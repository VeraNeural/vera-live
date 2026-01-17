'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RestChamber from '@/components/sanctuary/RestChamber';

export default function RestRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialView = searchParams.get('view') ?? undefined;

  const onBack = useCallback(() => {
    router.push('/sanctuary');
  }, [router]);

  return <RestChamber onBack={onBack} initialView={initialView} />;
}
