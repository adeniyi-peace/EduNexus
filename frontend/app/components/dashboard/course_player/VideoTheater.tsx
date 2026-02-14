import { useRef, useEffect, useState, type RefObject } from "react";
import { Play, Pause, RotateCcw, RotateCw, Maximize, Volume2, VolumeX, SkipForward, Loader2 } from "lucide-react";

interface VideoTheaterProps {
    currentLesson: any;
    isPlaying: boolean;
    hasInteracted: boolean;
    onPlayAction: () => void;
    onVideoEnd: () => void;
    setIsPlaying: (val: boolean) => void;
    videoRef: RefObject<HTMLVideoElement | null>; // Changed: Recieve Ref
}

export const VideoTheater = ({ 
    currentLesson, isPlaying, hasInteracted, onPlayAction, onVideoEnd, setIsPlaying, videoRef 
}: VideoTheaterProps) => {
    
    // Internal state for UI only
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Sync Mute
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted, videoRef]);

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const total = videoRef.current.duration;
            setProgress((current / total) * 100);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            const time = (Number(e.target.value) / 100) * videoRef.current.duration;
            videoRef.current.currentTime = time;
            setProgress(Number(e.target.value));
        }
    };

    const skip = (amount: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime += amount;
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
        }
    };

    const toggleFullscreen = () => {
        videoRef.current?.requestFullscreen();
    };

    // Auto-load Logic
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.load();
            if (hasInteracted) {
                videoRef.current.play().catch(() => console.log("Autoplay blocked"));
            }
        }
    }, [currentLesson, hasInteracted, videoRef]);

    return (
        <div 
            className="w-full h-full flex items-center justify-center bg-slate-950 relative group overflow-hidden"
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
            onClick={() => setShowControls(true)} // Touch support
        >
            {/* LOADING SPINNER */}
            {isLoading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px]">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </div>
            )}

            <video 
                key={currentLesson.videoUrl} 
                ref={videoRef}
                className="w-full h-full object-contain z-10 cursor-pointer"
                playsInline
                onWaiting={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
                onPlaying={() => setIsLoading(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={onVideoEnd}
                onClick={togglePlay}
                poster="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80"
            >
                <source src={currentLesson.videoUrl} type="video/mp4" />
            </video>

            {/* INITIAL PLAY OVERLAY */}
            {!hasInteracted && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/90">
                    <button onClick={onPlayAction} className="group flex flex-col items-center gap-4 transition-all active:scale-95">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-full flex items-center justify-center text-primary-content shadow-[0_0_50px_rgba(var(--p),0.3)] group-hover:shadow-primary/60 transition-all border border-white/10">
                            <Play fill="currentColor" size={32} className="ml-2" />
                        </div>
                        <span className="font-black text-[10px] uppercase tracking-[0.5em] text-white/40">Start Lesson</span>
                    </button>
                </div>
            )}

            {/* NEXT LESSON OVERLAY (End Screen) */}
            {!isPlaying && hasInteracted && !isLoading && Math.abs(progress - 100) < 1 && (
                <div className="absolute inset-0 z-45 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="text-center p-6 md:p-10 rounded-3xl border border-white/5 bg-white/5 shadow-2xl max-w-sm mx-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3">Module Complete</p>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-8 line-clamp-2">{currentLesson.title}</h3>
                        <div className="flex flex-col md:flex-row gap-4">
                            <button onClick={() => { videoRef.current?.play(); }} className="btn btn-outline text-white border-white/20 hover:bg-white hover:text-black rounded-xl w-full md:w-auto">Replay</button>
                            <button onClick={onVideoEnd} className="btn btn-primary text-primary-content rounded-xl w-full md:w-auto">Next Lesson <SkipForward size={16}/></button>
                        </div>
                    </div>
                </div>
            )}

            {/* CONTROLS BAR */}
            <div className={`absolute inset-x-0 bottom-0 z-30 p-4 md:p-6 bg-linear-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                
                {/* Progress Bar */}
                <div className="relative w-full h-2 md:h-1.5 mb-4 group/progress touch-none">
                    <input 
                        type="range" min="0" max="100" value={progress} onChange={handleSeek}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="absolute inset-0 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-primary shadow-[0_0_15px_rgba(var(--p),0.8)] transition-all duration-100 ease-out" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 md:gap-6">
                        <button onClick={togglePlay} className="text-white hover:text-primary transition-colors p-2 -ml-2">
                            {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} />}
                        </button>

                        <div className="flex items-center gap-4 text-white/60">
                            <button onClick={() => skip(-10)} className="hover:text-white"><RotateCcw size={20} /></button>
                            <button onClick={() => skip(10)} className="hover:text-white"><RotateCw size={20} /></button>
                        </div>

                        {/* Volume Control (Hidden on mobile usually) */}
                        <div className="flex items-center gap-3 group/volume">
                            <button onClick={() => setIsMuted(!isMuted)} className="text-white/60 hover:text-white">
                                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                            <input 
                                type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume}
                                onChange={(e) => {
                                    setVolume(Number(e.target.value));
                                    if (Number(e.target.value) > 0) setIsMuted(false);
                                }}
                                className="w-0 group-hover/volume:w-20 transition-all duration-300 accent-primary cursor-pointer h-1 bg-white/20 rounded-full appearance-none"
                            />
                        </div>

                        <span className="text-[10px] font-mono text-white/40 tracking-tighter">
                            {/* Simple time formatting helper would go here */}
                            {Math.floor((videoRef.current?.currentTime || 0) / 60)}:{(Math.floor((videoRef.current?.currentTime || 0) % 60)).toString().padStart(2, '0')} / 
                            {Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={onVideoEnd} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-primary transition-all p-2">
                            <span className="hidden md:inline">Next</span> <SkipForward size={14} />
                        </button>
                        <button onClick={toggleFullscreen} className="text-white/40 hover:text-white p-2">
                            <Maximize size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};