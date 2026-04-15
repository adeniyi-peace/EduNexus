"""
WebSocket consumer for real-time chat messaging.
Handles both course group chats and direct messages.
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser

from .models import ChatRoom, DirectMessageRoom, Message


class ChatConsumer(AsyncWebsocketConsumer):
    """
    Async WebSocket consumer for real-time chat.

    Connection URL patterns:
      - ws/chat/room/<room_id>/   — Course group chat
      - ws/chat/dm/<room_id>/     — Direct messages
    """

    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_type = self.scope['url_route']['kwargs'].get('room_type', 'room')
        self.user = self.scope.get('user', AnonymousUser())

        # Reject unauthenticated connections
        if isinstance(self.user, AnonymousUser) or not self.user.is_authenticated:
            await self.close(code=4001)
            return

        # Validate room access
        is_valid = await self.validate_room_access()
        if not is_valid:
            await self.close(code=4003)
            return

        # Set the channel group name
        self.group_name = f"chat_{self.room_type}_{self.room_id}"

        # Join the channel group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

        # Send a system message that user connected
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'user_event',
                'event': 'join',
                'user_id': self.user.id,
                'username': await self.get_username(),
            }
        )

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            # Send leave event
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'user_event',
                    'event': 'leave',
                    'user_id': self.user.id,
                    'username': await self.get_username() if self.user.is_authenticated else 'Unknown',
                }
            )

            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        """Handle incoming WebSocket messages."""
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON payload.'
            }))
            return

        message_type = data.get('type', 'chat_message')

        if message_type == 'chat_message':
            await self.handle_chat_message(data)
        elif message_type == 'typing':
            await self.handle_typing(data)
        elif message_type == 'read_receipt':
            await self.handle_read_receipt(data)

    async def handle_chat_message(self, data):
        """Process and broadcast a chat message."""
        content = data.get('message', '').strip()
        attachment_url = data.get('attachment_url')
        attachment_name = data.get('attachment_name', '')
        attachment_type = data.get('attachment_type', '')

        if not content and not attachment_url:
            return

        # Determine message type
        if attachment_url and attachment_type.startswith('image/'):
            msg_type = 'image'
        elif attachment_url:
            msg_type = 'file'
        else:
            msg_type = 'text'

        # Persist message to database
        message = await self.save_message(content, msg_type, attachment_name)

        # Get sender info
        sender_info = await self.get_sender_info()

        # Broadcast to group
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'chat_message',
                'message_id': str(message.id),
                'sender': sender_info,
                'content': content,
                'message_type': msg_type,
                'attachment_url': attachment_url or '',
                'attachment_name': attachment_name,
                'attachment_type': attachment_type,
                'created_at': message.created_at.isoformat(),
            }
        )

    async def handle_typing(self, data):
        """Broadcast typing indicator to other users in the room."""
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'typing_indicator',
                'user_id': self.user.id,
                'username': await self.get_username(),
                'is_typing': data.get('is_typing', False),
            }
        )

    async def handle_read_receipt(self, data):
        """Mark messages as read."""
        message_ids = data.get('message_ids', [])
        if message_ids:
            await self.mark_messages_read(message_ids)

    # -- Channel layer event handlers --

    async def chat_message(self, event):
        """Send chat message to WebSocket client."""
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message_id': event['message_id'],
            'sender': event['sender'],
            'content': event['content'],
            'message_type': event['message_type'],
            'attachment_url': event.get('attachment_url', ''),
            'attachment_name': event.get('attachment_name', ''),
            'attachment_type': event.get('attachment_type', ''),
            'created_at': event['created_at'],
            'is_me': event['sender']['id'] == self.user.id,
        }))

    async def typing_indicator(self, event):
        """Send typing indicator to WebSocket client (skip sender)."""
        if event['user_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'typing',
                'user_id': event['user_id'],
                'username': event['username'],
                'is_typing': event['is_typing'],
            }))

    async def user_event(self, event):
        """Send user join/leave event to WebSocket client."""
        if event['user_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'user_event',
                'event': event['event'],
                'user_id': event['user_id'],
                'username': event['username'],
            }))

    # -- Database operations (sync to async) --

    @database_sync_to_async
    def validate_room_access(self):
        """Check if the user has permission to access this room."""
        try:
            if self.room_type == 'room':
                room = ChatRoom.objects.get(id=self.room_id)
                return room.participants.filter(id=self.user.id).exists()
            elif self.room_type == 'dm':
                room = DirectMessageRoom.objects.get(id=self.room_id)
                return room.participants.filter(id=self.user.id).exists()
            return False
        except (ChatRoom.DoesNotExist, DirectMessageRoom.DoesNotExist):
            return False

    @database_sync_to_async
    def save_message(self, content, msg_type, attachment_name=''):
        """Persist a message to the database."""
        kwargs = {
            'sender': self.user,
            'content': content,
            'message_type': msg_type,
            'attachment_name': attachment_name,
        }
        if self.room_type == 'room':
            kwargs['room_id'] = self.room_id
        else:
            kwargs['dm_room_id'] = self.room_id

        return Message.objects.create(**kwargs)

    @database_sync_to_async
    def get_sender_info(self):
        """Get serializable sender information."""
        return {
            'id': self.user.id,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'fullname': self.user.get_full_name() or self.user.email,
            'role': self.user.role,
            'profile_picture': self.user.profile_picture.url if self.user.profile_picture else None,
        }

    @database_sync_to_async
    def get_username(self):
        """Get display name for the user."""
        return self.user.first_name or self.user.email

    @database_sync_to_async
    def mark_messages_read(self, message_ids):
        """Mark specific messages as read."""
        Message.objects.filter(
            id__in=message_ids
        ).exclude(
            sender=self.user
        ).update(is_read=True)
