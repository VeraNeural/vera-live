'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import RecalibrationRoom from '@/components/sanctuary/RecalibrationRoom';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export default function RecalibrationRoomPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const userName = 'You';

  const onBack = useCallback(() => {
    router.push('/sanctuary');
  }, [router]);

  const onSendMessage = useCallback(async (message: string) => {
    const content = message.trim();
    if (!content || isGenerating) return;

    const userMessage: ChatMessage = { role: 'user', content };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();

      if (data.gate === 'signup_required') {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: "I'm really enjoying our conversation. Sign up free to keep chatting — it only takes a second.",
          },
        ]);
        return;
      }

      if (data.gate === 'upgrade_required') {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: "You've been doing great work today. Upgrade to Sanctuary for unlimited conversations.",
          },
        ]);
        return;
      }

      const assistantContent = data.message || data.content || data.response;
      if (assistantContent) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: assistantContent,
          },
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having a moment. Could you try again?",
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  }, [messages, isGenerating]);

  return (
    <RecalibrationRoom
      onBack={onBack}
      onSendMessage={onSendMessage}
      messages={messages}
      isGenerating={isGenerating}
      userName={userName}
    />
  );
}
