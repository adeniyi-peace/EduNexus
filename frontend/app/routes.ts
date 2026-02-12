import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("routes/_public.tsx", [
    index("routes/home.tsx"),

    // Marketplace & Discovery
    route("/courses", "routes/courses.tsx"),
    route("/courses/course_id", "routes/courseDetail.tsx"),
    // route("courses/:id", "routes/courses.$id.view.tsx"),
        
    // Mentorship & Community
    route("mentors", "routes/mentors.tsx"),
    route("/pricing", "routes/pricing.tsx"),

    // Information Pages
    route("how-it-works", "routes/how-it-works.tsx"),
    route("about", "routes/about.tsx"),
    route("support", "routes/support.tsx"),
    route("contact", "routes/contact.tsx"),

    // Legal Pages
    route("privacy", "routes/privacy.tsx"),
    route("terms", "routes/terms.tsx")
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
    // route("dashboard/paths", "routes/dashboard/paths.tsx"),
    // route("dashboard/mentors", "routes/dashboard/mentors.tsx"),
    // route("dashboard/settings", "routes/dashboard/settings.tsx"),
  ]),

  // --- 4. CATCH-ALL / ERROR ---
  // route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
