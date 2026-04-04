from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import (
    CourseViewSet, ModuleViewSet, LessonViewSet, ResourceViewSet, 
    ReOrderView, WishlistViewSet, ReviewViewSet, NoteViewSet, 
    LessonCompletionView, EnrollmentViewSet, CertificateViewSet, CategoryViewSet,
    QuizQuestionViewSet, QuizOptionViewSet

)

# Create a router and register our viewset with it.
router = routers.DefaultRouter()
lesson_router = routers.DefaultRouter()
lesson_sub_router = routers.DefaultRouter()
# 1. Register both as top-level resources
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'wishlists', WishlistViewSet, basename='wishlist')
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')
router.register(r'certificates', CertificateViewSet, basename='certificate')
router.register(r'categories', CategoryViewSet, basename='category')
lesson_router.register(r'modules', ModuleViewSet, basename='module')
lesson_sub_router.register(r'lessons', LessonViewSet, basename='lesson')


# 2. Nested Router: /courses/{course_pk}/modules/
# lookup='course' tells the router to pass 'course_pk' to the ModuleViewSet
courses_router = routers.NestedSimpleRouter(router, r'courses', lookup='course')
courses_router.register(r'modules', ModuleViewSet, basename='course-modules')
courses_router.register(r'reviews', ReviewViewSet, basename='course-reviews')

# 3. NEW Nested Router: /modules/{module_pk}/lessons/
modules_router = routers.NestedSimpleRouter(lesson_router, r'modules', lookup='module')
modules_router.register(r'lessons', LessonViewSet, basename='module-lessons')


notes_router = routers.NestedSimpleRouter(lesson_sub_router, r'lessons', lookup='lesson')
notes_router.register(r'notes', NoteViewSet, basename='note-lessons')

lesson_resources_router = routers.NestedSimpleRouter(lesson_sub_router, r'lessons', lookup='lesson')
lesson_resources_router.register(r'resources', ResourceViewSet, basename='lesson-resources')

quiz_questions_router = routers.NestedSimpleRouter(lesson_sub_router, r'lessons', lookup='lesson')
quiz_questions_router.register(r'questions', QuizQuestionViewSet, basename='lesson-quiz-questions')

quiz_options_router = routers.NestedSimpleRouter(quiz_questions_router, r'questions', lookup='question')
quiz_options_router.register(r'options', QuizOptionViewSet, basename='quiz-question-options')



urlpatterns = [
    path('', include(router.urls)),
    path('', include(courses_router.urls)),
    path('', include(modules_router.urls)),
    path("", include(notes_router.urls)),
    path("", include(lesson_resources_router.urls)),
    path("", include(quiz_questions_router.urls)),
    path("", include(quiz_options_router.urls)),



    path('modules/<uuid:module_pk>/reorder/', ReOrderView.as_view(), name='lesson-reorder'),

    path("courses/<uuid:course_pk>/modules/<uuid:module_pk>/complete-lesson", LessonCompletionView.as_view(), name="complete-lesson"),
]