from rest_framework import viewsets, permissions
from .models import Notification, Achievement, UserAchievement
from .serializers import NotificationSerializer, AchievementSerializer, UserAchievementSerializer
from drf_spectacular.utils import extend_schema, extend_schema_view

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
