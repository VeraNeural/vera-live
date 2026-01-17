'use client';

import { Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RestChamber from '@/components/sanctuary/RestChamber';

function RestRoomPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialView = searchParams.get('view') ?? undefined;

  const onBack = useCallback(() => {
    router.push('/sanctuary');
  }, [router]);

  return <RestChamber onBack={onBack} initialView={initialView} />;
}

export default function RestRoomPage() {
  return (
    <Suspense fallback={null}>
      <RestRoomPageInner />
    </Suspense>
  );
}
