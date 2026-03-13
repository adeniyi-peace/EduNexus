from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    # Mapping for frontend consistency if needed, but standard fields are fine too
    time = serializers.SerializerMethodField()
    type = serializers.CharField(source='notification_type')
    text = serializers.CharField(source='message')

    class Meta:
        model = Notification
        fields = ['id', 'type', 'text', 'title', 'time', 'is_read', 'link']

    def get_time(self, obj):
        # Placeholder for relative time or formatting
        return obj.created_at.strftime("%Y-%m-%d %H:%M:%S")
