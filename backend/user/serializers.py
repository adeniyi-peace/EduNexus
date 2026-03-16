from rest_framework import serializers
from .models import Notification, Achievement, UserAchievement
from courses.models import Course, Enrollment

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'name', 'description', 'icon_name', 'points']

class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)
    
    class Meta:
        model = UserAchievement
        fields = ['id', 'achievement', 'earned_at']

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


class MessageAllSerializer(serializers.Serializer):
    """Serializer for sending messages to all students in a course."""
    subject = serializers.CharField(required=True, max_length=255)
    message = serializers.CharField(required=True)
    
    def validate(self, data):
        """Validate that both subject and message are provided."""
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()
        
        if not subject:
            raise serializers.ValidationError("Subject is required.")
        if not message:
            raise serializers.ValidationError("Message is required.")
            
        data['subject'] = subject
        data['message'] = message
        return data
    
    def create_notifications(self, course, instructor):
        """Create notifications for all enrolled students in the course."""
        validated_data = self.validated_data
        subject = validated_data['subject']
        message = validated_data['message']
        
        # Get all enrolled students
        enrollments = Enrollment.objects.filter(course=course).select_related('student')
        
        # Create notifications for each student
        notifications = []
        for enrollment in enrollments:
            notification = Notification.objects.create(
                sender=instructor,
                receiver=enrollment.student,
                notification_type=Notification.NotificationType.COURSE_UPDATE,
                title=subject,
                message=message,
                content_object=course,
                link=f"/dashboard/courses/{course.id}"
            )
            notifications.append(notification)
        
        return notifications


class MessageStudentSerializer(serializers.Serializer):
    """Serializer for sending a message to an individual student."""
    student_id = serializers.UUIDField(required=True)
    subject = serializers.CharField(required=True, max_length=255)
    message = serializers.CharField(required=True)
    
    def validate(self, data):
        """Validate that all required fields are provided and student exists."""
        from .models import User
        
        student_id = data.get('student_id')
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()
        
        if not student_id:
            raise serializers.ValidationError("Student ID is required.")
        if not subject:
            raise serializers.ValidationError("Subject is required.")
        if not message:
            raise serializers.ValidationError("Message is required.")
        
        # Validate student exists
        try:
            student = User.objects.get(id=student_id)
            data['student'] = student
        except User.DoesNotExist:
            raise serializers.ValidationError("Student not found.")
        
        data['subject'] = subject
        data['message'] = message
        return data
    
    def create_notification(self, instructor):
        """Create a notification for the specified student."""
        validated_data = self.validated_data
        student = validated_data['student']
        subject = validated_data['subject']
        message = validated_data['message']
        
        notification = Notification.objects.create(
            sender=instructor,
            receiver=student,
            notification_type=Notification.NotificationType.MENTOR_REPLY,
            title=subject,
            message=message
        )
        
        return notification
