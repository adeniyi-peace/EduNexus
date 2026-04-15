"""
WebSocket URL routing for the chat application.
"""
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # Course group chat: ws/chat/room/<uuid>/
    re_path(
        r'ws/chat/(?P<room_type>room)/(?P<room_id>[0-9a-f-]+)/$',
        consumers.ChatConsumer.as_asgi()
    ),
    # Direct message: ws/chat/dm/<uuid>/
    re_path(
        r'ws/chat/(?P<room_type>dm)/(?P<room_id>[0-9a-f-]+)/$',
        consumers.ChatConsumer.as_asgi()
    ),
]
