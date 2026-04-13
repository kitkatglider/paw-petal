'use client';

import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();

  return (
    <button 
      onClick={() => addToCart(product)}
      className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-full font-extrabold flex items-center justify-center space-x-2 active:scale-95 transition-transform"
    >
      <span>Add to Cart</span>
    </button>
  );
}