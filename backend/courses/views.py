from django.shortcuts import render,get_object_or_404
from rest_framework.generics import GenericAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import viewsets, status
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes

from .serializers import CourseSerializer, LessonSerializer, ModuleSerializer, ResourceSerializer, ReOrderRequestSerializer
from . models import Course, Module, Lesson, Resource

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