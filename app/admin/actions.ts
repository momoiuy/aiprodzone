'use server';

import { revalidatePath } from 'next/cache';

export async function revalidatePlatform() {
  try {
    revalidatePath('/', 'layout');
    revalidatePath('/admin', 'page');
    return { success: true, timestamp: Date.now() };
  } catch (err) {
    console.error('Revalidation error:', err);
    return { success: false, error: String(err) };
  }
}
