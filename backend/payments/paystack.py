import requests
from django.conf import settings

class PaystackService:
    def __init__(self):
        self.secret_key = settings.PAYSTACK_SECRET_KEY
        self.base_url = 'https://api.paystack.co'

    def verify_payment(self, reference):
        path = f'/transaction/verify/{reference}'
        url = self.base_url + path
        headers = {
            "Authorization": f"Bearer {self.secret_key}",
            "Content-Type": "application/json",
        }

        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            return response.json()['data']
        return None
