from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
import os

def send_activation_email(user, request=None):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    
    # Use FRONTEND_URL from settings, or fallback to request domain
    if hasattr(settings, 'FRONTEND_URL'):
        frontend_url = settings.FRONTEND_URL
    else:
        # Fallback to current request's domain if settings.FRONTEND_URL is not set
        domain = request.get_host() if request else 'localhost:5173'
        protocol = 'https' if request and request.is_secure() else 'http'
        frontend_url = f"{protocol}://{domain}"

    activation_link = f"{frontend_url}/activate/{uid}/{token}"

    subject = "Activate your EduNexus Account"
    message = f"Hello {user.first_name},\n\nPlease click the link below to activate your account. This link will expire in 30 minutes.\n\n{activation_link}\n\nIf you did not register for an account, please ignore this email."

    # In a real app, you might want to use a HTML template
    # html_message = render_to_string('activation_email.html', {'user': user, 'activation_link': activation_link})
    
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
            # html_message=html_message
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
