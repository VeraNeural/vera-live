import { auth, clerkClient } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function assertAdminOrRedirect() {
  const { userId } = await auth();
  if (!userId) redirect('/sanctuary');

  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  if (!adminEmail) redirect('/sanctuary');

  const user = await (await clerkClient()).users.getUser(userId);
  const email = (user.emailAddresses?.[0]?.emailAddress || '').trim().toLowerCase();

  if (!email || email !== adminEmail) redirect('/sanctuary');
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await assertAdminOrRedirect();

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'radial-gradient(1200px 600px at 20% 10%, rgba(139,92,246,0.16), transparent 60%), #070710',
        color: 'rgba(255,255,255,0.92)',
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
      }}
    >
      <aside
        style={{
          borderRight: '1px solid rgba(255,255,255,0.08)',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>Admin</div>
        <Link
          href="/admin/marketing"
          style={{
            padding: '10px 12px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(255,255,255,0.04)',
            color: 'rgba(255,255,255,0.92)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Marketing
        </Link>
        <Link
          href="/admin/self-healing"
          style={{
            padding: '10px 12px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(255,255,255,0.04)',
            color: 'rgba(255,255,255,0.92)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Self-Healing
        </Link>
        <div style={{ flex: 1 }} />
        <Link
          href="/sanctuary"
          style={{
            padding: '10px 12px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(255,255,255,0.02)',
            color: 'rgba(255,255,255,0.82)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Back to Sanctuary
        </Link>
      </aside>

      <main style={{ padding: 18 }}>{children}</main>
    </div>
  );
}
