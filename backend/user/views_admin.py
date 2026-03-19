from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Avg, Count, Q
from django.utils import timezone
from datetime import timedelta
from dateutil.relativedelta import relativedelta
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from django.contrib.auth import get_user_model

from courses.models import Course, Enrollment, Review, Category
from payments.models import Payment
from .models import AdminSetting
from .utils import format_time_ago, StandardPagination, _paginate
from .permissions import IsAdmin
from .serializers_admin import AdminDashboardSerializer, UserAdminSerializer, CourseAdminSerializer, CourseDeleteSerializer

User = get_user_model()


# -------------------------------------------------------------------
# 1. Admin Dashboard  GET /api/admin/dashboard/
# -------------------------------------------------------------------

class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    @extend_schema(
        summary="Admin Dashboard KPI Stats",
        responses={200: AdminDashboardSerializer},
        tags=["Admin"]
    )
    def get(self, request):
        # We pass None because we aren't serializing a specific model instance
        serializer = AdminDashboardSerializer(instance=None)
        return Response(serializer.data)


# -------------------------------------------------------------------
# 2. User Management  GET /api/admin/users/  PATCH /api/admin/users/{id}/
# -------------------------------------------------------------------

class AdminUserListView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    @extend_schema(
        summary="Admin — List All Users (paginated)",
        responses={200: UserAdminSerializer(many=True)},
        tags=["Admin"]
    )
    def get(self, request):
        qs = User.objects.all().order_by('-date_joined')

        # --- Filters ---
        role = request.query_params.get('role')
        is_active = request.query_params.get('is_active')
        search = request.query_params.get('search', '').strip()

        if role and role != 'all':
            qs = qs.filter(role=role)
        if is_active:
            qs = qs.filter(is_active=is_active.lower() == 'true')
        if search:
            qs = qs.filter(
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )

        # Using the serializer inside your pagination helper
        def serialize_user(user):
            return UserAdminSerializer(user).data

        return _paginate(qs, request, serialize_user)


class AdminUserDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]


    @extend_schema(
        summary="Admin — Update User",
        request=UserAdminSerializer, # Swagger now knows exactly what's editable
        responses={200: UserAdminSerializer},
        tags=["Admin"]
    )
    def patch(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        
        # 'partial=True' allows the frontend to only send 'role' or 'is_active'
        # note to self, uncoment role in serializer after migrations to allow role changes from admin dashboard
        serializer = UserAdminSerializer(
            user, 
            data=request.data, 
            partial=True, 
            context={'request': request}
        )
        
        if serializer.is_valid():
            updated_user = serializer.save()
            action = "activated" if updated_user.is_active else "suspended"
            return Response({
                "success": True,
                "message": f"User {updated_user.email} has been {action}.",
                "user": serializer.data
            })
        return Response(serializer.errors, status=400)

# -------------------------------------------------------------------
# 3. Admin Courses  GET /api/admin/courses/
# -------------------------------------------------------------------

class AdminCourseListView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    @extend_schema(
        summary="Admin — List All Courses (paginated)",
        responses={200: CourseAdminSerializer(many=True)},
        tags=["Admin"]
    )
    def get(self, request):
        # Optimization: select_related for 1:1/FK, annotate for counts
        qs = Course.objects.select_related('instructor', 'category').annotate(
            student_count=Count('enrollments')
        ).order_by('-created_at')

        # --- Filters ---
        status = request.query_params.get('status')
        category = request.query_params.get('category')
        search = request.query_params.get('search', '').strip()

        if status and status != 'all':
            qs = qs.filter(status=status)
        if category and category != 'all':
            qs = qs.filter(category__slug=category)
        if search:
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(instructor__first_name__icontains=search) |
                Q(instructor__last_name__icontains=search)
            )

        def serialize_course(course):
            return CourseAdminSerializer(course).data

        return _paginate(qs, request, serialize_course)

    @extend_schema(
        summary="Admin — Hard-delete a course",
        request=CourseDeleteSerializer,
        responses={
            200: OpenApiResponse(
                description="Course deleted successfully",
                response=OpenApiTypes.OBJECT, # Forces the JSON response to show
                examples=[
                    OpenApiExample(
                        'Success Response',
                        value={"success": True, "message": "Course permanently deleted"}
                    )
                ]
            )
        },
        tags=["Admin"]
    )
    def delete(self, request):
        serializer = CourseDeleteSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
            
        course_id = serializer.validated_data['course_id']
        try:
            course = Course.objects.get(id=course_id)
            title = course.title
            course.delete()
            return Response({"success": True, "message": f"Course '{title}' permanently deleted."})
        except Course.DoesNotExist:
            return Response({"error": "Course not found."}, status=404)

