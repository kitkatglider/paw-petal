'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, Check } from 'lucide-react';

const FLAVORS = ['Wild Salmon', 'Grass-Fed Beef', 'Free-Range Chicken', 'Mixed'];

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFlavor = searchParams.get('flavor');

  const updateFilter = (flavor: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (flavor) {
      params.set('flavor', flavor);
    } else {
      params.delete('flavor');
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-surface-container-low p-8 rounded-lg editorial-shadow">
        <div className="flex items-center space-x-2 mb-8 text-primary">
          <Filter size={18} strokeWidth={3} />
          <h3 className="font-bold text-lg font-headline uppercase tracking-tighter">Refine</h3>
        </div>

        <div className="space-y-8">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4">
              By Flavor
            </h4>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => updateFilter(null)}
                className={`flex items-center justify-between text-sm font-bold transition-colors ${
                  !currentFlavor ? 'text-primary' : 'text-on-surface hover:text-primary'
                }`}
              >
                <span>All Flavors</span>
                {!currentFlavor && <Check size={14} strokeWidth={3} />}
              </button>
              
              {FLAVORS.map((flavor) => (
                <button
                  key={flavor}
                  onClick={() => updateFilter(flavor)}
                  className={`flex items-center justify-between text-sm font-bold transition-colors ${
                    currentFlavor === flavor ? 'text-primary' : 'text-on-surface hover:text-primary'
                  }`}
                >
                  <span>{flavor}</span>
                  {currentFlavor === flavor && <Check size={14} strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          {currentFlavor && (
            <button 
              onClick={() => updateFilter(null)}
              className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-error hover:opacity-70 transition-opacity"
            >
              <X size={12} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}