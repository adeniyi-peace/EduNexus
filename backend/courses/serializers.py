from rest_framework import serializers
from django.db.models import Avg
from authentication.serializers import UserSerializer
from .models import Category, Course, Module, Lesson, Resource, QuizQuestion, QuizOption, Review, Wishlist, Note, Progress, Enrollment, Certificate

class ProgressSerializer(serializers.ModelSerializer):
    percentage_complete = serializers.IntegerField(read_only=True)

    class Meta:
        model = Progress
        fields = ['percentage_complete', 'last_accessed']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ReviewSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'student', 'course', 'rating', 'comment', 
            'instructor_reply', 'replied_at', 'created_at'
        ]
        read_only_fields = ['id', 'student', 'course', 'replied_at', 'created_at']

class WishlistSerializer(serializers.ModelSerializer):
    course_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'student', 'course', 'added_at', 'course_details']
        read_only_fields = ['id', 'student', 'added_at']

    def get_course_details(self, obj):
        # Return lightweight course info for the wishlist page
        request = self.context.get('request')
        serializer = CourseSerializer(obj.course, context={'request': request})
        return serializer.data

class InstructorSerializer(UserSerializer):
    instructor_rating = serializers.SerializerMethodField()
    student_count = serializers.IntegerField(source='courses__enrollments__count', read_only=True)  # Assuming you have enrollments related name
    premium_courses_count = serializers.SerializerMethodField()

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ['fullname', 'profile_picture', "student_count", "instructor_rating", "premium_courses_count"]

    def get_instructor_rating(self, obj):
        # Calculate the average rating across all courses taught by this instructor
        courses = obj.courses.all()  # Assuming 'courses' is the related name for Course's instructor FK
        if courses.exists():
            average = courses.aggregate(Avg('reviews__rating'))['reviews__rating__avg'] or 0
            return round(average, 2)
        return None
    
    def get_premium_courses_count(self, obj):
        # Count how many courses taught by this instructor are premium (price > 0)
        return obj.courses.filter(price__gt=0).count()

class ResourceSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = ['id', 'title', 'url', 'size']

    def get_title(self, obj):
        if obj.url:
            return obj.url.name.split('/')[-1]
        return "Untitled Resource"

    def get_size(self, obj):
        if obj.url:
            try:
                size_bytes = obj.url.size
                if size_bytes < 1024:
                    return f"{size_bytes}B"
                elif size_bytes < 1024 * 1024:
                    return f"{size_bytes / 1024:.1f}KB"
                else:
                    return f"{size_bytes / (1024 * 1024):.1f}MB"
            except (ValueError, FileNotFoundError):
                return "0B"
        return "0B"


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'student', 'lesson', 'content', 'created_at']
        read_only_fields = ['id', 'student', 'created_at']

class QuizOptionSerializer(serializers.ModelSerializer):
    # Mapping snake_case from Django to camelCase for TypeScript
    isCorrect = serializers.BooleanField(source='is_correct')

    class Meta:
        model = QuizOption
        fields = ['id', 'text', 'isCorrect']

class QuizQuestionSerializer(serializers.ModelSerializer):
    options = QuizOptionSerializer(many=True, read_only=True)

    class Meta:
        model = QuizQuestion
        fields = ['id', 'text', 'options']

class LessonSerializer(serializers.ModelSerializer):
    resources = ResourceSerializer(many=True, read_only=True)
    notes = NoteSerializer(many=True, read_only=True)  # Assuming a related name of 'notes' on Lesson model
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'type', 'description', 'isPublished', 
            'isPreview', 'isHidden', 'allow_download', 'order',
            'video_url', 'duration', 'content', 'quiz_time_limit',"resources",
            "notes"
        ]

    def to_representation(self, instance):
        # Start with the standard dictionary of fields
        data = super().to_representation(instance)
        
        # 1. Handle Video Type
        if instance.type == 'video':
            data.pop('content', None)
            data.pop('quiz_time_limit', None)
            
        # 2. Handle Article Type
        elif instance.type == 'article':
            data.pop('video_url', None)
            data.pop('duration', None)
            data.pop('quiz_time_limit', None)
            
        # 3. Handle Quiz Type
        elif instance.type == 'quiz':
            data.pop('video_url', None)
            data.pop('duration', None)
            data.pop('content', None)
            # Nest the questions inside a quizConfig object to match your TS interface
            questions = instance.quiz_questions.all()
            data['quizConfig'] = {
                'timeLimit': instance.quiz_time_limit,
                'questions': QuizQuestionSerializer(questions, many=True).data
            }
            
        return data

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ['id', 'title', 'isOpen', 'lessons']

