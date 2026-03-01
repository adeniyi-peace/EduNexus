import { CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";

interface Props {
    email: string;
    amount: number;
    metadata: any; 
    onSuccessAction: () => void;
}

export const PaystackTrigger = ({ email, amount, metadata, onSuccessAction }: Props) => {
    const navigate = useNavigate();
    const [isInitializing, setIsInitializing] = useState(false);

    const handlePayment = async () => {
        if (!email) return;

        setIsInitializing(true);

        try {
            // FIX: Dynamically import the library only when the button is clicked
            // This ensures it only runs in the browser (client-side)
            const PaystackPop = (await import("@paystack/inline-js")).default;
            const paystack = new PaystackPop();

            paystack.newTransaction({
                key: "pk_test_your_public_key_here", 
                email: email,
                amount: Math.round(amount * 100),
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
                }
            });
        } catch (error) {
            console.error("Failed to load Paystack:", error);
            setIsInitializing(false);
        }
    };

    return (
        <button 
            onClick={handlePayment}
            disabled={!email || isInitializing}
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