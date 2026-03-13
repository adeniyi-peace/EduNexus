from django.db import models
from uuid import uuid4
from django.utils.text import slugify
from django.contrib.auth import get_user_model


from .fields import OrderField

User = get_user_model()

class Category(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField()

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        return super().save(*args, **kwargs)

class Course(models.Model):
    DIFFICULTY_CHOICE = (
        ('Beginner','Beginner'),
        ('Intermediate','Intermediate'), 
        ('Advanced','Advanced')
    )

    STATUS = (
        ('Published','Published'),
        ('Draft','Draft'),
        ('Archived','Archived')
    )

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    title = models.CharField(max_length=200)
    instructor = models.ForeignKey(User, related_name="courses", on_delete=models.CASCADE)
    slug = models.SlugField(blank=True)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to=f"course thumbnail", height_field=None, width_field=None, max_length=None)
    price = models.DecimalField( max_digits=10, decimal_places=2)
    duration = models.DurationField(null=True, blank=True)
    category = models.ForeignKey(Category, related_name="courses", on_delete=models.CASCADE)
    language = models.CharField(max_length=50, default='English')
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICE, default=DIFFICULTY_CHOICE[0][0])
    status = models.CharField( max_length=50, choices=STATUS)
    lastUpdated = models.DateTimeField(auto_now=True, auto_now_add=False)
    created_at = models.DateTimeField( auto_now=False, auto_now_add=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(f"{self.title} {self.instructor.fullname}")
        self.duration = self.modules.aggregate(total_duration=models.Sum('lessons__duration'))['total_duration'] or 0
        return super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class Module(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    title = models.CharField(max_length=200)
    isOpen = models.BooleanField()
    course = models.ForeignKey(Course, related_name="modules", on_delete=models.CASCADE)

class Lesson(models.Model):
    TYPE =(
        ('video','video'),
        ('article','article'),
        ('quiz','quiz')
    )

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    module = models.ForeignKey(Module, related_name='lessons', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    type = models.CharField( max_length=20, choices=TYPE)
    description =models.TextField(blank=True, null=True)
    isPublished = models.BooleanField(default=False)
    isPreview = models.BooleanField(default=False)
    isHidden = models.BooleanField(default=False)
    allow_download = models.BooleanField(default=False)
    order = OrderField(blank=True, for_fields=['module'])
    lastUpdated = models.DateTimeField(auto_now=True, auto_now_add=False)
    created_at = models.DateTimeField( auto_now=False, auto_now_add=True)

    
    # Type-specific fields
    video_url = models.FileField(upload_to="videos", max_length=100)
    duration = models.PositiveIntegerField(help_text="Duration in seconds", blank=True, null=True)
    content = models.TextField(help_text="Markdown or HTML content", blank=True, null=True)
    quiz_time_limit = models.PositiveIntegerField(help_text="In minutes", blank=True, null=True)

    def __str__(self):
        return f'{self.order}. {self.title}'


class Resource(models.Model):
    lesson = models.ForeignKey(Lesson, related_name='resources', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    url = models.FileField(upload_to="resources", max_length=100)
    size = models.CharField(max_length=50) # e.g., "1.2MB"

class QuizQuestion(models.Model):
    lesson = models.ForeignKey(
        Lesson, 
        related_name='quiz_questions', 
        on_delete=models.CASCADE,
        limit_choices_to={'type': 'quiz'}
    )
    text = models.TextField()

class QuizOption(models.Model):
    question = models.ForeignKey(QuizQuestion, related_name='options', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

class Enrollment(models.Model):
    student = models.ForeignKey(User, related_name='enrollments', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, related_name='enrollments', on_delete=models.CASCADE)
    payment_reference = models.CharField(max_length=100, blank=True, null=True)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('student', 'course')

    def __str__(self):
        return f"{self.student.email} - {self.course.title}"
    
class Progress(models.Model):
    enrollment = models.OneToOneField(Enrollment, related_name='progress', on_delete=models.CASCADE)
    completed_lessons = models.ManyToManyField(Lesson, blank=True)
    last_accessed = models.DateTimeField(auto_now=True)

    @property
    def percentage_complete(self):
        total_lessons = self.enrollment.course.lessons.count()
        if total_lessons == 0:
            return 0
        done_count = self.completed_lessons.count()
        return (done_count / total_lessons) * 100

class Review(models.Model):
    student = models.ForeignKey(User, related_name='reviews', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, related_name='reviews', on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.email} - {self.course.title} ({self.rating} stars)"

class Wishlist(models.Model):
    student = models.ForeignKey(User, related_name='wishlists', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, related_name='wishlisted_by', on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.student.email} - {self.course.title}"


class Note(models.Model):
    student = models.ForeignKey(User, related_name='notes', on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, related_name='notes', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.PositiveIntegerField(help_text="Time in seconds where the note was taken", blank=True, null=True)
    is_code = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Note by {self.student.email} on {self.lesson.title}"


class CertificateConfig(models.Model):
    course = models.OneToOneField(Course, related_name='certificate_config', on_delete=models.CASCADE)
    signatory_name = models.CharField(max_length=255, help_text="Name of the person signing the certificate")
    signatory_title = models.CharField(max_length=255, help_text="Title of the signatory (e.g., 'Lead Instructor')")
    signatory_signature = models.ImageField(upload_to='signatures/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Config for {self.course.title}"

class Certificate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    student = models.ForeignKey(User, related_name='certificates', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, related_name='certificates', on_delete=models.CASCADE)
    certificate_id = models.CharField(max_length=100, unique=True, blank=True)
    issued_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')
        ordering = ['-issued_at']

    def save(self, *args, **kwargs):
        if not self.certificate_id:
            import uuid
            self.certificate_id = f"CERT-{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Certificate - {self.student.fullname} - {self.course.title}"

