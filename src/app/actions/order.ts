// src/app/actions/order.ts
'use server'

import { cookies } from 'next/headers';
import { openDb } from '@/lib/db';

export async function createOrder(cartItems: any[], totalPrice: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');

  if (!token?.value) {
    return { error: 'Authentication required to place an order.' };
  }

  const userEmail = token.value;
  
  // Create an editorial-friendly date string (e.g., "October 24, 2024")
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const itemsJson = JSON.stringify(cartItems);

  try {
    const db = await openDb();
    await db.run(
      'INSERT INTO orders (user_email, total, date, items) VALUES (?, ?, ?, ?)',
      [userEmail, totalPrice, date, itemsJson]
    );
    return { success: true };
  } catch (error) {
    console.error('Failed to save order:', error);
    return { error: 'Unable to process order at this time. Please try again.' };
  }
}