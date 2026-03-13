from django.contrib import admin
from .models import (
    Category, Course, Module, Lesson, Resource, 
    QuizQuestion, QuizOption, Enrollment, Progress, 
    Review, Wishlist, Note, CertificateConfig, Certificate
)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'price', 'status', 'created_at')
    list_filter = ('status', 'difficulty', 'category', 'instructor')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}

class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'isOpen')
    list_filter = ('course',)
    inlines = [LessonInline]

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'type', 'order', 'isPublished')
    list_filter = ('type', 'isPublished', 'module__course')
    search_fields = ('title', 'description')

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'enrolled_at')
    list_filter = ('course', 'enrolled_at')

@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ('enrollment', 'last_accessed')

@admin.register(CertificateConfig)
class CertificateConfigAdmin(admin.ModelAdmin):
    list_display = ('course', 'signatory_name', 'signatory_title')

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('certificate_id', 'student', 'course', 'issued_at')
    readonly_fields = ('certificate_id', 'issued_at')
    search_fields = ('certificate_id', 'student__email', 'course__title')

admin.site.register(Resource)
admin.site.register(QuizQuestion)
admin.site.register(QuizOption)
admin.site.register(Review)
admin.site.register(Wishlist)
admin.site.register(Note)
