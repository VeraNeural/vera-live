'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ZenRoom from '@/components/sanctuary/ZenRoom';

export default function ZenRoomPage() {
  const router = useRouter();

  const onBack = useCallback(() => {
    router.push('/sanctuary');
  }, [router]);

  return <ZenRoom onBack={onBack} />;
}
