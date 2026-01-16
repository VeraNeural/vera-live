'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import RestChamber from '@/components/sanctuary/RestChamber';

export default function RestRoomPage() {
  const router = useRouter();

  const onBack = useCallback(() => {
    router.push('/sanctuary');
  }, [router]);

  return <RestChamber onBack={onBack} />;
}
