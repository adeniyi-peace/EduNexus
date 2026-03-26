from django.contrib.auth import password_validation, authenticate
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.conf import settings
from user.models import User
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from dj_rest_auth.serializers import LoginSerializer, PasswordResetSerializer, PasswordResetConfirmSerializer

class UserSerializer(serializers.ModelSerializer):
    # Use the @property we defined in the model
    fullname = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 
            'fullname', 'role', 'phone', 'date_joined', 'xp'
        ]
        # Role and Email should generally not be editable via a standard profile update
        read_only_fields = ['role', 'email', 'date_joined']

    
# Uncomment commented sections if you want to have password confirmation 
# in the frontend
class RegisterUserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "email", 'first_name', 'last_name', "password1", "password2", "role"]
        extra_kwargs = {"password":{"write_only":True}}

    def save(self, request=None, **kwargs):
        """
        Overriding save to handle the 'request' positional argument 
        passed by dj-rest-auth while keeping DRF compatibility.
        """
        return super().save(**kwargs)

    def validate_password(self, attrs):
        if attrs["password1"] != attrs["password2"]:
            raise serializers.ValidationError("Password do not match")
        
        password = attrs["password1"]

        if not attrs["role"] :
            attrs["role"] = "student"

        try:
             password_validation.validate_password(password, user=None)
        except Exception as error:
            raise serializers.ValidationError(" ".join(error))

        
        return attrs
    
    def create(self, validated_data):
        # remove password1 and password2 from "validated_data" dictionary
        password = validated_data.pop("password1")
        validated_data.pop("password2")
        user = User.objects.create_user(password=password, **validated_data)
        return user
    
class UserLoginSerializer(LoginSerializer):
    username = None
    email = serializers.EmailField(required=True, allow_blank=True)
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, attrs):
        user = authenticate(**attrs)
        if user:
            if not user.is_active:
                raise serializers.ValidationError("Account is inactive. Please check your email for activation link.")
            return user
        else:
            # Check if user exists but is inactive
            email = attrs.get('email')
            password = attrs.get('password')
            try:
                user_obj = User.objects.get(email=email)
                if not user_obj.is_active and user_obj.check_password(password):
                    raise serializers.ValidationError("Account is inactive. Please activate your account through the email link sent to you.")
            except User.DoesNotExist:
                pass
            raise serializers.ValidationError(f"Incorrect Credentials.")
        
class CustomTokenClaimsSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role

        return token

class CustomPasswordResetSerializer(PasswordResetSerializer):
    def save(self):
        # We manually find the user and send a direct link to the frontend
        email = self.validated_data.get('email')
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # We return silently for security reasons (don't reveal users)
            return

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        # Direct link to the frontend (matches your reset-password component logic)
        reset_link = f"{frontend_url}/reset-password?uid={uid}&token={token}"
        print(reset_link)
        
        subject = "Reset your EduNexus Password"
        message = f"""Hello from EduNexus,\n\n
        You're receiving this email because you or someone else has requested a password reset for your user account.\n  
        Re-sync your access using the link below (expires in 30 minutes):\n\n
        {reset_link}\n
        If you did not request this, please ignore this transmission.\n\n
        Thank you for using EduNexus!\n
        The EduNexus Team"""
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )

class CustomPasswordResetConfirmSerializer(PasswordResetConfirmSerializer):
    def validate(self, attrs):
        # We handle field names manually to ensure compatibility with frontend
        uid = attrs.get('uid')
        token = attrs.get('token')
        password1 = attrs.get('new_password1')
        password2 = attrs.get('new_password2')
        
        if not uid or not token or not password1 or not password2:
            raise serializers.ValidationError("Missing required fields.")

        if password1 != password2:
            raise serializers.ValidationError({"new_password2": "Passwords do not match."})

        try:
            # Decode the user ID
            uid_decoded = force_str(urlsafe_base64_decode(uid))
            print(uid_decoded)
            self.user = User.objects.get(pk=uid_decoded)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist) as e:
             print(e)
             raise serializers.ValidationError({"uid": "Invalid user ID."})

        # Check the token
        if not default_token_generator.check_token(self.user, token):
            raise serializers.ValidationError({"token": "Invalid or expired token."})
        
        # Validate password strength (Django default validators)
        try:
            password_validation.validate_password(password1, user=self.user)
        except Exception as e:
            raise serializers.ValidationError({"new_password1": list(e)})

        # Store validated data for save method
        attrs['user'] = self.user
        return attrs

    def save(self):
        user = self.validated_data['user']
        password = self.validated_data['new_password1']
        user.set_password(password)
        user.save()
        return user