from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Avg, Count, Case, When, IntegerField, F
from django.utils import timezone
from datetime import timedelta
from drf_spectacular.utils import extend_schema, OpenApiResponse
from courses.models import Course, Enrollment, Review, Module, Lesson, Progress

class CMSDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Instructor Workspace Dashboard Data",
        description="Returns aggregated metrics, course deployments, and student activity for the authenticated instructor.",
        responses={
            200: OpenApiResponse(
                description="Dashboard data retrieved successfully.",
                examples=[{
                    "quickStats": [
                        {"label": "Revenue (Today)", "value": "$1,240", "icon": "DollarSign", "color": "text-success bg-success/10"},
                    ],
                    "myCourses": [
                        {"id": "course-slug", "title": "Course Title", "status": "Published", "progress": 85, "students": 120, "revenue": "$1.2k"}
                    ],
                    "activityFeed": [
                        {"id": "enr-1", "user": "Student Name", "action": "enrolled in", "target": "Course Title", "time": "2m ago"}
                    ],
                    "instructorName": "Peace"
                }]
            ),
            403: OpenApiResponse(description="Only instructors can access this dashboard.")
        },
        tags=["Instructor Dashboard"]
    )
    def get(self, request):
        instructor = request.user
        
        # Ensure user is an instructor
        if instructor.role != 'instructor':
            return Response({"error": "Only instructors can access the CMS dashboard."}, status=403)

        # 1. Quick Stats
        today = timezone.now().date()
        
        # Revenue Today
        revenue_today = Enrollment.objects.filter(
            course__instructor=instructor,
            enrolled_at__date=today
        ).aggregate(total=Sum('course__price'))['total'] or 0

        # New Students Today
        new_students_today = Enrollment.objects.filter(
            course__instructor=instructor,
            enrolled_at__date=today
        ).count()

        # Avg. Engagement
        enrollments = Enrollment.objects.filter(course__instructor=instructor)
        avg_engagement = 0
        if enrollments.exists():
            total_progress = 0
            for enrollment in enrollments:
                try:
                    total_progress += enrollment.progress.percentage_complete
                except:
                    pass
            avg_engagement = total_progress / enrollments.count()

        quick_stats = [
            {"label": "Revenue (Today)", "value": f"${revenue_today:,.0f}", "icon": "DollarSign", "color": "text-success bg-success/10"},
            {"label": "New Students", "value": f"+{new_students_today}", "icon": "Users", "color": "text-primary bg-primary/10"},
            {"label": "Avg. Engagement", "value": f"{avg_engagement:.0f}%", "icon": "Zap", "color": "text-warning bg-warning/10"},
        ]

        # 2. My Courses (Deployments)
        courses = Course.objects.filter(instructor=instructor).prefetch_related('enrollments', 'modules__lessons')
        my_courses = []
        for course in courses:
            student_count = course.enrollments.count()
            course_revenue = student_count * course.price
            
            course_enrollments = course.enrollments.all()
            course_completion_rate = 0
            if course_enrollments.exists():
                total_cp_rate = 0
                for enr in course_enrollments:
                    try:
                        total_cp_rate += enr.progress.percentage_complete
                    except:
                        pass
                course_completion_rate = total_cp_rate / course_enrollments.count()

            my_courses.append({
                "id": course.slug if course.slug else f"ID-{course.id}",
                "title": course.title,
                "status": course.status,
                "progress": round(course_completion_rate),
                "students": student_count,
                "revenue": f"${course_revenue:,.1f}k" if course_revenue >= 1000 else f"${course_revenue:,.2f}"
            })

        # 3. Activity Feed
        recent_enrollments = Enrollment.objects.filter(course__instructor=instructor).order_by('-enrolled_at')[:5]
        recent_reviews = Review.objects.filter(course__instructor=instructor).order_by('-created_at')[:5]
        
        feed = []
        for enr in recent_enrollments:
            feed.append({
                "id": f"enr-{enr.id}",
                "user": enr.student.fullname,
                "action": "enrolled in",
                "target": enr.course.title,
                "time": self.format_time_ago(enr.enrolled_at)
            })
        
        for rev in recent_reviews:
            feed.append({
                "id": f"rev-{rev.id}",
                "user": rev.student.fullname,
                "action": f"left a {rev.rating}-star review on",
                "target": rev.course.title,
                "time": self.format_time_ago(rev.created_at)
            })
        
        feed = sorted(feed, key=lambda x: x['id'], reverse=True)[:5]

        return Response({
            "quickStats": quick_stats,
            "myCourses": my_courses,
            "activityFeed": feed,
            "instructorName": instructor.first_name
        })


class CourseAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Individual Course Analytics Data",
        description="Returns detailed performance metrics for a specific course including revenue, student progress, and ratings.",
        responses={200: OpenApiResponse(description="Course analytics data retrieved successfully.")},
        tags=["Instructor Dashboard"]
    )
    def get(self, request, slug):
        instructor = request.user
        
        # Ensure user is an instructor
        if instructor.role != 'instructor':
            return Response({"error": "Only instructors can access course analytics."}, status=403)

        try:
            course = Course.objects.get(slug=slug, instructor=instructor)
        except Course.DoesNotExist:
            return Response({"error": "Course not found or you don't have permission to view it."}, status=404)

        # 1. Stat Cards
        enrollments = Enrollment.objects.filter(course=course)
        student_count = enrollments.count()
        revenue = student_count * course.price
        
        rating_avg = Review.objects.filter(course=course).aggregate(avg=Avg('rating'))['avg'] or 0
        
        completion_rate = 0
        if enrollments.exists():
            total_progress = 0
            for enr in enrollments:
                try:
                    total_progress += enr.progress.percentage_complete
                except:
                    pass
            completion_rate = total_progress / enrollments.count()

        stats = {
            "revenue": f"${revenue:,.0f}",
            "students": f"{student_count}",
            "rating": f"{rating_avg:.1f}",
            "completion": f"{completion_rate:.0f}%"
        }

        # 2. Revenue Chart (Simple last 6 months)
        revenue_data = []
        now = timezone.now()
        for i in range(5, -1, -1):
            month_date = now - timedelta(days=i*30)
            month_name = month_date.strftime("%b")
            month_enrollments = enrollments.filter(enrolled_at__year=month_date.year, enrolled_at__month=month_date.month).count()
            revenue_data.append({
                "name": month_name,
                "revenue": float(month_enrollments * course.price)
            })

        # 3. Student Progress Distribution (Buckets)
        progress_distribution = [
            {"name": "0-20%", "value": 0, "color": "#f87171"},
            {"name": "21-40%", "value": 0, "color": "#fb923c"},
            {"name": "41-60%", "value": 0, "color": "#fbbf24"},
            {"name": "61-80%", "value": 0, "color": "#818cf8"},
            {"name": "81-100%", "value": 0, "color": "#34d399"},
        ]
        
        for enr in enrollments:
            try:
                p = enr.progress.percentage_complete
                if p <= 20: progress_distribution[0]["value"] += 1
                elif p <= 40: progress_distribution[1]["value"] += 1
                elif p <= 60: progress_distribution[2]["value"] += 1
                elif p <= 80: progress_distribution[3]["value"] += 1
                else: progress_distribution[4]["value"] += 1
            except:
                progress_distribution[0]["value"] += 1

        # 4. Rating Analysis
        rating_dist = Review.objects.filter(course=course).values('rating').annotate(count=Count('rating')).order_by('-rating')
        rating_analysis = []
        for i in range(5, 0, -1):
            count = next((r['count'] for r in rating_dist if r['rating'] == i), 0)
            percentage = (count / student_count * 100) if student_count > 0 else 0
            rating_analysis.append({
                "stars": i,
                "count": count,
                "percentage": round(percentage)
            })

        # 5. Retention / Funnel Data
        modules = course.modules.all().prefetch_related('lessons')
        funnel_data = [{"stage": "Started", "students": student_count, "percent": 100}]
        
        dropout_rates = []
        
        for i, module in enumerate(modules):
            module_lessons = module.lessons.all()
            if not module_lessons.exists():
                continue
            
            completed_count = Progress.objects.filter(
                enrollment__course=course,
                completed_lessons__in=module_lessons
            ).distinct().count()
            
            percentage = round((completed_count / student_count * 100)) if student_count > 0 else 0
            
            funnel_data.append({
                "stage": f"Mod {i+1}",
                "students": completed_count,
                "percent": percentage
            })
            
            dropout_rates.append({
                "id": i+1,
                "name": f"Module {i+1}: {module.title}",
                "views": completed_count + (student_count - completed_count) // 2,
                "completed": completed_count,
                "dropout": 100 - percentage
            })

        return Response({
            "courseTitle": course.title,
            "stats": stats,
            "revenueChart": revenue_data,
            "progressDistribution": progress_distribution,
            "ratingAnalysis": rating_analysis,
            "funnelData": funnel_data,
            "dropoutRates": dropout_rates[:5]
        })

    def format_time_ago(self, dt):
        now = timezone.now()
        diff = now - dt
        if diff.days > 0:
            return f"{diff.days}d ago"
        hours = diff.seconds // 3600
        if hours > 0:
            return f"{hours}h ago"
        minutes = (diff.seconds % 3600) // 60
        return f"{minutes}m ago"
