from rest_framework import serializers
from django.db.models import Sum, Avg, Count
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema_field, extend_schema_serializer, OpenApiExample
from drf_spectacular.types import OpenApiTypes

from payments.models import Payment
from courses.models import Course, Enrollment
from payments.models import Payment
from courses.models import Course, Enrollment, Review, Category
from .utils import format_time_ago 
from .models import AdminSetting
from user.models import Notification

User = get_user_model()

@extend_schema_serializer(
    examples = [
         OpenApiExample(
            'AdminDashboardExample',
            summary='Admin dashboard data structure',
            description='Example response for the admin dashboard endpoint, including KPIs, pending approvals, activity feed, and revenue chart data.',
            value={
                "kpi_stats": [
                    {"title": "Active Students", "value": "1,234", "trend": 5.2, "description": "vs. last month"},
                    {"title": "Total Revenue", "value": "$12,345.67", "trend": -3.1, "description": "Current billing cycle"},
                    {"title": "Course Completions", "value": "567", "trend": 0, "description": "All time"},
                    {"title": "Pending Approvals", "value": "3", "trend": 0, "description": "Items in queue"},
                ],
                "pending_approvals": [
                    {"id": "course-uuid-1", "title": "Intro to Python", "instructor": "Alice Smith", "category": "Programming", "submittedAt": "2d ago", "price": 49.99, "thumbnail": "https://example.com/thumb1.jpg"},
                    {"id": "course-uuid-2", "title": "Data Science 101", "instructor": "Bob Johnson", "category": "Data Science", "submittedAt": "5h ago", "price": 79.99, "thumbnail": None},
                ],
                "activity_feed": [
                    {"id": "enr-123", "user": "Charlie Brown", "action": "enrolled in", "target": "Intro to Python", "time": "3h ago", "type": "enrollment"},
                    {"id": "pay-456", "user": "Dana White", "action": "completed payment", "target": "$49.99", "time": "1d ago", "type": "payment"},
                ],
                "revenue_chart": [
                    {"name": "Jan", "revenue": 5000.00},
                    {"name": "Feb", "revenue": 7000.00},
                    {"name": "Mar", "revenue": 6500.00},
                    {"name": "Apr", "revenue": 8000.00},
                    {"name": "May", "revenue": 7500.00},
                    {"name": "Jun", "revenue": 9000.00},
                ],
            },
            # request_only=True, # signal that example only applies to requests
            response_only=True, # signal that example only applies to responses
        ),
    ]
)
class AdminDashboardSerializer(serializers.Serializer):
    kpi_stats = serializers.SerializerMethodField(method_name="get_kpi_stats")
    pending_approvals = serializers.SerializerMethodField()
    activity_feed = serializers.SerializerMethodField()
    revenue_chart = serializers.SerializerMethodField()

    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_kpi_stats(self, obj):
        now = timezone.now()
        one_month_ago = now - relativedelta(months=1)

        # Student Stats
        total_students = User.objects.filter(role='student', is_active=True).count()
        prev_students = User.objects.filter(role='student', is_active=True, date_joined__lt=one_month_ago).count()
        student_trend = round(((total_students - prev_students) / prev_students * 100), 1) if prev_students else 0.0

        # Revenue Stats
        total_revenue = Payment.objects.filter(status='success').aggregate(t=Sum('amount'))['t'] or 0
        prev_revenue = Payment.objects.filter(
            status='success', created_at__lt=one_month_ago
        ).aggregate(t=Sum('amount'))['t'] or 0
        revenue_trend = round(((float(total_revenue) - float(prev_revenue)) / float(prev_revenue) * 100), 1) if prev_revenue else 0.0

        course_completions = Enrollment.objects.filter(progress__completed_lessons__isnull=False).distinct().count()
        pending_count = Course.objects.filter(status='PendingApproval').count()

        return [
            {"title": "Active Students", "value": f"{total_students:,}", "trend": student_trend, "description": "vs. last month"},
            {"title": "Total Revenue", "value": f"${float(total_revenue):,.2f}", "trend": revenue_trend, "description": "Current billing cycle"},
            {"title": "Course Completions", "value": f"{course_completions:,}", "trend": 0, "description": "All time"},
            {"title": "Pending Approvals", "value": str(pending_count), "trend": 0, "description": "Items in queue"},
        ]

    def get_pending_approvals(self, obj):
        courses = Course.objects.filter(status='PendingApproval').select_related('instructor', 'category').order_by('-created_at')[:5]
        return [{
            "id": str(c.id),
            "title": c.title,
            "instructor": c.instructor.fullname,
            "category": c.category.name if c.category else "Uncategorized",
            "submittedAt": format_time_ago(c.created_at),
            "price": float(c.price),
            "thumbnail": c.thumbnail.url if c.thumbnail else None,
        } for c in courses]

    def get_activity_feed(self, obj):
        enrollments = Enrollment.objects.select_related('student', 'course').order_by('-enrolled_at')[:6]
        payments = Payment.objects.filter(status='success').order_by('-created_at')[:4]

        feed = []
        for enr in enrollments:
            feed.append({
                "id": f"enr-{enr.id}",
                "user": enr.student.fullname,
                "action": "enrolled in",
                "target": enr.course.title,
                "raw_date": enr.enrolled_at, # Keep for sorting
                "type": "enrollment",
            })
        for pay in payments:
            feed.append({
                "id": f"pay-{pay.id}",
                "user": pay.email,
                "action": "completed payment",
                "target": f"${float(pay.amount):.2f}",
                "raw_date": pay.created_at, # Keep for sorting
                "type": "payment",
            })

        # Sort by actual datetime objects
        feed.sort(key=lambda x: x['raw_date'], reverse=True)
        
        # Format the time and remove the raw_date before returning
        for item in feed:
            item['time'] = format_time_ago(item.pop('raw_date'))
        
        return feed[:8]

    def get_revenue_chart(self, obj):
        now = timezone.now()
        chart = []
        for i in range(5, -1, -1):
            month_date = now - relativedelta(months=i)
            revenue = Payment.objects.filter(
                status='success',
                created_at__year=month_date.year,
                created_at__month=month_date.month,
            ).aggregate(t=Sum('amount'))['t'] or 0
            chart.append({
                "name": month_date.strftime("%b"),
                "revenue": float(revenue),
            })
        return chart
    

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'UserListResponse',
            summary='List of users with admin-specific fields',
            value={
                "id": 1,
                "fullname": "John Doe",
                "email": "john@example.com",
                "is_active": True,
                "date_joined": "Mar 22, 2026",
                "avatar": "https://example.com/media/profiles/john.jpg"
            },
            response_only=True
        ),
        OpenApiExample(
            'UserUpdateRequest',
            summary='Request to update user status or details',
            value={
                "is_active": False
            },
            request_only=True
        )
    ]
)
class UserAdminSerializer(serializers.ModelSerializer):
    # These are explicitly marked as read_only so they never appear in PATCH requirements
    fullname = serializers.CharField(read_only=True)
    date_joined = serializers.DateTimeField(format="%b %d, %Y", read_only=True)
    avatar = serializers.ImageField(source='profile_picture', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'fullname', 'email', 
            # 'role', 
            'is_active', 'date_joined', 'avatar'
        ]
        # Protect fields that should not be changed via the Admin UI
        read_only_fields = ['id', 'email', 'date_joined']

    def validate_is_active(self, value):
        """
        Business Logic: Prevent an admin from accidentally 
        suspending their own account.
        """
        request = self.context.get('request')
        # self.instance is the user being edited
        if request and request.user == self.instance and value is False:
            raise serializers.ValidationError("Security Check: You cannot suspend your own admin account.")
        return value

    def validate_role(self, value):
        if value not in [r[0] for r in User.Roles.choices]:
            raise serializers.ValidationError(f"Invalid role choice: {value}")
        return value
    


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'CourseListResponse',
            summary='Admin course list entry',
            value={
                "id": "uuid-string",
                "title": "Advanced Django Mastery",
                "instructor": "Jane Smith",
                "category": "Development",
                "status": "Published",
                "price": 99.99,
                "students": 150,
                "rating": 4.8,
                "thumbnail": "https://example.com/media/thumbs/django.jpg",
                "created_at": "Mar 15, 2026"
            },
            response_only=True
        )
    ]
)
class CourseAdminSerializer(serializers.ModelSerializer):
    instructor = serializers.CharField(source='instructor.fullname', read_only=True)
    category = serializers.CharField(source='category.name', default="Uncategorized", read_only=True)
    students = serializers.IntegerField(source='student_count', read_only=True)
    rating = serializers.FloatField(read_only=True)
    created_at = serializers.DateTimeField(format="%b %d, %Y", read_only=True)
    thumbnail = serializers.ImageField(read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'instructor', 'category', 
            'status', 'price', 'students', 'rating', 
            'thumbnail', 'created_at'
        ]

