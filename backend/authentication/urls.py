from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    path(r'', include('dj_rest_auth.urls')),
    path(r'registration/', include('dj_rest_auth.registration.urls')),
    path('api/auth/google/', views.GoogleLogin.as_view(), name='google_login'),
    path('api/auth/apple/', views.AppleLogin.as_view(), name='apple_login'),
]
