"""
JWT authentication middleware for Django Channels WebSocket connections.
Extracts the JWT token from the WebSocket query string (?token=xxx)
and authenticates the user before allowing the connection.
"""
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError

User = get_user_model()


@database_sync_to_async
def get_user_from_token(token_str):
    """Validate JWT token and return the associated user."""
    try:
        token = AccessToken(token_str)
        user_id = token.get('user_id')
        return User.objects.get(id=user_id)
    except (TokenError, User.DoesNotExist, KeyError):
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):
    """
    Custom middleware that extracts a JWT from the WebSocket
    query string and attaches the authenticated user to the scope.

    Usage in WebSocket URL: ws://host/ws/chat/room/<id>/?token=<jwt>
    """

    async def __call__(self, scope, receive, send):
        # Parse query string from the WebSocket connection
        query_string = scope.get('query_string', b'').decode('utf-8')
        query_params = parse_qs(query_string)

        token_list = query_params.get('token', [])

        if token_list:
            scope['user'] = await get_user_from_token(token_list[0])
        else:
            scope['user'] = AnonymousUser()

        return await super().__call__(scope, receive, send)
