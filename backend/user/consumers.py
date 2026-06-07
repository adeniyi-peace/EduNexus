"""
WebSocket consumer for real-time notifications.
Each authenticated user connects to their own personal notification channel.
Receives pushed notifications and sends mark-read events.
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser

from .models import Notification

class NotificationConsumer(AsyncWebsocketConsumer):
    """
    Async WebSocket consumer for real-time user notifications.

    Connection URL: ws/notifications/?token=<jwt>

    Each user joins a personal group: notifications_user_{user_id}
    On connect, sends the current unread count.
    Receives pushed notification events from Django signals.
    """

    async def connect(self):
        self.user = self.scope.get('user', AnonymousUser())

        if isinstance(self.user, AnonymousUser) or not self.user.is_authenticated:
            await self.close(code=4001)
            return

        # Personal notification group for this user
        self.group_name = f"notifications_user_{self.user.id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

        # Send initial unread count
        unread_count = await self.get_unread_count()
        await self.send(text_data=json.dumps({
            'type': 'initial_state',
            'unread_count': unread_count,
        }))

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        """Handle incoming messages from the client."""
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            return

        msg_type = data.get('type')

        if msg_type == 'mark_read':
            notification_id = data.get('notification_id')
            if notification_id:
                await self.mark_notification_read(notification_id)
                unread_count = await self.get_unread_count()
                await self.send(text_data=json.dumps({
                    'type': 'unread_count_update',
                    'unread_count': unread_count,
                }))

        elif msg_type == 'mark_all_read':
            await self.mark_all_notifications_read()
            await self.send(text_data=json.dumps({
                'type': 'unread_count_update',
                'unread_count': 0,
            }))

    # -- Channel layer event handlers --

    async def new_notification(self, event):
        """Push a new notification to the WebSocket client."""
        await self.send(text_data=json.dumps({
            'type': 'new_notification',
            'notification': event['notification'],
        }))

    async def unread_count_update(self, event):
        """Push an updated unread count."""
        await self.send(text_data=json.dumps({
            'type': 'unread_count_update',
            'unread_count': event['unread_count'],
        }))

    # -- Database operations --

    @database_sync_to_async
    def get_unread_count(self):
        return Notification.objects.filter(
            receiver=self.user,
            is_read=False
        ).count()

    @database_sync_to_async
    def mark_notification_read(self, notification_id):
        Notification.objects.filter(
            id=notification_id,
            receiver=self.user
        ).update(is_read=True)

    @database_sync_to_async
    def mark_all_notifications_read(self):
        Notification.objects.filter(
            receiver=self.user,
            is_read=False
        ).update(is_read=True)
