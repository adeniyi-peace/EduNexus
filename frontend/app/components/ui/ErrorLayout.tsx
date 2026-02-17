import { useNavigate } from "react-router";
import { Home, ArrowLeft, RefreshCcw, ShieldAlert, Ghost, ServerCrash } from "lucide-react";

interface Props {
    code: "404" | "403" | "500";
    title: string;
    message: string;
}

export const ErrorLayout = ({ code, title, message }: Props) => {
    const navigate = useNavigate();

    const icons = {
        "404": <Ghost size={80} className="text-primary animate-bounce" />,
        "403": <ShieldAlert size={80} className="text-error animate-pulse" />,
        "500": <ServerCrash size={80} className="text-warning" />,
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-6 text-center">
            <div className="max-w-md w-full">
                {/* Visual Icon */}
                <div className="flex justify-center mb-8">
                    {icons[code]}
                </div>

                {/* Text Content */}
                <h1 className="text-9xl font-black opacity-10 absolute left-1/2 -translate-x-1/2 top-0 select-none">
                    {code}
                </h1>
                <h2 className="text-3xl font-black tracking-tight mb-2 relative z-10">{title}</h2>
                <p className="text-base-content/60 font-medium mb-8 leading-relaxed">
                    {message}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="btn btn-outline gap-2"
                    >
                        <ArrowLeft size={18} /> Go Back
                    </button>
                    <button 
                        onClick={() => navigate("/")} 
                        className="btn btn-primary gap-2 shadow-lg shadow-primary/20"
                    >
                        <Home size={18} /> Return Home
                    </button>
                </div>

                {code === "500" && (
                    <button 
                        onClick={() => window.location.reload()} 
                        className="btn btn-ghost btn-sm mt-8 opacity-50 gap-2"
                    >
                        <RefreshCcw size={14} /> Try Refreshing
                    </button>
                )}
            </div>
        </div>
    );
};