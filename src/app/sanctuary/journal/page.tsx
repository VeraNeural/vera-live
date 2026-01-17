'use client';

import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import JournalRoom from '@/components/sanctuary/JournalRoom';

export default function JournalRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialView = searchParams.get('view') ?? undefined;

  const onBack = useCallback(() => {
    router.push('/sanctuary');
  }, [router]);

  return <JournalRoom onBack={onBack} initialView={initialView} />;
}