class CourseDeleteSerializer(serializers.Serializer):
    course_id = serializers.UUIDField(help_text="The ID of the course to permanently delete.")


# ---------------------------------------------------------
# Pending Courses
# ---------------------------------------------------------

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'PendingCourseResponse',
            summary='Details of a course awaiting approval',
            value={
                "id": "uuid-string",
                "title": "Unpublished Masterclass",
                "instructor": {
                    "name": "Expert Alex",
                    "avatar": None,
                    "rating": 4.5
                },
                "category": "Education",
                "price": 50.0,
                "submittedAt": "2 days ago",
                "thumbnail": None,
                "description": "Full course content...",
                "modulesCount": 12
            },
            response_only=True
        )
    ]
)
class AdminPendingCourseSerializer(serializers.ModelSerializer):
    instructor = serializers.SerializerMethodField()
    category = serializers.CharField(source='category.name', default='Uncategorized', read_only=True)
    submittedAt = serializers.SerializerMethodField()
    modulesCount = serializers.IntegerField(source='modules_count', read_only=True)
    price = serializers.FloatField()
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'instructor', 'category', 'price', 'submittedAt', 'thumbnail', 'description', 'modulesCount']

    def get_instructor(self, obj):
        avg_rating = Review.objects.filter(course__instructor=obj.instructor).aggregate(avg=Avg('rating'))['avg'] or 0
        return {
            "name": obj.instructor.fullname,
            "avatar": obj.instructor.profile_picture.url if obj.instructor.profile_picture else None,
            "rating": round(avg_rating, 1),
        }

    def get_submittedAt(self, obj):
        return format_time_ago(obj.created_at)