class CourseSerializer(serializers.ModelSerializer):
    # This nests the modules (and consequently lessons, resources, etc.) inside the course
    modules = ModuleSerializer(many=True, read_only=True)
    
    # Optional: If you want to return the full category object instead of just the ID
    # category = CategorySerializer(read_only=True) 
    students = serializers.IntegerField(source='enrollments.count', read_only=True)  # Assuming you have an enrollments related name
    isEnrolled = serializers.SerializerMethodField()
    reviews = ReviewSerializer(many=True, read_only=True)  # Assuming a related name of 'review' for course reviews
    rating = serializers.SerializerMethodField()
    instructor = InstructorSerializer(read_only=True)  # Assuming you have an instructor field that is a ForeignKey to User

    class Meta:
        model = Course
        fields = [
            'id', 'title',  'slug', 'description', 
            'thumbnail', 'price', 'duration', 'category', 'language', 
            'difficulty', 'status', 'lastUpdated', 'created_at', 'modules',
            "students", "isEnrolled", "reviews", "rating", "instructor"
        ]
        read_only_fields = ["instructor", "students", "isEnrolled", "reviews", "rating",]

    def get_isEnrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.enrollments.filter(student=request.user).exists()
        return False
    
    def get_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews.exists():
            return round(reviews.aggregate(Avg('rating'))['rating__avg'], 2)
        return None

    def create(self, validated_data):
        user = self.context["request"].user
        return Course.objects.create(instructor=user, **validated_data)

class ReOrderRequestSerializer(serializers.Serializer):
    # This matches your TS: lessonIds: string[]
    lessonIds = serializers.ListField(
        child=serializers.UUIDField(),
        allow_empty=False,
        help_text="An ordered list of Lesson UUIDs belonging to the module."
    )

    def validate_lessonIds(self, value):
        """
        Optional: Add custom validation to ensure all IDs are unique 
        in the request to prevent duplicate ordering.
        """
        if len(value) != len(set(value)):
            raise serializers.ValidationError("Duplicate lesson IDs are not allowed.")
        return value

class LessonCompletionSerializer(serializers.Serializer):
    lesson_id = serializers.UUIDField()

    def save(self, **kwargs):
        # Implementation for marking a lesson as completed would go here
        # You would typically access the current user and course from the context
        user = self.context['request'].user
        course_id = self.context['course_id']
        module_id = self.context.get('module_id')  # Optional, if you want to validate the lesson belongs to a specific module
        lesson_id = self.validated_data['lesson_id']

        # Here you would add logic to mark the lesson as completed for the user
        # This might involve creating/updating a Progress model instance, etc.
        try:
            progress = Progress.objects.get(enrollment__user=user, enrollment__course_id=course_id)
            lesson = Lesson.objects.get(id=lesson_id, module=module_id, module__course_id=course_id)  # Validate lesson belongs to the course (and optionally module)
            progress.completed_lessons.add(lesson)
        except Progress.DoesNotExist:
            raise serializers.ValidationError("Progress record not found for this user and course.")
        except Lesson.DoesNotExist:
            raise serializers.ValidationError("Lesson not found in this course.")
        except Exception as e:
            raise serializers.ValidationError(str(e))

        
        return {
            "message": f"Lesson {lesson_id} marked as completed for user {user.username} in course {course_id}."
        }

class EnrollmentSerializer(serializers.ModelSerializer):
    course_details = CourseSerializer(source='course', read_only=True)
    progress = ProgressSerializer(read_only=True)
    
    class Meta:
        model = Enrollment
        fields = [
            'id', 'course', 'course_details', 'progress', 'enrolled_at', 
            'device_type', 'traffic_source', 'country_code'
        ]
        read_only_fields = [
            'id', 'progress', 'enrolled_at', 'device_type', 
            'traffic_source', 'country_code'
        ]
        # 'course' remains writeable (FK) for creation

class CertificateSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.title', read_only=True)
    instructor_name = serializers.CharField(source='course.instructor.fullname', read_only=True)
    student_name = serializers.CharField(source='student.fullname', read_only=True)
    
    class Meta:
        model = Certificate
        fields = ['id', 'certificate_id', 'course', 'course_name', 'instructor_name', 'student_name', 'issued_at']
    
