'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import TrustTransparencySidebar from '@/components/TrustTransparencySidebar';
import { useVeraNavigator } from '@/lib/vera/navigator/hooks/useVeraNavigator';

// ============================================================================
// TYPES
// ============================================================================
type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
type ThemeMode = 'light' | 'dark' | 'auto';
type ConsentStatus = 'unknown' | 'pending' | 'granted' | 'denied';

type Room = {
  id: string;
  name: string;
  shortName: string;
  essence: string;
  icon: React.ReactNode;
};

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isConsentPrompt?: boolean;
  isSignupPrompt?: boolean;
  isUpgradePrompt?: boolean;
};

type QuickPrompt = {
  text: string;
  category: 'emotional' | 'practical' | 'explore';
};

// ============================================================================
// SVG ICONS
// ============================================================================
const RoomIcon = ({ type, color, size = 18 }: { type: string; color: string; size?: number }) => {
  const icons: Record<string, React.ReactNode> = {
    'zen': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    'library': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="10" x2="14" y2="10" />
      </svg>
    ),
    'rest': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    ),
    'studio': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    'journal': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="8" y1="8" x2="16" y2="8" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="8" y1="16" x2="12" y2="16" />
      </svg>
    ),
    'ops': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4l2 2" />
      </svg>
    ),
    'headphones': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 18v-6a9 9 0 0118 0v6" />
        <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z" />
      </svg>
    ),
    'mic': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 1a4 4 0 00-4 4v7a4 4 0 008 0V5a4 4 0 00-4-4z" />
        <path d="M19 10v2a7 7 0 01-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
    'send': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
    'more': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="1" fill={color} />
        <circle cx="19" cy="12" r="1" fill={color} />
        <circle cx="5" cy="12" r="1" fill={color} />
      </svg>
    ),
  };
  return icons[type] || null;
};

// ============================================================================
// CONSTANTS
// ============================================================================
const ROOMS: Room[] = [
  { 
    id: 'ops', 
    name: 'Ops', 
    shortName: 'Ops',
    essence: 'Get things moving', 
    icon: <RoomIcon type="ops" color="currentColor" />,
  },
  { 
    id: 'library', 
    name: 'Library', 
    shortName: 'Library',
    essence: 'Discover wisdom', 
    icon: <RoomIcon type="library" color="currentColor" />,
  },
  { 
    id: 'studio', 
    name: 'Design Studio', 
    shortName: 'Studio',
    essence: 'Create beauty', 
    icon: <RoomIcon type="studio" color="currentColor" />,
  },
  { 
    id: 'zen', 
    name: 'Zen Garden', 
    shortName: 'Zen',
    essence: 'Embrace stillness', 
    icon: <RoomIcon type="zen" color="currentColor" />,
  },
  { 
    id: 'journal', 
    name: 'Journal Nook', 
    shortName: 'Journal',
    essence: 'Reflect deeply', 
    icon: <RoomIcon type="journal" color="currentColor" />,
  },
  { 
    id: 'rest', 
    name: 'Rest Chamber', 
    shortName: 'Rest',
    essence: 'Surrender to sleep', 
    icon: <RoomIcon type="rest" color="currentColor" />,
  },
];

