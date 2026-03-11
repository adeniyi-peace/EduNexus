from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from courses.models import Enrollment, Progress

@receiver(post_save, sender=Enrollment)
def create_enrollment_progress(sender, instance, created, **kwargs):
    """
    Automatically creates a Progress record when a student 
    is enrolled in a course.
    """
    if created:
        Progress.objects.create(enrollment=instance)

@receiver(m2m_changed, sender=Progress.completed_lessons.through)
def update_enrollment_percentage(sender, instance, action, **kwargs):
    """
    Whenever a lesson is added/removed from completed_lessons, 
    update the DecimalField on the Enrollment model for fast querying.
    """
    if action in ["post_add", "post_remove", "post_clear"]:
        total_lessons = instance.enrollment.course.lessons.count()
        if total_lessons > 0:
            completed = instance.completed_lessons.count()
            percentage = (completed / total_lessons) * 100
            
            # Update the parent enrollment's decimal field
            instance.enrollment.progress = percentage
            instance.enrollment.save()