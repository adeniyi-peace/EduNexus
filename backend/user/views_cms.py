from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Avg, Count, Case, When, IntegerField, F
from django.utils import timezone
from datetime import timedelta
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
