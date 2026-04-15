from django.contrib import admin
from .models import ChatRoom, DirectMessageRoom, Message


@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('course', 'room_type', 'participant_count', 'created_at')
    list_filter = ('room_type', 'created_at')
    search_fields = ('course__title',)
    filter_horizontal = ('participants',)

    def participant_count(self, obj):
        return obj.participants.count()
    participant_count.short_description = 'Participants'


@admin.register(DirectMessageRoom)
class DirectMessageRoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'course', 'get_participants', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('course__title',)
    filter_horizontal = ('participants',)

    def get_participants(self, obj):
        return ", ".join(u.email for u in obj.participants.all()[:2])
    get_participants.short_description = 'Participants'


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'content_preview', 'message_type', 'room', 'dm_room', 'is_read', 'created_at')
    list_filter = ('message_type', 'is_read', 'created_at')
    search_fields = ('content', 'sender__email')
    raw_id_fields = ('sender', 'room', 'dm_room')

    def content_preview(self, obj):
        return obj.content[:60] if obj.content else '[attachment]'
    content_preview.short_description = 'Content'
