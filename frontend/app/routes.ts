import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("routes/_public.tsx", [
        index("routes/public/home.tsx"),

        // Marketplace & Discovery
        route("/courses", "routes/public/courses.tsx"),
        // Fixed: Added colon for dynamic parameter
        route("/courses/:id", "routes/public/courseDetail.tsx"), 
        
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
  
    // --- AUTHENTICATION ---
    layout("routes/_auth.tsx", [
        route("register", "routes/auth/register.tsx"),
        route("login", "routes/auth/login.tsx"),
        route("forgot-password", "routes/auth/forgot-password.tsx"),
        route("reset-password", "routes/auth/reset-password.tsx"),
    ]),

    // --- STUDENT DASHBOARD ---
    layout("routes/_dashboard.tsx", [
        route("dashboard", "routes/dashboard/index.tsx"),
        route("dashboard/courses", "routes/dashboard/courses.tsx"),
        // route("dashboard/courses/:id", "routes/public/courseDetail.tsx", {id: "registered-course"}),
        route("dashboard/community", "routes/dashboard/CommunityHub.tsx"),
        route("/dashboard/achievements", "routes/dashboard/AchievementsPage.tsx"),
        
        // Shared components with Unique IDs
        route("dashboard/profile", "routes/user/ProfilePage.tsx", { id: "student-profile" }),
        route("dashboard/settings", "routes/user/SettingsPage.tsx", { id: "student-settings" }),
        route("/dashboard/notification", "routes/user/NotificationsPage.tsx", { id: "student-notifications" }),
    ]),

    // --- CMS (INSTRUCTOR) DASHBOARD ---
    layout("routes/_cmsLayout.tsx", [
        route("/cms", "routes/cms/CMSDashboard.tsx"),
        route("/cms/builder", "routes/cms/CourseBuilder.tsx"),
        route("/cms/library", "routes/cms/AssetLibrary.tsx"),
        route("/cms/students", "routes/cms/GlobalStudentDirectory.tsx"),
        route("/cms/course/students", "routes/cms/CourseStudentManager.tsx"),
        route("/cms/analytics", "routes/cms/InstructorAnalyticsPage.tsx"),
        
        // Shared components with Unique IDs
        route("cms/profile", "routes/user/ProfilePage.tsx", { id: "cms-profile" }),
        route("/cms/settings", "routes/user/SettingsPage.tsx", { id: "cms-settings" }),
        route("/cms/notification", "routes/user/NotificationsPage.tsx", { id: "cms-notifications" }),
    ]),

    // --- ADMIN DASHBOARD ---
    layout("routes/_admin.tsx", [
        route("/admin", "routes/admin/Dashboard.tsx"),
        route("/admin/users", "routes/admin/UserManagementPage.tsx"),
        route("/admin/moderation", "routes/admin/ContentModerationPage.tsx"),
        route("/admin/finance", "routes/admin/FinancePage.tsx"),
        route("/admin/analytics", "routes/admin/AnalyticsPage.tsx"),
        route("/admin/courses-approval", "routes/admin/CourseApprovalPage.tsx"),
        route("/admin/courses", "routes/admin/AdminCoursesPage.tsx"),
        route("/admin/system-settings", "routes/admin/AdminSettingsPage.tsx"),
        
        // Shared components with Unique IDs
        route("admin/profile", "routes/user/ProfilePage.tsx", { id: "admin-profile" }),
        route("/admin/settings", "routes/user/SettingsPage.tsx", { id: "admin-settings" }),
        route("/admin/notification", "routes/user/NotificationsPage.tsx", { id: "admin-notifications" }),
    ]),

    
    route("courses/:id/learn", "routes/courses.$courseId.learn.tsx"),
    route("/resources/theme", "routes/resources.theme.ts"),

    // --- 4. CATCH-ALL / ERROR ---
    route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;