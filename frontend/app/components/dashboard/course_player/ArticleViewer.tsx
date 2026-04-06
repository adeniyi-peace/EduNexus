import type { ArticleLesson } from '~/types/course';
import { BookOpen, Clock, CheckCircle } from 'lucide-react';

interface ArticleViewerProps {
    lesson: ArticleLesson;
    onMarkComplete: (lessonId: string) => void;
    isCompleted: boolean;
}

export const ArticleViewer = ({ lesson, onMarkComplete, isCompleted }: ArticleViewerProps) => {
    // Estimated read time based on average 200 wpm
    const wordCount = lesson.content
        .replace(/<[^>]*>/g, '')
        .split(/\s+/)
        .filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <div className="w-full h-full overflow-y-auto bg-base-100 custom-scrollbar">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-primary text-[11px] font-black uppercase tracking-[0.25em] mb-4">
                        <BookOpen size={13} />
                        Article Lesson
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-base-content leading-tight mb-3">
                        {lesson.title}
                    </h1>
                    {lesson.description && (
                        <p className="text-base-content/60 text-sm leading-relaxed mb-4">
                            {lesson.description}
                        </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-base-content/40 font-mono">
                        <Clock size={12} />
                        <span>{readTime} min read</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-base-content/10 mb-8" />

                {/* Article Content */}
                <div
                    className="
                        prose prose-sm md:prose-base max-w-none
                        text-base-content/80 leading-relaxed
                        prose-headings:text-base-content prose-headings:font-black prose-headings:tracking-tight
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-base-content
                        prose-code:bg-base-300 prose-code:text-primary prose-code:px-1.5 prose-code:py-0.5
                        prose-code:rounded prose-code:text-sm prose-code:font-mono
                        prose-pre:bg-base-300 prose-pre:border prose-pre:border-base-content/10
                        prose-blockquote:border-l-primary prose-blockquote:text-base-content/60
                        prose-img:rounded-xl prose-img:shadow-lg
                        prose-hr:border-base-content/10
                    "
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                />

                {/* Mark Complete Footer */}
                <div className="mt-14 pt-8 border-t border-base-content/10 flex flex-col items-center gap-3">
                    {isCompleted ? (
                        <div className="flex items-center gap-3 text-success font-bold text-lg">
                            <CheckCircle size={24} />
                            <span>Lesson Completed</span>
                        </div>
                    ) : (
                        <>
                            <p className="text-xs text-base-content/40 text-center">
                                Finished reading? Mark this lesson as complete to track your progress.
                            </p>
                            <button
                                onClick={() => onMarkComplete(lesson.id)}
                                className="btn btn-primary btn-lg px-10 rounded-2xl gap-3
                                    shadow-[0_0_30px_rgba(var(--p),0.25)]
                                    hover:shadow-[0_0_40px_rgba(var(--p),0.4)] transition-all"
                            >
                                <CheckCircle size={20} />
                                Mark as Complete
                            </button>
                        </>
                    )}
                </div>

                {/* Bottom spacing */}
                <div className="h-16" />
            </div>
        </div>
    );
};
