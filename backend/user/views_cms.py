from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Avg, Count, Case, When, IntegerField, F
from django.utils import timezone
from datetime import timedelta
from dateutil.relativedelta import relativedelta
from drf_spectacular.utils import extend_schema, OpenApiResponse
from courses.models import Course, Enrollment, Review, Module, Lesson, Progress
from .serializers import MessageAllSerializer, MessageStudentSerializer
from .utils import format_time_ago

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
                "time": format_time_ago(enr.enrolled_at)
            })
        
        for rev in recent_reviews:
            feed.append({
                "id": f"rev-{rev.id}",
                "user": rev.student.fullname,
                "action": f"left a {rev.rating}-star review on",
                "target": rev.course.title,
                "time": format_time_ago(rev.created_at)
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
    def get(self, request, course_id):
        instructor = request.user
        
        # Ensure user is an instructor
        if instructor.role != 'instructor':
            return Response({"error": "Only instructors can access course analytics."}, status=403)

        try:
            course = Course.objects.get(id=course_id, instructor=instructor)
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
            "id": course.id,
            "slug": course.slug,
            "courseTitle": course.title,
            "stats": stats,
            "revenueChart": revenue_data,
            "progressDistribution": progress_distribution,
            "ratingAnalysis": rating_analysis,
            "funnelData": funnel_data,
            "dropoutRates": dropout_rates[:5]
        })


class CourseStudentsView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="List students enrolled in a specific course",
        description="Returns all students enrolled in the specified course with their progress data. Only accessible by the course instructor.",
        responses={
            200: OpenApiResponse(
                description="Students list retrieved successfully.",
                examples=[{
                    "students": [
                        {
                            "id": "uuid",
                            "name": "Student Name",
                            "email": "student@example.com",
                            "avatar": "url",
                            "joinedDate": "Oct 24",
                            "currentProgress": 75,
                            "status": "Active",
                            "lastActive": "2h ago"
                        }
                    ]
                }]
            ),
            403: OpenApiResponse(description="Only instructors can access this endpoint."),
            404: OpenApiResponse(description="Course not found or you don't have permission.")
        },
        tags=["Instructor Dashboard"]
    )
    def get(self, request, course_id):
        instructor = request.user

        # Ensure user is an instructor
        if instructor.role != 'instructor':
            return Response({"error": "Only instructors can access this endpoint."}, status=403)

        try:
            course = Course.objects.get(id=course_id, instructor=instructor)
        except Course.DoesNotExist:
            return Response({"error": "Course not found or you don't have permission to view it."}, status=404)

        # Get all enrollments for this course with related student data
        # Note: progress is OneToOne on Progress model pointing to Enrollment,
        # so we can't use select_related for it - we'll query separately if needed
        enrollments = Enrollment.objects.filter(course=course).select_related('student')

        students_data = []
        for enrollment in enrollments:
            student = enrollment.student

            # Calculate progress percentage
            progress_percentage = 0
            try:
                progress_percentage = enrollment.progress.percentage_complete
            except:
                pass

            # Determine status based on progress
            if progress_percentage >= 100:
                status = 'Completed'
            elif progress_percentage < 20:
                status = 'At Risk'
            else:
                status = 'Active'

            # Format joined date
            joined_date = enrollment.enrolled_at.strftime("%b %d")

            # Calculate last active (from progress.last_accessed)
            last_active = "Never"
            try:
                if enrollment.progress.last_accessed:
                    last_active = format_time_ago(enrollment.progress.last_accessed)
            except:
                pass

            students_data.append({
                "id": str(student.id),
                "name": student.fullname,
                "email": student.email,
                "avatar": student.profile_picture.url if student.profile_picture else None,
                "joinedDate": joined_date,
                "currentProgress": round(progress_percentage),
                "status": status,
                "lastActive": last_active
            })

        return Response({"students": students_data})


