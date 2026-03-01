import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CourseData } from "~/types/course";

export interface Course {
    id: string | number;
    title: string;
    instructor: string;
    price: number;
    thumbnail: string;
}

interface CartState {
    cart: CourseData [];
    addToCart: (course: CourseData ) => void;
    removeFromCart: (courseId: string | number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
}

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],

            addToCart: (course) => {
                const { cart } = get();
                const exists = cart.find((item) => item.id === course.id);
                if (!exists) {
                    set({ cart: [...cart, course] });
                }
            },

            removeFromCart: (courseId) => {
                const { cart } = get();
                set({ cart: cart.filter((item) => item.id !== courseId) });
            },

            clearCart: () => set({ cart: [] }),

            getTotalPrice: () => {
                const { cart } = get();
                return cart.reduce((sum, item) => sum + item.price, 0);
            },
        }),
        {
            name: "edunexus_cart", // key in localStorage
            storage: createJSONStorage(() => localStorage),
            // This prevents hydration errors during SSR
            skipHydration: true, 
        }
    )
);