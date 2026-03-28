from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Notification, Achievement, UserAchievement
from .serializers import NotificationSerializer, AchievementSerializer, UserAchievementSerializer
from courses.models import Certificate, Enrollment
from drf_spectacular.utils import extend_schema, extend_schema_view


class StudentDashboardView(APIView):
    """
    Aggregated student dashboard endpoint.
    Returns notifications, achievements, and computed stats for the authenticated student.
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Get student dashboard data",
        description="Returns aggregated dashboard data: notifications, achievements, and stats.",
        tags=["Student Dashboard"],
    )
    def get(self, request):
        user = request.user

        # 1. Recent Notifications (latest 5, unread first)
        notifications = Notification.objects.filter(
            receiver=user
        ).order_by('is_read', '-created_at')[:5]

        # 2. Achievements (latest 5 earned)
        achievements = UserAchievement.objects.filter(
            user=user
        ).select_related('achievement')[:5]

        # 3. Computed Stats
        xp = user.xp
        stats = {
            "xp_points": xp,
            "courses_completed": Certificate.objects.filter(student=user).count(),
            "active_streak": 0,  # Placeholder — can be extended with login tracking
            "rank": self._calculate_rank(xp),
            "total_enrolled": Enrollment.objects.filter(student=user).count(),
        }

        return Response({
            "notifications": NotificationSerializer(notifications, many=True).data,
            "achievements": UserAchievementSerializer(achievements, many=True).data,
            "stats": stats,
        })

    @staticmethod
    def _calculate_rank(xp):
        if xp >= 10000:
            return "Elite"
        if xp >= 5000:
            return "Senior"
        if xp >= 1000:
            return "Intermediate"
        return "Rookie"


@extend_schema_view(
    list=extend_schema(description="List all achievements", tags=["Achievements"]),
    retrieve=extend_schema(description="Retrieve a specific achievement", tags=["Achievements"])
)
class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [permissions.IsAuthenticated]

@extend_schema_view(
    list=extend_schema(description="List user's achievements", tags=["Student Achievements"]),
    retrieve=extend_schema(description="Retrieve a specific user achievement", tags=["Student Achievements"])
)
class UserAchievementViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserAchievementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserAchievement.objects.filter(user=self.request.user)

@extend_schema_view(
    list=extend_schema(description="List notifications", tags=["Notifications"]),
    retrieve=extend_schema(description="Retrieve a specific notification", tags=["Notifications"])
)
class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own notifications
        return Notification.objects.filter(receiver=self.request.user)
