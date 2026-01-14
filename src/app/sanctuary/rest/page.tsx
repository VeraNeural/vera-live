'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import BedroomRoom from '@/components/sanctuary/BedroomRoom';

export default function RestRoomPage() {
  const router = useRouter();

  const onBack = useCallback(() => {
    router.push('/sanctuary');
  }, [router]);

  return <BedroomRoom onBack={onBack} />;
}
