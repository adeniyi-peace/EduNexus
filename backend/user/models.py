from django.db import models
from django.contrib.auth.models import PermissionsMixin, AbstractBaseUser, BaseUserManager, User
from phonenumber_field.modelfields import PhoneNumberField
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey




class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):

        if not email:
            raise ValueError(_("The email must be set"))
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Super User must have is_staff=True"))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Super User must have is_superuser=True"))
        
        return self.create_user(email, password, **extra_fields, role="admin")


class User(AbstractBaseUser, PermissionsMixin):
    class Roles(models.TextChoices):
        STUDENT = 'student', _('Student')
        INSTRUCTOR = 'instructor', _('Instructor')
        ADMIN = 'admin', _('Admin')

    email = models.EmailField(verbose_name="Email Address", max_length=254, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = PhoneNumberField( null=True, blank=True)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateField(default=timezone.now)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to=f"profile pictures", height_field=None, width_field=None, max_length=None, blank=True, null=True)

    # Role Selection
    role = models.CharField(
        max_length=20, 
        choices=Roles.choices, 
        default=Roles.STUDENT
    )

    @property
    def xp(self):
        """Calculates total XP as the sum of points from all earned achievements."""
        return self.achievements_earned.aggregate(models.Sum('achievement__points'))['achievement__points__sum'] or 0

    @property
    def fullname(self):
        return f"{self.first_name} {self.last_name}"
    
    # Add related_name to avoid clashes
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name='customuser_set', # Unique related_name
        related_query_name='customuser',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='customuser_permissions_set', # Use another unique related_name
        related_query_name='customuser_permission'
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = CustomUserManager()

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")


    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.last_name} {self.first_name}"

    def get_short_name(self):
        return self.first_name
    
    @property
    def is_instructor(self):
        return self.role == self.Roles.INSTRUCTOR

    @property
    def is_student(self):
        return self.role == self.Roles.STUDENT
    
    @property
    def is_admin(self):
        return self.role == self.Roles.ADMIN or self.is_superuser
    
    

class Notification(models.Model):
    class NotificationType(models.TextChoices):
        SYSTEM = "system", _("System")
        ENROLLMENT = "enrollment", _("Enrollment")
        COURSE_UPDATE = "course_update", _("Course Update")
        ACHIEVEMENT = "achievement", _("Achievement")
        MENTOR_REPLY = "mentor_reply", _("Mentor Reply")
        DEADLINE = "deadline", _("Deadline")
        CERTIFICATE = "certificate", _("Certificate")

    # The user who triggered the notification (optional, e.g., an instructor)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_notifications", null=True, blank=True)
    # The user receiving the notification
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    
    # Generic relation to link to any model (Course, Lesson, Review, etc.)
    content_ct = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    content_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey("content_ct", "content_id")

    notification_type = models.CharField(max_length=20, choices=NotificationType.choices)
    title = models.CharField(max_length=255, blank=True)
    message = models.TextField()
    link = models.CharField(max_length=255, blank=True, null=True) # Optional direct link
    
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes =[
            models.Index(fields=["-created_at"] ),
            models.Index(fields=["content_ct", "content_id"] )
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.notification_type} for {self.receiver.email}"

class Achievement(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon_name = models.CharField(max_length=50, help_text="Lucide or custom icon name (e.g., 'ShieldCheck')")
    points = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="achievements_earned")
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name="users_earned")
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'achievement')
        ordering = ['-earned_at']

    def __str__(self):
        return f"{self.user.email} - {self.achievement.name}"


class AdminSetting(models.Model):
    """Key-value store for platform-wide configuration (site name, maintenance mode, etc.)"""
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    label = models.CharField(max_length=255, blank=True, help_text="Human-readable label for the setting")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.key} = {self.value[:50]}"