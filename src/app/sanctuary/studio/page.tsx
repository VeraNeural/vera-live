'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import StudioRoom from '@/components/sanctuary/StudioRoom';

export default function StudioRoomPage() {
  const router = useRouter();

  const onBack = useCallback(() => {
    router.push('/sanctuary');
  }, [router]);

  return <StudioRoom onBack={onBack} />;
}
