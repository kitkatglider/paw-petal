import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { openDb } from '@/lib/db';
import { logout } from '@/app/actions/auth';
import { Package, Calendar, ArrowRight, LogOut } from 'lucide-react';

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');

  // Protect the route
  if (!token?.value) {
    redirect('/login');
  }

  const userEmail = token.value;
  const db = await openDb();
  
  // Fetch orders specific to the logged-in user
  const orders = await db.all('SELECT * FROM orders WHERE user_email = ? ORDER BY id DESC', [userEmail]);

  return (
    <main className="pt-32 pb-20 px-8 max-w-5xl mx-auto flex-grow w-full">
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">
            Profile
          </span>
          <h1 className="font-headline text-5xl font-extrabold tracking-tight">Purchase History</h1>
          <p className="text-on-surface-variant mt-4 text-lg italic">
            Welcome back, <span className="font-bold">{userEmail}</span>
          </p>
        </div>
        
        <form action={logout}>
          <button type="submit" className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-error transition-colors">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </form>
      </header>

      {orders.length === 0 ? (
        <div className="bg-surface-container-low p-20 rounded-[2rem] text-center">
          <Package className="mx-auto text-outline-variant mb-6" size={48} strokeWidth={1.5} />
          <p className="font-bold text-lg text-on-surface mb-2">Your journal is currently empty.</p>
          <p className="text-on-surface-variant text-sm max-w-md mx-auto">Explore our curated selections and begin your companion's tailored nutrition journey.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="group bg-surface-container-low rounded-[2rem] p-8 transition-all hover:-translate-y-1 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-full flex items-center justify-center">
                  <Calendar size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-2xl font-headline">Order #{order.id}</h3>
                  <p className="text-sm text-on-surface-variant font-medium mt-1">{order.date || "Recent"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-12">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-1">Investment</p>
                  <p className="font-extrabold text-2xl">${order.total.toFixed(2)}</p>
                </div>
                <button className="w-14 h-14 rounded-full border border-outline-variant flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-on-primary transition-all">
                  <ArrowRight size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}