class MessageAllStudentsView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Send message to all students in a course",
        description="Sends a notification/message to all enrolled students in the specified course.",
        request=MessageAllSerializer,
        responses={
            200: OpenApiResponse(description="Messages sent successfully."),
            403: OpenApiResponse(description="Only instructors can access this endpoint."),
            404: OpenApiResponse(description="Course not found."),
            400: OpenApiResponse(description="Invalid data."),
        },
        tags=["Instructor Dashboard"]
    )
    def post(self, request, course_id):
        instructor = request.user

        # Ensure user is an instructor
        if instructor.role != 'instructor':
            return Response({"error": "Only instructors can access this endpoint."}, status=403)

        try:
            course = Course.objects.get(id=course_id, instructor=instructor)
        except Course.DoesNotExist:
            return Response({"error": "Course not found or you don't have permission."}, status=404)

        # Validate and process using serializer
        serializer = MessageAllSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=400)
        
        # Create notifications via serializer
        notifications = serializer.create_notifications(course, instructor)

        return Response({
            "success": True,
            "message": f"Message sent to {len(notifications)} students.",
            "recipients_count": len(notifications)
        })


class MessageStudentView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Send message to an individual student",
        description="Sends a direct notification/message to a specific student.",
        request=MessageStudentSerializer,
        responses={
            200: OpenApiResponse(description="Message sent successfully."),
            403: OpenApiResponse(description="Only instructors can access this endpoint."),
            404: OpenApiResponse(description="Student not found."),
            400: OpenApiResponse(description="Invalid data."),
        },
        tags=["Instructor Dashboard"]
    )
    def post(self, request):
        instructor = request.user

        # Ensure user is an instructor
        if instructor.role != 'instructor':
            return Response({"error": "Only instructors can access this endpoint."}, status=403)

        # Validate and process using serializer
        serializer = MessageStudentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=400)
        
        # Create notification via serializer
        notification = serializer.create_notification(instructor)
        student = serializer.validated_data['student']

        return Response({
            "success": True,
            "message": f"Message sent to {student.fullname}."
        })


class GlobalStudentsView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="List all students across all instructor courses",
        description="Returns all students enrolled in any of the instructor's courses with aggregated data including total spent, enrolled courses count, and course details.",
        responses={
            200: OpenApiResponse(
                description="Students list retrieved successfully.",
                examples=[{
                    "students": [
                        {
                            "id": "uuid",
                            "name": "Student Name",
                            "email": "student@example.com",
                            "avatar": "url",
                            "joinedDate": "Oct 2025",
                            "totalSpent": 179.98,
                            "enrolledCoursesCount": 2,
                            "enrolledCoursesList": [
                                {
                                    "id": "course-uuid",
                                    "title": "Course Title",
                                    "progress": 75,
                                    "lastAccessed": "2h ago"
                                }
                            ]
                        }
                    ]
                }]
            ),
            403: OpenApiResponse(description="Only instructors can access this endpoint.")
        },
        tags=["Instructor Dashboard"]
    )
    def get(self, request):
        instructor = request.user

        # Ensure user is an instructor
        if instructor.role != 'instructor':
            return Response({"error": "Only instructors can access this endpoint."}, status=403)

        # Get all courses by this instructor
        courses = Course.objects.filter(instructor=instructor)
        
        # Get all enrollments for these courses with related student data
        enrollments = Enrollment.objects.filter(course__in=courses).select_related('student', 'course', 'progress')
        
        # Aggregate data by student
        students_data = {}
        
        for enrollment in enrollments:
            student = enrollment.student
            student_id = str(student.id)
            
            if student_id not in students_data:
                # Initialize student data
                students_data[student_id] = {
                    "id": student_id,
                    "name": student.fullname,
                    "email": student.email,
                    "avatar": student.profile_picture.url if student.profile_picture else None,
                    "joinedDate": enrollment.enrolled_at.strftime("%b %Y"),
                    "totalSpent": 0,
                    "enrolledCoursesCount": 0,
                    "enrolledCoursesList": []
                }
            
            # Add course price to total spent
            students_data[student_id]["totalSpent"] += float(enrollment.course.price or 0)
            students_data[student_id]["enrolledCoursesCount"] += 1
            
            # Get progress for this course
            progress_percentage = 0
            try:
                if hasattr(enrollment, 'progress') and enrollment.progress:
                    progress_percentage = round(enrollment.progress.percentage_complete)
            except:
                pass
            
            # Get last accessed time
            last_accessed = "Never"
            try:
                if hasattr(enrollment, 'progress') and enrollment.progress and enrollment.progress.last_accessed:
                    last_accessed = format_time_ago(enrollment.progress.last_accessed)
            except:
                pass
            
            # Add course to enrolled list
            students_data[student_id]["enrolledCoursesList"].append({
                "id": str(enrollment.course.id),
                "title": enrollment.course.title,
                "progress": progress_percentage,
                "lastAccessed": last_accessed
            })
        
        # Convert dict to list
        students_list = list(students_data.values())
        
        return Response({"students": students_list})


class InstructorAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Instructor Overall Analytics",
        description="Returns aggregated analytics data for the instructor dashboard including KPIs, revenue charts, student distribution, rating analysis, and top performing courses.",
        responses={
            200: OpenApiResponse(
                description="Analytics data retrieved successfully.",
                examples=[{
                    "stats": {
                        "totalRevenue": "$24,500",
                        "activeStudents": "1,240",
                        "avgRating": "4.8",
                        "hoursWatched": "854h"
                    },
                    "revenueChart": [{"name": "Jan", "revenue": 4000}],
                    "studentDistribution": [{"name": "0-20%", "value": 10, "color": "#f87171"}],
                    "ratingAnalysis": [{"stars": 5, "count": 120, "percentage": 60}],
                    "quickStats": {
                        "newEnrollments": 48,
                        "certificates": 156,
                        "refundRate": 2.4,
                        "completionRate": 68
                    },
                    "topCourses": [
                        {"id": "course-1", "title": "Course Title", "students": 450, "revenue": "$9,000", "rating": 4.9}
                    ]
                }]
            ),
            403: OpenApiResponse(description="Only instructors can access this endpoint.")
        },
        tags=["Instructor Dashboard"]
    )
    def get(self, request):
        instructor = request.user

        # Ensure user is an instructor
        if instructor.role != 'instructor':
            return Response({"error": "Only instructors can access this endpoint."}, status=403)

        # Get all instructor courses with enrollment counts (fixes N+1)
        courses = Course.objects.filter(instructor=instructor).annotate(
            enrollment_count=Count('enrollments')
        )
        all_enrollments = Enrollment.objects.filter(course__in=courses).select_related('progress')
        
        # Calculate total revenue (using annotated count - fixes N+1)
        total_revenue = sum(course.price * course.enrollment_count for course in courses)
        
        # Active students (unique)
        active_students = all_enrollments.values('student').distinct().count()
        
        # Calculate hours watched
        total_hours = 0
        for enrollment in all_enrollments:
            try:
                if hasattr(enrollment, 'progress') and enrollment.progress:
                    completed_count = enrollment.progress.completed_lessons.count()
                    total_hours += completed_count * 0.5
            except:
                pass
        
        # Average rating across all courses
        reviews = Review.objects.filter(course__in=courses)
        avg_rating = reviews.aggregate(avg=Avg('rating'))['avg'] or 0
        
        # Calculate Trends (compare current month vs previous month)
        now = timezone.now()
        current_month = now.month
        current_year = now.year
        
        # Previous month calculation
        if current_month == 1:
            prev_month = 12
            prev_year = current_year - 1
        else:
            prev_month = current_month - 1
            prev_year = current_year
        
        # Revenue trend
        current_month_revenue = sum(
            enrollment.course.price for enrollment in all_enrollments.filter(
                enrolled_at__year=current_year, enrolled_at__month=current_month
            )
        )
        prev_month_revenue = sum(
            enrollment.course.price for enrollment in all_enrollments.filter(
                enrolled_at__year=prev_year, enrolled_at__month=prev_month
            )
        )
        
        if prev_month_revenue > 0:
            revenue_trend_pct = ((current_month_revenue - prev_month_revenue) / prev_month_revenue) * 100
        else:
            revenue_trend_pct = 100 if current_month_revenue > 0 else 0
        
        # Students trend (new enrollments)
        current_month_students = all_enrollments.filter(
            enrolled_at__year=current_year, enrolled_at__month=current_month
        ).count()
        prev_month_students = all_enrollments.filter(
            enrolled_at__year=prev_year, enrolled_at__month=prev_month
        ).count()
        
        if prev_month_students > 0:
            students_trend_pct = ((current_month_students - prev_month_students) / prev_month_students) * 100
        else:
            students_trend_pct = 100 if current_month_students > 0 else 0
        
        # Rating trend (compare reviews from current vs previous month)
        current_month_reviews = reviews.filter(
            created_at__year=current_year, created_at__month=current_month
        ).aggregate(avg=Avg('rating'))['avg'] or 0
        prev_month_reviews = reviews.filter(
            created_at__year=prev_year, created_at__month=prev_month
        ).aggregate(avg=Avg('rating'))['avg'] or 0
        
        if prev_month_reviews > 0:
            rating_trend_pct = ((current_month_reviews - prev_month_reviews) / prev_month_reviews) * 100
        else:
            rating_trend_pct = 0
        
        # Hours trend (approximate via completed lessons this month vs last)
        # Use enrollment last_accessed as proxy for activity
        current_month_activity = all_enrollments.filter(
            progress__last_accessed__year=current_year,
            progress__last_accessed__month=current_month
        ).count()
        prev_month_activity = all_enrollments.filter(
            progress__last_accessed__year=prev_year,
            progress__last_accessed__month=prev_month
        ).count()
        
        if prev_month_activity > 0:
            hours_trend_pct = ((current_month_activity - prev_month_activity) / prev_month_activity) * 100
        else:
            hours_trend_pct = 0 if current_month_activity == 0 else 100
        
        # Stats object with trends
        def get_trend_direction(value):
            if value > 0.5:
                return "up"
            elif value < -0.5:
                return "down"
            return "neutral"
        
        stats = {
            "totalRevenue": f"${total_revenue:,.0f}",
            "activeStudents": f"{active_students:,}",
            "avgRating": f"{avg_rating:.1f}",
            "hoursWatched": f"{int(total_hours)}h",
            "revenueTrend": f"{revenue_trend_pct:+.1f}%",
            "revenueTrendDirection": get_trend_direction(revenue_trend_pct),
            "studentsTrend": f"{students_trend_pct:+.1f}%",
            "studentsTrendDirection": get_trend_direction(students_trend_pct),
            "ratingTrend": f"{rating_trend_pct:+.1f}%",
            "ratingTrendDirection": get_trend_direction(rating_trend_pct),
            "hoursTrend": f"{hours_trend_pct:+.1f}%",
            "hoursTrendDirection": get_trend_direction(hours_trend_pct),
        }
        
        # Revenue Chart (last 6 months aggregated)
        revenue_chart = []
        now = timezone.now()
        for i in range(5, -1, -1):
            month_date = now - relativedelta(months=i)
            month_name = month_date.strftime("%b")
            month_enrollments = all_enrollments.filter(
                enrolled_at__year=month_date.year,
                enrolled_at__month=month_date.month
            )
            month_revenue = sum(
                enrollment.course.price for enrollment in month_enrollments
            )
            revenue_chart.append({
                "name": month_name,
                "revenue": float(month_revenue)
            })
        
        # Student Progress Distribution
        progress_distribution = [
            {"name": "0-20%", "value": 0, "color": "#f87171"},
            {"name": "21-40%", "value": 0, "color": "#fb923c"},
            {"name": "41-60%", "value": 0, "color": "#fbbf24"},
            {"name": "61-80%", "value": 0, "color": "#818cf8"},
            {"name": "81-100%", "value": 0, "color": "#34d399"},
        ]
        
        for enrollment in all_enrollments:
            try:
                if hasattr(enrollment, 'progress') and enrollment.progress:
                    p = enrollment.progress.percentage_complete
                else:
                    p = 0
            except:
                p = 0
                
            if p <= 20: progress_distribution[0]["value"] += 1
            elif p <= 40: progress_distribution[1]["value"] += 1
            elif p <= 60: progress_distribution[2]["value"] += 1
            elif p <= 80: progress_distribution[3]["value"] += 1
            else: progress_distribution[4]["value"] += 1
        
        # Rating Analysis (aggregate across all courses)
        rating_dist = reviews.values('rating').annotate(count=Count('rating')).order_by('-rating')
        total_reviews = reviews.count()
        rating_analysis = []
        for i in range(5, 0, -1):
            count = next((r['count'] for r in rating_dist if r['rating'] == i), 0)
            percentage = (count / total_reviews * 100) if total_reviews > 0 else 0
            rating_analysis.append({
                "stars": i,
                "count": count,
                "percentage": round(percentage)
            })
        
        # Quick Stats
        # New enrollments this week
        one_week_ago = timezone.now() - timedelta(days=7)
        new_enrollments = all_enrollments.filter(enrolled_at__gte=one_week_ago).count()
        
        # Certificates (students at 100% completion)
        certificates_count = 0
        for enrollment in all_enrollments:
            try:
                if hasattr(enrollment, 'progress') and enrollment.progress:
                    if enrollment.progress.percentage_complete >= 100:
                        certificates_count += 1
            except:
                pass
        
        # Refund rate (approximate - assuming refunds tracked separately)
        # For now, calculate based on dropouts (students with < 5% progress who haven't accessed in 30 days)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        potential_refunds = 0
        for enrollment in all_enrollments:
            try:
                if hasattr(enrollment, 'progress') and enrollment.progress:
                    low_progress = enrollment.progress.percentage_complete < 5
                    inactive = not enrollment.progress.last_accessed or enrollment.progress.last_accessed < thirty_days_ago
                    if low_progress and inactive:
                        potential_refunds += 1
            except:
                pass
        
        refund_rate = (potential_refunds / all_enrollments.count() * 100) if all_enrollments.exists() else 0
        
        # Completion rate (students at 100%)
        completions = 0
        for enrollment in all_enrollments:
            try:
                if hasattr(enrollment, 'progress') and enrollment.progress:
                    if enrollment.progress.percentage_complete >= 100:
                        completions += 1
            except:
                pass
        
        completion_rate = (completions / all_enrollments.count() * 100) if all_enrollments.exists() else 0
        
        quick_stats = {
            "newEnrollments": new_enrollments,
            "certificates": certificates_count,
            "refundRate": round(refund_rate, 1),
            "completionRate": round(completion_rate)
        }
        
        # Top Performing Courses
        top_courses = []
        for course in courses.order_by('-created_at')[:5]:
            course_enrollments = Enrollment.objects.filter(course=course)
            student_count = course_enrollments.count()
            course_revenue = student_count * course.price
            course_rating = Review.objects.filter(course=course).aggregate(avg=Avg('rating'))['avg'] or 0
            
            top_courses.append({
                "id": course.slug or str(course.id),
                "title": course.title,
                "students": student_count,
                "revenue": f"${course_revenue:,.0f}",
                "rating": round(course_rating, 1)
            })
        
        # Sort by revenue (highest first) - use float to handle decimals (fixes crash risk)
        top_courses.sort(key=lambda x: float(x['revenue'].replace('$', '').replace(',', '')), reverse=True)
        
        return Response({
            "stats": stats,
            "revenueChart": revenue_chart,
            "studentDistribution": progress_distribution,
            "ratingAnalysis": rating_analysis,
            "quickStats": quick_stats,
            "topCourses": top_courses
        })

    # End of get method

# End of InstructorAnalyticsView class