# -------------------------------------------------------------------
# 4. Course Approval  GET /api/admin/courses/pending/
#                     POST /api/admin/courses/{id}/approve/
#                     POST /api/admin/courses/{id}/reject/
# -------------------------------------------------------------------

class AdminPendingCoursesView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    @extend_schema(
        summary="Admin — List Pending Approval Courses",
        description="Returns all courses with status=PendingApproval. Admin only.",
        tags=["Admin"]
    )
    def get(self, request):
        qs = Course.objects.filter(status='PendingApproval').select_related(
            'instructor', 'category'
        ).prefetch_related('modules').annotate(
            modules_count=Count('modules', distinct=True)
        ).order_by('-created_at')

        def serialize(c):
            avg_rating = Review.objects.filter(
                course__instructor=c.instructor
            ).aggregate(avg=Avg('rating'))['avg'] or 0
            return {
                "id": str(c.id),
                "title": c.title,
                "instructor": {
                    "name": c.instructor.fullname,
                    "avatar": c.instructor.profile_picture.url if c.instructor.profile_picture else None,
                    "rating": round(avg_rating, 1),
                },
                "category": c.category.name if c.category else "Uncategorized",
                "price": float(c.price),
                "submittedAt": format_time_ago(c.created_at),
                "thumbnail": c.thumbnail.url if c.thumbnail else None,
                "description": c.description,
                "modulesCount": c.modules_count,
            }

        return _paginate(qs, request, serialize)


class AdminApproveCourseView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    @extend_schema(
        summary="Admin — Approve a Course",
        description="Sets course status to Published and notifies the instructor. Admin only.",
        tags=["Admin"]
    )
    def post(self, request, course_id):
        try:
            course = Course.objects.select_related('instructor').get(id=course_id)
        except Course.DoesNotExist:
            return Response({"error": "Course not found."}, status=404)

        if course.status != 'PendingApproval':
            return Response({"error": f"Course is not pending approval (current status: {course.status})."}, status=400)

        course.status = 'Published'
        course.rejection_reason = None
        course.save(update_fields=['status', 'rejection_reason'])

        # Ripple: Create notification for instructor
        try:
            from django.contrib.contenttypes.models import ContentType
            from user.models import Notification
            ContentType.objects.get_for_model(Course)
            Notification.objects.create(
                sender=request.user,
                receiver=course.instructor,
                notification_type='course_update',
                title="Course Approved! 🎉",
                message=f'Your course "{course.title}" has been approved and is now live.',
                link=f"/courses/{course.slug}",
            )
        except Exception:
            pass  # Non-fatal

        return Response({
            "success": True,
            "message": f'Course "{course.title}" has been published.',
            "courseId": str(course.id),
            "newStatus": "Published",
        })


class AdminRejectCourseView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    @extend_schema(
        summary="Admin — Reject a Course",
        description="Sets course status to Rejected, stores rejection_reason, notifies instructor. Admin only.",
        tags=["Admin"]
    )
    def post(self, request, course_id):
        try:
            course = Course.objects.select_related('instructor').get(id=course_id)
        except Course.DoesNotExist:
            return Response({"error": "Course not found."}, status=404)

        reason = request.data.get('reason', '').strip()
        if not reason:
            return Response({"error": "A rejection reason is required."}, status=400)

        if course.status != 'PendingApproval':
            return Response({"error": f"Course is not pending approval (current status: {course.status})."}, status=400)

        course.status = 'Rejected'
        course.rejection_reason = reason
        course.save(update_fields=['status', 'rejection_reason'])

        # Ripple: Notify instructor
        try:
            from user.models import Notification
            Notification.objects.create(
                sender=request.user,
                receiver=course.instructor,
                notification_type='course_update',
                title="Course Needs Revision",
                message=f'Your course "{course.title}" was not approved. Reason: {reason}',
                link="/cms",
            )
        except Exception:
            pass

        return Response({
            "success": True,
            "message": f'Course "{course.title}" has been rejected.',
            "courseId": str(course.id),
            "newStatus": "Rejected",
        })


