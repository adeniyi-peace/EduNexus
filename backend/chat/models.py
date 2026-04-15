from django.db import models
from django.contrib.auth import get_user_model
from uuid import uuid4

User = get_user_model()


class ChatRoom(models.Model):
    """
    A group chat room scoped to a course.
    Every published course gets one group chat room.
    All enrolled students + the instructor are participants.
    """
    ROOM_TYPE_CHOICES = (
        ('course_group', 'Course Group'),
    )

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    course = models.OneToOneField(
        'courses.Course',
        related_name='chat_room',
        on_delete=models.CASCADE,
        help_text="The course this chat room belongs to."
    )
    room_type = models.CharField(
        max_length=20,
        choices=ROOM_TYPE_CHOICES,
        default='course_group'
    )
    participants = models.ManyToManyField(
        User,
        related_name='chat_rooms',
        blank=True,
        help_text="Users who can access this chat room."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Chat: {self.course.title}"

    @property
    def group_name(self):
        """Channel layer group name for WebSocket broadcasting."""
        return f"chat_room_{self.id}"


class DirectMessageRoom(models.Model):
    """
    A 1:1 direct message room between two users, scoped to a course context.
    Supports student↔instructor and student↔student messaging within a course.
    """
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    participants = models.ManyToManyField(
        User,
        related_name='dm_rooms',
        help_text="The two users in this DM conversation."
    )
    course = models.ForeignKey(
        'courses.Course',
        related_name='dm_rooms',
        on_delete=models.CASCADE,
        help_text="Course context for this DM."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        names = ", ".join(u.get_full_name() or u.email for u in self.participants.all()[:2])
        return f"DM: {names}"

    @property
    def group_name(self):
        """Channel layer group name for WebSocket broadcasting."""
        return f"dm_room_{self.id}"


class Message(models.Model):
    """
    An individual chat message. Belongs to either a ChatRoom or a DirectMessageRoom.
    """
    MESSAGE_TYPE_CHOICES = (
        ('text', 'Text'),
        ('image', 'Image'),
        ('file', 'File'),
        ('system', 'System'),
    )

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)

    # A message belongs to EITHER a room or a dm_room (one will be null)
    room = models.ForeignKey(
        ChatRoom,
        related_name='messages',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        help_text="Course group chat room (null if this is a DM)."
    )
    dm_room = models.ForeignKey(
        DirectMessageRoom,
        related_name='messages',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        help_text="Direct message room (null if this is a group message)."
    )

    sender = models.ForeignKey(
        User,
        related_name='chat_messages',
        on_delete=models.CASCADE
    )
    content = models.TextField(blank=True, default='')
    attachment = models.FileField(
        upload_to='chat_attachments/%Y/%m/',
        blank=True,
        null=True,
        help_text="Optional file attachment."
    )
    attachment_name = models.CharField(
        max_length=255,
        blank=True,
        default='',
        help_text="Original filename of the attachment."
    )
    message_type = models.CharField(
        max_length=10,
        choices=MESSAGE_TYPE_CHOICES,
        default='text'
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['room', 'created_at']),
            models.Index(fields=['dm_room', 'created_at']),
        ]

    def __str__(self):
        sender_name = self.sender.get_full_name() or self.sender.email
        preview = self.content[:40] if self.content else '[attachment]'
        return f"{sender_name}: {preview}"
