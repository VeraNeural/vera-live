'use client';

import { Suspense, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import StudioRoom from '@/components/sanctuary/StudioRoom';

function StudioCategoryPageInner() {
  const router = useRouter();
  const params = useParams();
  const category = params.category as string;

  const onBack = useCallback(() => {
    router.push('/sanctuary');
  }, [router]);

  return <StudioRoom onBack={onBack} initialCategory={category} />;
}

export default function StudioCategoryPage() {
  return (
    <Suspense fallback={null}>
      <StudioCategoryPageInner />
    </Suspense>
  );
}
