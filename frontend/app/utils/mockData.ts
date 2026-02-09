export interface Course {
    id: number;
    title: string;
    instructor: string;
    thumbnail: string;
    category: string;
    price: string;
    rating: number;
    students: number;
    description: string;
    duration: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    isEnrolled?: boolean;
}

export const DUMMY_COURSES: Course[] = [
    {
        id: 1,
        title: "Advanced Distributed Systems",
        instructor: "Dr. Aris Thorne",
        thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80",
        category: "Backend",
        price: "$149.00",
        rating: 4.9,
        students: 1240,
        description: "Master consistency models, Raft consensus, and fault-tolerant architecture.",
        duration: "18h 45m",
        level: "Advanced",
        isEnrolled: true // This will show "Enter Course Node"
    },
    {
        id: 2,
        title: "React Router v7: The Future of Web",
        instructor: "Sarah Jenkins",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
        category: "Frontend",
        price: "$74.50",
        rating: 4.8,
        students: 850,
        description: "Deep dive into data loaders, actions, and the single-fetch architecture.",
        duration: "10h 20m",
        level: "Intermediate",
        isEnrolled: true
    },
    {
        id: 3,
        title: "Next.js 15: Production Patterns",
        instructor: "Aris Thorne",
        thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&q=80",
        category: "Frontend",
        price: "$99.00",
        rating: 4.7,
        students: 3200,
        description: "Server Components, Partial Prerendering, and advanced caching strategies.",
        duration: "14h 10m",
        level: "Advanced",
        isEnrolled: false // This will show Price and "Details"
    },
    {
        id: 4,
        title: "UI/UX Design with Tailwind v4",
        instructor: "Marcus Aurelius",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bbbda536339a?w=800&q=80",
        category: "Design",
        price: "Free",
        rating: 4.6,
        students: 1500,
        description: "Modern styling using the new CSS-first engine of Tailwind v4.",
        duration: "6h 50m",
        level: "Beginner",
        isEnrolled: false
    },
    {
        id: 5,
        title: "Cloud Native Scalability",
        instructor: "Elena Rodriguez",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
        category: "DevOps",
        price: "$110.00",
        rating: 4.9,
        students: 2100,
        description: "Deploying and managing multi-region Kubernetes clusters.",
        duration: "22h 15m",
        level: "Advanced",
        isEnrolled: true
    }
];