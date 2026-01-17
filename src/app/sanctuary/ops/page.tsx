'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import OpsRoom from '@/components/sanctuary/OpsRoom';

function OpsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialView = searchParams.get('view') ?? undefined;

  return (
    <OpsRoom onBack={() => router.push('/sanctuary')} initialView={initialView} />
  );
}

export default function OpsPage() {
  return (
    <Suspense fallback={null}>
      <OpsPageInner />
    </Suspense>
  );
}