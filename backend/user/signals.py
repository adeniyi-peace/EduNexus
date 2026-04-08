from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from django.db.models import Count
from courses.models import Progress, Enrollment, Certificate
from .models import Achievement, UserAchievement, Notification

@receiver(m2m_changed, sender=Progress.completed_lessons.through)
def check_for_achievements(sender, instance, action, **kwargs):
    """
    Triggered when a student completes a lesson.
    Checks for lesson count milestones and course completion milestones.
    """
    if action != "post_add":
        return

    user = instance.enrollment.student
    
    # 1. Lesson Milestones
    # Total unique lessons completed by this user across all courses
    total_lessons_completed = Progress.objects.filter(
        enrollment__student=user
    ).aggregate(total=Count('completed_lessons'))['total'] or 0

    # Define milestones: count -> (achievement_name, icon, points)
    lesson_milestones = {
        5: ("Quick Starter", "Zap", 50),
        25: ("Consistent Learner", "BookOpen", 200),
        100: ("Lesson Master", "Award", 1000),
    }

    for count, (name, icon, pts) in lesson_milestones.items():
        if total_lessons_completed >= count:
            award_achievement(user, name, f"You have completed {count} lessons!", icon, pts)

    # 2. Course Completion Milestones
    # Check if the course linked to this Progress instance is now 100% complete
    if instance.percentage_complete >= 100:
        # User just finished this specific course
        award_achievement(
            user, 
            "Course Graduate", 
            f"You've successfully completed: {instance.enrollment.course.title}", 
            "GraduationCap", 
            500
        )
        
        # 3. Issue Certificate
        issue_certificate(user, instance.enrollment.course)

        # Multi-course milestones
        # Count courses where the number of completed lessons matches the total lessons in that course
        enrollments = Enrollment.objects.filter(student=user).select_related('course')
        completed_courses_count = 0
        for enrollment in enrollments:
            total_lessons = enrollment.course.modules.aggregate(lessons_count=Count("lessons"))
            if total_lessons['lessons_count'] > 0:
                completed_count = enrollment.progress.completed_lessons.count()
                if completed_count >= total_lessons['lessons_count']:
                    completed_courses_count += 1

        course_milestones = {
            1: ("Nexus Pioneer", "Rocket", 300),
            5: ("Senior Architect", "Trophy", 1500),
            10: ("Elite Developer", "Crown", 5000),
        }

        for count, (name, icon, pts) in course_milestones.items():
            if completed_courses_count >= count:
                award_achievement(user, name, f"You have mastered {count} courses!", icon, pts)

def award_achievement(user, name, message, icon, points):
    """
    Helper to create the achievement and notification if not already awarded.
    """
    # Get or create the achievement definition
    achievement, created = Achievement.objects.get_or_create(
        name=name,
        defaults={
            "description": message,
            "icon_name": icon,
            "points": points
        }
    )

    # Award it to the user
    user_achievement, newly_awarded = UserAchievement.objects.get_or_create(
        user=user,
        achievement=achievement
    )

    if newly_awarded:
        # Notify the user
        Notification.objects.create(
            receiver=user,
            notification_type="achievement",
            title="Achievement Unlocked!",
            message=f"New Badge: {name}. {message}",
            link="/dashboard/achievements"
        )

def issue_certificate(user, course):
    """
    Helper to issue a certificate to a user for a specific course.
    """
    certificate, created = Certificate.objects.get_or_create(
        student=user,
        course=course
    )

    if created:
        # Notify the user
        Notification.objects.create(
            receiver=user,
            notification_type="certificate",
            title="Certificate Issued!",
            message=f"Congratulations! You have earned a certificate for: {course.title}.",
            link=f"/dashboard/certificates"
        )