# -------------------------------------------------------------------
# 5. Content Moderation  GET /api/admin/reports/
#                        POST /api/admin/reports/{id}/dismiss/
#                        POST /api/admin/reports/{id}/remove/
# -------------------------------------------------------------------

class AdminReportListView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    @extend_schema(
        summary="Admin — List Flagged Reviews",
        description="Returns all reviews with is_flagged=True for moderation. Admin only.",
        tags=["Admin"]
    )
    def get(self, request):
        qs = Review.objects.filter(is_flagged=True).select_related(
            'student', 'course', 'flagged_by'
        ).order_by('-flagged_at')

        def serialize(r):
            return {
                "id": r.id,
                "type": "review",
                "content": r.comment or "",
                "rating": r.rating,
                "reason": r.flag_reason or "Flagged by user",
                "reporter": r.flagged_by.fullname if r.flagged_by else "System",
                "author": r.student.fullname,
                "authorId": r.student.id,
                "courseTitle": r.course.title,
                "courseId": str(r.course.id),
                "timestamp": format_time_ago(r.flagged_at) if r.flagged_at else format_time_ago(r.created_at),
            }

        # Moderation stats
        total_flagged = qs.count()
        resolved_today = 0  # Would need a resolved log; placeholder

        data = [serialize(r) for r in qs]
        return Response({
            "stats": {
                "totalFlagged": total_flagged,
                "resolvedToday": resolved_today,
                "pendingReview": total_flagged,
            },
            "count": len(data),
            "results": data,
        })


class AdminDismissReportView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    @extend_schema(
        summary="Admin — Dismiss a Flagged Review",
        description="Clears the is_flagged flag; keeps the review content. Admin only.",
        tags=["Admin"]
    )
    def post(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)
        except Review.DoesNotExist:
            return Response({"error": "Review not found."}, status=404)

        review.is_flagged = False
        review.flag_reason = None
        review.flagged_by = None
        review.flagged_at = None
        review.save(update_fields=['is_flagged', 'flag_reason', 'flagged_by', 'flagged_at'])

        return Response({"success": True, "message": "Report dismissed. Review kept."})


class AdminRemoveReviewView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    @extend_schema(
        summary="Admin — Hard-delete a Flagged Review",
        description="Permanently deletes the review from the platform. Admin only.",
        tags=["Admin"]
    )
    def post(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)
        except Review.DoesNotExist:
            return Response({"error": "Review not found."}, status=404)

        review.delete()
        return Response({"success": True, "message": "Review permanently removed."})


# -------------------------------------------------------------------
# 6. Finance  GET /api/admin/finance/
# -------------------------------------------------------------------

