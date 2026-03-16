from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, AchievementViewSet, UserAchievementViewSet
from .views_cms import CMSDashboardView, CourseAnalyticsView, CourseStudentsView, MessageAllStudentsView, MessageStudentView, GlobalStudentsView

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'achievements', AchievementViewSet, basename='achievement')
router.register(r'user-achievements', UserAchievementViewSet, basename='user-achievement')

urlpatterns = [
    path('', include(router.urls)),
    path("instructor/dashboard/", CMSDashboardView.as_view(), name="instructor-dashboard"),
    path("instructor/course-analytics/<slug:slug>/", CourseAnalyticsView.as_view(), name="course-analytics"),
    path("instructor/courses/<uuid:course_id>/students/", CourseStudentsView.as_view(), name="course-students"),
    path("instructor/courses/<uuid:course_id>/message-all/", MessageAllStudentsView.as_view(), name="message-all-students"),
    path("instructor/message-student/", MessageStudentView.as_view(), name="message-student"),
    path("instructor/students/", GlobalStudentsView.as_view(), name="global-students"),
]
