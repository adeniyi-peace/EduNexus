// components/course/Syllabus.tsx
export function Syllabus({ modules }: { modules: any[] }) {
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
                            <ul className="py-4 space-y-4">
                                {module.lessons.map((lesson: string, i: number) => (
                                    <li key={i} className="flex items-center gap-4 text-base-content/80">
                                        <span className="text-primary font-mono text-sm">0{i+1}</span>
                                        {lesson}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}