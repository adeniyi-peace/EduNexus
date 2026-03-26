from django.shortcuts import render

from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.apple.views import AppleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import redirect
from django.conf import settings

from .serializers import *
from .utils import send_activation_email
from  user.models import User


class RegisterUserView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RegisterUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Send activation email
        send_activation_email(user, request)
        
        data = serializer.data
        data["message"] = "Account created. Please check your email to activate your account."
        return Response(data=data, status=status.HTTP_201_CREATED)

class ActivateAccountView(GenericAPIView):
    permission_classes = [AllowAny]
    
    def get(self, request, uidb64, token, *args, **kwargs):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            
            # Generate tokens for automatic login
            refresh = RefreshToken.for_user(user)
            user_data = UserSerializer(user).data
            
            return Response({
                "message": "Account activated successfully.",
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token)
                },
                "user": user_data
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Activation link is invalid or has expired."}, status=status.HTTP_400_BAD_REQUEST)

class ResendActivationView(GenericAPIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            if user.is_active:
                return Response({"message": "This account is already active."}, status=status.HTTP_400_BAD_REQUEST)
            
            send_activation_email(user, request)
            return Response({"message": "Activation email has been resent."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            # We return 200 even if user doesn't exist for security reasons (don't reveal users)
            # or we can be explicit here as it's an educational/simple project
            return Response({"message": "If this email is registered, an activation link has been sent."}, status=status.HTTP_200_OK)

class PasswordResetConfirmRedirectView(GenericAPIView):
    permission_classes = [AllowAny]
    
    def get(self, request, uidb64, token, *args, **kwargs):
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        return redirect(f"{frontend_url}/reset-password?uid={uidb64}&token={token}")

class LoginView(GenericAPIView):
    permission_classes = [AllowAny,]
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        
        serializer = UserSerializer(user, context=self.get_serializer_context())
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {"refresh":str(token),
                          "access":str(token.access_token)}
        return Response(data=data, status=status.HTTP_200_OK)
    
class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:3000" # Your frontend URL
    client_class = OAuth2Client

class AppleLogin(SocialLoginView):
    adapter_class = AppleOAuth2Adapter
    callback_url = "https://your-domain.com/apple/callback"
    client_class = OAuth2Client