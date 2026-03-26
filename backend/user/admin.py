from django.contrib import admin
from .models import User, Notification, Achievement, UserAchievement, AdminSetting

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_active', 'is_staff', 'date_joined')
    list_filter = ('role', 'is_active', 'is_staff', 'date_joined')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-date_joined',)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('receiver', 'notification_type', 'title', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('receiver__email', 'title', 'message')

@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('name', 'points', 'created_at')
    search_fields = ('name', 'description')

@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ('user', 'achievement', 'earned_at')
    list_filter = ('earned_at',)
    search_fields = ('user__email', 'achievement__name')

@admin.register(AdminSetting)
class AdminSettingAdmin(admin.ModelAdmin):
    list_display = ('key', 'value', 'label', 'updated_at')
    search_fields = ('key', 'label')
