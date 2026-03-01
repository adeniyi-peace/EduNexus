import { useState } from "react";
import { useCart } from "~/hooks/CartContext";
import { ShieldCheck, Mail, Lock, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { PaystackTrigger } from "~/components/cart/PaystackButton";

export default function CheckoutPage() {
    const { cart, removeFromCart, clearCart, getTotalPrice } = useCart();
    const totalPrice = getTotalPrice();
    const [email, setEmail] = useState("");

    // Prepare metadata for Django (IDs of courses being bought)
    const metadata = {
        course_ids: cart.map(item => item.id),
        custom_fields: [
            { display_name: "Platform", variable_name: "platform", value: "EduNexus" }
        ]
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 md:px-8 animate-fade-in">
            <Link to="/cart" className="btn btn-ghost btn-sm gap-2 mb-8 opacity-50 hover:opacity-100 font-bold">
                <ArrowLeft size={16} /> Back to Cart
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* LEFT: Payment & Details */}
                <div className="lg:col-span-7 space-y-10">
                    <section>
                        <h2 className="text-3xl font-black tracking-tight mb-2">Secure Checkout</h2>
                        <p className="text-sm font-bold opacity-40 uppercase tracking-widest">Complete your enrollment</p>
                    </section>

                    {/* Email Input - Critical for Paystack */}
                    <div className="card bg-base-100 border border-base-content/10 p-8 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                <Mail size={20} />
                            </div>
                            <h3 className="font-black text-lg">Contact Information</h3>
                        </div>
                        <div className="form-control w-full">
                            <label className="label"><span className="label-text font-bold">Email Address</span></label>
                            <input 
                                type="email" 
                                placeholder="name@example.com" 
                                className="input input-bordered w-full bg-base-200/50 focus:border-primary font-bold"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <p className="text-[10px] mt-2 opacity-40 font-bold uppercase italic">
                                We will send your receipt and course access to this email.
                            </p>
                        </div>
                    </div>

                    {/* Payment Provider Card */}
                    <div className="card bg-base-100 border border-base-content/10 p-8 animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                                    <Lock size={20} />
                                </div>
                                <h3 className="font-black text-lg">Payment Method</h3>
                            </div>
                            <div className="flex gap-2 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                                {/* Replace with actual logos if preferred */}
                                <span className="text-[10px] font-black border border-current px-2 py-1 rounded">VISA</span>
                                <span className="text-[10px] font-black border border-current px-2 py-1 rounded">MASTERCARD</span>
                            </div>
                        </div>

                        <PaystackTrigger
                            email={email} 
                            amount={totalPrice} 
                            metadata={metadata}
                            onSuccessAction={clearCart}
                        />

                        <div className="mt-6 flex items-center justify-center gap-4 py-4 border-t border-base-content/5">
                            <ShieldCheck size={24} className="text-success" />
                            <p className="text-[10px] font-black uppercase opacity-40 tracking-widest leading-tight">
                                Secured by Paystack. <br/> Your card details are never stored.
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Summary Sidebar */}
                <div className="lg:col-span-5">
                    <div className="card bg-base-200/50 border border-base-content/5 p-8 sticky top-24">
                        <h3 className="font-black text-xs uppercase opacity-40 tracking-[0.3em] mb-6">Your Order</h3>
                        
                        <div className="space-y-4 mb-8">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <p className="text-sm font-black truncate max-w-50">{item.title}</p>
                                        <p className="text-[10px] font-bold opacity-40 uppercase">{item.instructor}</p>
                                    </div>
                                    <p className="font-black text-sm text-primary">${item.price}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 pt-6 border-t border-base-content/10">
                            <div className="flex justify-between text-xs font-bold opacity-50">
                                <span>Subtotal</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-end pt-2">
                                <span className="text-sm font-black uppercase">Total Amount</span>
                                <span className="text-4xl font-black text-primary tracking-tighter">
                                    ${totalPrice.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}