import { useRef, useEffect, useState, type RefObject, useCallback } from "react";
import { 
    Play, Pause, RotateCcw, RotateCw, Maximize, Minimize, 
    Volume2, Volume1, VolumeX, SkipForward, Loader2 
} from "lucide-react";

interface VideoTheaterProps {
    currentLesson: any;
    isPlaying: boolean;
    hasInteracted: boolean;
    onPlayAction: () => void;
    onVideoEnd: () => void;
    setIsPlaying: (val: boolean) => void;
    videoRef: RefObject<HTMLVideoElement | null>;
}

export const VideoTheater = ({ 
    currentLesson, isPlaying, hasInteracted, onPlayAction, onVideoEnd, setIsPlaying, videoRef 
}: VideoTheaterProps) => {
    
    // UI States
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync Mute & Volume
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
            videoRef.current.volume = volume;
        }
    }, [isMuted, volume, videoRef]);

    // Keyboard Shortcuts (UX Improvement)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!hasInteracted) return;
            
            // Prevent scrolling when using shortcuts
            if (["Space", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
                e.preventDefault();
            }

            switch(e.code) {
                case "Space":
                    togglePlay();
                    break;
                case "ArrowLeft":
                    skip(-10);
                    break;
                case "ArrowRight":
                    skip(10);
                    break;
                case "KeyM":
                    setIsMuted(prev => !prev);
                    break;
                case "KeyF":
                    toggleFullscreen();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [hasInteracted, isPlaying]);

    // Fullscreen Listener (UX Improvement)
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    // Format time helper (Clean Code Improvement)
    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds)) return "0:00";
        const m = Math.floor(timeInSeconds / 60);
        const s = Math.floor(timeInSeconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const total = videoRef.current.duration;
            setProgress((current / total) * 100 || 0);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            const time = (Number(e.target.value) / 100) * videoRef.current.duration;
            videoRef.current.currentTime = time;
            setProgress(Number(e.target.value));
        }
    };

    const skip = useCallback((amount: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime += amount;
        }
    }, [videoRef]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
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

    // Determine appropriate volume icon
    const VolumeIcon = isMuted || volume === 0 
        ? VolumeX 
        : volume < 0.5 
            ? Volume1 
            : Volume2;

    return (
        <div 
            ref={containerRef}
            className="w-full h-full flex items-center justify-center bg-black relative group overflow-hidden select-none"
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            {/* LOADING SPINNER */}
            {isLoading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
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
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <button onClick={onPlayAction} className="group flex flex-col items-center gap-5 transition-transform hover:scale-105 active:scale-95">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-full flex items-center justify-center text-primary-content shadow-[0_0_40px_rgba(var(--p),0.4)] group-hover:shadow-[0_0_60px_rgba(var(--p),0.6)] transition-all border-4 border-white/10">
                            <Play fill="currentColor" size={36} className="ml-2" />
                        </div>
                        <span className="font-bold text-xs uppercase tracking-[0.3em] text-white/80 group-hover:text-white transition-colors">Start Lesson</span>
                    </button>
                </div>
            )}

            {/* NEXT LESSON OVERLAY (End Screen) */}
            {!isPlaying && hasInteracted && !isLoading && Math.abs(progress - 100) < 1 && (
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
                    <div className="text-center p-8 rounded-3xl border border-white/10 bg-white/5 shadow-2xl max-w-md mx-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3">Module Complete</p>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-8 line-clamp-2">{currentLesson.title}</h3>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button onClick={() => { videoRef.current?.play(); }} className="btn btn-outline text-white border-white/20 hover:bg-white hover:text-black rounded-xl w-full sm:w-auto px-6">
                                <RotateCcw size={16} className="mr-2" /> Replay
                            </button>
                            <button onClick={onVideoEnd} className="btn btn-primary text-primary-content rounded-xl w-full sm:w-auto px-6 shadow-[0_0_20px_rgba(var(--p),0.4)]">
                                Next Lesson <SkipForward size={16} className="ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CONTROLS BAR */}
            <div 
                className={`absolute inset-x-0 bottom-0 z-30 pt-24 pb-4 px-4 md:px-6 bg-linear-to-t from-black via-black/80 to-transparent transition-opacity duration-300 ease-in-out ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
                onClick={(e) => e.stopPropagation()} // Prevent clicking controls from pausing video
            >
                {/* Progress Bar */}
                <div className="relative w-full h-1.5 md:h-2 mb-4 group/progress flex items-center cursor-pointer">
                    <input 
                        type="range" min="0" max="100" step="0.1" value={progress} onChange={handleSeek}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="absolute inset-0 bg-white/30 rounded-full overflow-hidden transition-all group-hover/progress:bg-white/40">
                        <div className="h-full bg-primary shadow-[0_0_10px_rgba(var(--p),0.8)]" style={{ width: `${progress}%` }} />
                    </div>
                    {/* Scrub Thumb */}
                    <div 
                        className="absolute h-3 w-3 md:h-4 md:w-4 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform duration-150 z-20 pointer-events-none" 
                        style={{ left: `calc(${progress}% - 6px)` }}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-5">
                        {/* Play/Pause */}
                        <button onClick={togglePlay} className="text-white hover:text-primary transition-colors p-2 hover:bg-white/10 rounded-full">
                            {isPlaying ? <Pause fill="currentColor" size={22} /> : <Play fill="currentColor" size={22} />}
                        </button>

                        {/* Skip Controls */}
                        <div className="flex items-center gap-1 md:gap-2 text-white/80">
                            <button onClick={() => skip(-10)} className="hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors" title="Skip backward 10s">
                                <RotateCcw size={18} />
                            </button>
                            <button onClick={() => skip(10)} className="hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors" title="Skip forward 10s">
                                <RotateCw size={18} />
                            </button>
                        </div>

                        {/* Volume Control */}
                        <div className="flex items-center gap-2 group/volume relative">
                            <button onClick={() => setIsMuted(!isMuted)} className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors">
                                <VolumeIcon size={20} />
                            </button>
                            <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300 ease-in-out flex items-center">
                                <input 
                                    type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume}
                                    onChange={(e) => {
                                        setVolume(Number(e.target.value));
                                        if (Number(e.target.value) > 0) setIsMuted(false);
                                    }}
                                    className="w-20 h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer accent-primary"
                                />
                            </div>
                        </div>

                        {/* Time Display */}
                        <span className="text-xs font-medium text-white/80 font-mono tracking-wide ml-2">
                            {formatTime(videoRef.current?.currentTime || 0)} <span className="opacity-50 mx-1">/</span> {formatTime(duration)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Next Lesson Button */}
                        <button onClick={onVideoEnd} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/70 hover:text-primary hover:bg-white/10 py-2 px-3 rounded-lg transition-all">
                            <span className="hidden sm:inline">Next Lesson</span> <SkipForward size={16} />
                        </button>
                        
                        {/* Fullscreen Toggle */}
                        <button onClick={toggleFullscreen} className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors">
                            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};