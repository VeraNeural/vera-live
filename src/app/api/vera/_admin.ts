import { auth, clerkClient } from '@clerk/nextjs/server';

export async function assertAdminOrThrow(): Promise<{ userId: string; email: string }> {
  const { userId } = await auth();
  if (!userId) throw new Error('unauthorized');

  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  if (!adminEmail) throw new Error('missing_admin_email');

  const user = await (await clerkClient()).users.getUser(userId);
  const email = (user.emailAddresses?.[0]?.emailAddress || '').trim().toLowerCase();
  if (!email || email !== adminEmail) throw new Error('forbidden');

  return { userId, email };
}
