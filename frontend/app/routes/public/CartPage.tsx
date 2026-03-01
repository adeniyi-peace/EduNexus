import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { CartItem } from "~/components/cart/CartItem";
import { CartSummary } from "~/components/cart/CartSummary";
import { useCart } from "~/hooks/CartContext";

export default function CartPage() {
    const { cart, removeFromCart, clearCart, getTotalPrice } = useCart();
    const totalPrice = getTotalPrice();

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 animate-fade-in text-center px-4">
                <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center text-base-content/20">
                    <ShoppingCart size={48} />
                </div>
                <div>
                    <h2 className="text-3xl font-black tracking-tight">Your cart is empty</h2>
                    <p className="opacity-50 font-medium max-w-xs mx-auto mt-2">
                        Looks like you haven't added any courses to your learning journey yet.
                    </p>
                </div>
                <Link to="/courses" className="btn btn-primary rounded-full px-8 gap-2">
                    <ArrowLeft size={18} /> Browse Courses
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 md:px-8">
            <header className="mb-10">
                <h1 className="text-4xl font-black tracking-tighter italic flex items-center gap-4">
                    Shopping Cart <span className="text-primary opacity-20 text-5xl">/</span>
                </h1>
                <p className="text-sm font-bold opacity-40 uppercase tracking-[0.3em]">You have {cart.length} items</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main List */}
                <div className="lg:col-span-8 space-y-4">
                    {cart.map((item) => (
                        <CartItem key={item.id} course={item} />
                    ))}
                    
                    <Link to="/courses" className="btn btn-ghost btn-sm gap-2 font-black opacity-50 hover:opacity-100 transition-all mt-4">
                        <ArrowLeft size={16} /> Continue Shopping
                    </Link>
                </div>

                {/* Sidebar Summary */}
                <div className="lg:col-span-4">
                    <CartSummary />
                </div>
            </div>
        </div>
    );
}