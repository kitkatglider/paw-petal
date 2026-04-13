'use client';

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { LogIn, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <main className="pt-32 pb-20 px-8 flex justify-center items-center flex-grow bg-background">
      <div className="max-w-md w-full">
        {/* Editorial Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-6">
            <ShieldCheck size={32} strokeWidth={1.5} />
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight mb-3 uppercase">
            The Editorial <span className="text-primary italic">Journal</span>
          </h1>
          <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
            Enter your credentials to access your tailored pet nutrition profile.
          </p>
        </header>

        {/* Form Container: Background Shifts instead of lines */}
        <div className="bg-surface-container-low p-10 rounded-[2rem] border border-outline-variant/10">
          
          {state?.error && (
            <div className="mb-8 p-4 bg-error/10 rounded-xl">
              <p className="text-error text-[10px] font-black uppercase tracking-[0.2em] text-center">
                {state.error}
              </p>
            </div>
          )}

          <form action={formAction} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant ml-1">
                Registry Email
              </label>
              <input 
                name="email"
                type="email" 
                required
                disabled={isPending}
                placeholder="alex@tailored.com"
                className="w-full bg-surface border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all disabled:opacity-50" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant ml-1">
                Access Key
              </label>
              <input 
                name="password"
                type="password" 
                required
                disabled={isPending}
                placeholder="••••••••"
                className="w-full bg-surface border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all disabled:opacity-50" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full rounded-full bg-primary py-5 text-on-primary font-bold text-lg flex items-center justify-center space-x-3 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <LogIn size={20} strokeWidth={2.5} />
                  <span>Enter Profile</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Don't have an account? 
              <Link href="/shop" className="text-primary ml-2 hover:underline decoration-2 underline-offset-4">
                Explore the Shop
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}