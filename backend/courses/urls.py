from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import CourseViewSet, ModuleViewSet,LessonViewSet, ResourceViewSet, ReOrderView

# Create a router and register our viewset with it.
router = routers.DefaultRouter()
lesson_router = routers.DefaultRouter()
# 1. Register both as top-level resources
router.register(r'courses', CourseViewSet, basename='course')
lesson_router.register(r'modules', ModuleViewSet, basename='module')

# 2. Nested Router: /courses/{course_pk}/modules/
# lookup='course' tells the router to pass 'course_pk' to the ModuleViewSet
courses_router = routers.NestedSimpleRouter(router, r'courses', lookup='course')
courses_router.register(r'modules', ModuleViewSet, basename='course-modules')

# 3. NEW Nested Router: /modules/{module_pk}/lessons/
modules_router = routers.NestedSimpleRouter(lesson_router, r'modules', lookup='module')
modules_router.register(r'lessons', LessonViewSet, basename='module-lessons')

resource_router = routers.NestedSimpleRouter(modules_router, r"lessons", lookup="lesson")
resource_router.register(r"resources", ResourceViewSet, basename="resource_lesson")

urlpatterns = [
    path('', include(router.urls)),
    path('', include(courses_router.urls)),
    path('', include(modules_router.urls)),
    path("", include(resource_router.urls)),
    path('modules/<uuid:module_pk>/reorder', ReOrderView.as_view(), name='lesson-reorder'),
]