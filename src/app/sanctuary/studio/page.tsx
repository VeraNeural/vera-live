'use client';

import { Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import StudioRoom from '@/components/sanctuary/StudioRoom';

function StudioRoomPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialView = searchParams.get('view') ?? undefined;

  const onBack = useCallback(() => {
    router.push('/sanctuary');
  }, [router]);

  return <StudioRoom onBack={onBack} initialView={initialView} />;
}

export default function StudioRoomPage() {
  return (
    <Suspense fallback={null}>
      <StudioRoomPageInner />
    </Suspense>
  );
}
