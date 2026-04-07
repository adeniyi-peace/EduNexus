import { CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

interface Props {
    email: string;
    amount: number;
    metadata: any; 
    onSuccessAction: () => void;
}

export const PaystackTrigger = ({ email, amount, metadata, onSuccessAction }: Props) => {
    const navigate = useNavigate();
    const [isInitializing, setIsInitializing] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    // Load Paystack script from CDN on mount - This is more reliable than NPM for Paystack in SSR
    useEffect(() => {
        if (typeof window !== "undefined") {
            if ((window as any).PaystackPop) {
                setScriptLoaded(true);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://js.paystack.co/v2/inline.js";
            script.async = true;
            script.onload = () => setScriptLoaded(true);
            script.onerror = () => {
                console.error("Paystack script failed to load. Check ad-blockers.");
                setScriptLoaded(false);
            };
            document.body.appendChild(script);
        }
    }, []);

    const handlePayment = async () => {
        if (!email) return;

        const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
        if (!publicKey) {
            console.error("Paystack Public Key is missing! Check your .env file.");
            alert("Payment initialization failed: Configuration error.");
            return;
        }

        setIsInitializing(true);

        try {
            // Access PaystackPop from the window object (loaded via CDN)
            const PaystackPop = (window as any).PaystackPop;
            
            if (!PaystackPop) {
                throw new Error("Paystack library not found. Please disable any ad-blockers and refresh.");
            }

            const paystack = new PaystackPop();

            paystack.newTransaction({
                key: publicKey, 
                email: email,
                amount: Math.round(amount * 100), // Convert to kobo/cents
                metadata: metadata,
                reference: `EN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                
                onSuccess: (transaction: any) => {
                    setIsInitializing(false);
                    onSuccessAction();
                    navigate(`/checkout/success?reference=${transaction.reference}`);
                },
                onCancel: () => {
                    setIsInitializing(false);
                },
                onError: (error: any) => {
                    setIsInitializing(false);
                    console.error("Paystack Error:", error);
                    alert("Paystack encountered an error during initialization.");
                }
            });
        } catch (error: any) {
            console.error("Failed to initialize Paystack:", error);
            alert(error.message || "Could not initialize the payment processor. Please check your internet connection and disable ad-blockers.");
            setIsInitializing(false);
        }
    };

    return (
        <button 
            onClick={handlePayment}
            type="button"
            disabled={!email || isInitializing || amount <= 0 || !scriptLoaded}
            className="btn btn-primary btn-block h-16 text-lg font-black gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
        >
            {isInitializing ? (
                <>
                    <Loader2 size={22} className="animate-spin" />
                    Initializing...
                </>
            ) : (
                <>
                    <CheckCircle2 size={22} />
                    Pay with Paystack
                </>
            )}
        </button>
    );
};