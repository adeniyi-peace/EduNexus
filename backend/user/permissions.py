from rest_framework import permissions

class IsInstructor(permissions.BasePermission):
    """
    Allows access only to users with the instructor role.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.role == 'instructor' or request.user.is_staff)
        )

class IsInstructorOrReadOnly(permissions.BasePermission):
    """
    Public can see (GET), but only Instructors can modify (POST, PUT, DELETE).
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.role == 'instructor')

class IsCourseOwner(permissions.BasePermission):
    """
    Object-level permission to only allow instructors to edit THEIR OWN courses.
    Handles Courses, Modules, Lessons, Resources, QuizQuestions, and QuizOptions.
    """
    def has_object_permission(self, request, view, obj):
        # SAFE_METHODS are GET, HEAD or OPTIONS.
        if request.method in permissions.SAFE_METHODS:
            return True

        if hasattr(obj, 'instructor'):
            return obj.instructor == request.user
        if hasattr(obj, 'course'):
            return obj.course.instructor == request.user
        if hasattr(obj, 'module'):
            return obj.module.course.instructor == request.user
        if hasattr(obj, 'lesson'):
            return obj.lesson.module.course.instructor == request.user
        if hasattr(obj, 'question'):
            if hasattr(obj.question, 'lesson'): # QuizOption or Answer
                return obj.question.lesson.module.course.instructor == request.user
            
        return False


class IsStudent(permissions.BasePermission):
    """Allows access only to students."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'student')


class IsAdmin(permissions.BasePermission):
    """Custom permission: only allows users with role='admin' or superusers."""
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.role == 'admin' or request.user.is_superuser)
        )