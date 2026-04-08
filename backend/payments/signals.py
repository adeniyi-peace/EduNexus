from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from django.db.models import Count
from courses.models import Enrollment, Progress

@receiver(post_save, sender=Enrollment)
def create_enrollment_progress(sender, instance, created, **kwargs):
    """
    Automatically creates a Progress record when a student 
    is enrolled in a course.
    """
    if created:
        Progress.objects.create(enrollment=instance)
