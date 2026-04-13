import { CircleArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low pt-20 pb-10 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-sm">pets</span>
            </div>
            <span className="font-headline font-bold text-xl tracking-tighter">Paws & Petals</span>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Redefining pet nutrition with love, science, and a touch of petal power. 
            Crafted for the modern pet parent.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-primary mb-6 uppercase tracking-widest text-xs">Shop</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:text-primary transition-colors">Dog Food</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Puppy Special</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Treats</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-primary mb-6 uppercase tracking-widest text-xs">Social</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Facebook</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Newsletter</a></li>
          </ul>
        </div>

        <div className="bg-surface-container-highest p-8 rounded-lg">
          <h4 className="font-bold mb-4">Stay Inspired</h4>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full bg-surface border-none rounded-l-full px-4 py-2 focus:ring-1 focus:ring-primary text-sm"
            />
            <button className="bg-primary text-on-primary px-4 rounded-r-full material-symbols-outlined">
              <CircleArrowRight />
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-outline-variant/30 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
        <span>© 2026 Paws & Petals</span>
        <span>Made with Love for Tails</span>
      </div>
    </footer>
  );
}