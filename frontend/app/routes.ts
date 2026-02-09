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
  ]),] satisfies RouteConfig;