# ---------------------------------------------------------
# Course Actions
# ---------------------------------------------------------
class AdminCourseApproveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = []

    def update(self, instance, validated_data):
        if instance.status != 'PendingApproval':
            raise serializers.ValidationError({"error": f"Course is not pending approval (current status: {instance.status})."})

        instance.status = 'Published'
        instance.rejection_reason = None
        instance.save(update_fields=['status', 'rejection_reason'])

        # Notify instructor
        try:
            Notification.objects.create(
                sender=self.context['request'].user,
                receiver=instance.instructor,
                notification_type='course_update',
                title="Course Approved! 🎉",
                message=f'Your course "{instance.title}" has been approved and is now live.',
                link=f"/courses/{instance.slug}",
            )
        except Exception:
            pass
        return instance

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'RejectCourseRequest',
            summary='Rejection reason for a course submission',
            value={"reason": "The course content is too thin. Please add more depth to module 3."},
            request_only=True
        )
    ]
)
class AdminCourseRejectSerializer(serializers.ModelSerializer):
    reason = serializers.CharField(required=True, allow_blank=False, write_only=True)
    
    class Meta:
        model = Course
        fields = ['reason']
        
    def update(self, instance, validated_data):
        reason = validated_data.get('reason')
        if instance.status != 'PendingApproval':
            raise serializers.ValidationError({"error": f"Course is not pending approval (current status: {instance.status})."})
            
        instance.status = 'Rejected'
        instance.rejection_reason = reason
        instance.save(update_fields=['status', 'rejection_reason'])
        
        # Notify instructor
        try:
            Notification.objects.create(
                sender=self.context['request'].user,
                receiver=instance.instructor,
                notification_type='course_update',
                title="Course Needs Revision",
                message=f'Your course "{instance.title}" was not approved. Reason: {reason}',
                link="/cms",
            )
        except Exception:
            pass
        return instance

