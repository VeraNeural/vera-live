'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
    else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
    else setTimeOfDay('night');
  }, []);

  const isDark = timeOfDay === 'evening' || timeOfDay === 'night';

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          const email = session.user.email;
          
          if (!email) {
            console.error('Auth callback: missing email');
            router.push('/login');
            return;
          }

          // Check if user profile exists
          const { data: existingProfile } = await supabase
            .from('users')
            .select('id')
            .eq('id', session.user.id)
            .single();

          // If no profile exists, create one
          if (!existingProfile) {
            await supabase.from('users').insert({
              id: session.user.id,
              email,
              display_name: session.user.user_metadata.full_name || email.split('@')[0] || 'User',
              created_at: new Date().toISOString(),
            });
          }

          // Redirect to sanctuary space
          router.push('/sanctuary/space');
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        router.push('/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <>
      <style jsx>{`
        .callback-page {
          min-height: 100vh;
          min-height: 100dvh;
          background: ${isDark
            ? 'linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0d0d18 100%)'
            : 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #e8e2d8 100%)'};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 24px;
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .loading-orb {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, 
            rgba(255,255,255,0.3) 0%, 
            rgba(139,92,246,0.5) 30%, 
            rgba(139,92,246,0.4) 60%, 
            rgba(124,58,237,0.3) 100%);
          box-shadow: 
            0 0 50px rgba(139,92,246,0.3),
            0 0 100px rgba(139,92,246,0.15);
          animation: pulse 2s ease-in-out infinite;
        }

        .loading-text {
          font-size: 1rem;
          color: ${isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)'};
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }
      `}</style>

      <div className="callback-page">
        <div className="loading-orb" />
        <div className="loading-text">Signing you in...</div>
      </div>
    </>
  );
}