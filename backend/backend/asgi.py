"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

This configuration routes:
  - HTTP requests → standard Django ASGI handler
  - WebSocket requests → Django Channels with JWT authentication

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import OriginValidator
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Initialize Django ASGI application early to ensure AppRegistry is populated
# before importing Channels consumers
django_asgi_app = get_asgi_application()

# Import after Django setup to avoid AppRegistryNotReady
from chat.routing import websocket_urlpatterns as chat_ws_patterns
from chat.middleware import JWTAuthMiddleware
from user.routing import websocket_urlpatterns as notification_ws_patterns

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": OriginValidator(
        JWTAuthMiddleware(
            URLRouter(chat_ws_patterns + notification_ws_patterns)
        ),
        settings.ALLOWED_HOSTS
    ),
})
