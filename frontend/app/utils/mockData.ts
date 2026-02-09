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
}

export const DUMMY_COURSES: Course[] = [
  {
    id: 1,
    title: "Mastering Django Rest Framework",
    instructor: "Dr. Aris Thorne",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80",
    category: "Web Development",
    price: "$99.99",
    rating: 4.8,
    students: 1240,
    description: "Build scalable APIs with Python and Django."
  },
  {
    id: 2,
    title: "React Router v7: The Future of Web",
    instructor: "Sarah Jenkins",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    category: "Frontend",
    price: "$74.50",
    rating: 4.9,
    students: 850,
    description: "Learn the evolution of Remix and React Router."
  },
  {
    id: 3,
    title: "UI/UX Design with Tailwind v4",
    instructor: "Marcus Aurelius",
    thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&q=80",
    category: "Design",
    price: "Free",
    rating: 4.7,
    students: 3200,
    description: "Modern styling without the overhead."
  },
  {
    id: 4,
    title: "Data Science with Python",
    instructor: "Elena Rodriguez",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bbbda536339a?w=800&q=80",
    category: "Data Science",
    price: "$129.00",
    rating: 4.6,
    students: 1500,
    description: "From NumPy to Neural Networks."
  }
];