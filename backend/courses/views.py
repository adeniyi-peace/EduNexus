from django.shortcuts import render,get_object_or_404
from rest_framework.generics import GenericAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import viewsets, status
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from django.http import FileResponse
from django.utils import timezone
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .serializers import (CourseSerializer, LessonSerializer, ModuleSerializer, ResourceSerializer, 
                          ReOrderRequestSerializer, WishlistSerializer, ReviewSerializer, NoteSerializer, 
                          LessonCompletionSerializer, EnrollmentSerializer, CertificateSerializer, CategorySerializer,
                          QuizQuestionSerializer, QuizOptionSerializer, CertificateConfigSerializer,
                          QuestionSerializer, AnswerSerializer
                        )
from . models import Course, Module, Lesson, Resource, Wishlist, Review, Enrollment, Note, Certificate, Category, QuizQuestion, QuizOption, CertificateConfig, Question, Answer

from user.permissions import  *
from .utils_telemetry import get_telemetry_data
from user.permissions import IsInstructor

from user.models import Notification

import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
from django.db.models import Avg

class CourseFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name='category__name', lookup_expr='iexact')

    class Meta:
        model = Course
        fields = ['category']

class CoursePagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 100


@extend_schema_view(
    list=extend_schema(summary="Get all courses", tags=['Courses']),
    retrieve=extend_schema(summary="Get course details by slug", tags=['Courses']),
    create=extend_schema(summary="Create a new course", tags=['Instructor Actions']),
    update=extend_schema(summary="Update a course", tags=['Instructor Actions']),
    partial_update=extend_schema(summary="Partial update course", tags=['Instructor Actions']),
    destroy=extend_schema(summary="Delete course", tags=['Instructor Actions']),
)
class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    
    pagination_class = CoursePagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = CourseFilter
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'annotated_rating', 'created_at']

    def get_queryset(self):
        # Annotate course with average rating so we can sort by it via 'annotated_rating'
        queryset = Course.objects.annotate(annotated_rating=Avg('reviews__rating'))
            
        return queryset

    @action(detail=False, methods=['get'], permission_classes=[IsInstructor])
    def mine(self, request):
        """
        Endpoint to retrieve courses created by the authenticated instructor.
        """
        courses = self.get_queryset().filter(instructor=request.user)
        page = self.paginate_queryset(courses)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)


    @action(detail=True, methods=['patch'], url_path='certificate-config', permission_classes=[IsInstructor, IsCourseOwner])
    def update_certificate_config(self, request, pk=None):
        """
        Custom action to update certificate configuration for a course.
        """
        course = self.get_object()
        config, created = CertificateConfig.objects.get_or_create(course=course)
        
        serializer = CertificateConfigSerializer(config, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data)

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions 
        that this view requires.
        """
        if self.action in ['list', 'retrieve']:
            # Anyone can view the list or details
            permission_classes = [AllowAny]
        elif self.action == 'mine':
            # Only authenticated instructors can see their library
            permission_classes = [IsInstructor]
        elif self.action == 'create':
            # Only instructors can create courses
            permission_classes = [IsInstructor]
        elif self.action in ['update', 'partial_update', 'destroy']:
            # Only authenticated instructors can modify their own courses
            permission_classes = [IsInstructor, IsCourseOwner]
        else:
            # Fallback for any other actions
            permission_classes = [permissions.IsAuthenticated]

        return [permission() for permission in permission_classes]


@extend_schema_view(
    list=extend_schema(summary="List modules for a specific course", tags=['Courses']),
    retrieve=extend_schema(summary="Get module details", tags=['Courses']),
    create=extend_schema(summary="Add a module to a course", tags=['Instructor Actions']),
    update=extend_schema(summary="Update a course module", tags=['Instructor Actions']),
    partial_update=extend_schema(summary="Partial update a course module", tags=['Instructor Actions']),
    destroy=extend_schema(summary="Delete course module", tags=['Instructor Actions']),
)
class ModuleViewSet(viewsets.ModelViewSet):
    serializer_class = ModuleSerializer
    queryset = Module.objects.all()

    def get_queryset(self):
        """
        Filter modules based on the course_pk in the URL.
        """
        queryset = super().get_queryset()
        # 'course_pk' comes from the NestedSimpleRouter lookup='course'
        return queryset.filter(course_id=self.kwargs['course_pk'])

    def perform_create(self, serializer):
        """
        Automatically link the new module to the course in the URL.
        """
        serializer.save(course_id=self.kwargs['course_pk'])


@extend_schema_view(
    list=extend_schema(summary="List lessons for a specific module", tags=['Courses']),
    retrieve=extend_schema(summary="Get lesson details", tags=['Courses']),
    create=extend_schema(summary="Add a lesson to a module", tags=['Instructor Actions']),
    update=extend_schema(summary="Update module lesson", tags=['Instructor Actions']),
    partial_update=extend_schema(summary="Partial update module lesson", tags=['Instructor Actions']),
    destroy=extend_schema(summary="Delete module lesson", tags=['Instructor Actions']),
)
class LessonViewSet(viewsets.ModelViewSet):
    serializer_class = LessonSerializer
    

    def get_queryset(self):
        """
        Filters the lessons based on the provided module_pk if present,
        otherwise returns all lessons.
        """
        queryset = Lesson.objects.all()
        module_pk = self.kwargs.get('module_pk')
        if module_pk:
            queryset = queryset.filter(module_id=module_pk)
        return queryset

    def perform_create(self, serializer):
        """
        Ensures that when a lesson is created via a nested endpoint,
        it is automatically linked to the correct module.
        """
        module_pk = self.kwargs.get('module_pk')
        if module_pk:
            serializer.save(module_id=module_pk)
        else:
            raise ValidationError("Lesson not found, please provide a valid lesson ID inside the url.")

    @action(detail=True, methods=['post'], url_path='upload')
    def upload_video(self, request, module_pk, pk=None):
        """
        Custom action to handle video uploads for a lesson.
        Expects 'video_url' (file) and 'duration' (seconds).
        """
        lesson = self.get_object()
        video_file = request.FILES.get('video_url')
        duration = request.data.get('duration')

        if video_file:
            lesson.video_url = video_file
        if duration:
            lesson.duration = int(float(duration))
            
        lesson.save()
        return Response(self.get_serializer(lesson).data)



class ReOrderView(GenericAPIView):
    serializer_class= LessonSerializer
    queryset = Lesson.objects.all()

    @extend_schema(
        summary="Reorder lessons within a module",
        description="Updates the 'order' field for all provided lesson IDs based on their position in the input list.",
        tags=['Instructor Actions'],
        parameters=[
            OpenApiParameter(
                name='module_pk', 
                type=OpenApiTypes.UUID, 
                location=OpenApiParameter.PATH,
                description='UUID of the module containing the lessons'
            ),
        ],
        request=ReOrderRequestSerializer,
        responses={200: LessonSerializer(many=True)},
        examples=[
            OpenApiExample(
                'Example Request',
                value={
                    "lessonIds": [
                        "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                        "497f6eca-6276-4993-bfeb-53cbbbba6f08"
                    ]
                }
            )
        ]
    )

    def put(self, request, *args, **kwargs):
        module_id = self.kwargs['module_pk']
        request_serializer = ReOrderRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)
        
        # 2. Extract the cleaned UUIDs
        lesson_ids = request_serializer.validated_data['lessonIds']

        lessons = self.queryset.filter(module_id=module_id)

        updated_lessons = []

        # new ordering according to list i.e [lessonid1, lessonid2] => [lessonid2, lessonid1]
        for index, lesson_id in enumerate(lesson_ids):
            try:
                # Find the lesson and update the order locally
                lesson = lessons.get(id=lesson_id)
                lesson.order = index
                updated_lessons.append(lesson)
            except Lesson.DoesNotExist:
                continue # Or handle error

        # Efficiently save all changes in one database query
        Lesson.objects.bulk_update(updated_lessons, ['order'])

        # Return the newly ordered list using many=True
        serializer = self.get_serializer(updated_lessons, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
        

@extend_schema_view(
    list=extend_schema(summary="List resource for a specific lesson", tags=['Courses']),
    retrieve=extend_schema(summary="Get resource details", tags=['Courses']),
    create=extend_schema(summary="Add a resource to a lesson", tags=['Instructor Actions']),
    update=extend_schema(summary="Update lesson resource", tags=['Instructor Actions']),
    partial_update=extend_schema(summary="Partial update lesson resource", tags=['Instructor Actions']),
    destroy=extend_schema(summary="Delete lesson resource", tags=['Instructor Actions']),
)
class ResourceViewSet(viewsets.ModelViewSet):
    serializer_class = ResourceSerializer
    queryset = Resource.objects.all()


    def get_queryset(self):
        """
        Filters the resources to only those belonging to the lesson 
        specified in the URL path.
        """
        queryset = Resource.objects.all()
        lesson_pk = self.kwargs.get('lesson_pk')
        if lesson_pk:
            queryset = queryset.filter(lesson_id=lesson_pk)
        return queryset

    def perform_create(self, serializer):
        """
        Ensures that when a resource is created via this endpoint, 
        it is automatically linked to the correct lesson.
        """
        lesson_pk = self.kwargs.get('lesson_pk')
        if lesson_pk:
            serializer.save(lesson_id=lesson_pk)
        else:
            raise ValidationError("Lesson not found, please provide a valid lesson ID inside the url.")



@extend_schema_view(
    list=extend_schema(summary="List user wishlist", tags=['Students']),
    retrieve=extend_schema(summary="Get wishlist item", tags=['Students']),
    create=extend_schema(summary="Add course to wishlist", tags=['Students']),
    destroy=extend_schema(summary="Remove course from wishlist", tags=['Students']),
)
class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    http_method_names = ['get', 'post', 'delete']

    def get_queryset(self):
        # Users can only see their own wishlist
        if self.request.user.is_authenticated:
            return Wishlist.objects.filter(student=self.request.user)
        return Wishlist.objects.none()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


@extend_schema_view(
    retrieve = extend_schema(summary="Get review details", tags=['Courses']),
    list=extend_schema(summary="List reviews for a course", tags=['Courses']),
    create=extend_schema(summary="Add a review for a course", tags=['Students']),
)
class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    http_method_names = ['get', 'post', 'patch']

    def get_queryset(self):
        return Review.objects.filter(course_id=self.kwargs['course_pk'])

    def perform_create(self, serializer):
        course_id = self.kwargs['course_pk']
        course = get_object_or_404(Course, pk=course_id)
        
        # Optionally, check if the student is actually enrolled
        if not Enrollment.objects.filter(student=self.request.user, course=course).exists():
            
            raise ValidationError("You must be enrolled in this course to leave a review.")
            
        # Check if review already exists
        if Review.objects.filter(student=self.request.user, course=course).exists():
            
            raise ValidationError("You have already reviewed this course.")

        serializer.save(student=self.request.user, course=course)

    @action(detail=True, methods=['patch'], url_path='instructor-reply')
    def reply(self, request, course_pk=None, pk=None):
        review = self.get_object()
        
        # Ensure the user is the instructor of the course
        if review.course.instructor != request.user:
            return Response(
                {"error": "You can only reply to reviews of your own courses."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        instructor_reply = request.data.get('instructor_reply')
        if not instructor_reply:
            return Response(
                {"error": "instructor_reply is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        review.instructor_reply = instructor_reply
        review.replied_at = timezone.now()
        review.save()
        
        return Response(self.get_serializer(review).data)


@extend_schema_view(
    list=extend_schema(summary="List notes for the authenticated user", tags=['Students']),
    create=extend_schema(summary="Add a note for a lesson", tags=['Students']),
    retrieve=extend_schema(summary="Get note details", tags=['Students']),
    update=extend_schema(summary="Update a note", tags=['Students']),
    partial_update=extend_schema(summary="Partial update a note", tags=['Students']),
    destroy=extend_schema(summary="Delete a note", tags=['Students']),
)
class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    http_method_names = ['get', 'post', 'put', 'delete']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            lesson_id = self.kwargs.get('lesson_pk')
            if lesson_id:
                return Note.objects.filter(student=self.request.user, lesson_id=lesson_id)
            return Note.objects.filter(student=self.request.user)
        return Note.objects.none()

    def perform_create(self, serializer):
        lesson_id = self.kwargs.get('lesson_pk')
        if lesson_id:
            serializer.save(student=self.request.user, lesson_id=lesson_id)
        else:
            serializer.save(student=self.request.user)

class LessonCompletionView(GenericAPIView):
    serializer_class = LessonCompletionSerializer

    @extend_schema(
        summary="Mark a lesson as completed",
        description="Adds the specified lesson to the student's list of completed lessons for the course.",
        tags=['Students'],
        parameters=[
            OpenApiParameter(
                name='lesson_id', 
                type=OpenApiTypes.UUID, 
                location=OpenApiParameter.PATH,
                description='UUID of the lesson to mark as completed'
            ),
        ],
        request=LessonCompletionSerializer,
        responses={200: {"detail": "Lesson marked as completed."}}
    )
    def post(self, request, *args, **kwargs):
        course_id = self.kwargs['course_pk']
        lesson_id = request.data.get('lesson_id')
        module_id = request.data.get('module_id')  # Optional, if you want to validate the lesson belongs to a specific module

        context = self.get_serializer_context()
        context['course_id'] = course_id
        context["module_id"] = module_id
        serializer = self.get_serializer(data={'lesson_id': lesson_id}, context=context)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Lesson marked as completed."}, status=status.HTTP_200_OK)

@extend_schema_view(
    list=extend_schema(summary="List user enrollments", tags=['Students']),
    retrieve=extend_schema(summary="Get enrollment details", tags=['Students']),
)
class EnrollmentViewSet(viewsets.ModelViewSet):
    serializer_class = EnrollmentSerializer
    
    # Exclude PUT/DELETE as enrollments are typically final (or handled elsewhere)
    http_method_names = ['get', 'post', 'options', 'head']

    def get_queryset(self):
        # Users can only see their own enrollments
        if self.request.user.is_authenticated:
            return Enrollment.objects.filter(student=self.request.user)
        return Enrollment.objects.none()

    def perform_create(self, serializer):
        # 1. Prevent multiple enrollments
        course = serializer.validated_data.get('course')
        if Enrollment.objects.filter(student=self.request.user, course=course).exists():
            
            raise ValidationError("You are already enrolled in this course.")

        # 2. Get Telemetry Data from request
        telemetry = get_telemetry_data(self.request)
        
        # 3. Get Traffic Source from frontend payload (passed as part of the POST body)
        traffic_source = self.request.data.get('traffic_source', 'Direct')

        # 4. Save with all data
        serializer.save(
            student=self.request.user,
            device_type=telemetry['device_type'],
            country_code=telemetry['country_code'],
            traffic_source=traffic_source
        )

@extend_schema_view(
    list=extend_schema(summary="List user certificates", tags=['Students']),
    retrieve=extend_schema(summary="Get certificate details", tags=['Students']),
    download=extend_schema(summary="Download certificate", tags=['Students']),
)
class CertificateViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CertificateSerializer

    def get_queryset(self):
        # Users can only see their own certificates
        if self.request.user.is_authenticated:
            return Certificate.objects.filter(student=self.request.user)
        return Certificate.objects.none()

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        certificate = self.get_object()
        from .utils import generate_certificate_pdf
        
        buffer = generate_certificate_pdf(certificate)
        
        return FileResponse(
            buffer, 
            as_attachment=True, 
            filename=f"Certificate_{certificate.certificate_id}.pdf"
        )

@extend_schema_view(
    list=extend_schema(summary="Get all categories", tags=['Courses']),
)
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

@extend_schema_view(
    list=extend_schema(summary="List questions for a specific lesson", tags=['Instructor Actions']),
    retrieve=extend_schema(summary="Get quiz question details", tags=['Instructor Actions']),
    create=extend_schema(summary="Add a question to a quiz lesson (with nested options)", tags=['Instructor Actions']),
    update=extend_schema(summary="Update quiz question", tags=['Instructor Actions']),
    partial_update=extend_schema(summary="Partial update quiz question", tags=['Instructor Actions']),
    destroy=extend_schema(summary="Delete quiz question", tags=['Instructor Actions']),
)
class QuizQuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuizQuestionSerializer
    queryset = QuizQuestion.objects.all()

    def get_queryset(self):
        lesson_pk = self.kwargs.get('lesson_pk')
        if lesson_pk:
            return self.queryset.filter(lesson_id=lesson_pk)
        return self.queryset

    def perform_create(self, serializer):
        lesson_pk = self.kwargs.get('lesson_pk')
        if lesson_pk:
            serializer.save(lesson_id=lesson_pk)
        else:
            raise ValidationError("Lesson ID is required. Pass it in the URL")

@extend_schema_view(
    list=extend_schema(summary="List options for a specific question", tags=['Instructor Actions']),
    retrieve=extend_schema(summary="Get quiz option details", tags=['Instructor Actions']),
    create=extend_schema(summary="Add an option to a quiz question", tags=['Instructor Actions']),
    update=extend_schema(summary="Update quiz option", tags=['Instructor Actions']),
    partial_update=extend_schema(summary="Partial update quiz option", tags=['Instructor Actions']),
    destroy=extend_schema(summary="Delete quiz option", tags=['Instructor Actions']),
)
class QuizOptionViewSet(viewsets.ModelViewSet):
    serializer_class = QuizOptionSerializer
    queryset = QuizOption.objects.all()

    def get_queryset(self):
        question_pk = self.kwargs.get('question_pk')
        if question_pk:
            return self.queryset.filter(question_id=question_pk)
        return self.queryset

    def perform_create(self, serializer):
        question_pk = self.kwargs.get('question_pk')
        if question_pk:
            serializer.save(question_id=question_pk)
        else:
            raise ValidationError("Question ID is required. Pass it in the URL")

@extend_schema_view(
    list=extend_schema(summary="List Q&A questions for a lesson", tags=['Q&A']),
    create=extend_schema(summary="Ask a question on a lesson", tags=['Q&A']),
    retrieve=extend_schema(summary="Get question details", tags=['Q&A']),
    update=extend_schema(summary="Update a question", tags=['Q&A']),
    partial_update=extend_schema(summary="Partial update a question", tags=['Q&A']),
    destroy=extend_schema(summary="Delete a question", tags=['Q&A']),
)
class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    
    def get_queryset(self):
        lesson_id = self.kwargs.get('lesson_pk')
        if lesson_id:
            return Question.objects.filter(lesson_id=lesson_id)
        return Question.objects.all()

    def perform_create(self, serializer):
        lesson_id = self.kwargs.get('lesson_pk')
        if lesson_id:
            question = serializer.save(student=self.request.user, lesson_id=lesson_id)
            instructor = question.lesson.module.course.instructor
            if instructor != self.request.user:
                 Notification.objects.create(
                     receiver=instructor,
                     sender=self.request.user,
                     notification_type="mentor_reply", # or an existing type
                     title=f"New Question in {question.lesson.title}",
                     message=f"{self.request.user.fullname} asked: {question.title}",
                 )
        else:
            raise ValidationError("Lesson ID is required.")

@extend_schema_view(
    list=extend_schema(summary="List answers for a question", tags=['Q&A']),
    create=extend_schema(summary="Answer a question", tags=['Q&A']),
    retrieve=extend_schema(summary="Get answer details", tags=['Q&A']),
    update=extend_schema(summary="Update an answer", tags=['Q&A']),
    partial_update=extend_schema(summary="Partial update an answer", tags=['Q&A']),
    destroy=extend_schema(summary="Delete an answer", tags=['Q&A']),
)
class AnswerViewSet(viewsets.ModelViewSet):
    serializer_class = AnswerSerializer
    
    def get_queryset(self):
        question_id = self.kwargs.get('question_pk')
        if question_id:
            return Answer.objects.filter(question_id=question_id)
        return Answer.objects.all()

    def perform_create(self, serializer):
        question_id = self.kwargs.get('question_pk')
        if question_id:
            question = get_object_or_404(Question, id=question_id)
            is_instructor = self.request.user == question.lesson.module.course.instructor
            answer = serializer.save(user=self.request.user, question_id=question_id, is_instructor_reply=is_instructor)
            if question.student != self.request.user:
                 Notification.objects.create(
                     receiver=question.student,
                     sender=self.request.user,
                     notification_type="mentor_reply" if is_instructor else "system",
                     title=f"Reply to your question",
                     message=f"{self.request.user.fullname} replied to: {question.title}",
                 )
        else:
            raise ValidationError("Question ID is required.")
