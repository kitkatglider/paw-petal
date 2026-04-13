import { openDb } from "@/lib/db";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGallery from "@/components/ProductGallery";

interface ShopProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Shop({ searchParams }: ShopProps) {
  const resolvedParams = await searchParams;
  const flavor = typeof resolvedParams.flavor === 'string' ? resolvedParams.flavor : null;
  
  const db = await openDb();
  
  let query = 'SELECT * FROM products';
  let params: any[] = [];
  
  if (flavor) {
    query += ' WHERE flavor = ?';
    params.push(flavor);
  }

  const products = await db.all(query, params);

  return (
    <main className="pt-24 pb-16 px-8 max-w-7xl mx-auto flex-grow">
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight font-headline mb-4 uppercase">
          Curated <span className="text-primary italic">Nutrition</span>
        </h1>
        <p className="text-on-surface-variant max-w-xl text-lg leading-relaxed">
          {flavor ? `Our premium ${flavor} recipes.` : "Tailored meals for every breed, age, and flavor preference."}
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-12">
        <FilterSidebar />
        {/* Pass the server-fetched products to the client component */}
        <ProductGallery initialProducts={products} />
      </div>
    </main>
  );
}