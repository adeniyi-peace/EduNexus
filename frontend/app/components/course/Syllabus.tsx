// components/course/Syllabus.tsx

import { Lock, PlayCircle } from "lucide-react";
import { Link } from "react-router";

// 2. Updated Syllabus Component
export function Syllabus({ modules, courseId }: { modules: any[], courseId: string }) {
    return (
        <section>
            <h2 className="text-3xl font-black mb-8 italic">Course Content</h2>
            <div className="join join-vertical w-full border border-base-content/10">
                {modules.map((module, idx) => (
                    <div key={idx} className="collapse collapse-arrow join-item border-b border-base-content/10">
                        <input type="radio" name="syllabus-accordion" defaultChecked={idx === 0} /> 
                        <div className="collapse-title text-xl font-bold flex justify-between items-center pr-12">
                            {module.title}
                            <span className="text-sm font-normal opacity-50">{module.lessons.length} lessons</span>
                        </div>
                        <div className="collapse-content bg-base-200/50"> 
                            <ul className="py-2 flex flex-col">
                                {module.lessons.map((lesson: any, i: number) => {
                                    // If it's a preview, we create a link to the player. Otherwise, it's a static disabled item.
                                    const Content = () => (
                                        <>
                                            <div className="flex items-center gap-4 flex-1">
                                                <span className="text-primary font-mono text-sm">0{i+1}</span>
                                                {lesson.isPreview ? <PlayCircle size={16} className="text-primary" /> : <Lock size={16} className="opacity-40" />}
                                                <span className={lesson.isPreview ? "font-bold" : "opacity-70"}>{lesson.title}</span>
                                            </div>
                                            {lesson.isPreview && (
                                                <span className="badge badge-primary badge-sm badge-outline">Preview</span>
                                            )}
                                        </>
                                    );

                                    return lesson.isPreview ? (
                                        <Link 
                                            key={lesson.id}
                                            to={`/courses/${courseId}/learn?lessonId=${lesson.id}`} 
                                            className="flex items-center justify-between p-4 hover:bg-base-100 transition-colors rounded-xl group cursor-pointer"
                                        >
                                            <Content />
                                        </Link>
                                    ) : (
                                        <li key={lesson.id} className="flex items-center justify-between p-4 cursor-not-allowed">
                                            <Content />
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

// Don't forget to pass the courseId down from the main component!
// <Syllabus modules={course.syllabus} courseId={course.id} />