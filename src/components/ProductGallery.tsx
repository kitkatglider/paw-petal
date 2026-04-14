'use client';

import { useState } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import AddToCartButton from './AddToCartButton';
import { Product } from '@/types/cart';


export default function ProductGallery({ initialProducts }: { initialProducts: Product[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Client-side filtering logic
  const filteredProducts = initialProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.flavor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1">
      {/* Editorial Search Bar */}
      <div className="relative w-full md:w-80 group mb-12 ml-auto">
        <Search 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" 
          size={18} 
        />
        <input 
          type="text" 
          placeholder="Search our kitchen..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface-container-low border-none rounded-full py-3 pl-12 pr-6 focus:ring-2 focus:ring-primary text-sm font-medium transition-all"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-on-surface-variant italic font-medium">
          <p>No matches found for "{searchQuery}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-[4/5] overflow-hidden rounded-lg bg-surface-container-lowest mb-6 transition-all duration-500 group-hover:editorial-shadow group-hover:-translate-y-2">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-105" 
                />
                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                      {product.badge}
                    </span>
                  </div>
                )}
              </div>
              <div className="px-2">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold font-headline leading-[1.1] max-w-[70%]">{product.name}</h3>
                  <span className="text-lg font-extrabold text-primary">${product.price.toFixed(2)}</span>
                </div>
                <p className="text-[11px] font-black uppercase tracking-widest text-secondary mb-3">{product.flavor}</p>
                <p className="text-sm text-on-surface-variant mb-6 line-clamp-2 leading-relaxed">{product.description}</p>
                <AddToCartButton product={product} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}