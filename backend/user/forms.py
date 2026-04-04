from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm


from .models import User

# strictly used for the admin
class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = User
        fields = ("email",)

# strictly used for the admin
class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = User
        fields = ("email",)

