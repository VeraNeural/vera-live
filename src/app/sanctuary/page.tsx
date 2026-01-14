'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import VeraSanctuary from '@/components/sanctuary/VeraSanctuary';

export default function SanctuaryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAccess() {
  console.log('[Sanctuary] Checking access...');
  const supabase = createClient();
  
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  console.log('[Sanctuary] Session:', session, sessionError);
  
  if (!session) {
    console.log('[Sanctuary] No session, redirecting to login');
    router.push('/login?redirect=/sanctuary');
    return;
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('tier')
    .eq('id', session.user.id)
    .single();

  console.log('[Sanctuary] User tier:', user, userError);

  if (user?.tier !== 'sanctuary' && user?.tier !== 'build') {
    console.log('[Sanctuary] Not sanctuary tier, redirecting to upgrade');
    router.push('/upgrade');
    return;
  }

  console.log('[Sanctuary] Authorized!');
  setAuthorized(true);
  setLoading(false);
}

    checkAccess();
  }, [router]);

  // Handle room selection
  function handleRoomSelect(roomId: string) {
    router.push(`/sanctuary/${roomId}`);
  }

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0a0a12',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #c4b5fd, #7c3aed)',
            boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // Not authorized (shouldn't reach here, but safety)
  if (!authorized) {
    return null;
  }

  // Render Sanctuary
  return <VeraSanctuary onRoomSelect={handleRoomSelect} />;
}