'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { parseChatApiEnvelope } from '@/lib/vera/chatEnvelope';
import styles from './VeraHome.module.css';

export default function VeraHome() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [breathPhase, setBreathPhase] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [uiMode, setUiMode] = useState<'landing' | 'chat'>('landing');
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isChatActive = messages.length > 0;

  useEffect(() => {
    setMounted(true);
    
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
    else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
    else setTimeOfDay('night');

    const breathInterval = setInterval(() => {
      setBreathPhase(prev => (prev + 1) % 100);
    }, 80);

    return () => clearInterval(breathInterval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isDark = timeOfDay === 'evening' || timeOfDay === 'night';
  const breathValue = Math.sin(breathPhase * 0.0628) * 0.5 + 0.5;

  const getGreeting = () => {
    switch (timeOfDay) {
      case 'morning': return 'Good morning';
      case 'afternoon': return 'Good afternoon';
      case 'evening': return 'Good evening';
      case 'night': return 'Welcome';
    }
  };

  const explore = [
    { id: 'jobs', label: 'Find a job' },
    { id: 'build', label: 'Build something' },
    { id: 'write', label: 'Write with me' },
    { id: 'research', label: 'Research a topic' },
    { id: 'learn', label: 'Learn a skill' },
    { id: 'design', label: 'Design help' },
    { id: 'business', label: 'Business strategy' },
    { id: 'talk', label: 'Just talk' },
  ];

  const ecosystem = [
    { id: 'sanctuary', name: 'Sanctuary', desc: '7 immersive healing rooms', href: '/sanctuary' },
    { id: 'pulse', name: 'Pulse', desc: 'Community where everyone gets seen', href: '/pulse' },
    { id: 'vds', name: 'VDS Studio', desc: 'Professional design services', href: '/vds' },
    { id: 'edutask', name: 'Edutask', desc: 'Courses and certifications', href: '/edutask' },
    { id: 'therapists', name: 'Therapists', desc: 'Trusted professional support', href: '/therapists' },
    { id: 'partners', name: 'Partners', desc: 'Businesses you can trust', href: '/partners' },
  ];

  const dustPositions = [65, 78, 45, 82, 55, 72, 38, 88, 50, 75, 42, 68];

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    if (uiMode === 'landing') {
      setUiMode('chat');
    }

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: inputValue.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const raw = await response.json();
      const data = parseChatApiEnvelope(raw);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.ui_directive.content,
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const colors = {
    bg: isDark
      ? 'linear-gradient(180deg, #0a0a12 0%, #12121f 40%, #0d0d18 100%)'
      : 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #e8e2d8 100%)',
    text: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(42,42,42,0.8)',
    textMuted: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)',
    textFaint: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(42,42,42,0.4)',
    cardBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.65)',
    cardBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
    windowBg: isDark
      ? 'linear-gradient(180deg, #0a1020 0%, #151535 40%, #0d0d28 100%)'
      : 'linear-gradient(180deg, #d4e8f0 0%, #b8d8e8 30%, #a8d0e0 60%, #c8e0ec 100%)',
    windowFrame: isDark ? '#252540' : '#c8b8a8',
    treeLine: isDark 
      ? 'linear-gradient(180deg, transparent 0%, rgba(20, 35, 30, 0.6) 50%, rgba(15, 30, 25, 0.8) 100%)'
      : 'linear-gradient(180deg, transparent 0%, rgba(100, 130, 100, 0.3) 50%, rgba(80, 110, 80, 0.4) 100%)',
    treeCanopy1: isDark ? 'rgba(30, 50, 40, 0.9)' : 'rgba(80, 110, 80, 0.7)',
    treeCanopy2: isDark ? 'rgba(25, 45, 35, 0.95)' : 'rgba(70, 100, 70, 0.75)',
    treeCanopy3: isDark ? 'rgba(35, 55, 45, 0.85)' : 'rgba(90, 120, 85, 0.65)',
    treeTrunk: isDark ? '#1a1a30' : '#6b7b68',
    beam: isDark
      ? 'linear-gradient(180deg, rgba(100, 120, 200, 0.1) 0%, transparent 70%)'
      : 'linear-gradient(180deg, rgba(255, 252, 245, 0.4) 0%, transparent 70%)',
    dust: isDark ? 'rgba(180, 190, 255, 0.4)' : 'rgba(255, 250, 240, 0.8)',
    floor: isDark
      ? 'linear-gradient(180deg, transparent 0%, rgba(18, 18, 30, 0.5) 50%, rgba(10, 10, 18, 0.8) 100%)'
      : 'linear-gradient(180deg, transparent 0%, rgba(235, 229, 219, 0.5) 50%, rgba(220, 212, 200, 0.7) 100%)',
  };

  if (!mounted) {
    return <div className={styles.loadingScreen} />;
  }

  const cssVars = {
    ['--bg' as any]: colors.bg,
    ['--text' as any]: colors.text,
    ['--text-muted' as any]: colors.textMuted,
    ['--text-faint' as any]: colors.textFaint,
    ['--card-bg' as any]: colors.cardBg,
    ['--card-border' as any]: colors.cardBorder,
    ['--window-bg' as any]: colors.windowBg,
    ['--window-frame' as any]: colors.windowFrame,
    ['--tree-line' as any]: colors.treeLine,
    ['--tree-trunk' as any]: colors.treeTrunk,
    ['--beam-bg' as any]: colors.beam,
    ['--floor' as any]: colors.floor,
    ['--vignette' as any]: `radial-gradient(ellipse at center, transparent 40%, ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.08)'} 100%)`,
    ['--window-inset' as any]: isDark ? 'rgba(100, 120, 200, 0.1)' : 'rgba(255, 255, 255, 0.5)',
    ['--header-bg' as any]: `linear-gradient(to bottom, ${isDark ? 'rgba(10, 10, 18, 0.9)' : 'rgba(248, 246, 242, 0.9)'} 0%, transparent 100%)`,
    ['--beams-opacity' as any]: isDark ? '0.15' : '0.6',
    ['--chat-shadow' as any]: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)',
    ['--eco-icon-bg' as any]: isDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)',
    ['--eco-icon-border' as any]: isDark ? 'rgba(167,139,250,0.8)' : 'rgba(139,92,246,0.7)',
    ['--orb-ring1-color' as any]: `rgba(139, 92, 246, ${0.18 + breathValue * 0.12})`,
    ['--orb-ring1-scale' as any]: `${0.95 + breathValue * 0.07}`,
    ['--orb-ring2-color' as any]: `rgba(139, 92, 246, ${0.08 + breathValue * 0.06})`,
    ['--hero-orb-shadow' as any]: `0 0 ${45 + breathValue * 25}px rgba(139,92,246,${0.3 + breathValue * 0.15}), 0 0 ${90 + breathValue * 45}px rgba(139,92,246,${0.12 + breathValue * 0.08}), inset 0 0 45px rgba(255,255,255,0.15)`,
    ['--hero-orb-scale' as any]: `${1 + breathValue * 0.04}`,
  };

  return (
    <div className={styles.veraHome} data-state={uiMode} style={cssVars as any}>
      
      {/* Vignette */}
      <div className={styles.vignette} />

      {/* Background Elements */}
      <div className={styles.bgElements}>
        {/* Window */}
        <div className={styles.windowArea}>
          <div className={styles.windowFrame}>
            {/* Trees inside window */}
            <div className={styles.windowTrees}>
              {/* Tree Line */}
              <div className={styles.treeLine} />
              
              {/* Trees */}
              {[
                { left: '18%', trunkW: 5, trunkH: 20, canopyW: 30, canopyH: 40, color: colors.treeCanopy1 },
                { left: '45%', trunkW: 7, trunkH: 28, canopyW: 42, canopyH: 52, color: colors.treeCanopy2 },
                { left: '72%', trunkW: 4, trunkH: 16, canopyW: 26, canopyH: 32, color: colors.treeCanopy3 },
              ].map((tree, i) => (
                <div
                  key={i}
                  className={styles.tree}
                  style={
                    {
                      ['--tree-left' as any]: tree.left,
                      ['--trunk-w' as any]: `${tree.trunkW}px`,
                      ['--trunk-h' as any]: `${tree.trunkH}px`,
                      ['--canopy-w' as any]: `${tree.canopyW}px`,
                      ['--canopy-h' as any]: `${tree.canopyH}px`,
                      ['--canopy-bg' as any]: tree.color,
                    } as any
                  }
                >
                  <div className={styles.treeTrunk} />
                  <div className={styles.treeCanopy} />
                </div>
              ))}
            </div>

            {/* Moon */}
            {isDark && <div className={styles.moon} />}

            {/* Mullions */}
            <div className={styles.mullionVertical} />
            <div className={styles.mullionHorizontal} />
          </div>
        </div>

        {/* Light Beams */}
        <div className={styles.beams}>
          {[
            { left: '20%', w: 100, h: '110%', rotate: -12 },
            { left: '45%', w: 70, h: '100%', rotate: -8, opacity: 0.6 },
            { left: '65%', w: 90, h: '105%', rotate: -14, opacity: 0.4 },
          ].map((beam, i) => (
            <div
              key={i}
              className={styles.beam}
              style={
                {
                  ['--beam-left' as any]: beam.left,
                  ['--beam-w' as any]: `${beam.w}px`,
                  ['--beam-h' as any]: beam.h,
                  ['--beam-rotate' as any]: `${beam.rotate}deg`,
                  ['--beam-opacity' as any]: `${beam.opacity ?? 1}`,
                } as any
              }
            />
          ))}
        </div>

        {/* Floor */}
        <div className={styles.floor} />
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logoMark}>
            <span className={styles.logoMarkLetter}>V</span>
          </div>
          <span className={styles.logoText}>VERA</span>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.btnSecondary}>Sign In</button>
          <button className={styles.btnPrimary}>Get Started</button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>

        {!isChatActive && (
          <>
            {/* Hero */}
            <section className={styles.heroSection}>
              <div className={styles.heroText}>
                <h1 className={styles.greeting}>{getGreeting()}</h1>
                <p className={styles.heroSubline}>AI that helps you do anything, your way, your pace</p>
              </div>

              {/* Orb */}
              {!isChatActive && (
                <div
                  onClick={() => router.push('/chat')}
                  className={styles.heroOrb}
                >
                  <div className={styles.heroOrbRingInner} />
                  <div className={styles.heroOrbRingOuter} />
                  <div className={styles.heroOrbCore}>
                    <div className={styles.heroOrbHighlight} />
                  </div>
                  <span className={styles.heroOrbLabel}>Talk to VERA</span>
                </div>
              )}
            </section>

            {/* Explore */}
            {!isChatActive && (
              <section className={styles.section}>
                <p className={styles.sectionLabel}>Explore what VERA can do</p>
                <div className={styles.exploreGrid}>
                  {explore.map((item) => (
                    <div key={item.id} onClick={() => router.push('/chat')} className={styles.exploreItem}>
                      {item.label}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Ecosystem */}
            <section className={styles.section}>
              <p className={styles.sectionLabel}>The VERA Ecosystem</p>
              <div className={styles.ecosystemGrid}>
                {ecosystem.map((space) => (
                  <a
                    key={space.id}
                    href={space.href}
                    className={styles.ecosystemCard}
                    onClick={(e) => {
                      const isExternal =
                        space.href.startsWith('http://') || space.href.startsWith('https://');
                      if (!isExternal) {
                        e.preventDefault();
                        router.push(space.href);
                      }
                    }}
                    target={space.href.startsWith('http://') || space.href.startsWith('https://') ? '_blank' : undefined}
                    rel={space.href.startsWith('http://') || space.href.startsWith('https://') ? 'noreferrer' : undefined}
                  >
                    <div className={styles.ecosystemIconWrap}>
                      <div className={styles.ecosystemIconInner} />
                    </div>
                    <div className={styles.ecosystemName}>{space.name}</div>
                    <div className={styles.ecosystemDesc}>{space.desc}</div>
                  </a>
                ))}
              </div>
            </section>

            {/* Trust */}
            <section className={styles.trustSection}>
              <p className={styles.trustLabel}>Trusted by people who need more than productivity</p>
              <div className={styles.trustStats}>
                {[
                  { value: '50K+', label: 'Conversations' },
                  { value: '4.9', label: 'Rating' },
                  { value: '24/7', label: 'Always here' },
                ].map((stat) => (
                  <div key={stat.label} className={styles.trustStat}>
                    <div className={styles.trustValue}>{stat.value}</div>
                    <div className={styles.trustName}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Chat */}
        <section className={styles.chatSection}>
          {uiMode === 'chat' && messages.length > 0 && (
            <div className={styles.messageList}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.messageRow} ${message.role === 'user' ? styles.messageRowUser : styles.messageRowAssistant}`}
                >
                  <div
                    className={`${styles.messageBubble} ${message.role === 'user' ? styles.messageBubbleUser : styles.messageBubbleAssistant}`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className={styles.loadingRow}>
                  <div className={styles.loadingBubble}>
                    <span className={styles.loadingDots}>...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
          <div className={`${styles.chatContainer} ${isChatActive ? styles.chatContainerActive : ''}`}>
            <input
              type="text"
              placeholder="Ask VERA anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className={styles.chatInput}
            />
            <button onClick={sendMessage} className={styles.chatSubmit}>
              Ask VERA
            </button>
          </div>

          {isChatActive && messages.length === 1 && (
            <div className={styles.chatQuickStarts}>
              <div className={styles.exploreGrid}>
                {explore.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => router.push('/chat')}
                    className={styles.exploreItem}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}