import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("routes/_public.tsx", [
    index("routes/public/home.tsx"),

    // Marketplace & Discovery
    route("/courses", "routes/public/courses.tsx"),
    route("/courses/course_id", "routes/public/courseDetail.tsx"),
    // route("courses/:id", "routes/public/courses.$id.view.tsx"),
        
    // Mentorship & Community
    route("mentors", "routes/public/mentors.tsx"),

    // Information Pages
    route("how-it-works", "routes/public/how-it-works.tsx"),
    route("about", "routes/public/about.tsx"),
    route("support", "routes/public/support.tsx"),
    route("contact", "routes/public/contact.tsx"),

    // Legal Pages
    route("privacy", "routes/public/privacy.tsx"),
    route("terms", "routes/public/terms.tsx")
  ]),
  
  // --- AUTHENTICATION (Standalone Layout) ---
  layout("routes/_auth.tsx", [
      route("register", "routes/auth/register.tsx"),
      route("login", "routes/auth/login.tsx"),
      route("forgot-password", "routes/auth/forgot-password.tsx"),
      route("reset-password", "routes/auth/reset-password.tsx"),
  ]),

  // ---  STUDENT DASHBOARD ROUTES ---
  layout("routes/_dashboard.tsx", [
    route("dashboard", "routes/dashboard/index.tsx"),

    // Nested Dashboard sections
    route("dashboard/courses", "routes/dashboard/courses.tsx"),
    route("dashboard/courses/:id", "routes/dashboard/CoursePlayer.tsx"),
    route("dashboard/community", "routes/dashboard/CommunityHub.tsx"),
    route("/dashboard/achievements", "routes/dashboard/AchievementsPage.tsx"),
    route("dashboard/profile", "routes/user/ProfilePage.tsx"),
    // route("dashboard/mentors", "routes/dashboard/mentors.tsx"),
    // route("dashboard/settings", "routes/user/SettingsPage.tsx"),
  ]),

  layout("routes/_cmsLayout.tsx", [
    route("/cms", "routes/cms/CMSDashboard.tsx"),
    route("/cms/builder", "routes/cms/CourseBuilder.tsx"),
    route("/cms/library", "routes/cms/AssetLibrary.tsx"),
    route("/cms/students", "routes/cms/GlobalStudentDirectory.tsx"),
    route("/cms/course/students", "routes/cms/CourseStudentManager.tsx"),
    route("/cms/test", "routes/cms/StudentManager.tsx"),
    route("/cms/analytics", "routes/cms/InstructorAnalyticsPage.tsx"),
    route("/cms/settings", "routes/user/SettingsPage.tsx"),
    route("/cms/notification", "routes/user/NotificationsPage.tsx"),
    // route("cms/question-bank", ""),
  ]),

  layout("routes/_admin.tsx", [
    route("/admin", "routes/admin/Dashboard.tsx"),
    route("/admin/users", "routes/admin/UserManagementPage.tsx"),
    route("/admin/moderation", "routes/admin/CourseApprovalPage.tsx"),
    route("/admin/finance", "routes/admin/FinancePage.tsx"),
    route("/admin/analytics", "routes/admin/AnalyticsPage.tsx"),
    route("/admin/courses", "routes/admin/AdminCoursesPage.tsx"),
    // route("cms/question-bank", ""),
  ]),

  route("/resources/theme", "routes/resources.theme.ts")

  // --- 4. CATCH-ALL / ERROR ---
  // route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
