'use client';

import { useRouter } from 'next/navigation';
import OpsRoom from '@/components/sanctuary/OpsRoom';

export default function OpsPage() {
  const router = useRouter();

  return (
    <OpsRoom onBack={() => router.push('/sanctuary')} />
  );
}