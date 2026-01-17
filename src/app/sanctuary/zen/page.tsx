'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ZenRoom from '@/components/sanctuary/ZenRoom';

export default function ZenRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialView = searchParams.get('view') ?? undefined;

  const onBack = useCallback(() => {
    router.push('/sanctuary');
  }, [router]);

  return <ZenRoom onBack={onBack} initialView={initialView} />;
}
