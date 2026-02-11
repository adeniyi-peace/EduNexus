import { useRef, useEffect, useState } from "react";
import { Play, Pause, RotateCcw, RotateCw, Maximize, Volume2, VolumeX, SkipForward, Loader2 } from "lucide-react";

interface VideoTheaterProps {
    currentLesson: any;
    isPlaying: boolean;
    hasInteracted: boolean;
    onPlayAction: () => void;
    onVideoEnd: () => void;
    setIsPlaying: (val: boolean) => void;
}

export const VideoTheater = ({ 
    currentLesson, isPlaying, hasInteracted, onPlayAction, onVideoEnd, setIsPlaying 
}: VideoTheaterProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isLoading, setIsLoading] = useState(false); // New Loading State

    // Sync Mute
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);

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

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.load();
            if (hasInteracted) {
                videoRef.current.play().catch(() => console.log("Autoplay blocked"));
            }
        }
    }, [currentLesson, hasInteracted]);

    return (
        <div 
            className="flex-1 flex items-center justify-center bg-slate-950 relative group overflow-hidden"
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            {/* LOADING SPINNER */}
            {isLoading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px]">
                    <div className="relative flex items-center justify-center">
                        <Loader2 className="w-16 h-16 text-primary animate-spin" />
                        <div className="absolute inset-0 w-16 h-16 border-t-2 border-primary rounded-full animate-pulse blur-sm"></div>
                    </div>
                    <span className="mt-4 text-[10px] font-black uppercase tracking-[0.5em] text-primary/80 animate-pulse">
                        Synchronizing...
                    </span>
                </div>
            )}

            <video 
                key={currentLesson.videoUrl} 
                ref={videoRef}
                className="w-full max-h-full aspect-video z-10 cursor-pointer"
                playsInline
                onWaiting={() => setIsLoading(true)}    // Trigger loader
                onCanPlay={() => setIsLoading(false)}   // Hide loader
                onPlaying={() => setIsLoading(false)}   // Fail-safe hide loader
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

            {/* INITIAL OVERLAY */}
            {!hasInteracted && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900">
                    <button onClick={onPlayAction} className="group flex flex-col items-center gap-4 transition-all hover:scale-105">
                        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-content shadow-[0_0_50px_rgba(var(--p),0.3)] group-hover:shadow-primary/60 transition-all border border-white/10">
                            <Play fill="currentColor" size={40} className="ml-2" />
                        </div>
                        <span className="font-black text-[10px] uppercase tracking-[0.5em] text-white/40">Initialize Protocol</span>
                    </button>
                </div>
            )}

            {/* NEXT LESSON OVERLAY */}
            {!isPlaying && hasInteracted && !isLoading && (
                <div className="absolute inset-0 z-45 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md">
                    <div className="text-center p-10 rounded-4xl border border-white/5 bg-white/5 shadow-2xl">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3">Transmission Complete</p>
                        <h3 className="text-2xl font-bold text-white mb-8">{currentLesson.title}</h3>
                        <div className="flex gap-4">
                            <button onClick={togglePlay} className="btn btn-primary rounded-2xl px-10">Resume Node</button>
                            <button onClick={onVideoEnd} className="btn btn-ghost text-white/60 hover:text-white rounded-2xl">Skip Node</button>
                        </div>
                    </div>
                </div>
            )}

            {/* CONTROLS */}
            <div className={`absolute inset-x-0 bottom-0 z-30 p-6 bg-linear-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                
                <div className="relative w-full h-1.5 mb-6 group/progress">
                    <input 
                        type="range" min="0" max="100" value={progress} onChange={handleSeek}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="absolute inset-0 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary shadow-[0_0_15px_rgba(var(--p),0.8)]" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={togglePlay} className="text-white hover:text-primary transition-colors">
                            {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} />}
                        </button>

                        <div className="flex items-center gap-4 text-white/60">
                            <button onClick={() => skip(-10)} className="hover:text-white"><RotateCcw size={20} /></button>
                            <button onClick={() => skip(10)} className="hover:text-white"><RotateCw size={20} /></button>
                        </div>

                        <div className="flex items-center gap-3 group/volume">
                            <button onClick={() => setIsMuted(!isMuted)} className="text-white/60 hover:text-white">
                                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                            <input 
                                type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume}
                                onChange={(e) => {
                                    const newVol = Number(e.target.value);
                                    setVolume(newVol);
                                    if (videoRef.current) videoRef.current.volume = newVol;
                                    if (newVol > 0 && isMuted) setIsMuted(false);
                                }}
                                className="w-0 group-hover/volume:w-20 transition-all duration-300 accent-primary cursor-pointer"
                            />
                        </div>

                        <span className="text-[10px] font-mono text-white/40 tracking-tighter">
                            {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={onVideoEnd} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-primary transition-all">
                            Next Node <SkipForward size={14} />
                        </button>
                        <button onClick={toggleFullscreen} className="text-white/40 hover:text-white">
                            <Maximize size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};