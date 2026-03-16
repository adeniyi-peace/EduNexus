from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, AchievementViewSet, UserAchievementViewSet
from .views_cms import (
    CMSDashboardView, CourseAnalyticsView, CourseStudentsView,
    MessageAllStudentsView, MessageStudentView, GlobalStudentsView, InstructorAnalyticsView,
)
from .views_admin import (
    AdminDashboardView,
    AdminUserListView, AdminUserDetailView,
    AdminCourseListView,
    AdminPendingCoursesView, AdminApproveCourseView, AdminRejectCourseView,
    AdminReportListView, AdminDismissReportView, AdminRemoveReviewView,
    AdminFinanceView,
    AdminAnalyticsView,
    AdminSettingsView,
)

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'achievements', AchievementViewSet, basename='achievement')
router.register(r'user-achievements', UserAchievementViewSet, basename='user-achievement')

urlpatterns = [
    path('', include(router.urls)),

    # --- Instructor (CMS) Endpoints ---
    path("instructor/dashboard/", CMSDashboardView.as_view(), name="instructor-dashboard"),
    path("instructor/analytics/", InstructorAnalyticsView.as_view(), name="instructor-analytics"),
    path("instructor/course-analytics/<slug:slug>/", CourseAnalyticsView.as_view(), name="course-analytics"),
    path("instructor/courses/<uuid:course_id>/students/", CourseStudentsView.as_view(), name="course-students"),
    path("instructor/courses/<uuid:course_id>/message-all/", MessageAllStudentsView.as_view(), name="message-all-students"),
    path("instructor/message-student/", MessageStudentView.as_view(), name="message-student"),
    path("instructor/students/", GlobalStudentsView.as_view(), name="global-students"),

    # --- Admin Endpoints ---
    path("admin/dashboard/", AdminDashboardView.as_view(), name="admin-dashboard"),

    # User Management
    path("admin/users/", AdminUserListView.as_view(), name="admin-users"),
    path("admin/users/<int:user_id>/", AdminUserDetailView.as_view(), name="admin-user-detail"),

    # Courses (all)
    path("admin/courses/", AdminCourseListView.as_view(), name="admin-courses"),

    # Course Approval workflow
    path("admin/courses/pending/", AdminPendingCoursesView.as_view(), name="admin-courses-pending"),
    path("admin/courses/<uuid:course_id>/approve/", AdminApproveCourseView.as_view(), name="admin-course-approve"),
    path("admin/courses/<uuid:course_id>/reject/", AdminRejectCourseView.as_view(), name="admin-course-reject"),

    # Content Moderation
    path("admin/reports/", AdminReportListView.as_view(), name="admin-reports"),
    path("admin/reports/<int:review_id>/dismiss/", AdminDismissReportView.as_view(), name="admin-report-dismiss"),
    path("admin/reports/<int:review_id>/remove/", AdminRemoveReviewView.as_view(), name="admin-report-remove"),

    # Finance
    path("admin/finance/", AdminFinanceView.as_view(), name="admin-finance"),

    # Analytics
    path("admin/analytics/", AdminAnalyticsView.as_view(), name="admin-analytics"),

    # Settings
    path("admin/settings/", AdminSettingsView.as_view(), name="admin-settings"),
]
