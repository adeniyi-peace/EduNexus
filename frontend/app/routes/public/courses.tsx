import { 
    useLoaderData, 
    useSearchParams, 
    useSubmit, 
    Form, 
    useNavigation 
} from "react-router";
import { Search, Filter, SlidersHorizontal, SearchX } from "lucide-react";
import { CourseCard } from "~/components/ui/CourseCard";
import { SectionHeader } from "~/components/ui/SectionHeader";
import { MarketplaceSkeleton } from "~/components/ui/Skeletons";
import type { Route } from "../+types/courses";
import api from "~/utils/api.client";
import type { CourseData } from "~/types/course";

// ... loader function stays exactly the same as your logic is perfect ...

export async function loader({ request }: Route.ClientLoaderArgs) {
    const url = new URL(request.url);
    const search = url.searchParams.get("q") || "";
    const category = url.searchParams.get("category") || "";
    const sort = url.searchParams.get("sort") || "-created_at";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = 6;

    try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set("search", search);
        if (category) queryParams.set("category", category);
        
        // Map frontend expected sorting defaults to backend expectations
        let backendSort = sort;
        if (sort === "-rating") backendSort = "-annotated_rating";
        queryParams.set("ordering", backendSort);
        queryParams.set("page", page.toString());
        
        const response = await api.get(`/courses/?${queryParams.toString()}`);

        const paginatedCourses = response.data.results as CourseData[];
        const totalCourses = response.data.count as number;
        const totalPages = Math.ceil(totalCourses / pageSize);

        return { 
            courses: paginatedCourses,
            meta: {
                totalCourses,
                totalPages,
                currentPage: page,
                hasNextPage: !!response.data.next,
                hasPrevPage: !!response.data.previous,
            },
            filters: { search, category, sort }
        };
    } catch (error) {
        console.error("Failed to fetch courses:", error);
        return {
            courses: [],
            meta: {
                totalCourses: 0,
                totalPages: 0,
                currentPage: page,
                hasNextPage: false,
                hasPrevPage: false,
            },
            filters: { search, category, sort }
        };
    }
}

export function HydrateFallback() {
    return <MarketplaceSkeleton />;
}

export default function CourseMarketplace() {
    const { courses, filters, meta } = useLoaderData<typeof loader>();
    const [searchParams] = useSearchParams();
    const submit = useSubmit();
    const navigation = useNavigation();

    const categories = ["Web Development", "Data Science", "Design", "Business", "Marketing"];

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        submit(params);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="animate-slide-up">
                <SectionHeader 
                    title="Explore Knowledge" 
                    subtitle="Expert-led courses designed for the next generation of engineers." 
                />
            </div>

            <div className="flex flex-col lg:flex-row gap-12 mt-16">
                {/* --- FILTERS SIDEBAR --- */}
                <aside className="w-full lg:w-80 shrink-0">
                    <div className="sticky top-28 p-8 rounded-4xl bg-base-200/50 backdrop-blur-md border border-base-content/5 shadow-sm space-y-10">
                        <Form 
                            method="get" 
                            onChange={(e) => {
                                const formData = new FormData(e.currentTarget);
                                formData.set("page", "1"); 
                                submit(formData, { replace: true });
                            }}
                            className="space-y-10"
                        >
                            {/* Search Group */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                                    <Search size={14} className="text-primary" />
                                    Search Library
                                </label>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        name="q"
                                        defaultValue={filters.search}
                                        placeholder="Keywords..." 
                                        className="input input-bordered w-full bg-base-100 rounded-xl focus:outline-primary transition-all pr-10" 
                                    />
                                    {navigation.state === "loading" && (
                                        <span className="loading loading-spinner loading-xs absolute right-3 top-4 opacity-30"></span>
                                    )}
                                </div>
                            </div>

                            {/* Categories Group */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                                    <Filter size={14} className="text-primary" />
                                    Subject Area
                                </label>
                                <div className="flex flex-col gap-1">
                                    <CategoryRadio label="All Categories" value="" current={filters.category} />
                                    {categories.map((cat) => (
                                        <CategoryRadio key={cat} label={cat} value={cat} current={filters.category} />
                                    ))}
                                </div>
                            </div>

                            {/* Sort Group */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                                    <SlidersHorizontal size={14} className="text-primary" />
                                    Sort Results
                                </label>
                                <select 
                                    name="sort" 
                                    className="select select-bordered w-full bg-base-100 rounded-xl font-bold text-sm"
                                    defaultValue={filters.sort}
                                >
                                    <option value="-created_at">Newest Released</option>
                                    <option value="price">Price: Lowest</option>
                                    <option value="-price">Price: Highest</option>
                                    <option value="-rating">Top Rated</option>
                                </select>
                            </div>
                        </Form>
                    </div>
                </aside>

                {/* --- COURSE GRID & PAGINATION --- */}
                <main className="flex-1">
                    <div className={`transition-all duration-500 ${navigation.state === "loading" ? "opacity-30 blur-sm pointer-events-none" : "opacity-100 blur-0"}`}>
                        {courses.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-fade-in">
                                    {courses.map((course: any) => (
                                        <CourseCard key={course.id} course={course} />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                <div className="mt-20 flex justify-center">
                                    <div className="join bg-base-100 p-1 rounded-2xl border border-base-content/5 shadow-xl">
                                        <button 
                                            disabled={!meta.hasPrevPage}
                                            onClick={() => handlePageChange(meta.currentPage - 1)}
                                            className="join-item btn btn-ghost btn-md rounded-xl disabled:opacity-20"
                                        >
                                            ←
                                        </button>
                                        <button className="join-item btn btn-ghost btn-md no-animation pointer-events-none px-6 font-black text-xs uppercase tracking-widest">
                                            {meta.currentPage} / {meta.totalPages}
                                        </button>
                                        <button 
                                            disabled={!meta.hasNextPage}
                                            onClick={() => handlePageChange(meta.currentPage + 1)}
                                            className="join-item btn btn-ghost btn-md rounded-xl disabled:opacity-20"
                                        >
                                            →
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 bg-base-100/30 backdrop-blur-sm rounded-[3rem] border border-base-content/5 shadow-sm text-center animate-fade-in relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50"></div>
                                <div className="relative w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 shadow-inner border border-primary/20">
                                    <SearchX className="text-primary w-10 h-10 opacity-80" />
                                </div>
                                <h3 className="relative text-2xl md:text-3xl font-bold tracking-tight text-base-content">No Results Found</h3>
                                <p className="relative text-base-content/60 mt-3 max-w-md font-medium px-4">
                                    We couldn't find any courses matching your specific filters. Try adjusting your parameters to see more options.
                                </p>
                                <button 
                                    onClick={() => submit({})} 
                                    className="relative btn btn-outline btn-primary mt-10 px-10 rounded-2xl font-bold tracking-wide transition-all hover:shadow-lg hover:shadow-primary/20"
                                >
                                    Reset All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

function CategoryRadio({ label, value, current }: { label: string; value: string; current: string }) {
    const isActive = current === value;
    return (
        <label className={`label cursor-pointer justify-start gap-4 py-2.5 px-4 rounded-xl transition-all group ${isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-base-content/5"}`}>
            <input 
                type="radio" 
                name="category" 
                value={value}
                defaultChecked={isActive}
                className="hidden" 
            />
            <span className={`text-sm font-bold tracking-tight ${isActive ? "text-white" : "text-base-content/60 group-hover:text-base-content"}`}>
                {label}
            </span>
        </label>
    );
}