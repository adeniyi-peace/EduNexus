import { useState, useRef, useMemo, useEffect } from "react";
import { CurriculumSidebar } from "~/components/dashboard/course_player/CurriculumSidebar";
import { TabSystem } from "~/components/dashboard/course_player/TabSystem";
import { VideoTheater } from "~/components/dashboard/course_player/VideoTheater";
import { ArticleViewer } from "~/components/dashboard/course_player/ArticleViewer";
import { QuizContainer } from "~/components/dashboard/quiz/QuizContainer";
import { ChevronRight, ChevronLeft, Menu, AlertTriangle, RefreshCw } from "lucide-react";
import { PaywallModal } from "~/components/course/PaywallModal";
import { useCoursePlayerData, useMarkLessonComplete } from "~/hooks/useCoursePlayerData";
import type { PlayerLesson } from "~/types/course";

interface CoursePlayerProps {
    courseId: string;
    initialLessonId: string | null;
}

export default function CoursePlayer({ courseId, initialLessonId }: CoursePlayerProps) {
    // ---- DATA FETCHING ----
    const { data, isLoading, isError, refetch } = useCoursePlayerData(courseId);
    const markComplete = useMarkLessonComplete(courseId);

    // Flatten all lessons across modules for sequential navigation
    const allLessons = useMemo(() =>
        data?.modules.flatMap(m => m.lessons) ?? [],
    [data]);

    const isEnrolled = data?.isEnrolled ?? false;

    // ---- LESSON STATE ----
    const [currentLesson, setCurrentLesson] = useState<PlayerLesson | null>(null);
    const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
    const [showPaywall, setShowPaywall] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    // UI States
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isTabExpanded, setIsTabExpanded] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);

    // Initialize currentLesson once data arrives
    useEffect(() => {
        if (allLessons.length > 0 && !currentLesson) {
            const initial = initialLessonId
                ? allLessons.find(l => l.id === initialLessonId) ?? allLessons[0]
                : allLessons[0];
            setCurrentLesson(initial);
        }
    }, [allLessons, currentLesson, initialLessonId]);

    // ---- HELPERS ----

    /** Find the module that contains a given lesson */
    const getModuleForLesson = (lesson: PlayerLesson): string | null => {
        const mod = data?.modules.find(m => m.lessons.some(l => l.id === lesson.id));
        return mod?.id ?? null;
    };

    const playNextLesson = () => {
        if (!currentLesson) return;
        const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
        const nextLesson = allLessons[currentIndex + 1];

        // Mark current lesson as complete
        const moduleId = getModuleForLesson(currentLesson);
        if (moduleId) {
            markComplete.mutate({ moduleId, lessonId: currentLesson.id });
        }
        setCompletedLessonIds(prev => new Set(prev).add(currentLesson.id));

        if (nextLesson) {
            // Guard clause for preview users hitting a paywall
            if (!isEnrolled && !nextLesson.isPreview) {
                setShowPaywall(true);
                return;
            }
            setCurrentLesson(nextLesson);
        } else {
            setIsPlaying(false);
            // Course complete — could show a congratulations screen here
        }
    };

    const handleLessonSelect = (targetLesson: PlayerLesson) => {
        if (!isEnrolled && !targetLesson.isPreview) {
            setShowPaywall(true);
            return; // Stop the video from changing
        }

        setCurrentLesson(targetLesson);
        setShowPaywall(false);

        if (!hasInteracted) setHasInteracted(true);
        // Close sidebar on mobile after selection
        if (typeof window !== 'undefined' && window.innerWidth < 1024) setIsSidebarOpen(false);
    };

    const handleInitialPlay = () => {
        setHasInteracted(true);
        setIsPlaying(true);
    };

    const jumpToTime = (seconds: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = seconds;
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleArticleComplete = (lessonId: string) => {
        const moduleId = currentLesson ? getModuleForLesson(currentLesson) : null;
        if (moduleId) {
            markComplete.mutate({ moduleId, lessonId });
        }
        setCompletedLessonIds(prev => new Set(prev).add(lessonId));
        playNextLesson();
    };

    // ---- LOADING SKELETON ----
    if (isLoading || !currentLesson) {
        return (
            <div className="flex flex-col lg:flex-row w-full h-[100dvh] bg-base-300">
                {/* Left pane skeleton */}
                <div className="flex flex-col flex-1 min-w-0">
                    <div className="aspect-video w-full bg-base-200 animate-pulse" />
                    <div className="flex-1 p-6 space-y-4">
                        <div className="h-4 bg-base-200 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-base-200 rounded animate-pulse w-1/2" />
                        <div className="h-4 bg-base-200 rounded animate-pulse w-2/3" />
                    </div>
                </div>
                {/* Right pane skeleton */}
                <div className="hidden lg:flex w-96 border-l border-base-content/10 bg-base-100 flex-col p-6 gap-4">
                    <div className="h-6 bg-base-300 rounded animate-pulse w-full" />
                    <div className="h-2 bg-base-300 rounded-full animate-pulse w-full" />
                    <div className="h-px bg-base-content/5 my-2" />
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-12 bg-base-300 rounded-xl animate-pulse w-full" />
                    ))}
                </div>
            </div>
        );
    }

    // ---- ERROR STATE ----
    if (isError) {
        return (
            <div className="w-full h-[100dvh] flex items-center justify-center bg-base-300">
                <div className="text-center p-8 rounded-2xl bg-base-100 border border-base-content/10 shadow-xl max-w-sm mx-4">
                    <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle size={28} className="text-error" />
                    </div>
                    <h2 className="font-black text-lg text-base-content mb-2">Failed to load course</h2>
                    <p className="text-sm text-base-content/50 mb-6">
                        Check your connection and try again.
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="btn btn-primary rounded-xl px-8 gap-2"
                    >
                        <RefreshCw size={16} /> Retry
                    </button>
                </div>
            </div>
        );
    }

    // ---- MAIN PLAYER ----
    return (
        <div className="flex flex-col lg:flex-row w-full h-[100dvh] overflow-hidden bg-base-300 relative">

            <PaywallModal
                isOpen={showPaywall}
                onClose={() => setShowPaywall(false)}
                courseTitle={data?.title ?? 'This Course'}
                price={data?.price ?? 0}
            />

            {/* --- LEFT PANE --- */}
            <div className={`flex flex-col min-w-0 transition-all duration-300 ease-in-out relative ${isSidebarOpen ? 'lg:w-[calc(100%-24rem)]' : 'lg:w-full'}`}>

                {/* 1. THEATER AREA */}
                <div className={`relative bg-black transition-all duration-500 ease-in-out
                    ${isTabExpanded ? 'h-0 overflow-hidden' : ''}
                    ${currentLesson.type === 'quiz'
                        ? 'flex-1 overflow-y-auto'
                        : currentLesson.type === 'article'
                            ? 'flex-1 overflow-y-auto'
                            : 'aspect-video max-h-[70vh] lg:flex-1 lg:max-h-[60vh] xl:max-h-[70vh]'
                    }`}>

                    {currentLesson.type === 'quiz' ? (
                        <div className="w-full h-full min-h-125 flex items-center justify-center bg-slate-950 p-4 lg:p-12">
                            <QuizContainer
                                questions={currentLesson.quizConfig.questions}
                                timeLimit={currentLesson.quizConfig.timeLimit}
                                onFinish={playNextLesson}
                            />
                        </div>
                    ) : currentLesson.type === 'article' ? (
                        <ArticleViewer
                            lesson={currentLesson}
                            onMarkComplete={handleArticleComplete}
                            isCompleted={completedLessonIds.has(currentLesson.id)}
                        />
                    ) : (
                        <VideoTheater
                            currentLesson={currentLesson}
                            isPlaying={isPlaying}
                            hasInteracted={hasInteracted}
                            onPlayAction={handleInitialPlay}
                            onVideoEnd={playNextLesson}
                            setIsPlaying={setIsPlaying}
                            videoRef={videoRef}
                        />
                    )}
                </div>

                {/* 2. TAB SYSTEM — hidden for quiz lessons */}
                {currentLesson.type !== 'quiz' && (
                    <div className={`flex-1 bg-base-100 border-t border-base-content/5 relative z-10 transition-all duration-300 ${isTabExpanded ? 'h-full' : 'min-h-100'}`}>
                        <TabSystem
                            currentLesson={currentLesson}
                            videoRef={currentLesson.type === 'article' ? null : videoRef}
                            onJumpToTime={jumpToTime}
                            isExpanded={isTabExpanded}
                            onToggleExpand={() => setIsTabExpanded(!isTabExpanded)}
                            isEnrolled={isEnrolled}
                        />
                    </div>
                )}
            </div>

            {/* --- RIGHT PANE (Sidebar) --- */}
            <div className={`
                fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-in-out bg-base-100 shadow-2xl w-80 lg:w-96 border-l border-base-content/10
                lg:relative lg:transform-none lg:shadow-none lg:z-0
                ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:hidden'}
            `}>
                <CurriculumSidebar
                    modules={data!.modules}
                    allLessons={allLessons}
                    currentLesson={currentLesson}
                    completedLessonIds={completedLessonIds}
                    courseTitle={data!.title}
                    isEnrolled={isEnrolled}
                    onLessonSelect={handleLessonSelect}
                />

                {/* Mobile Close Button */}
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden absolute top-4 right-4 btn btn-circle btn-sm btn-ghost"
                    aria-label="Close sidebar"
                >
                    ✕
                </button>
            </div>

            {/* --- UTILITY: Sidebar Toggles --- */}

            {/* Desktop Toggle */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden lg:flex absolute top-1/2 -translate-y-1/2 z-[60] bg-base-100 border border-base-content/10 p-1 rounded-l-lg shadow-lg hover:bg-primary hover:text-white transition-colors"
                style={{ right: isSidebarOpen ? 'calc(24rem - 1px)' : '-1px' }}
                aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
                {isSidebarOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Mobile Toggle (Floating Bottom Right) */}
            {!isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden fixed bottom-6 right-6 z-50 btn btn-circle btn-primary shadow-2xl"
                    aria-label="Open curriculum sidebar"
                >
                    <Menu size={20} />
                </button>
            )}

            {/* Overlay for Mobile Sidebar */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}