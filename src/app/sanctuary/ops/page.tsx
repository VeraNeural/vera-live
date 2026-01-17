'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import OpsRoom from '@/components/sanctuary/OpsRoom';

function OpsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const view = searchParams.get('view') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const activity = searchParams.get('activity') ?? undefined;
  const option = searchParams.get('option') ?? undefined;

  return (
    <OpsRoom 
      onBack={() => router.push('/sanctuary')} 
      initialView={view}
      initialCategory={category}
      initialActivity={activity}
      initialOption={option}
    />
  );
}

export default function OpsPage() {
  return (
    <Suspense fallback={null}>
      <OpsPageInner />
    </Suspense>
  );
}