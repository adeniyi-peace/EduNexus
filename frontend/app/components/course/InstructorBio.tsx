// app/components/course/InstructorBio.tsx

export function InstructorBio({ instructor }: { instructor: any }) {
    return (
        <section className="py-12 border-t border-base-content/5">
            <h2 className="text-3xl font-black mb-10 italic">Your Instructor</h2>
            
            <div className="flex flex-col md:flex-row gap-10 items-start">
                {/* Left: Avatar & Quick Stats */}
                <div className="w-full md:w-1/3 space-y-6">
                    <div className="avatar">
                        <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl ring ring-primary ring-offset-base-100 ring-offset-4 shadow-2xl overflow-hidden bg-base-200 flex items-center justify-center">
                            {instructor.profile_picture ? (
                                <img src={instructor.profile_picture} alt={instructor.fullname} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-bold opacity-30">{instructor.fullname?.[0] || "I"}</span>
                            )}
                        </div>
                    </div>
                    
                    <div className="space-y-3 bg-base-200/50 p-5 rounded-2xl border border-base-content/5">
                        <div className="flex items-center gap-3 text-sm font-bold">
                            <span className="text-primary text-lg">★</span> 
                            <span>{instructor.instructor_rating || "New"} Instructor Rating</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold">
                            <span className="text-primary text-lg">👥</span> 
                            <span>{instructor.student_count?.toLocaleString() || 0} Students</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold">
                            <span className="text-primary text-lg">🎥</span> 
                            <span>{instructor.premium_courses_count || 0} Premium Courses</span>
                        </div>
                    </div>
                </div>

                {/* Right: Narrative Bio */}
                <div className="flex-1 space-y-4">
                    <h3 className="text-3xl font-black text-primary tracking-tight">
                        {instructor.fullname}
                    </h3>
                    <p className="font-bold opacity-50 uppercase tracking-widest text-xs">
                        {instructor.role || "Instructor"}
                    </p>
                    
                    <div className="prose prose-lg text-base-content/70 leading-relaxed italic">
                        <p>"{instructor.bio || "An experienced instructor passing down tech skills to the EduNexus community."}"</p>
                    </div>

                    <div className="flex gap-3 pt-6">
                        <button className="btn btn-primary btn-sm px-6 shadow-md shadow-primary/20">
                            View Profile
                        </button>
                        <button className="btn btn-ghost btn-sm border border-base-content/10">
                            Website
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}