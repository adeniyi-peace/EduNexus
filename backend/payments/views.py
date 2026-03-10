import json
import hmac
import hashlib
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema, OpenApiExample
from drf_spectacular.types import OpenApiTypes


from courses.models import Course, Enrollment
from .models import Payment


User = get_user_model()


# Define a mock schema for the Paystack payload for documentation purposes
PAYSTACK_WEBHOOK_EXAMPLE = {
    "event": "charge.success",
    "data": {
        "reference": "NEXUS-123456",
        "amount": 500000,
        "status": "success",
        "customer": {"email": "student@edunexus.com"},
        "metadata": {"course_ids": [1, 2, 5]}
    }
}

class PaystackWebhookView(APIView):
    # 2. Crucial: Allow Paystack to hit this without a JWT token
    permission_classes = [AllowAny]
    # 3. DRF's APIView automatically exempts CSRF, so we don't need @method_decorator

    @extend_schema(
        summary="Paystack Webhook Callback",
        description="Handles 'charge.success' events from Paystack to enroll students in courses.",
        request=OpenApiTypes.OBJECT,
        responses={200: OpenApiTypes.STR, 401: OpenApiTypes.STR},
        examples=[
            OpenApiExample(
                'Successful Charge',
                value=PAYSTACK_WEBHOOK_EXAMPLE,
                request_only=True,
            )
        ],
        tags=['Payments']
    )
    def post(self, request, *args, **kwargs):
        # DRF's request.body is the same as Django's request.body
        payload = request.body
        sig_header = request.headers.get('x-paystack-signature')
        
        if not sig_header:
            return HttpResponse(status=400)
            
        # Verify Paystack signature
        secret = settings.PAYSTACK_WEBHOOK_SECRET
        hash_obj = hmac.new(secret.encode('utf-8'), payload, hashlib.sha512).hexdigest()
        
        if hash_obj != sig_header:
            return HttpResponse(status=401)
            
        # DRF parses JSON for you automatically in request.data, 
        # but for signature verification we used the raw payload above.
        event_data = request.data 
        event = event_data.get('event')
        data = event_data.get('data', {})
        
        if event == 'charge.success':
            reference = data.get('reference')
            email = data.get('customer', {}).get('email')
            amount = data.get('amount', 0) / 100  # Paystack amount is in kobo/cents
            status = data.get('status')
            metadata = data.get('metadata', {})
            course_ids = metadata.get('course_ids', [])
            
            # Check if payment already exists
            if Payment.objects.filter(reference=reference).exists():
                return HttpResponse(status=200)  # Already processed
                
            # Find the user
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                user = None  # Or handle guest checkout if applicable
                
            # Create payment record
            payment = Payment.objects.create(
                user=user,
                email=email,
                amount=amount,
                reference=reference,
                status=status if status == 'success' else 'failed'
            )
            
            if status == 'success' and user:
                # Process enrollments
                for course_id in course_ids:
                    try:
                        course = Course.objects.get(id=course_id)
                        # Enroll the user, if not already enrolled
                        Enrollment.objects.get_or_create(
                            student=user,
                            course=course,
                            defaults={'payment_reference': reference}
                        )
                    except Course.DoesNotExist:
                        # Log error or handle missing course
                        pass
                        

        # 4. Use DRF's Response instead of HttpResponse
        return Response({"status": "success"}, status=200)