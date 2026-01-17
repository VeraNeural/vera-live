'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import OpsRoom from '@/components/sanctuary/OpsRoom';

export default function OpsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialView = searchParams.get('view') ?? undefined;

  return (
    <OpsRoom onBack={() => router.push('/sanctuary')} initialView={initialView} />
  );
}