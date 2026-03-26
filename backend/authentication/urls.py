from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    path('registration/', views.RegisterUserView.as_view(), name='account_signup'), # Override dj-rest-auth signup
    path(r'', include('dj_rest_auth.urls')),
    path(r'registration/', include('dj_rest_auth.registration.urls')), # Kept as fallback/social
    path('activate/<uidb64>/<token>/', views.ActivateAccountView.as_view(), name='activate_account'),
    path('resend-activation/', views.ResendActivationView.as_view(), name='resend_activation'),
    path('api/auth/google/', views.GoogleLogin.as_view(), name='google_login'),
    path('api/auth/apple/', views.AppleLogin.as_view(), name='apple_login'),
]
