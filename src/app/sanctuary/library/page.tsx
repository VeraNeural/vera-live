'use client';

import { Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LibraryRoom from '@/components/sanctuary/LibraryRoom';

function LibraryRoomPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialView = searchParams.get('view') ?? undefined;

  const onBack = useCallback(() => {
    router.push('/sanctuary');
  }, [router]);

  return (
    <LibraryRoom
      onBack={onBack}
      initialView={initialView}
      onStartStory={() => {}}
      onStartLesson={() => {}}
      onStartAssessment={() => {}}
    />
  );
}

export default function LibraryRoomPage() {
  return (
    <Suspense fallback={null}>
      <LibraryRoomPageInner />
    </Suspense>
  );
}
