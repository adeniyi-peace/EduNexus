from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, AchievementViewSet, UserAchievementViewSet

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'achievements', AchievementViewSet, basename='achievement')
router.register(r'user-achievements', UserAchievementViewSet, basename='user-achievement')

urlpatterns = [
    path('', include(router.urls)),
]
