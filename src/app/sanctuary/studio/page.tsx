'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import StudioRoom from '@/components/sanctuary/StudioRoom';

type SavedProject = {
  id: string;
  name: string;
  thumbnail?: string;
  lastEdited: string;
};

export default function StudioRoomPage() {
  const router = useRouter();
  const [savedProjects] = useState<SavedProject[]>([]);

  const onBack = useCallback(() => {
    router.push('/sanctuary/space');
  }, [router]);

  const onLaunchVDS = useCallback(() => {
    router.push('/vds');
  }, [router]);

  return (
    <StudioRoom
      onBack={onBack}
      onLaunchVDS={onLaunchVDS}
      onOpenProject={() => {}}
      onSelectTemplate={() => {}}
      savedProjects={savedProjects}
    />
  );
}