const TIME_COLORS = {
  morning: {
    bg: 'linear-gradient(180deg, #f8f5f0 0%, #f0e8dc 30%, #e8dcc8 100%)',
    accent: '#d4a574',
    text: 'rgba(60, 50, 40, 0.9)',
    textMuted: 'rgba(60, 50, 40, 0.5)',
    textDim: 'rgba(60, 50, 40, 0.35)',
    cardBg: 'rgba(255, 255, 255, 0.75)',
    cardBorder: 'rgba(0, 0, 0, 0.06)',
    glow: 'rgba(255, 200, 120, 0.2)',
    inputBg: 'rgba(255, 255, 255, 0.8)',
  },
  afternoon: {
    bg: 'linear-gradient(180deg, #f5f2ed 0%, #ebe3d5 30%, #dfd5c2 100%)',
    accent: '#c49a6c',
    text: 'rgba(55, 45, 35, 0.9)',
    textMuted: 'rgba(55, 45, 35, 0.45)',
    textDim: 'rgba(55, 45, 35, 0.32)',
    cardBg: 'rgba(255, 255, 255, 0.7)',
    cardBorder: 'rgba(0, 0, 0, 0.05)',
    glow: 'rgba(255, 180, 100, 0.15)',
    inputBg: 'rgba(255, 255, 255, 0.75)',
  },
  evening: {
    bg: 'linear-gradient(180deg, #1e1a28 0%, #15121c 50%, #0e0b14 100%)',
    accent: '#c9a87c',
    text: 'rgba(255, 250, 240, 0.9)',
    textMuted: 'rgba(255, 250, 240, 0.45)',
    textDim: 'rgba(255, 250, 240, 0.32)',
    cardBg: 'rgba(255, 255, 255, 0.06)',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    glow: 'rgba(255, 180, 100, 0.08)',
    inputBg: 'rgba(255, 255, 255, 0.08)',
  },
  night: {
    bg: 'linear-gradient(180deg, #0a0810 0%, #06050a 50%, #030305 100%)',
    accent: '#a08060',
    text: 'rgba(255, 250, 245, 0.85)',
    textMuted: 'rgba(255, 250, 245, 0.35)',
    textDim: 'rgba(255, 250, 245, 0.25)',
    cardBg: 'rgba(255, 255, 255, 0.04)',
    cardBorder: 'rgba(255, 255, 255, 0.06)',
    glow: 'rgba(255, 200, 120, 0.05)',
    inputBg: 'rgba(255, 255, 255, 0.06)',
  },
};

const getQuickPrompts = (timeOfDay: TimeOfDay): QuickPrompt[] => {
  // Time-specific prompts - only 3, kept short
  if (timeOfDay === 'morning') {
    return [
      { text: "Set my intentions", category: 'practical' },
      { text: "Feeling anxious", category: 'emotional' },
      { text: "Motivate me", category: 'emotional' },
    ];
  }
  if (timeOfDay === 'afternoon') {
    return [
      { text: "I'm overwhelmed", category: 'emotional' },
      { text: "Need to focus", category: 'practical' },
      { text: "Talk through something", category: 'emotional' },
    ];
  }
  if (timeOfDay === 'evening' || timeOfDay === 'night') {
    return [
      { text: "Help me wind down", category: 'emotional' },
      { text: "Can't stop thinking", category: 'emotional' },
      { text: "Reflect on my day", category: 'practical' },
    ];
  }
  return [
    { text: "I need support", category: 'emotional' },
    { text: "Talk to me", category: 'emotional' },
    { text: "Help me think", category: 'practical' },
  ];
};

const NAV_HINT_ROTATIONS = [
  "Try: 'breathe', 'can't sleep', 'brain dump', 'decode this'",
  "Try: 'can't sleep', 'breathe', 'decode this', 'brain dump'",
  "Try: 'brain dump', 'decode this', 'breathe', 'can't sleep'",
];

// ============================================================================
// GLOBAL STYLES
// ============================================================================
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }
  
  html, body {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
    position: fixed;
    inset: 0;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes gentlePulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 0.9; transform: scale(1.02); }
  }

  @keyframes typing {
    0%, 60%, 100% { opacity: 0.3; }
    30% { opacity: 1; }
  }

  .message-appear {
    animation: fadeIn 0.3s ease-out;
  }

  .prompt-btn {
    transition: all 0.2s ease;
  }
  .prompt-btn:hover {
    transform: translateY(-2px);
  }
  .prompt-btn:active {
    transform: scale(0.98);
  }

  .prompt-scroll {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }
  .prompt-scroll::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
  }

  .hide-scrollbar {
    -ms-overflow-style: none !important;
    scrollbar-width: none !important;
    overflow: -moz-scrollbars-none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
    -webkit-appearance: none !important;
  }
  .hide-scrollbar::-webkit-scrollbar-track {
    background: transparent !important;
  }
  .hide-scrollbar::-webkit-scrollbar-thumb {
    background: transparent !important;
  }

  .room-pill {
    transition: all 0.2s ease;
  }
  .room-pill:hover {
    transform: translateY(-2px);
  }
  .room-pill:active {
    transform: scale(0.96);
  }

  .chat-scroll::-webkit-scrollbar {
    width: 4px;
  }
  .chat-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .chat-scroll::-webkit-scrollbar-thumb {
    background: rgba(150, 140, 130, 0.3);
    border-radius: 4px;
  }

  .input-field:focus {
    outline: none;
  }
