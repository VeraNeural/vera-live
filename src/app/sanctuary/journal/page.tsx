'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import JournalRoom from '@/components/sanctuary/JournalRoom';

export default function JournalRoomPage() {
  const router = useRouter();

  const onBack = useCallback(() => {
    router.push('/sanctuary');
  }, [router]);

  return <JournalRoom onBack={onBack} />;
}
