import { ArrowRight, ShieldCheck, Ticket } from "lucide-react";
import { Link } from "react-router";
import { useCart } from "~/hooks/CartContext";

export const CartSummary = () => {
    const { cart, removeFromCart, clearCart, getTotalPrice } = useCart();
    const totalPrice = getTotalPrice();

    return (
        <div className="card bg-base-100 border border-base-content/10 shadow-xl p-6 sticky top-24 space-y-6 animate-slide-up">
            <h3 className="text-xl font-black italic tracking-tight">Order Summary</h3>
            
            <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold opacity-60">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-success">
                    <span>Discount</span>
                    <span>-$0.00</span>
                </div>
                <div className="divider opacity-5"></div>
                <div className="flex justify-between items-end">
                    <span className="text-xs font-black uppercase opacity-40">Total Amount</span>
                    <span className="text-3xl font-black text-primary">${totalPrice.toFixed(2)}</span>
                </div>
            </div>

            {/* Coupon Code */}
            <div className="join w-full">
                <input className="input input-bordered join-item w-full input-sm font-bold" placeholder="Coupon Code" />
                <button className="btn btn-primary join-item btn-sm font-black uppercase">Apply</button>
            </div>

            <Link to={"/checkout"}>
            <button className="btn btn-primary btn-block h-14 text-lg font-black gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                Checkout Now <ArrowRight size={20} />
            </button>
            </Link>

            <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase opacity-30 tracking-widest">
                <ShieldCheck size={14} /> Secure Checkout 
            </div>
        </div>
    );
};