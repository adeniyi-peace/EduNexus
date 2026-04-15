"""
Signals for automatic chat room management.
- Auto-creates a course chat room when a course is published.
- Auto-adds students to the chat room on enrollment.
- Auto-adds the instructor as a participant.
"""
from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver

from courses.models import Enrollment, Course
from .models import ChatRoom


@receiver(post_save, sender=Enrollment)
def add_student_to_chat_room(sender, instance, created, **kwargs):
    """
    When a student enrolls in a course, auto-create the course chat room
    (if it doesn't exist) and add the student as a participant.
    """
    if not created:
        return

    course = instance.course
    student = instance.student

    # Get or create the course chat room
    chat_room, room_created = ChatRoom.objects.get_or_create(
        course=course,
        defaults={'room_type': 'course_group'}
    )

    # Add the student
    chat_room.participants.add(student)

    # Ensure the instructor is always a participant
    chat_room.participants.add(course.instructor)


@receiver(post_save, sender=Course)
def create_chat_room_for_published_course(sender, instance, **kwargs):
    """
    When a course status changes to Published, ensure a chat room exists
    with the instructor as the first participant.
    """
    if instance.status == 'Published':
        chat_room, created = ChatRoom.objects.get_or_create(
            course=instance,
            defaults={'room_type': 'course_group'}
        )
        if created:
            chat_room.participants.add(instance.instructor)
