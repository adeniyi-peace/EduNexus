import { useState, useRef, useEffect } from "react";
import { CurriculumSidebar } from "~/components/dashboard/course_player/CurriculumSidebar";
import { TabSystem } from "~/components/dashboard/course_player/TabSystem";
import { VideoTheater } from "~/components/dashboard/course_player/VideoTheater";
import { QuizContainer } from "~/components/dashboard/quiz/QuizContainer";
import { MOCK_CURRICULUM } from "~/utils/mockData";

export default function CoursePlayer() {
    // Flatten lessons for easier "Next/Prev" navigation logic
    const allLessons = MOCK_CURRICULUM.flatMap(module => module.lessons);
    
    const [currentLesson, setCurrentLesson] = useState(allLessons[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false); 

    // Function to manually trigger play and "unlock" the browser audio
    const handleInitialPlay = () => {
        setHasInteracted(true);
        setIsPlaying(true);
    };


    // Auto-play logic: Find the next lesson in the flattened array
    const playNextLesson = () => {
        const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
        const nextLesson = allLessons[currentIndex + 1];

        if (nextLesson) {
            setCurrentLesson(nextLesson);
            // In a real app, you'd send a "mark as completed" request to your Django backend here
            // Reset interaction state for new quizzes if you want them to start with a button
            // setHasInteracted(false);
            console.log(`Node ${currentLesson.id} complete. Transitioning to ${nextLesson.id}`);
        } else {
            setIsPlaying(false);
            console.log("Course Protocol Complete. All nodes visited.");
        }
    };

    

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] bg-base-300 overflow-hidden">
            
            {/* --- MAIN PANE (The Theater) --- */}
            <div className="flex-1 flex flex-col min-w-0 bg-black relative">
                
                    
                    {/* CONDITIONAL RENDERING LOGIC */}
                    {currentLesson.type === "quiz" ? (
                    <div className="flex-1 flex items-center justify-center bg-slate-950 relative group overflow-y-auto"> 
                        <div className="w-full h-full bg-slate-950 py-12 overflow-y-auto">
                            <QuizContainer 
                                questions={currentLesson.questions ?? []} 
                                timeLimit={currentLesson.timeLimit} // e.g., 300 for 5 mins
                                onFinish={playNextLesson} // Automatically go to next lesson after results
                            />
                        </div>
                    </div>
                    ) : (
                    <>
                        <div className="flex-1 flex items-center justify-center bg-slate-950 relative group ">
                        <VideoTheater 
                            currentLesson={currentLesson}
                            isPlaying={isPlaying}
                            hasInteracted={hasInteracted}
                            onPlayAction={handleInitialPlay}
                            onVideoEnd={playNextLesson}
                            setIsPlaying={setIsPlaying}
                        />
                        </div>

                        {/* Bottom Utility Tabs */}
                        <TabSystem currentLesson={currentLesson} />
                    </>
                        
                    )}
                    
                
            </div>

            {/* --- SIDEBAR (Curriculum) --- */}
            <CurriculumSidebar 
                curriculum={MOCK_CURRICULUM}
                currentLesson={currentLesson}
                allLessons={allLessons}
                onLessonSelect={(lesson) => {
                    setCurrentLesson(lesson);
                    // Ensure that if user selects a lesson, we treat it as an interaction
                    if (!hasInteracted) setHasInteracted(true);
                }}
            />
        </div>
    );
}