`;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

const getGreeting = (time: TimeOfDay): string => {
  switch (time) {
    case 'morning': return 'Good morning';
    case 'afternoon': return 'Good afternoon';
    case 'evening': return 'Good evening';
    case 'night': return 'Welcome back';
  }
};

const getVeraGreeting = (time: TimeOfDay): string => {
  const greetings = {
    morning: [
      "Ready to start fresh?",
      "What's on your mind today?",
      "Let's make today count.",
      "How can I help you this morning?",
      "A new day awaits.",
    ],
    afternoon: [
      "How's your day unfolding?",
      "Taking a moment for yourself?",
      "What's on your mind?",
      "Need a thought partner?",
      "I'm here when you need me.",
    ],
    evening: [
      "How was your day?",
      "Time to decompress?",
      "What's lingering on your mind?",
      "Ready to wind down?",
      "Let's reflect together.",
    ],
    night: [
      "Can't sleep?",
      "I'm here with you.",
      "What's keeping you up?",
      "Need some quiet company?",
      "Let's talk it through.",
    ],
  };
  
  const options = greetings[time];
  return options[Math.floor(Math.random() * options.length)];
};

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
        router.back();
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

      <div style={{
        position: 'fixed',
        inset: 0,
        background: colors.bg,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
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
          {/* Orb - Sidebar Trigger */}
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: 'none',
              background: isDark
                ? 'linear-gradient(145deg, rgba(140, 120, 200, 0.5) 0%, rgba(100, 80, 160, 0.4) 100%)'
                : 'linear-gradient(145deg, rgba(140, 120, 200, 0.6) 0%, rgba(120, 100, 180, 0.5) 100%)',
              boxShadow: isDark
                ? '0 4px 20px rgba(140, 120, 200, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)'
                : '0 4px 20px rgba(140, 120, 200, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            aria-label="Open Trust & Transparency"
          >
            {/* Inner glow */}
            <div style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)',
            }} />
          </button>
          
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: colors.textMuted,
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

        {/* Main Content */}
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: '0 16px',
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
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px 0',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Welcome State (no messages yet) */}
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
                  <h1 style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 'clamp(2.8rem, 12vw, 4rem)',
                    fontWeight: 300,
                    color: colors.text,
                    marginBottom: 16,
                    letterSpacing: '-0.02em',
                  }}>
                    {getGreeting(timeOfDay)}
                  </h1>
                  
                  <p style={{
                    fontSize: 'clamp(16px, 4vw, 20px)',
                    color: colors.textMuted,
                    marginBottom: 40,
                    lineHeight: 1.6,
                  }}>
                    {getVeraGreeting(timeOfDay)}
                  </p>

                  {/* Quick Prompts - Centered Wrap */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 12,
                    maxWidth: 500,
                  }}>
                      {quickPrompts.map((prompt, index) => (
                        <button
                          key={index}
                          className="prompt-btn"
                          onClick={() => handleSend(prompt.text)}
                          style={{
                            padding: '14px 22px',
                            background: colors.cardBg,
                            border: `1px solid ${colors.cardBorder}`,
                            borderRadius: 50,
                            color: colors.text,
                            fontSize: 15,
                            fontWeight: 500,
                            cursor: 'pointer',
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          {prompt.text}
                        </button>
                      ))}
                    </div>
                </div>
              )}

              {/* Messages */}
              {hasMessages && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {messages.map((message) => {
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
                    return (
                      <div
                        key={message.id}
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
                            ? (isDark ? 'rgba(200, 170, 120, 0.25)' : 'rgba(200, 170, 120, 0.2)')
                            : colors.cardBg,
                          border: `1px solid ${message.role === 'user'
                            ? (isDark ? 'rgba(200, 170, 120, 0.3)' : 'rgba(200, 170, 120, 0.25)')
                            : colors.cardBorder}`,
                          color: colors.text,
                          fontSize: 15,
                          lineHeight: 1.6,
                        }}>
                          {message.content}
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <div style={{
                        padding: '14px 18px',
                        borderRadius: '20px 20px 20px 4px',
                        background: colors.cardBg,
                        border: `1px solid ${colors.cardBorder}`,
                        display: 'flex',
                        gap: 6,
                      }}>
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

        {/* Bottom Section - Input + Room Pills */}
        <footer style={{
          padding: '16px 20px',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
          zIndex: 50,
        }}>
          <div style={{
            maxWidth: 640,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            
            {/* Input Area */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 12,
            }}>
              {/* Audio Controls */}
              <button style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                border: `1.5px solid ${colors.cardBorder}`,
                background: colors.cardBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                color: colors.textMuted,
              }}>
                <RoomIcon type="headphones" color="currentColor" size={22} />
              </button>

              <button style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                border: `1.5px solid ${colors.cardBorder}`,
                background: colors.cardBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                color: colors.textMuted,
              }}>
                <RoomIcon type="mic" color="currentColor" size={22} />
              </button>

              {/* Text Input + Hint */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  background: colors.inputBg,
                  border: `1.5px solid ${colors.cardBorder}`,
                  borderRadius: 28,
                  padding: '14px 20px',
                  backdropFilter: 'blur(10px)',
                }}>
                  <textarea
                    ref={inputRef}
                    className="input-field"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      isGated
                        ? chatGate === 'upgrade_required'
                          ? 'Daily limit reached — upgrade to keep chatting…'
                          : 'Create a free account to keep chatting…'
                        : "Share what's on your mind..."
                    }
                    disabled={isGated}
                    rows={1}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      color: colors.text,
                      fontSize: 16,
                      lineHeight: 1.5,
                      resize: 'none',
                      maxHeight: 120,
                      opacity: isGated ? 0.6 : 1,
                    }}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={isGated || !inputValue.trim()}
                    style={{
                      marginLeft: 12,
                      padding: 0,
                      border: 'none',
                      background: 'transparent',
                      cursor: !isGated && inputValue.trim() ? 'pointer' : 'default',
                      opacity: !isGated && inputValue.trim() ? 1 : 0.4,
                      color: colors.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <RoomIcon type="send" color="currentColor" size={24} />
                  </button>
                </div>

                <div style={{
                  color: colors.textDim,
                  fontSize: 12,
                  marginTop: 8,
                  paddingLeft: 20,
                  paddingRight: 20,
                }}>
                  {navHint}
                </div>
              </div>
            </div>

            {/* Room Pills - More Prominent */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
            }}>
              {/* Section Label */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
              }}>
                <div style={{
                  flex: 1,
                  height: 1,
                  background: colors.cardBorder,
                }} />
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: colors.textMuted,
                }}>
                  Explore Rooms
                </span>
                <div style={{
                  flex: 1,
                  height: 1,
                  background: colors.cardBorder,
                }} />
              </div>

              {/* Room Pills Grid */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                flexWrap: 'wrap',
              }}>
                {ROOMS.slice(0, showAllRooms ? ROOMS.length : 5).map((room) => (
                  <button
                    key={room.id}
                    className="room-pill"
                    onClick={() => handleRoomClick(room.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '12px 20px',
                      background: isDark 
                        ? 'rgba(255, 255, 255, 0.08)' 
                        : 'rgba(255, 255, 255, 0.85)',
                      border: `1.5px solid ${isDark 
                        ? 'rgba(255, 255, 255, 0.12)' 
                        : 'rgba(0, 0, 0, 0.08)'}`,
                      borderRadius: 50,
                      cursor: 'pointer',
                      color: colors.text,
                      fontSize: 15,
                      fontWeight: 500,
                      backdropFilter: 'blur(10px)',
                      boxShadow: isDark 
                        ? 'none' 
                        : '0 2px 8px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <span style={{ 
                      display: 'flex', 
                      color: colors.accent,
                      opacity: 0.9,
                    }}>
                      {room.icon}
                    </span>
                    <span>{room.shortName}</span>
                  </button>
                ))}
                
                {!showAllRooms && ROOMS.length > 5 && (
                  <button
                    className="room-pill"
                    onClick={() => setShowAllRooms(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      padding: 0,
                      background: isDark 
                        ? 'rgba(255, 255, 255, 0.08)' 
                        : 'rgba(255, 255, 255, 0.85)',
                      border: `1.5px solid ${isDark 
                        ? 'rgba(255, 255, 255, 0.12)' 
                        : 'rgba(0, 0, 0, 0.08)'}`,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      color: colors.textMuted,
                    }}
                  >
                    <RoomIcon type="more" color="currentColor" size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </footer>

        {/* Trust & Transparency Sidebar */}
        <TrustTransparencySidebar
          isDark={isDark}
          colors={{
            bg: colors.cardBg,
            text: colors.text,
            textMuted: colors.textMuted,
          }}
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
        />
      </div>
    </>
  );
}