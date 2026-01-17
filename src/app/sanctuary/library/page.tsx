'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LibraryRoom from '@/components/sanctuary/LibraryRoom';

export default function LibraryRoomPage() {
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