# ---------------------------------------------------------
# Moderation Reports
# ---------------------------------------------------------
@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'ModReportResponse',
            summary='Flagged review for moderation',
            value={
                "id": 45,
                "type": "review",
                "content": "This course is terrible and shouldn't exist.",
                "rating": 1,
                "reason": "Harassment or Hate Speech",
                "reporter": "Alice Brown",
                "author": "Negative Ned",
                "authorId": "user-uuid-88",
                "courseTitle": "Intro to Philosophy",
                "courseId": "uuid-philosophy",
                "timestamp": "5 hours ago"
            },
            response_only=True
        )
    ]
)
class AdminReportSerializer(serializers.ModelSerializer):
    type = serializers.CharField(default='review', read_only=True)
    content = serializers.CharField(source='comment', default='', read_only=True)
    reason = serializers.SerializerMethodField()
    reporter = serializers.SerializerMethodField()
    author = serializers.CharField(source='student.fullname', read_only=True)
    authorId = serializers.CharField(source='student.id', read_only=True)
    courseTitle = serializers.CharField(source='course.title', read_only=True)
    courseId = serializers.CharField(source='course.id', read_only=True)
    timestamp = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id', 'type', 'content', 'rating', 'reason', 'reporter',
            'author', 'authorId', 'courseTitle', 'courseId', 'timestamp'
        ]

    def get_reason(self, obj):
        return obj.flag_reason or "Flagged by user"

    def get_reporter(self, obj):
        return obj.flagged_by.fullname if obj.flagged_by else "System"

    def get_timestamp(self, obj):
        return format_time_ago(obj.flagged_at) if obj.flagged_at else format_time_ago(obj.created_at)


class AdminReviewDismissSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = []

    def update(self, instance, validated_data):
        instance.is_flagged = False
        instance.flag_reason = None
        instance.flagged_by = None
        instance.flagged_at = None
        instance.save(update_fields=['is_flagged', 'flag_reason', 'flagged_by', 'flagged_at'])
        return instance

# ---------------------------------------------------------
# Settings Updates
# ---------------------------------------------------------

class AdminSettingResponseSerializer(serializers.ModelSerializer):
    updated_at = serializers.DateTimeField(format="%b %d, %Y %H:%M", read_only=True)
    class Meta:
        model = AdminSetting
        fields = ['key', 'value', 'label', 'updated_at']

class AdminSettingItemSerializer(serializers.Serializer):
    key = serializers.CharField()
    value = serializers.CharField(allow_blank=True, allow_null=True)

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'SettingsPatchRequest',
            summary='Bulk settings update',
            value={
                "settings": [
                    {"key": "maintenance_mode", "value": "true"},
                    {"key": "site_name", "value": "EduNexus Pro"}
                ]
            },
            request_only=True
        )
    ]
)
class AdminSettingsPatchSerializer(serializers.Serializer):
    settings = AdminSettingItemSerializer(many=True)

    def create(self, validated_data):
        settings_data = validated_data.get('settings', [])
        updated = []
        errors = []
        for item in settings_data:
            key = item.get('key')
            value = item.get('value')
            setting, _ = AdminSetting.objects.get_or_create(key=key)
            if key == 'maintenance_mode':
                if str(value).lower() not in ['true', 'false']:
                    errors.append(f"Invalid value for {key}: must be 'true' or 'false'")
                    continue
            setting.value = str(value) if value is not None else ''
            setting.save()
            updated.append(key)
        return {"updated": updated, "errors": errors}

