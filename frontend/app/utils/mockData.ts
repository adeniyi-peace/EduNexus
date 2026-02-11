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

export const MOCK_CURRICULUM = [
    {
        title: "Module 1: System Fundamentals",
        lessons: [
            { 
                id: "101", 
                title: "Introduction to Nexus Nodes", 
                type: "video",
                duration: "00:15", 
                completed: true,
                videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            },
            { 
                id: "102", 
                title: "Configuring the Uplink", 
                type: "video",
                duration: "00:12", 
                completed: true,
                videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" 
            },
            {
                id: "103",
                title: "Fundamentals Checkpoint",
                type: "quiz",
                duration: "5 mins",
                completed: false,
                timeLimit: 120, // 2 minutes
                questions: [
                    {
                        text: "Which protocol is primarily used for Nexus Node synchronization?",
                        options: [
                            { text: "Lattice-based Sync", isCorrect: true },
                            { text: "Standard HTTP Polling", isCorrect: false },
                            { text: "Manual Uplink", isCorrect: false },
                            { text: "UDP Broadcast", isCorrect: false }
                        ]
                    },
                    {
                        text: "A Nexus Node can operate without an active Uplink configuration.",
                        options: [
                            { text: "True", isCorrect: false },
                            { text: "False", isCorrect: true }
                        ]
                    }
                ]
            }
        ]
    },
    {
        title: "Module 2: Advanced Architecture",
        lessons: [
            { 
                id: "201", 
                title: "Distributed Consensus Protocols", 
                type: "video",
                duration: "00:10", 
                completed: false,
                videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" 
            },
            { 
                id: "202", 
                title: "Fault Tolerance in Nexus", 
                type: "video",
                duration: "00:18", 
                completed: false,
                videoUrl: "https://player.vimeo.com/external/494356011.sd.mp4?s=d010775d79679199c0e4876932a32c668b57700e&profile_id=165&oauth2_token_id=57447761" 
            },
            {
                id: "203",
                title: "Architecture Final Exam",
                type: "quiz",
                duration: "10 mins",
                completed: false,
                timeLimit: 300, // 5 minutes
                questions: [
                    {
                        text: "In the event of a cluster failure, what is the primary recovery mechanism?",
                        options: [
                            { text: "Shard Migration", isCorrect: false },
                            { text: "Consensus Re-election", isCorrect: true },
                            { text: "Cold Reboot", isCorrect: false },
                            { text: "Data Purge", isCorrect: false }
                        ]
                    }
                ]
            }
        ]
    }
];