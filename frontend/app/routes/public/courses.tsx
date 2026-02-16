import { 
    useLoaderData, 
    useSearchParams, 
    useSubmit, 
    Form, 
    useNavigation 
} from "react-router";
import { CourseCard } from "~/components/ui/CourseCard";
import { SectionHeader } from "~/components/ui/SectionHeader";
import { DUMMY_COURSES } from "~/utils/mockData";
import { MarketplaceSkeleton } from "~/components/ui/Skeletons";
import type { Route } from "../+types/courses";

export async function loader({ request }: { request: Request }) {
    const url = new URL(request.url);
    const search = url.searchParams.get("q")?.toLowerCase() || "";
    const category = url.searchParams.get("category") || "";
    const sort = url.searchParams.get("sort") || "-created_at";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = 6;

    // Simulate Network Latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = [...DUMMY_COURSES];

    // 1. Filter Logic
    if (search) {
        filtered = filtered.filter(c => 
            c.title.toLowerCase().includes(search) || 
            c.description.toLowerCase().includes(search)
        );
    }
    if (category) {
        filtered = filtered.filter(c => c.category === category);
    }

    // 2. Sort Logic (Production standard)
    filtered.sort((a, b) => {
        if (sort === "price") return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
        if (sort === "-price") return parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''));
        if (sort === "-rating") return b.rating - a.rating;
        return b.id - a.id; // Default newest
    });

    // 3. Pagination Logic
    const totalCourses = filtered.length;
    const totalPages = Math.ceil(totalCourses / pageSize);
    const start = (page - 1) * pageSize;
    const paginatedCourses = filtered.slice(start, start + pageSize);

    return { 
        courses: paginatedCourses,
        meta: {
            totalCourses,
            totalPages,
            currentPage: page,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
        filters: { search, category, sort }
    };
}

export function HydrateFallback() {
    return <MarketplaceSkeleton />;
}

export default function CourseMarketplace() {
    const { courses, filters, meta } = useLoaderData<typeof loader>();
    const [searchParams] = useSearchParams();
    const submit = useSubmit();
    const navigation = useNavigation();

    const isSearching = navigation.location && 
        new URLSearchParams(navigation.location.search).has("q");

    const categories = ["Web Development", "Data Science", "Design", "Business", "Marketing"];

    // Helper to change page without losing existing filters
    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        submit(params);
    };

    return (
        <div className="container mx-auto px-4 py-12 transition-opacity duration-500 ease-in-out">
            <SectionHeader 
                title="Explore Knowledge" 
                subtitle="Expert-led courses designed for the next generation of engineers." 
            />

            <div className="flex flex-col lg:flex-row gap-10 mt-12">
                {/* --- FILTERS SIDEBAR --- */}
                <aside className="w-full lg:w-72">
                    <div className="sticky top-24 space-y-8 bg-base-200/50 p-6 rounded-3xl border border-base-content/5">
                        <Form 
                            method="get" 
                            onChange={(e) => {
                                // Reset to page 1 on filter change
                                const formData = new FormData(e.currentTarget);
                                formData.set("page", "1"); 
                                submit(formData, { replace: true });
                            }}
                            className="space-y-6"
                        >
                            <div>
                                <label className="text-sm font-black uppercase tracking-widest opacity-50 mb-4 block">Search</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        name="q"
                                        defaultValue={filters.search}
                                        placeholder="Keywords..." 
                                        className="input input-bordered w-full bg-base-100 focus:outline-primary" 
                                    />
                                    {navigation.state === "loading" && (
                                        <span className="loading loading-spinner loading-xs absolute right-3 top-4 opacity-30"></span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-black uppercase tracking-widest opacity-50 mb-4 block">Categories</label>
                                <div className="flex flex-col gap-1">
                                    <label className="label cursor-pointer justify-start gap-3 py-2 px-3 rounded-xl hover:bg-base-300 transition-colors">
                                        <input 
                                            type="radio" 
                                            name="category" 
                                            value=""
                                            checked={!filters.category}
                                            className="radio radio-primary radio-sm" 
                                        />
                                        <span className={`text-sm ${!filters.category ? "font-bold text-primary" : ""}`}>All Categories</span>
                                    </label>
                                    {categories.map((cat) => (
                                        <label key={cat} className="label cursor-pointer justify-start gap-3 py-2 px-3 rounded-xl hover:bg-base-300 transition-colors">
                                            <input 
                                                type="radio" 
                                                name="category" 
                                                value={cat}
                                                checked={filters.category === cat}
                                                className="radio radio-primary radio-sm" 
                                            />
                                            <span className={`text-sm ${filters.category === cat ? "font-bold text-primary" : ""}`}>{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-black uppercase tracking-widest opacity-50 mb-4 block">Sort By</label>
                                <select 
                                    name="sort" 
                                    className="select select-bordered w-full bg-base-100"
                                    defaultValue={filters.sort}
                                >
                                    <option value="-created_at">Newest First</option>
                                    <option value="price">Price: Low to High</option>
                                    <option value="-price">Price: High to Low</option>
                                    <option value="-rating">Highest Rated</option>
                                </select>
                            </div>
                        </Form>
                    </div>
                </aside>

                {/* --- COURSE GRID & PAGINATION --- */}
                <main className="flex-1">
                    <div className={`transition-opacity duration-300 ${navigation.state === "loading" ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
                        {courses.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {courses.map((course: any) => (
                                        <CourseCard key={course.id} {...course} />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                <div className="mt-16 flex justify-center">
                                    <div className="join border border-base-content/10 bg-base-100 shadow-sm">
                                        <button 
                                            disabled={!meta.hasPrevPage}
                                            onClick={() => handlePageChange(meta.currentPage - 1)}
                                            className="join-item btn btn-md disabled:bg-base-200"
                                        >
                                            «
                                        </button>
                                        <button className="join-item btn btn-md no-animation pointer-events-none px-8">
                                            Page {meta.currentPage} of {meta.totalPages}
                                        </button>
                                        <button 
                                            disabled={!meta.hasNextPage}
                                            onClick={() => handlePageChange(meta.currentPage + 1)}
                                            className="join-item btn btn-md disabled:bg-base-200"
                                        >
                                            »
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 bg-base-200/30 rounded-[3rem] border-2 border-dashed border-base-content/5 text-center">
                                <div className="w-20 h-20 bg-base-300 rounded-full flex items-center justify-center text-4xl mb-6">🔍</div>
                                <h3 className="text-2xl font-black">No courses found</h3>
                                <p className="text-base-content/50 mt-2 max-w-xs">We couldn't find any results for "{filters.search}". Try different keywords or filters.</p>
                                <button 
                                    onClick={() => submit({})} 
                                    className="btn btn-primary mt-8 px-10 rounded-full"
                                >
                                    Reset Discovery
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}