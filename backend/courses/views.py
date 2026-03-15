from django.shortcuts import render,get_object_or_404
from rest_framework.generics import GenericAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import viewsets, status
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from django.http import FileResponse
from django.utils import timezone

from .serializers import (CourseSerializer, LessonSerializer, ModuleSerializer, ResourceSerializer, 
                          ReOrderRequestSerializer, WishlistSerializer, ReviewSerializer, NoteSerializer, 
                          LessonCompletionSerializer, EnrollmentSerializer, CertificateSerializer
                        )
from . models import Course, Module, Lesson, Resource, Wishlist, Review, Enrollment, Note, Certificate

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
    queryset = Course.objects.all()


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
        Filters the lessons to only those belonging to the module 
        specified in the URL path.
        """
        # module_pk is automatically captured by the nested router
        return Lesson.objects.filter(module_id=self.kwargs['module_pk'])

    def perform_create(self, serializer):
        """
        Ensures that when a lesson is created via this endpoint, 
        it is automatically linked to the correct module.
        """
        serializer.save(module_id=self.kwargs['module_pk'])


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
        Filters the lessons to only those belonging to the module 
        specified in the URL path.
        """
        # module_pk is automatically captured by the nested router
        return Lesson.objects.filter(module_id=self.kwargs['module_pk'])

    def perform_create(self, serializer):
        """
        Ensures that when a lesson is created via this endpoint, 
        it is automatically linked to the correct module.
        """
        serializer.save(module_id=self.kwargs['module_pk'])


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
            from rest_framework.exceptions import ValidationError
            raise ValidationError("You must be enrolled in this course to leave a review.")
            
        # Check if review already exists
        if Review.objects.filter(student=self.request.user, course=course).exists():
            from rest_framework.exceptions import ValidationError
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
        # Users can only see their own notes
        if self.request.user.is_authenticated:
            return Note.objects.filter(student=self.request.user)
        return Note.objects.none()

    def perform_create(self, serializer):
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
class EnrollmentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EnrollmentSerializer

    def get_queryset(self):
        # Users can only see their own enrollments
        if self.request.user.is_authenticated:
            return Enrollment.objects.filter(student=self.request.user)
        return Enrollment.objects.none()

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