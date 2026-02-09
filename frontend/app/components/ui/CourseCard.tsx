import type { Course } from "~/utils/mockData";

export function CourseCard({ title, instructor, thumbnail, category, price, rating, students }: Course) {
    return (
        <div className="card bg-base-100 shadow-sm hover:shadow-2xl transition-all duration-500 border border-base-content/5 group overflow-hidden">
            <figure className="relative h-52 overflow-hidden">
                <img 
                    src={thumbnail} 
                    alt={title} 
                    className="group-hover:scale-110 transition-transform duration-700 w-full h-full object-cover" 
                />
                <div className="absolute top-4 left-4">
                    <span className="badge badge-primary font-bold py-3 px-4 shadow-lg border-none bg-linear-to-r from-primary to-primary/80">
                        {category}
                    </span>
                </div>
            </figure>
            
            <div className="card-body p-6">
                <div className="flex items-center gap-2 text-sm mb-2">
                    <div className="rating rating-xs">
                        <input type="radio" className="mask mask-star-2 bg-warning" readOnly checked />
                    </div>
                    <span className="font-bold text-base-content">{rating}</span>
                    <span className="text-base-content/40">({students.toLocaleString()} students)</span>
                </div>

                <h3 className="card-title text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-14">
                    {title}
                </h3>
                
                <p className="text-sm text-base-content/60 mt-2">
                    Instructed by <span className="text-base-content font-medium">{instructor}</span>
                </p>
                
                <div className="divider my-4 opacity-5"></div>
                
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-xs uppercase opacity-50 font-bold tracking-tighter">Price</span>
                        <span className="text-2xl font-black text-primary">{price}</span>
                    </div>
                    <button className="btn btn-primary btn-md shadow-md shadow-primary/10 group-hover:px-6 transition-all duration-300">
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
}