// src/app/checkout/page.tsx
'use client';

import { useCart } from "@/context/CartContext";
import { ArrowLeft, LogIn, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createOrder } from "@/app/actions/order"; // Import the new Server Action

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false); // New loading state

  useEffect(() => {
    const hasToken = document.cookie.split(';').some((item) => item.trim().startsWith('auth_token='));
    setIsLoggedIn(hasToken);
  }, []);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPlacingOrder(true);

    // Call the server action to save to the database
    const result = await createOrder(cart, totalPrice);

    setIsPlacingOrder(false);

    if (result.error) {
      alert(result.error);
      return;
    }

    alert("Order placed successfully! This has been added to your Journal.");
    clearCart();
    router.push("/account");
  };

  if (cart.length === 0) {
    return (
      <main className="pt-32 pb-16 px-8 flex flex-col items-center justify-center flex-grow">
        <span className="material-symbols-outlined text-6xl text-surface-container-highest mb-4">shopping_basket</span>
        <h1 className="font-headline text-3xl font-bold mb-6">Your bag is empty</h1>
        <Link href="/shop" className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform">
          Back to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-24 min-h-screen flex flex-col lg:flex-row">
      {/* Left Column: Checkout Form */}
      <div className="flex-1 px-8 py-12 lg:px-16 bg-background">
        <header className="mb-12">
          <Link href="/shop" className="text-sm font-bold text-primary flex items-center space-x-2 mb-4 group w-max">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Shop</span>
          </Link>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight">Checkout</h1>
        </header>

        <form onSubmit={handlePlaceOrder} className="space-y-12 max-w-2xl">
          {/* Section: Contact */}
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-primary mb-6">01. Contact Information</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Email Address</label>
                <input type="email" required className="w-full bg-surface-container-low border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all" placeholder="your@email.com" />
              </div>
            </div>
          </section>

          {/* Section: Shipping */}
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-primary mb-6">02. Shipping Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Street Address</label>
                <input type="text" required className="w-full bg-surface-container-low border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">City</label>
                <input type="text" required className="w-full bg-surface-container-low border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Postal Code</label>
                <input type="text" required className="w-full bg-surface-container-low border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all" />
              </div>
            </div>
          </section>

          {/* Section: Payment */}
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-primary mb-6">03. Payment</h2>
            <div className="bg-surface-container-highest/30 p-6 rounded-xl flex items-center space-x-4 border border-outline-variant/20">
              <ShieldCheck className="text-secondary" />
              <p className="text-sm font-medium">Your connection is secure. Tailored encryption active.</p>
            </div>
          </section>

          {/* Mobile Action Button */}
          {isLoggedIn ? (
            <button 
              type="submit" 
              disabled={isPlacingOrder}
              className="w-full lg:hidden py-5 bg-primary text-on-primary rounded-full font-bold text-lg shadow-xl shadow-primary/20 flex items-center justify-center space-x-2 disabled:opacity-70"
            >
              {isPlacingOrder ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <span>Complete Order — ${totalPrice.toFixed(2)}</span>
              )}
            </button>
          ) : (
            <Link href="/login" className="w-full lg:hidden py-5 bg-on-surface text-surface rounded-full font-bold text-lg flex items-center justify-center space-x-2">
              <LogIn size={20} />
              <span>Login to Complete Order</span>
            </Link>
          )}
        </form>
      </div>

      {/* Right Column: Order Summary */}
      <aside className="w-full lg:w-[450px] bg-surface-container-low px-8 py-12 lg:px-12 lg:sticky lg:top-20 h-fit min-h-screen">
        <h2 className="font-headline text-2xl font-bold mb-8">Order Summary</h2>
        
        <div className="space-y-6 mb-10 overflow-y-auto max-h-[40vh] pr-2">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold leading-tight">{item.name}</h4>
                <p className="text-xs text-on-surface-variant font-medium">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-4 pt-6 border-t border-outline-variant/30">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-on-surface-variant">Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span className="text-on-surface-variant">Shipping</span>
            <span className="text-secondary font-bold uppercase tracking-tighter">Calculated Next</span>
          </div>
          <div className="flex justify-between text-xl font-black pt-4">
            <span className="font-headline">Total</span>
            <span className="text-primary font-body">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Desktop Action Button */}
        <div className="mt-10">
          {isLoggedIn ? (
            <button 
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="hidden lg:flex w-full py-5 bg-primary text-on-primary rounded-full font-bold text-lg hover:scale-[1.02] transition-transform shadow-xl shadow-primary/20 items-center justify-center space-x-2 disabled:opacity-70 disabled:hover:scale-100"
            >
              {isPlacingOrder ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <span>Complete Order</span>
              )}
            </button>
          ) : (
            <div className="hidden lg:block p-8 bg-surface-container-highest rounded-3xl border border-outline-variant/20 text-center">
              <h3 className="font-headline font-bold text-lg mb-2">Member Exclusive</h3>
              <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">Please sign in to your editorial profile to finalize your tailored selection.</p>
              <Link href="/login" className="flex items-center justify-center space-x-2 w-full py-4 bg-primary text-on-primary rounded-full font-bold hover:bg-primary-dim transition-colors">
                <LogIn size={18} />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </main>
  );
}