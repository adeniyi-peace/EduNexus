from rest_framework import generics, status, parsers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import CursorPagination
from django.contrib.auth import get_user_model
from django.db.models import Q
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter

from .models import ChatRoom, DirectMessageRoom, Message
from .serializers import (
    ChatRoomSerializer,
    DirectMessageRoomSerializer,
    MessageSerializer,
    StartDMSerializer,
    FileUploadSerializer,
    ChatParticipantSerializer,
)

User = get_user_model()


class MessageCursorPagination(CursorPagination):
    """Cursor-based pagination for chat messages (newest first for loading)."""
    page_size = 50
    ordering = '-created_at'
    cursor_query_param = 'cursor'


@extend_schema_view(
    get=extend_schema(
        summary="List chat rooms",
        description=(
            "Returns all course group chat rooms the authenticated user is a participant in. "
            "Includes last message preview and unread count."
        ),
        tags=["Chat"],
    )
)
class ChatRoomListView(generics.ListAPIView):
    """Lists all course group chat rooms for the authenticated user."""
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatRoom.objects.filter(
            participants=self.request.user
        ).select_related('course', 'course__instructor').prefetch_related('participants')


@extend_schema_view(
    get=extend_schema(
        summary="List DM conversations",
        description=(
            "Returns all direct message rooms for the authenticated user. "
            "Includes the other participant's info, last message, and unread count."
        ),
        tags=["Chat"],
    )
)
class DirectMessageListView(generics.ListAPIView):
    """Lists all DM conversations for the authenticated user."""
    serializer_class = DirectMessageRoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DirectMessageRoom.objects.filter(
            participants=self.request.user
        ).select_related('course').prefetch_related('participants')


@extend_schema(
    summary="Get message history",
    description=(
        "Returns paginated message history for a chat room or DM room. "
        "Uses cursor-based pagination for efficient infinite scroll. "
        "Provide either `room_id` or `dm_room_id` as a query parameter."
    ),
    parameters=[
        OpenApiParameter(name='room_id', description='Group chat room ID', required=False, type=str),
        OpenApiParameter(name='dm_room_id', description='Direct message room ID', required=False, type=str),
    ],
    tags=["Chat"],
)
class MessageListView(generics.ListAPIView):
    """
    Paginated message history for a specific room.
    Accepts either `room_id` or `dm_room_id` as query parameter.
    Also marks unread messages as read when fetched.
    """
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = MessageCursorPagination

    def get_queryset(self):
        user = self.request.user
        room_id = self.request.query_params.get('room_id')
        dm_room_id = self.request.query_params.get('dm_room_id')

        if room_id:
            # Verify user is a participant
            qs = Message.objects.filter(
                room_id=room_id,
                room__participants=user
            )
        elif dm_room_id:
            qs = Message.objects.filter(
                dm_room_id=dm_room_id,
                dm_room__participants=user
            )
        else:
            return Message.objects.none()

        # Mark messages as read
        qs.filter(is_read=False).exclude(sender=user).update(is_read=True)

        return qs.select_related('sender')


@extend_schema(
    summary="Start or get a DM conversation",
    description=(
        "Creates a new DM room between the authenticated user and the specified user, "
        "scoped to a course. If a DM room already exists between them for that course, "
        "returns the existing one."
    ),
    request=StartDMSerializer,
    responses={200: DirectMessageRoomSerializer},
    tags=["Chat"],
)
class StartDMView(APIView):
    """Creates or retrieves a DM room between two users within a course."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = StartDMSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        target_user_id = serializer.validated_data['user_id']
        course_id = serializer.validated_data['course_id']

        # Cannot DM yourself
        if target_user_id == request.user.id:
            return Response(
                {"error": "Cannot start a DM with yourself."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify target user exists
        try:
            target_user = User.objects.get(id=target_user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if a DM room already exists between these two for this course
        existing = DirectMessageRoom.objects.filter(
            course_id=course_id,
            participants=request.user
        ).filter(
            participants=target_user
        ).first()

        if existing:
            data = DirectMessageRoomSerializer(existing, context={'request': request}).data
            return Response(data, status=status.HTTP_200_OK)

        # Create new DM room
        dm_room = DirectMessageRoom.objects.create(course_id=course_id)
        dm_room.participants.add(request.user, target_user)

        data = DirectMessageRoomSerializer(dm_room, context={'request': request}).data
        return Response(data, status=status.HTTP_201_CREATED)


@extend_schema(
    summary="Upload a chat attachment",
    description=(
        "Uploads a file to be attached to a chat message. "
        "Returns the file URL to be included in the WebSocket message payload."
    ),
    request={
        'multipart/form-data': FileUploadSerializer
    },
    responses={
        201: {
            'type': 'object',
            'properties': {
                'url': {'type': 'string', 'description': 'URL of the uploaded file'},
                'name': {'type': 'string', 'description': 'Original filename'},
                'type': {'type': 'string', 'description': 'MIME type of the file'},
            }
        }
    },
    tags=["Chat"],
)
class FileUploadView(APIView):
    """Handles file attachment uploads for chat messages."""
    permission_classes = [IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response(
                {"error": "No file provided."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Optional: validate file size (max 10MB)
        if file.size > 10 * 1024 * 1024:
            return Response(
                {"error": "File size exceeds 10MB limit."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create a message shell to store the file
        # The actual message will be created via WebSocket, but we store the file here
        room_id = request.data.get('room_id')
        dm_room_id = request.data.get('dm_room_id')

        msg = Message(
            sender=request.user,
            content='',
            attachment=file,
            attachment_name=file.name,
            message_type='image' if file.content_type.startswith('image/') else 'file',
        )
        if room_id:
            msg.room_id = room_id
        elif dm_room_id:
            msg.dm_room_id = dm_room_id

        msg.save()

        url = request.build_absolute_uri(msg.attachment.url)
        return Response({
            'url': url,
            'name': file.name,
            'type': file.content_type,
            'message_id': str(msg.id),
        }, status=status.HTTP_201_CREATED)


@extend_schema(
    summary="List course participants for DM",
    description=(
        "Returns the list of participants in a course chat room that the current user can DM. "
        "Excludes the current user from the list."
    ),
    parameters=[
        OpenApiParameter(name='room_id', description='Chat room ID', required=True, type=str),
    ],
    tags=["Chat"],
)
class RoomParticipantsView(APIView):
    """Lists participants of a chat room for starting DMs."""
    permission_classes = [IsAuthenticated]
    serializer_class = ChatParticipantSerializer

    def get(self, request):
        room_id = request.query_params.get('room_id')
        if not room_id:
            return Response({"error": "room_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            room = ChatRoom.objects.get(id=room_id, participants=request.user)
        except ChatRoom.DoesNotExist:
            return Response({"error": "Room not found."}, status=status.HTTP_404_NOT_FOUND)

        participants = room.participants.exclude(id=request.user.id)
        data = ChatParticipantSerializer(participants, many=True).data
        return Response(data)

