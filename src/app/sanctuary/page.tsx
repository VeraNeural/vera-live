'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { TrustTransparencySidebar } from '@/components/sidebar';
import { useVeraNavigator } from '@/lib/vera/navigator/hooks/useVeraNavigator';
import { LegalLinks } from '@/components/common/LegalLinks';
import { TimeOfDay, ThemeMode, ConsentStatus, Room, Message, QuickPrompt } from './types';
import { TIME_COLORS, getQuickPrompts, NAV_HINT_ROTATIONS, RoomIcon, ROOMS } from './constants';
import { getTimeOfDay, getGreeting, getVeraGreeting } from './utils';
import { GLOBAL_STYLES } from './styles';
import { ChatInput, QuickPrompts } from './components';

// ============================================================================
// GLOBAL STYLES
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// ============================================================================
// COMPONENT
// ============================================================================
export default function VeraSanctuary() {
  const router = useRouter();
  const { executeCommand } = useVeraNavigator();
  const { user, isLoaded: userLoaded } = useUser();
  const [mounted, setMounted] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');
  const [manualTheme, setManualTheme] = useState<ThemeMode>('auto');
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAllRooms, setShowAllRooms] = useState(false);
  
  // Consent & conversation state
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('unknown');
  const [chatGate, setChatGate] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSidebarOpen(window.innerWidth >= 768);
    }
  }, []);

  // Handle new conversation - reset all state
  const handleNewConversation = () => {
    setMessages([]);
    setInputValue('');
    setIsTyping(false);
    setCurrentConversationId(null);
    setIsFirstMessage(true);
    // Sidebar stays as-is for persistent navigation
    
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  // Handle loading a conversation from history
  const handleLoadConversation = async (conversationId: string) => {
    try {
      const stored = localStorage.getItem('vera-conversations');
      const conversations = stored ? JSON.parse(stored) : [];
      const conversation = conversations.find((c: any) => c.id === conversationId);
      
      if (conversation && conversation.messages) {
        setMessages(conversation.messages);
        setCurrentConversationId(conversationId);
        setIsFirstMessage(false);
        
        // Scroll to bottom after loading
        setTimeout(() => {
          if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      showToast('Failed to load conversation');
    }
  };

  // Save conversation to localStorage
  const saveConversationToStorage = (conversationId: string, messages: Message[]) => {
    try {
      const stored = localStorage.getItem('vera-conversations');
      const conversations = stored ? JSON.parse(stored) : [];
      
      const title = messages.find(m => m.role === 'user')?.content.slice(0, 50) || 'New conversation';
      const now = new Date().toISOString();
      
      const conversation = {
        id: conversationId,
        title,
        messages,
        updated_at: now,
        created_at: conversations.find((c: any) => c.id === conversationId)?.created_at || now,
      };
      
      const existingIndex = conversations.findIndex((c: any) => c.id === conversationId);
      if (existingIndex >= 0) {
        conversations[existingIndex] = conversation;
      } else {
        conversations.unshift(conversation);
      }
      
      // Keep only the 50 most recent conversations
      const trimmed = conversations.slice(0, 50);
      localStorage.setItem('vera-conversations', JSON.stringify(trimmed));
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;

    // Reset height to get accurate scrollHeight
    textarea.style.height = 'auto';
    // Set new height based on content
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;
  }, [inputValue]);

  // Auto-save conversation to localStorage
  useEffect(() => {
    if (messages.length === 0) return;
    
    // Create conversation ID if this is the first message
    if (!currentConversationId) {
      const newId = crypto.randomUUID ? crypto.randomUUID() : `conv-${Date.now()}`;
      setCurrentConversationId(newId);
      saveConversationToStorage(newId, messages);
    } else {
      // Update existing conversation
      saveConversationToStorage(currentConversationId, messages);
    }
  }, [messages, currentConversationId]);

  const [navHint, setNavHint] = useState(() => {
    const idx = Math.floor(Math.random() * NAV_HINT_ROTATIONS.length);
    return NAV_HINT_ROTATIONS[idx] ?? NAV_HINT_ROTATIONS[0];
  });

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, 2200);
  }, []);

  // Check consent status on mount
  useEffect(() => {
    setMounted(true);
    setTimeOfDay(getTimeOfDay());
    const interval = setInterval(() => setTimeOfDay(getTimeOfDay()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Rotate occasionally, but stay stable while the user is typing.
    if (inputValue.trim()) return;

    const id = window.setInterval(() => {
      setNavHint((prev) => {
        if (NAV_HINT_ROTATIONS.length <= 1) return prev;
        let next = prev;
        let attempts = 0;
        while (next === prev && attempts < 6) {
          next = NAV_HINT_ROTATIONS[Math.floor(Math.random() * NAV_HINT_ROTATIONS.length)] ?? prev;
          attempts += 1;
        }
        return next;
      });
    }, 9000);

    return () => window.clearInterval(id);
  }, [inputValue]);

  // Check consent when user is loaded
  useEffect(() => {
    if (!userLoaded || !user) return;
    
    const checkConsent = async () => {
      try {
        const response = await fetch('/api/sanctuary/conversations?action=consent');
        const data = await response.json();
        
        if (data.hasConsented === true) {
          setConsentStatus('granted');
        } else if (data.hasConsented === false) {
          setConsentStatus('denied');
        } else {
          setConsentStatus('unknown'); // Never asked
        }
      } catch (error) {
        console.error('Failed to check consent:', error);
        setConsentStatus('unknown');
      }
    };
    
    checkConsent();
  }, [userLoaded, user]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const isDark = manualTheme === 'dark' ? true : manualTheme === 'light' ? false : (timeOfDay === 'evening' || timeOfDay === 'night');
  const colors = isDark ? TIME_COLORS.evening : TIME_COLORS[timeOfDay];
  const separatorColor = isDark ? 'rgba(235, 210, 180, 0.12)' : 'rgba(140, 110, 80, 0.12)';
  const quickPrompts = getQuickPrompts(timeOfDay);

  // Handle consent response
  const handleConsent = async (consent: boolean) => {
    try {
      await fetch('/api/sanctuary/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'consent', consent }),
      });
      
      setConsentStatus(consent ? 'granted' : 'denied');
      
      // Remove the consent prompt message
      setMessages(prev => prev.filter(m => !m.isConsentPrompt));
      
      // Add VERA's acknowledgment
      const ackMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: consent 
          ? "I'll remember our conversations. Now, tell me more about what brought you here today."
          : "That's completely fine. Our conversations will stay private. Now, tell me more about what brought you here today.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, ackMessage]);
      
    } catch (error) {
      console.error('Failed to save consent:', error);
    }
  };

  // Save message to database
  const saveMessage = async (conversationId: string, role: string, content: string) => {
    if (consentStatus !== 'granted') return;
    
    try {
      await fetch('/api/sanctuary/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'message',
          conversationId,
          role,
          content,
        }),
      });
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  };

  // Create new conversation
  const createConversation = async (firstMessage: string): Promise<string | null> => {
    if (consentStatus !== 'granted') return null;
    
    try {
      const response = await fetch('/api/sanctuary/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          firstMessage,
        }),
      });
      
      const data = await response.json();
      return data.conversation?.id || null;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      return null;
    }
  };

  const handleSend = async (text?: string) => {
    const messageText = (text ?? inputValue).trim();
    if (!messageText) return;

    if (chatGate) {
      showToast(chatGate === 'upgrade_required' ? 'Upgrade to keep chatting today.' : 'Please sign up to keep chatting.');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Intercept command-like messages and route via VERA Navigator
    const navResult = executeCommand(messageText);
    if (navResult?.navigateTo?.room) {
      const { room, view } = navResult.navigateTo;

      const roomLabel = room === 'sanctuary' ? 'Sanctuary' : room === 'back' ? 'Back' : room;
      showToast(`Taking you to ${roomLabel}...`);

      if (navResult.voiceResponse) {
        const localAssistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: navResult.voiceResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, localAssistantMessage]);
      }

      // Optional: speak via /api/narrate if enabled
      const enableCommandTts = process.env.NEXT_PUBLIC_ENABLE_COMMAND_TTS === 'true';
      if (enableCommandTts && navResult.shouldSpeak && navResult.voiceResponse) {
        void (async () => {
          try {
            const resp = await fetch('/api/narrate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: navResult.voiceResponse }),
            });

            if (!resp.ok) return;
            const data = await resp.json();
            const audioUrl: string | undefined = data?.audioUrl;
            if (!audioUrl) return;

            const audio = new Audio(audioUrl);
            await audio.play();
          } catch {
            // best-effort only
          }
        })();
      }

      if (room === 'back') {
        router.push('/sanctuary');
        return;
      }

      const basePath = room === 'sanctuary' ? '/sanctuary' : `/sanctuary/${room}`;
      const targetUrl = view ? `${basePath}?view=${encodeURIComponent(view)}` : basePath;
      router.push(targetUrl);
      return;
    }

    // Normal chat flow
    setIsTyping(true);

    // Check if we need to ask for consent (first message, never asked)
    const shouldAskConsent = isFirstMessage && consentStatus === 'unknown' && user;
    setIsFirstMessage(false);

    // Call VERA API - format messages for /api/chat
    try {
      const formattedMessages = [
        ...messages
          .filter((m) => !m.isConsentPrompt && m.role !== 'system')
          .map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
        { role: 'user' as const, content: messageText },
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedMessages,
        }),
      });

      const data = await response.json();

      if (data?.gate === 'signup_required') {
        setChatGate('signup_required');

        const gateText =
          typeof data?.content === 'string'
            ? data.content
            : "I'm really enjoying our conversation. To keep chatting, create a free account - it only takes a moment. You'll get 20 messages per day.";

        const gateMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: gateText,
          timestamp: new Date(),
        };

        const signupPrompt: Message = {
          id: (Date.now() + 2).toString(),
          role: 'system',
          content: 'signup_prompt',
          timestamp: new Date(),
          isSignupPrompt: true,
        };

        setMessages((prev) => [...prev, gateMessage, signupPrompt]);
        return;
      }

      if (data?.gate === 'upgrade_required') {
        setChatGate('upgrade_required');

        const gateText =
          typeof data?.content === 'string' && data.content.trim().length
            ? data.content
            : "You've used your daily messages. Upgrade to Sanctuary for unlimited access.";

        const gateMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: gateText,
          timestamp: new Date(),
        };

        const upgradePrompt: Message = {
          id: (Date.now() + 2).toString(),
          role: 'system',
          content: 'upgrade_prompt',
          timestamp: new Date(),
          isUpgradePrompt: true,
        };

        setMessages((prev) => [...prev, gateMessage, upgradePrompt]);
        return;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || "I'm here with you. Take your time.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If consent granted, save messages
      if (consentStatus === 'granted') {
        let convId = currentConversationId;

        // Create conversation if needed
        if (!convId) {
          convId = await createConversation(messageText);
          if (convId) setCurrentConversationId(convId);
        }

        // Save both messages
        if (convId) {
          await saveMessage(convId, 'user', messageText);
          await saveMessage(convId, 'assistant', assistantMessage.content);
        }
      }

      // Ask for consent after first exchange if never asked
      if (shouldAskConsent) {
        setTimeout(() => {
          const consentPrompt: Message = {
            id: (Date.now() + 2).toString(),
            role: 'system',
            content: 'consent_prompt',
            timestamp: new Date(),
            isConsentPrompt: true,
          };
          setMessages((prev) => [...prev, consentPrompt]);
          setConsentStatus('pending');
        }, 1000);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm here with you. Sometimes connections falter, but I'm not going anywhere.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRoomClick = (roomId: string) => {
    router.push(`/sanctuary/${roomId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!mounted) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: '#f5f2ed',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 32, height: 32,
          border: '2px solid rgba(150, 130, 110, 0.2)',
          borderTopColor: 'rgba(150, 130, 110, 0.7)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const hasMessages = messages.length > 0;
  const isGated = chatGate === 'signup_required' || chatGate === 'upgrade_required';

  return (
    <>
      <style jsx global>{GLOBAL_STYLES}</style>
      
      {/* Hidden file input for attachments */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.currentTarget.files?.[0];
          e.currentTarget.value = '';
          if (!file) return;
          showToast('Attachment functionality coming soon');
        }}
      />

      <div style={{
        position: 'fixed',
        inset: 0,
        background: colors.bg,
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        paddingLeft: sidebarOpen ? '340px' : '60px',
        transition: 'padding-left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Screen reader announcement for new messages */}
        <div 
          aria-live="assertive" 
          aria-atomic="true"
          className="sr-only"
        >
          {messages.length > 0 && messages[messages.length - 1]?.role === 'assistant' && (
            <span>VERA says: {messages[messages.length - 1]?.content?.slice(0, 200)}</span>
          )}
        </div>

        {/* Toast */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              top: 'max(10px, env(safe-area-inset-top))',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 200,
              padding: '10px 14px',
              borderRadius: 14,
              background: isDark ? 'rgba(20, 16, 28, 0.85)' : 'rgba(255, 255, 255, 0.85)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
              color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(40,35,30,0.9)',
              boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              fontSize: 13,
              fontWeight: 500,
              maxWidth: 'min(92vw, 520px)',
              textAlign: 'center',
            }}
          >
            {toastMessage}
          </div>
        )}

        {/* Ambient Background */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(120vw, 700px)',
            height: 'min(80vh, 500px)',
            background: isDark
              ? 'radial-gradient(ellipse at 50% 30%, rgba(255, 180, 100, 0.08) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at 50% 30%, rgba(255, 220, 180, 0.4) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'gentlePulse 10s ease-in-out infinite',
          }} />
        </div>

        {/* Header */}
        <header style={{
          padding: '12px 16px',
          paddingTop: 'max(12px, env(safe-area-inset-top))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 50,
        }}>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: isDark ? 'rgba(255, 255, 255, 0.5)' : colors.textMuted,
          }}>
            Sanctuary
          </span>

          <div style={{
            display: 'flex',
            gap: 4,
            padding: 4,
            background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
            borderRadius: 20,
          }}>
            {(['light', 'auto', 'dark'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setManualTheme(mode)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 16,
                  border: 'none',
                  background: manualTheme === mode
                    ? (isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.9)')
                    : 'transparent',
                  color: manualTheme === mode ? colors.text : colors.textMuted,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                {mode === 'auto' ? '◐' : mode === 'light' ? '○' : '●'}
              </button>
            ))}
          </div>
        </header>

        <div style={{
          height: 1,
          backgroundColor: separatorColor,
          margin: '8px 16px 12px',
        }} />

        {/* Main Content */}
        <main 
          id="main-content"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            padding: '0 16px',
            paddingBottom: 180,
          }}>
          
          {/* VERA Chat Area */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 600,
            width: '100%',
            margin: '0 auto',
            overflow: 'hidden',
          }}>
            
            {/* Welcome / Chat Messages */}
            <div
              ref={chatRef}
              className="chat-scroll"
              role="log"
              aria-live="polite"
              aria-label="Conversation with VERA"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px 0',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Welcome State (no messages yet) - Centered Layout */}
              {!hasMessages && (
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  animation: 'fadeInUp 0.6s ease-out',
                  padding: '0 20px',
                }}>
                  {/* Greeting Section */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 16,
                    marginBottom: 32,
                  }}>
                    <h1 style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                      fontWeight: 400, // Lighter weight like main page
                      color: isDark ? 'rgba(255, 255, 255, 0.95)' : colors.text,
                      margin: 0,
                      letterSpacing: '-0.01em',
                      lineHeight: 1.1,
                    }}>
                      {getGreeting(timeOfDay)}
                    </h1>
                    
                    <p style={{
                      fontSize: 'clamp(16px, 3vw, 20px)',
                      color: isDark ? 'rgba(255, 255, 255, 0.6)' : colors.textMuted,
                      margin: 0,
                      lineHeight: 1.5,
                      fontWeight: 400,
                    }}>
                      {getVeraGreeting(timeOfDay)}
                    </p>
                  </div>

                  <div style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: separatorColor,
                    margin: '4px 0 20px',
                  }} />

                  {/* Chat Input - Centered (Welcome State Only) */}
                  <div style={{
                    width: '100%',
                    maxWidth: 600,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    marginBottom: 12,
                  }}>
                    <div style={{
                      fontSize: 14,
                      color: isDark ? 'rgba(255, 255, 255, 0.65)' : colors.textMuted,
                      textAlign: 'center',
                      letterSpacing: '0.01em',
                    }}>
                      A quiet place to begin
                    </div>
                    {/* Input Container */}
                    <ChatInput
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      onSend={() => handleSend()}
                      onKeyDown={handleKeyDown}
                      onVoiceClick={() => router.push('/voice')}
                      inputRef={inputRef}
                      fileInputRef={fileInputRef}
                      colors={colors}
                      isDark={isDark}
                      placeholder="Share what's on your mind..."
                    />

                    {/* AI Disclaimer - Removed from here */}
                  </div>

                  <div style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: separatorColor,
                    margin: '4px 0 16px',
                  }} />

                  {/* Quick Prompts - Below Input */}
                  <QuickPrompts
                    prompts={quickPrompts}
                    onSelect={(text) => handleSend(text)}
                    colors={colors}
                    isDark={isDark}
                  />
                </div>
              )}

              {/* Messages */}
              {hasMessages && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {messages.map((message, index) => {
                    // Render signup gate prompt
                    if (message.isSignupPrompt) {
                      return (
                        <div
                          key={message.id}
                          className="message-appear"
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <div style={{
                            maxWidth: '85%',
                            width: 520,
                            padding: '18px 20px',
                            borderRadius: 20,
                            background: colors.cardBg,
                            border: `1px solid ${colors.cardBorder}`,
                            backdropFilter: 'blur(10px)',
                          }}>
                            <div style={{
                              color: colors.text,
                              fontSize: 14,
                              fontWeight: 600,
                              marginBottom: 6,
                              letterSpacing: '-0.01em',
                            }}>
                              Continue chatting
                            </div>

                            <div style={{
                              color: colors.textMuted,
                              fontSize: 13,
                              lineHeight: 1.5,
                              marginBottom: 14,
                            }}>
                              Create a free account to keep chatting. You’ll get 20 messages per day.
                            </div>

                            <div style={{
                              display: 'flex',
                              gap: 10,
                              flexWrap: 'wrap',
                            }}>
                              <button
                                onClick={() => router.push('/signup')}
                                className="prompt-btn"
                                style={{
                                  padding: '10px 20px',
                                  borderRadius: 50,
                                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'}`,
                                  background: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                                  color: 'rgba(0,0,0,0.9)',
                                  fontSize: 14,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                Create free account
                              </button>

                              <button
                                onClick={() => router.push('/login')}
                                className="prompt-btn"
                                style={{
                                  padding: '10px 20px',
                                  borderRadius: 50,
                                  border: `1px solid ${colors.cardBorder}`,
                                  background: 'transparent',
                                  color: colors.text,
                                  fontSize: 14,
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                }}
                              >
                                Log in
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Render upgrade gate prompt
                    if (message.isUpgradePrompt) {
                      return (
                        <div
                          key={message.id}
                          className="message-appear"
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <div
                            style={{
                              maxWidth: '85%',
                              width: 520,
                              padding: '18px 20px',
                              borderRadius: 20,
                              background: colors.cardBg,
                              border: `1px solid ${colors.cardBorder}`,
                              backdropFilter: 'blur(10px)',
                            }}
                          >
                            <div
                              style={{
                                color: colors.text,
                                fontSize: 14,
                                fontWeight: 600,
                                marginBottom: 6,
                                letterSpacing: '-0.01em',
                              }}
                            >
                              Daily limit reached
                            </div>

                            <div
                              style={{
                                color: colors.textMuted,
                                fontSize: 13,
                                lineHeight: 1.5,
                                marginBottom: 14,
                              }}
                            >
                              You've used your daily messages. If you'd like to keep going today, Sanctuary gives you unlimited access.
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                gap: 10,
                                flexWrap: 'wrap',
                              }}
                            >
                              <button
                                onClick={() => router.push('/sanctuary/upgrade')}
                                className="prompt-btn"
                                style={{
                                  padding: '10px 20px',
                                  borderRadius: 50,
                                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'}`,
                                  background: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                                  color: 'rgba(0,0,0,0.9)',
                                  fontSize: 14,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                Upgrade to Sanctuary
                              </button>

                              <button
                                onClick={() => showToast("No rush — you can continue tomorrow.")}
                                className="prompt-btn"
                                style={{
                                  padding: '10px 20px',
                                  borderRadius: 50,
                                  border: `1px solid ${colors.cardBorder}`,
                                  background: 'transparent',
                                  color: colors.text,
                                  fontSize: 14,
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                }}
                              >
                                Continue tomorrow
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Render consent prompt
                    if (message.isConsentPrompt) {
                      return (
                        <div
                          key={message.id}
                          className="message-appear"
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                          }}
                        >
                          <div style={{
                            maxWidth: '85%',
                            padding: '18px 20px',
                            borderRadius: '20px 20px 20px 4px',
                            background: colors.cardBg,
                            border: `1px solid ${colors.cardBorder}`,
                          }}>
                            <p style={{
                              color: colors.text,
                              fontSize: 15,
                              lineHeight: 1.6,
                              marginBottom: 16,
                            }}>
                              Before we continue — would you like me to remember our conversations? 
                              It helps me understand you better over time, but it's completely your choice.
                            </p>

                            <div style={{
                              display: 'flex',
                              gap: 10,
                              flexWrap: 'wrap',
                            }}>
                              <button
                                onClick={() => handleConsent(true)}
                                className="prompt-btn"
                                style={{
                                  padding: '10px 20px',
                                  borderRadius: 50,
                                  border: `1px solid ${isDark ? 'rgba(200, 170, 120, 0.3)' : 'rgba(200, 170, 120, 0.4)'}`,
                                  background: isDark ? 'rgba(200, 170, 120, 0.1)' : 'rgba(200, 170, 120, 0.08)',
                                  color: colors.text,
                                  fontSize: 14,
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                }}
                              >
                                Yes, remember
                              </button>

                              <button
                                onClick={() => handleConsent(false)}
                                className="prompt-btn"
                                style={{
                                  padding: '10px 20px',
                                  borderRadius: 50,
                                  border: `1px solid ${colors.cardBorder}`,
                                  background: 'transparent',
                                  color: colors.textMuted,
                                  fontSize: 14,
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                }}
                              >
                                Keep private
                              </button>
                            </div>

                            <p style={{
                              color: colors.textMuted,
                              fontSize: 12,
                              marginTop: 12,
                              lineHeight: 1.5,
                            }}>
                              You can change this anytime in settings.
                            </p>
                          </div>
                        </div>
                      );
                    }

                    // Render regular message
                    const prev = messages[index - 1];
                    const showRoleSeparator =
                      prev &&
                      (prev.role === 'user' || prev.role === 'assistant') &&
                      (message.role === 'user' || message.role === 'assistant') &&
                      prev.role !== message.role;

                    return (
                      <React.Fragment key={message.id}>
                        {showRoleSeparator && (
                          <div style={{
                            height: 1,
                            backgroundColor: separatorColor,
                            margin: '12px 0',
                          }} />
                        )}
                        <div
                          className="message-appear"
                          style={{
                            display: 'flex',
                            justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                          }}
                        >
                          <div style={{
                            maxWidth: '85%',
                            padding: '14px 18px',
                            borderRadius: message.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                            background: message.role === 'user'
                              ? (isDark 
                                  ? 'rgba(200, 170, 120, 0.3)' 
                                  : 'rgba(160, 130, 90, 0.2)') // More visible
                              : (isDark 
                                  ? 'rgba(255, 255, 255, 0.1)' 
                                  : 'rgba(255, 255, 255, 0.95)'), // More solid white
                            border: message.role === 'user'
                              ? (isDark 
                                  ? '1px solid rgba(200, 170, 120, 0.4)' 
                                  : '1px solid rgba(160, 130, 90, 0.3)') // Stronger border
                              : (isDark 
                                  ? '1px solid rgba(255, 255, 255, 0.15)' 
                                  : '1px solid rgba(0, 0, 0, 0.1)'), // Visible border
                            color: isDark ? 'rgba(255, 250, 240, 0.95)' : 'rgba(35, 30, 25, 0.95)', // Much darker text
                            fontSize: 15,
                            lineHeight: 1.6,
                            boxShadow: isDark 
                              ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
                              : '0 2px 8px rgba(0, 0, 0, 0.08)', // Subtle shadow
                          }}>
                            {message.content}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div 
                      style={{ display: 'flex', justifyContent: 'flex-start' }}
                      role="status"
                      aria-label="VERA is typing"
                    >
                      <div style={{
                        padding: '14px 18px',
                        borderRadius: '20px 20px 20px 4px',
                        background: colors.cardBg,
                        border: `1px solid ${colors.cardBorder}`,
                        display: 'flex',
                        gap: 6,
                      }}
                      aria-hidden="true"
                      >
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: colors.accent,
                              animation: `typing 1.4s infinite ${i * 0.2}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Fixed Bottom Input - Only show when chat has started */}
        {hasMessages && (
          <footer style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 20px',
            paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
            background: colors.bg,
            borderTop: `1px solid ${separatorColor}`,
            zIndex: 100,
          }}>
            <div style={{
              maxWidth: 760,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}>
              
              {/* Input Area */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              {/* Input Container */}
              <ChatInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                onSend={() => handleSend()}
                onKeyDown={handleKeyDown}
                onVoiceClick={() => router.push('/voice')}
                inputRef={inputRef}
                fileInputRef={fileInputRef}
                colors={colors}
                isDark={isDark}
                isGated={isGated}
                placeholder={isGated 
                  ? (chatGate === 'upgrade_required' 
                    ? 'Daily limit reached — upgrade to keep chatting…' 
                    : 'Create a free account to keep chatting…')
                  : "Share what's on your mind..."
                }
              />

              {/* AI Disclaimer */}
              <div style={{
                paddingTop: 12,
                paddingLeft: 20,
                paddingRight: 20,
                borderTop: `1px solid ${colors.cardBorder}`,
                textAlign: 'center',
              }}>
                <p style={{
                  color: isDark ? 'rgba(255, 250, 240, 0.6)' : 'rgba(35, 30, 25, 0.6)', // More visible
                  fontSize: 11,
                  lineHeight: 1.5,
                  margin: 0,
                  fontStyle: 'italic',
                  fontWeight: 500, // Slightly bolder
                }}>
                  VERA is an AI assistant. While she strives for accuracy, please verify important information independently.
                </p>
                <div style={{ marginTop: 8 }}>
                  <LegalLinks isDark={isDark} size="small" />
                </div>
              </div>
            </div>
          </div>
          </footer>
        )}

        {/* Fixed Disclaimer at Bottom - Only show in welcome state */}
        {!hasMessages && (
          <div style={{
            position: 'fixed',
            bottom: 20,
            left: 0,
            right: 0,
            textAlign: 'center',
            padding: '0 20px',
            zIndex: 50,
          }}>
            <p style={{
              color: isDark ? 'rgba(255, 250, 240, 0.6)' : 'rgba(35, 30, 25, 0.6)', // More visible
              fontSize: 12,
              lineHeight: 1.5,
              margin: 0,
              fontWeight: 500, // Slightly bolder
              letterSpacing: '0.01em',
            }}>
              VERA is an AI assistant. While she strives for accuracy, please verify important information independently.
            </p>
            <div style={{ marginTop: 8 }}>
              <LegalLinks isDark={isDark} size="small" />
            </div>
          </div>
        )}

        <TrustTransparencySidebar
          isDark={isDark}
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          onNewConversation={handleNewConversation}
          onLoadConversation={handleLoadConversation}
        />
      </div>
    </>
  );
}