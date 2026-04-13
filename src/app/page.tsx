import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[921px] flex items-center overflow-hidden px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          <div className="lg:col-span-6 z-10">
            <span className="inline-block py-1 px-4 rounded-full bg-secondary-container text-on-secondary-container font-semibold text-sm mb-6 uppercase tracking-widest">
              Premium Nutrition
            </span>
            <h1 className="font-headline text-6xl md:text-8xl font-extrabold tracking-tight leading-[0.9] mb-8">
              The Gold Standard for <span className="text-primary italic">Happy</span> Tails.
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-lg mb-10 leading-relaxed">
              Elevate your pet's lifestyle with chef-curated recipes designed by top veterinarians and pet nutritionists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop" className="rounded-full bg-gradient-to-r from-primary to-primary-container px-10 py-5 text-on-primary font-bold text-lg hover:scale-105 transition-transform duration-200 shadow-xl shadow-primary/20 text-center">
                Shop Now
              </Link>
              <button className="rounded-full bg-surface-container-lowest px-10 py-5 text-primary font-bold text-lg hover:scale-105 transition-transform duration-200 editorial-shadow">
                Our Story
              </button>
            </div>
          </div>
          <div className="lg:col-span-6 relative">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
            <div className="relative rounded-lg overflow-hidden editorial-shadow transform rotate-2">
              <img alt="Happy Golden Retriever" className="w-full h-[600px] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCevZ5uPhD_vTyjawzQomjXKNs8mzzSfSZWGp6yEhrmEvQkWjTdAyJDfWyza0gKsLF4AjCNSK2FmtdIVEurQbczg2fs6iTsZaxEiGW534r3b-1GzaYHmVkjw8VwIjyRb_bY34_eIn0TJyWIWWPmNB-fb-kKKKOx6CmBVRESrJMrZasq7KuLz9lRHnucn2D_SlqXOkTzsutbXCh3ng68a6ARtAUrgC5KHPb3hoFoJIRMn4s6jhDQwnA-cIIEiwlW_32kWjBTes76Lcqe" />
            </div>
          </div>
        </div>
      </section>

      {/* Insert Value Props & Featured Products sections here (Converting class -> className) */}
      
    </main>
  );
}