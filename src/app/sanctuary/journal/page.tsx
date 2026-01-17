'use client';

import { Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import JournalRoom from '@/components/sanctuary/JournalRoom';

function JournalRoomPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialView = searchParams.get('view') ?? undefined;

  const onBack = useCallback(() => {
    router.push('/sanctuary');
  }, [router]);

  return <JournalRoom onBack={onBack} initialView={initialView} />;
}

export default function JournalRoomPage() {
  return (
    <Suspense fallback={null}>
      <JournalRoomPageInner />
    </Suspense>
  );
}
