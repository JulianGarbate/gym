import { prisma } from '@/lib/prisma';

const DEMO_USER_EMAIL = 'demo@gymtracker.app';

/**
 * Placeholder for real auth (Supabase Auth / NextAuth / Clerk).
 * Returns the seeded demo user so the rest of the app has a stable userId.
 */
export async function getCurrentUser() {
  return prisma.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: {},
    create: { email: DEMO_USER_EMAIL, name: 'Demo User' },
  });
}