class AdminFinanceView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    @extend_schema(
        summary="Admin — Financial Overview",
        description="Returns revenue KPIs, monthly revenue chart, recent transactions, and instructor payout summaries. Admin only.",
        tags=["Admin"]
    )
    def get(self, request):
        now = timezone.now()
        one_month_ago = now - relativedelta(months=1)

        # --- KPIs ---
        all_successful = Payment.objects.filter(status='success')
        total_revenue = all_successful.aggregate(t=Sum('amount'))['t'] or 0
        this_month = all_successful.filter(
            created_at__year=now.year, created_at__month=now.month
        ).aggregate(t=Sum('amount'))['t'] or 0
        last_month = all_successful.filter(
            created_at__year=(now - relativedelta(months=1)).year,
            created_at__month=(now - relativedelta(months=1)).month,
        ).aggregate(t=Sum('amount'))['t'] or 0
        transaction_count = all_successful.count()

        revenue_trend = 0.0
        if last_month:
            revenue_trend = round(((float(this_month) - float(last_month)) / float(last_month)) * 100, 1)

        finance_stats = {
            "totalRevenue": float(total_revenue),
            "totalRevenueFormatted": f"${float(total_revenue):,.2f}",
            "thisMonth": float(this_month),
            "thisMonthFormatted": f"${float(this_month):,.2f}",
            "revenueTrend": revenue_trend,
            "totalTransactions": transaction_count,
            "platformFee": 0.20,  # 20% platform cut assumption
        }

        # --- Revenue Chart (last 6 months) ---
        revenue_chart = []
        for i in range(5, -1, -1):
            m = now - relativedelta(months=i)
            month_revenue = all_successful.filter(
                created_at__year=m.year, created_at__month=m.month
            ).aggregate(t=Sum('amount'))['t'] or 0
            revenue_chart.append({
                "name": m.strftime("%b"),
                "revenue": float(month_revenue),
                "payout": round(float(month_revenue) * 0.80, 2),
            })

        # --- Recent Transactions (paginated) ---
        qs = Payment.objects.select_related('user').order_by('-created_at')
        page_size = int(request.query_params.get('page_size', 10))
        page = int(request.query_params.get('page', 1))
        start = (page - 1) * page_size
        end = start + page_size
        total_txn = qs.count()
        transactions = []
        for pay in qs[start:end]:
            transactions.append({
                "id": pay.id,
                "reference": pay.reference,
                "email": pay.email,
                "userName": pay.user.fullname if pay.user else pay.email,
                "amount": float(pay.amount),
                "status": pay.status,
                "date": pay.created_at.strftime("%b %d, %Y"),
            })

        # --- Instructor Payout Summaries ---
        from django.db.models import Case, When, F, Value, DecimalField
        instructors = User.objects.filter(role='instructor').annotate(
            enrolled_students=Count('courses__enrollments', distinct=True),
            gross_revenue=Sum(
                Case(
                    When(courses__enrollments__isnull=False, then=F('courses__price')),
                    default=Value(0),
                    output_field=DecimalField()
                )
            )
        )[:10]

        payouts = []
        for inst in instructors:
            gross = float(inst.gross_revenue or 0)
            payouts.append({
                "id": inst.id,
                "name": inst.fullname,
                "email": inst.email,
                "students": inst.enrolled_students,
                "grossRevenue": gross,
                "platformCut": round(gross * 0.20, 2),
                "payoutDue": round(gross * 0.80, 2),
                "status": "Pending",
            })

        return Response({
            "stats": finance_stats,
            "revenueChart": revenue_chart,
            "transactions": {
                "count": total_txn,
                "results": transactions,
                "page": page,
                "pageSize": page_size,
            },
            "payouts": payouts,
        })


# -------------------------------------------------------------------
# 7. Analytics  GET /api/admin/analytics/
# -------------------------------------------------------------------

class AdminAnalyticsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    @extend_schema(
        summary="Admin — Platform Analytics",
        description="Returns platform-wide KPIs, growth charts, top courses, and engagement data. Admin only.",
        tags=["Admin"]
    )
    def get(self, request):
        now = timezone.now()

        # --- Top-level KPIs ---
        total_users = User.objects.filter(is_active=True).count()
        total_students = User.objects.filter(role='student', is_active=True).count()
        total_instructors = User.objects.filter(role='instructor', is_active=True).count()
        total_courses = Course.objects.filter(status='Published').count()
        total_enrollments = Enrollment.objects.count()
        total_revenue = Payment.objects.filter(status='success').aggregate(t=Sum('amount'))['t'] or 0
        avg_rating = Review.objects.aggregate(avg=Avg('rating'))['avg'] or 0

        kpis = {
            "totalUsers": total_users,
            "totalStudents": total_students,
            "totalInstructors": total_instructors,
            "totalPublishedCourses": total_courses,
            "totalEnrollments": total_enrollments,
            "totalRevenue": float(total_revenue),
            "avgPlatformRating": round(float(avg_rating), 1),
        }

        # --- User Growth (last 6 months) ---
        user_growth = []
        for i in range(5, -1, -1):
            m = now - relativedelta(months=i)
            new_students = User.objects.filter(
                role='student',
                date_joined__year=m.year if hasattr(m, 'year') else m.year,
                date_joined__month=m.month if hasattr(m, 'month') else m.month,
            ).count()
            new_instructors = User.objects.filter(
                role='instructor',
                date_joined__year=m.year,
                date_joined__month=m.month,
            ).count()
            user_growth.append({
                "name": m.strftime("%b"),
                "students": new_students,
                "instructors": new_instructors,
            })

        # --- Engagement: Daily Active (last 30 days as weekly buckets) ---
        engagement_chart = []
        for i in range(5, -1, -1):
            m = now - relativedelta(months=i)
            month_enrollments = Enrollment.objects.filter(
                enrolled_at__year=m.year,
                enrolled_at__month=m.month,
            ).count()
            engagement_chart.append({
                "name": m.strftime("%b"),
                "enrollments": month_enrollments,
            })

        # --- Top 10 Courses by Students ---
        top_courses = Course.objects.filter(status='Published').annotate(
            student_count=Count('enrollments', distinct=True),
            avg_rating=Avg('reviews__rating'),
        ).order_by('-student_count')[:10]

        top_courses_data = []
        for c in top_courses:
            revenue = float(c.price) * c.student_count
            top_courses_data.append({
                "id": str(c.id),
                "title": c.title,
                "instructor": c.instructor.fullname,
                "students": c.student_count,
                "revenue": revenue,
                "revenueFormatted": f"${revenue:,.0f}",
                "rating": round(c.avg_rating, 1) if c.avg_rating else 0,
                "category": c.category.name if c.category else "Uncategorized",
            })

        # --- Category Distribution ---
        categories = Category.objects.annotate(
            course_count=Count('courses', filter=Q(courses__status='Published'))
        ).order_by('-course_count')[:8]

        category_dist = [
            {"name": cat.name, "courses": cat.course_count}
            for cat in categories
        ]

        return Response({
            "kpis": kpis,
            "userGrowth": user_growth,
            "engagementChart": engagement_chart,
            "topCourses": top_courses_data,
            "categoryDistribution": category_dist,
        })


