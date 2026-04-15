from typing import Optional

from rest_framework import serializers
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema_field

from .models import ChatRoom, DirectMessageRoom, Message

User = get_user_model()


class ChatParticipantSerializer(serializers.ModelSerializer):
    """Lightweight user serializer for chat participant info."""
    fullname = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'fullname', 'role', 'profile_picture']
        read_only_fields = fields

    @extend_schema_field(serializers.CharField)
    def get_fullname(self, obj) -> str:
        return obj.get_full_name() or obj.email


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for individual chat messages."""
    sender = ChatParticipantSerializer(read_only=True)
    attachment_url = serializers.SerializerMethodField()
    is_me = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'content', 'attachment_url', 'attachment_name',
            'message_type', 'is_read', 'created_at', 'is_me',
        ]
        read_only_fields = ['id', 'sender', 'created_at']

    @extend_schema_field(serializers.URLField(allow_null=True))
    def get_attachment_url(self, obj) -> Optional[str]:
        if obj.attachment:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.attachment.url)
            return obj.attachment.url
        return None

    @extend_schema_field(serializers.BooleanField)
    def get_is_me(self, obj) -> bool:
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.sender_id == request.user.id
        return False


class LastMessageSerializer(serializers.ModelSerializer):
    """Compact message serializer for room list previews."""
    sender_name = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'content', 'sender_name', 'message_type', 'created_at']
        read_only_fields = fields

    @extend_schema_field(serializers.CharField)
    def get_sender_name(self, obj) -> str:
        return obj.sender.first_name or obj.sender.email


class ChatRoomSerializer(serializers.ModelSerializer):
    """Serializer for course group chat rooms."""
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_id = serializers.CharField(source='course.id', read_only=True)
    course_thumbnail = serializers.ImageField(source='course.thumbnail', read_only=True)
    instructor_name = serializers.SerializerMethodField()
    participant_count = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = [
            'id', 'course_title', 'course_thumbnail', 'room_type',
            'instructor_name', 'participant_count', 'last_message',
            'unread_count', 'created_at', "course_id"
        ]
        read_only_fields = fields

    @extend_schema_field(serializers.CharField)
    def get_instructor_name(self, obj) -> str:
        instructor = obj.course.instructor
        return instructor.get_full_name() or instructor.email

    @extend_schema_field(serializers.IntegerField)
    def get_participant_count(self, obj) -> int:
        return obj.participants.count()

    @extend_schema_field(LastMessageSerializer(allow_null=True))
    def get_last_message(self, obj):
        last_msg = obj.messages.order_by('-created_at').first()
        if last_msg:
            return LastMessageSerializer(last_msg).data
        return None

    @extend_schema_field(serializers.IntegerField)
    def get_unread_count(self, obj) -> int:
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0


class DirectMessageRoomSerializer(serializers.ModelSerializer):
    """Serializer for 1:1 direct message rooms."""
    other_participant = serializers.SerializerMethodField()
    course_title = serializers.CharField(source='course.title', read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = DirectMessageRoom
        fields = [
            'id', 'other_participant', 'course_title',
            'last_message', 'unread_count', 'created_at',
        ]
        read_only_fields = fields

    @extend_schema_field(ChatParticipantSerializer(allow_null=True))
    def get_other_participant(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            other = obj.participants.exclude(id=request.user.id).first()
            if other:
                return ChatParticipantSerializer(other).data
        return None

    @extend_schema_field(LastMessageSerializer(allow_null=True))
    def get_last_message(self, obj):
        last_msg = obj.messages.order_by('-created_at').first()
        if last_msg:
            return LastMessageSerializer(last_msg).data
        return None

    @extend_schema_field(serializers.IntegerField)
    def get_unread_count(self, obj) -> int:
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0


class StartDMSerializer(serializers.Serializer):
    """Serializer for starting/getting a DM room."""
    user_id = serializers.IntegerField(
        help_text="ID of the user to start a DM with."
    )
    course_id = serializers.UUIDField(
        help_text="Course ID scoping this DM conversation."
    )


class FileUploadSerializer(serializers.Serializer):
    """Serializer for chat file uploads."""
    file = serializers.FileField(help_text="The file to upload.")
    room_id = serializers.UUIDField(
        required=False,
        help_text="Chat room ID (for group messages)."
    )
    dm_room_id = serializers.UUIDField(
        required=False,
        help_text="DM room ID (for direct messages)."
    )
