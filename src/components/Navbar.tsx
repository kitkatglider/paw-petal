'use client';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { totalItems } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for auth_token on the client side
  useEffect(() => {
    const hasToken = document.cookie.split(';').some((item) => item.trim().startsWith('auth_token='));
    setIsLoggedIn(hasToken);
  }, []);
  
  return (
    <nav className="bg-white fixed top-0 left-0 right-0 z-50 glass-nav border-b border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary">pets</span>
          </div>
          <span className="font-headline font-extrabold text-2xl tracking-tighter">
            Paws <span className="text-primary">&</span> Petals
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center space-x-10">
          <Link href="/shop" className="font-bold hover:text-primary transition-colors">Shop</Link>
          <Link href="#" className="font-bold hover:text-primary transition-colors">Benefits</Link>
          <Link href="#" className="font-bold hover:text-primary transition-colors">Reviews</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-6">
          <Link href={isLoggedIn ? "/account" : "/login"} className="material-symbols-outlined text-2xl hover:text-primary transition-colors">
            <UserRound />
          </Link>
          <Link href="/checkout" className="material-symbols-outlined text-2xl hover:text-primary transition-colors">
            <button className="relative material-symbols-outlined text-2xl hover:text-primary transition-colors">
              <ShoppingCart />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-in zoom-in duration-300">
                  {totalItems}
                </span>
              )}
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}