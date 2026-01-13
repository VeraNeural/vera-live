'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import JournalRoom from '@/components/sanctuary/JournalRoom';

type SavedEntry = {
  id: string;
  title: string;
  preview: string;
  date: string;
  mood?: string;
};

type EntryToSave = {
  title: string;
  content: string;
  mood?: string;
  date: string;
};

export default function JournalRoomPage() {
  const router = useRouter();
  const [savedEntries, setSavedEntries] = useState<SavedEntry[]>([]);

  const onBack = useCallback(() => {
    router.push('/sanctuary/space');
  }, [router]);

  const onSaveEntry = useCallback(async (entry: EntryToSave) => {
    const id = `${Date.now()}`;
    const preview = entry.content.trim().slice(0, 140);

    setSavedEntries((prev) => [
      {
        id,
        title: entry.title,
        preview,
        date: entry.date,
        mood: entry.mood,
      },
      ...prev,
    ]);
  }, []);

  return <JournalRoom onBack={onBack} onSaveEntry={onSaveEntry} savedEntries={savedEntries} />;
}