# -------------------------------------------------------------------
# 8. Settings  GET /api/admin/settings/  PATCH /api/admin/settings/
# -------------------------------------------------------------------

class AdminSettingsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    # Default settings seeded on first fetch
    DEFAULT_SETTINGS = [
        {"key": "site_name", "value": "EduNexus", "label": "Platform Name"},
        {"key": "maintenance_mode", "value": "false", "label": "Maintenance Mode"},
        {"key": "allow_registrations", "value": "true", "label": "Allow New Registrations"},
        {"key": "instructor_payout_rate", "value": "80", "label": "Instructor Payout Rate (%)"},
        {"key": "platform_commission", "value": "20", "label": "Platform Commission (%)"},
        {"key": "support_email", "value": "support@edunexus.com", "label": "Support Email"},
        {"key": "course_approval_required", "value": "true", "label": "Course Approval Required"},
        {"key": "paystack_public_key", "value": "", "label": "Paystack Public Key"},
    ]

    @extend_schema(
        summary="Admin — Get Platform Settings",
        description="Returns all AdminSetting key-value pairs. Seeds defaults on first call. Admin only.",
        tags=["Admin"]
    )
    def get(self, request):
        # Seed defaults if settings don't exist yet
        from django.db import transaction
        with transaction.atomic():
            for default in self.DEFAULT_SETTINGS:
                AdminSetting.objects.get_or_create(
                    key=default['key'],
                    defaults={'value': default['value'], 'label': default['label']}
                )

        settings = AdminSetting.objects.all().order_by('key')
        data = [
            {
                "key": s.key,
                "value": s.value,
                "label": s.label,
                "updated_at": s.updated_at.strftime("%b %d, %Y %H:%M"),
            }
            for s in settings
        ]
        return Response({"settings": data})

    @extend_schema(
        summary="Admin — Update Platform Settings",
        description="PATCH with {settings: [{key, value}, ...]} to bulk-update settings. Admin only.",
        tags=["Admin"]
    )
    def patch(self, request):
        settings_data = request.data.get('settings', [])
        if not settings_data:
            return Response({"error": "No settings provided. Send {settings: [{key, value}, ...]}."}, status=400)

        updated = []
        errors = []
        for item in settings_data:
            key = item.get('key')
            value = item.get('value')
            if not key:
                errors.append("Each setting must have a 'key'.")
                continue
            setting, _ = AdminSetting.objects.get_or_create(key=key)
            if key == 'maintenance_mode':
                if str(value).lower() not in ['true', 'false']:
                    errors.append(f"Invalid value for {key}: must be 'true' or 'false'")
                    continue
            setting.value = str(value) if value is not None else ''
            setting.save()
            updated.append(key)

        return Response({
            "success": True,
            "message": f"Updated {len(updated)} setting(s).",
            "updatedKeys": updated,
            "errors": errors,
        })
