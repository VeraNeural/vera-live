'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import TherapyRoom from '@/components/sanctuary/TherapyRoom';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export default function RecalibrationRoomPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const userName = useMemo(() => 'You', []);

  const onBack = useCallback(() => {
    router.push('/sanctuary');
  }, [router]);

  const onSendMessage = useCallback((message: string) => {
    const content = message.trim();
    if (!content) return;

    setMessages((prev) => [...prev, { role: 'user', content }]);
    setIsGenerating(true);

    // Local-only placeholder response (no backend wired yet)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm here with you. Tell me more about what's coming up right now.",
        },
      ]);
      setIsGenerating(false);
    }, 450);
  }, []);

  return (
    <TherapyRoom
      onBack={onBack}
      onSendMessage={onSendMessage}
      messages={messages}
      isGenerating={isGenerating}
      userName={userName}
    />
  );
}
