'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import LibraryRoom from '@/components/sanctuary/LibraryRoom';

export default function LibraryRoomPage() {
  const router = useRouter();

  const onBack = useCallback(() => {
    router.push('/sanctuary');
  }, [router]);

  return (
    <LibraryRoom
      onBack={onBack}
      onStartStory={() => {}}
      onStartLesson={() => {}}
      onStartAssessment={() => {}}
    />
  );
}