# ---------------------------------------------------------
# Finance Serializers
# ---------------------------------------------------------

class AdminFinanceStatsSerializer(serializers.Serializer):
    totalRevenue = serializers.FloatField()
    totalRevenueFormatted = serializers.CharField()
    thisMonth = serializers.FloatField()
    thisMonthFormatted = serializers.CharField()
    revenueTrend = serializers.FloatField()
    totalTransactions = serializers.IntegerField()
    platformFee = serializers.FloatField()

class AdminFinanceChartSerializer(serializers.Serializer):
    name = serializers.CharField()
    revenue = serializers.FloatField()
    payout = serializers.FloatField()

class AdminFinanceTransactionSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    reference = serializers.CharField()
    email = serializers.EmailField()
    userName = serializers.CharField()
    amount = serializers.FloatField()
    status = serializers.CharField()
    date = serializers.CharField()

class AdminFinancePayoutSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField()
    email = serializers.EmailField()
    students = serializers.IntegerField()
    grossRevenue = serializers.FloatField()
    platformCut = serializers.FloatField()
    payoutDue = serializers.FloatField()
    status = serializers.CharField()

class AdminFinanceSerializer(serializers.Serializer):
    stats = AdminFinanceStatsSerializer()
    revenueChart = AdminFinanceChartSerializer(many=True)
    transactions = serializers.DictField() # Use DictField for the paginated structure or define another serializer
    payouts = AdminFinancePayoutSerializer(many=True)

# ---------------------------------------------------------
# Analytics Serializers
# ---------------------------------------------------------

class AdminAnalyticsKPISerializer(serializers.Serializer):
    totalUsers = serializers.IntegerField()
    totalStudents = serializers.IntegerField()
    totalInstructors = serializers.IntegerField()
    totalPublishedCourses = serializers.IntegerField()
    totalEnrollments = serializers.IntegerField()
    totalRevenue = serializers.FloatField()
    avgPlatformRating = serializers.FloatField()

class AdminAnalyticsGrowthSerializer(serializers.Serializer):
    name = serializers.CharField()
    students = serializers.IntegerField()
    instructors = serializers.IntegerField()

class AdminAnalyticsEngagementSerializer(serializers.Serializer):
    name = serializers.CharField()
    enrollments = serializers.IntegerField()

class AdminAnalyticsTopCourseSerializer(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()
    instructor = serializers.CharField()
    students = serializers.IntegerField()
    revenue = serializers.FloatField()
    revenueFormatted = serializers.CharField()
    rating = serializers.FloatField()
    category = serializers.CharField()

class AdminAnalyticsCategorySerializer(serializers.Serializer):
    name = serializers.CharField()
    courses = serializers.IntegerField()

class AdminAnalyticsGeoSerializer(serializers.Serializer):
    name = serializers.CharField()
    percent = serializers.IntegerField()

class AdminAnalyticsDeviceSerializer(serializers.Serializer):
    name = serializers.CharField()
    value = serializers.IntegerField()

class AdminAnalyticsTrafficSerializer(serializers.Serializer):
    label = serializers.CharField()
    percent = serializers.IntegerField()

class AdminAnalyticsSerializer(serializers.Serializer):
    kpis = AdminAnalyticsKPISerializer()
    userGrowth = AdminAnalyticsGrowthSerializer(many=True)
    engagementChart = AdminAnalyticsEngagementSerializer(many=True)
    topCourses = AdminAnalyticsTopCourseSerializer(many=True)
    categoryDistribution = AdminAnalyticsCategorySerializer(many=True)
    geographicDistribution = AdminAnalyticsGeoSerializer(many=True)
    deviceStats = AdminAnalyticsDeviceSerializer(many=True)
    trafficSources = AdminAnalyticsTrafficSerializer(many=True)

