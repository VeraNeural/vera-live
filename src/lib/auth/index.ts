import { auth, currentUser } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { validateUserTier } from '@/lib/julija/userTier';

export type AuthUser = {
  userId: string;
  email: string | null;
  isAdmin: boolean;
};

export async function getAuthUser(_request: NextRequest): Promise<AuthUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    null;

  let isAdmin = false;
  const adminListEnv = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (email && adminListEnv.length > 0) {
    isAdmin = adminListEnv.includes(email.toLowerCase());
  } else if (email) {
    const tierInfo = await validateUserTier(userId, email);
    isAdmin = tierInfo.tier === 'admin';
  }

  return { userId, email, isAdmin };
}
