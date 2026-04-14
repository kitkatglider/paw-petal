'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { openDb } from '@/lib/db'

// In React 19 / Next 15, useActionState passes the previous state as the first argument
export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  let loginSuccessful = false;

  try {
    const db = await openDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (user && user.password === password) {
      const cookieStore = await cookies();
      
      // Store the email in the token for easy order lookup
      cookieStore.set('auth_token', user.email, { 
        httpOnly: false, // False so client components can read it if needed
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 
      });
      
      loginSuccessful = true;
    } else {
      return { error: "Invalid email or password" };
    }
  } catch (err) {
    console.error("Auth Error:", err);
    return { error: "Database connection failed. Please try again." };
  }

  // Redirect must be called outside the try/catch block
  if (loginSuccessful) {
    redirect('/account');
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  redirect('/login');
}