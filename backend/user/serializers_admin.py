from rest_framework import serializers
from django.db.models import Sum, Avg, Count
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema_field, extend_schema_serializer, OpenApiExample
from drf_spectacular.types import OpenApiTypes

from payments.models import Payment
from courses.models import Course, Enrollment
from .utils import format_time_ago 

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