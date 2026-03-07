from rest_framework import serializers
from .models import Category, Course, Module, Lesson, Resource, QuizQuestion, QuizOption

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

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

    class Meta:
        model = Course
        fields = [
            'id', 'title',  'slug', 'description', 
            'thumbnail', 'price', 'duration', 'category', 'language', 
            'difficulty', 'status', 'lastUpdated', 'created_at', 'modules'
        ]

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