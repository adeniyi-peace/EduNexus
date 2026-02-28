import { useState, useRef, useMemo } from "react";
import { CurriculumSidebar } from "~/components/dashboard/course_player/CurriculumSidebar";
import { TabSystem } from "~/components/dashboard/course_player/TabSystem";
import { VideoTheater } from "~/components/dashboard/course_player/VideoTheater";
import { QuizContainer } from "~/components/dashboard/quiz/QuizContainer";
import { MOCK_CURRICULUM } from "~/utils/mockData";
import { ChevronRight, ChevronLeft, Menu } from "lucide-react";
import { PaywallModal } from "~/components/course/PaywallModal";

export default function CoursePlayer({ isEnrolled, initialLessonId }: { isEnrolled: boolean, initialLessonId: string | null }) {

    // Flatten lessons for easier "Next/Prev" navigation logic
    // Memoize to prevent unnecessary recalculations on every render
    const allLessons = useMemo(() => MOCK_CURRICULUM.flatMap(module => module.lessons), []);

    const initialLesson = initialLessonId 
        ? allLessons.find(l => l.id === initialLessonId) || allLessons[0] 
        : allLessons[0];

    const [currentLesson, setCurrentLesson] = useState(initialLesson);
    const [showPaywall, setShowPaywall] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    
    // UI States
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isTabExpanded, setIsTabExpanded] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);

    // Auto-play logic
    const playNextLesson = () => {
        const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
        const nextLesson = allLessons[currentIndex + 1];

        if (nextLesson) {
            // Guard clause for preview users hitting a paywall
            if (!isEnrolled && !nextLesson.isPreview) {
                console.log("Paywall triggered: User needs to enroll to continue.");
                setShowPaywall(true);
                return;
            }
            setCurrentLesson(nextLesson);
            // In a real app, you'd send a "mark as completed" request to your Django backend here
            // Reset interaction state for new quizzes if you want them to start with a button
            // setHasInteracted(false); // Optional: Reset if you want them to click play again
            console.log(`Transitioning to ${nextLesson.title}`);
        } else {
            setIsPlaying(false);
            console.log("Course Complete");
        }
    };

    const handleLessonSelect = (targetLesson: any) => {
        // Intercept the click!
        if (!isEnrolled && !targetLesson.isPreview) {
            setShowPaywall(true);
            return; // Stop the video from changing
        }

        setCurrentLesson(targetLesson);
        setShowPaywall(false);

        if (!hasInteracted) setHasInteracted(true);
        // Optional: Close sidebar on mobile select
        if (window.innerWidth < 1024) setIsSidebarOpen(false);
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

    return (
        // Container fills the dashboard content area. 
        // We use h-[calc(100vh-theme(spacing.header))] if the header is fixed, 
        // but flex-1 h-full is safer if the parent controls height.
        <div className="flex flex-col lg:flex-row w-full h-screen overflow-hidden bg-base-300 relative">

            
            <PaywallModal 
                isOpen={showPaywall}
                onClose={() => setShowPaywall(false)}
                courseTitle={"react course"}
                price={20000}
            />
            
            {/* --- LEFT PANE --- */}
            <div className={`flex flex-col min-w-0 transition-all duration-300 ease-in-out relative ${isSidebarOpen ? 'lg:w-[calc(100%-24rem)]' : 'lg:w-full'}`}>
                
                {/* 1. THEATER AREA */}
                {/* We add a conditional opacity/visibility if tabs are expanded to save resources */}
                <div className={`relative bg-black transition-all duration-500 ease-in-out 
                    ${isTabExpanded ? 'h-0 overflow-hidden' : ''} 
                    ${currentLesson.type === 'quiz' ? 'flex-1 overflow-y-auto' : 'aspect-video max-h-[70vh] lg:flex-1 lg:max-h-[60vh] xl:max-h-[70vh]'}`}>
                    
                    {currentLesson.type === "quiz" ? (
                        <div className="w-full h-full min-h-125 flex items-center justify-center bg-slate-950 p-4 lg:p-12">
                            <QuizContainer 
                                questions={currentLesson.questions ?? []} 
                                timeLimit={currentLesson.timeLimit}
                                onFinish={playNextLesson}
                            />
                        </div>
                    ) : (
                        <VideoTheater 
                            currentLesson={currentLesson}
                            isPlaying={isPlaying}
                            hasInteracted={hasInteracted}
                            onPlayAction={handleInitialPlay}
                            onVideoEnd={playNextLesson}
                            setIsPlaying={setIsPlaying}
                            videoRef={videoRef} // Pass Ref down
                        />
                    )}
                </div>

                {/* 2. TAB SYSTEM (Fills remaining height on desktop, fixed height on mobile) */}
                {/* 2. TAB SYSTEM */}
                {currentLesson.type !== "quiz" && (
                    <div className={`flex-1 bg-base-100 border-t border-base-content/5 relative z-10 transition-all duration-300 ${isTabExpanded ? 'h-full' : 'min-h-100'}`}>
                        <TabSystem 
                            currentLesson={currentLesson} 
                            videoRef={videoRef} 
                            onJumpToTime={jumpToTime}
                            isExpanded={isTabExpanded}
                            onToggleExpand={() => setIsTabExpanded(!isTabExpanded)}
                        />
                    </div>
                )}
            </div>

            {/* --- RIGHT PANE (Sidebar) --- */}
            {/* Mobile: Appears below everything (or could be a drawer). Here it flows naturally for SEO/Accessibility */}
            <div className={`
                fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-in-out bg-base-100 shadow-2xl w-80 lg:w-96 border-l border-base-content/10
                lg:relative lg:transform-none lg:shadow-none lg:z-0
                ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:hidden'}
            `}>
                <CurriculumSidebar 
                    curriculum={MOCK_CURRICULUM}
                    currentLesson={currentLesson}
                    allLessons={allLessons}
                    onLessonSelect={handleLessonSelect}
                />

                {/* Mobile Close Button */}
                <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden absolute top-4 right-4 btn btn-circle btn-sm btn-ghost"
                >
                    ✕
                </button>
            </div>

            {/* --- UTILITY: Sidebar Toggles --- */}
            
            {/* Desktop Toggle (Floating on the edge of the video/tab split) */}
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-55 bg-base-100 border border-base-content/10 p-1 rounded-l-lg shadow-lg hover:bg-primary hover:text-white transition-colors"
                style={{ right: isSidebarOpen ? '24rem' : '0' }}
            >
                {isSidebarOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Mobile Toggle (Floating Bottom Right if sidebar is closed) */}
            {!isSidebarOpen && (
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden fixed bottom-6 right-6 z-50 btn btn-circle btn-primary shadow-2xl animate-bounce-subtle"
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