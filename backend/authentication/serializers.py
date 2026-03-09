from django.contrib.auth import password_validation, authenticate
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from  user.models import User

class UserSerializer(serializers.ModelSerializer):
    # Use the @property we defined in the model
    fullname = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 
            'fullname', 'role', 'phone', 'date_joined'
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

    def validate_password(self, attrs):
        if attrs["password1"] != attrs["password2"]:
            raise serializers.ValidationError("Password do not match")
        
        password = attrs["password1"]

        if not attrs["role"] :
            attrs["role"] = "student"

        try:
             password_validation.validate_password(password, self.instance)
        except Exception as error:
            raise serializers.ValidationError(" ".join(error))

        
        return attrs
    
    def create(self, validated_data):
        # remove password1 and password2 from "validated_data" dictionary
        password = validated_data.pop("password1")
        validated_data.pop("password2")
        user = User.objects.create_user(password=password, **validated_data)
        return user
    
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(**attrs)
        if user:
            return user
        else:
            raise serializers.ValidationError(f"Incorrect Credentials.")
        
class CustomTokenClaimsSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role

        return token