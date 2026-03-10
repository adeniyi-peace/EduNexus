from rest_framework import serializers
from django.db.models import Avg
from authentication.serializers import UserSerializer
from .models import Category, Course, Module, Lesson, Resource, QuizQuestion, QuizOption, Review, Wishlist

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ReviewSerializer(serializers.ModelSerializer):
        user = serializers.CharField(source='user.fullname', read_only=True)  # Assuming you have a fullname property on your User model

        class Meta:
            model = Review
            fields = ['id', 'user', 'course', 'rating', 'comment', 'created_at']
            read_only_fields = ['id', 'user', 'course', 'created_at']

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
        fields = UserSerializer.Meta.fields + ['fullname', 'profile_picture']

    def get_instructor_rating(self, obj):
        # Calculate the average rating across all courses taught by this instructor
        courses = obj.courses.all()  # Assuming 'courses' is the related name for Course's instructor FK
        if courses.exists():
            return round(courses.aggregate(Avg('reviews__rating'))['reviews__rating__avg'], 2)
        return None
    
    def get_premium_courses_count(self, obj):
        # Count how many courses taught by this instructor are premium (price > 0)
        return obj.courses.filter(price__gt=0).count()

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'title', 'url', 'size']

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
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'type', 'description', 'isPublished', 
            'isPreview', 'isHidden', 'allow_download', 'order',
            'video_url', 'duration', 'content', 'quiz_time_limit',"resources"
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
    instructor = serializers.UserSerializer(read_only=True)  # Assuming you have an instructor field that is a ForeignKey to User

    class Meta:
        model = Course
        fields = [
            'id', 'title',  'slug', 'description', 
            'thumbnail', 'price', 'duration', 'category', 'language', 
            'difficulty', 'status', 'lastUpdated', 'created_at', 'modules',
            "students", "isEnrolled", "reviews"
        ]

    def get_isEnrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.enrollments.filter(user=request.user).exists()
        return False
    
    def get_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews.exists():
            return round(reviews.aggregate(Avg('rating'))['rating__avg'], 2)
        return None

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
    