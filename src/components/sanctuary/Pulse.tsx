'use client';

import { useState, useEffect } from 'react';

interface PulseProps {
  onBack: () => void;
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
    isAnonymous?: boolean;
  };
}

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    isAnonymous?: boolean;
  };
  content: string;
  tags: string[];
  reactions: {
    hug: number;
    strength: number;
    light: number;
    love: number;
  };
  userReaction?: 'hug' | 'strength' | 'light' | 'love' | null;
  commentCount: number;
  createdAt: string;
  mood?: 'hopeful' | 'anxious' | 'grateful' | 'struggling' | 'celebrating' | 'reflecting';
}

const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    author: { id: 'u1', name: 'Anonymous Butterfly', isAnonymous: true },
    content: "Today I finally told someone about my anxiety. It felt like lifting a weight I didn't know I was carrying. To anyone else struggling in silence - you're not alone. 💜",
    tags: ['anxiety', 'breakthrough', 'healing'],
    reactions: { hug: 124, strength: 89, light: 56, love: 203 },
    commentCount: 34,
    createdAt: '2h ago',
    mood: 'hopeful',
  },
  {
    id: '2',
    author: { id: 'u2', name: 'Gentle Soul', isAnonymous: true },
    content: "Small win today: I got out of bed, took a shower, and made breakfast. Some days that's enough. Proud of myself.",
    tags: ['smallwins', 'selfcare', 'progress'],
    reactions: { hug: 89, strength: 156, light: 34, love: 178 },
    commentCount: 21,
    createdAt: '4h ago',
    mood: 'celebrating',
  },
  {
    id: '3',
    author: { id: 'u3', name: 'Night Owl', isAnonymous: true },
    content: "3am thoughts: Healing isn't linear. Yesterday I felt on top of the world. Today I'm back in bed. And that's okay. Tomorrow is a new page.",
    tags: ['healing', 'latenight', 'thoughts'],
    reactions: { hug: 234, strength: 67, light: 123, love: 145 },
    commentCount: 45,
    createdAt: '6h ago',
    mood: 'reflecting',
  },
  {
    id: '4',
    author: { id: 'u4', name: 'Sunrise Seeker', isAnonymous: true },
    content: "Gratitude list:\n☀️ Woke up today\n☕ Had warm coffee\n🌸 Saw a flower blooming\n💌 Got a text from an old friend\n\nWhat are you grateful for?",
    tags: ['gratitude', 'mindfulness', 'positivity'],
    reactions: { hug: 45, strength: 23, light: 189, love: 267 },
    commentCount: 89,
    createdAt: '8h ago',
    mood: 'grateful',
  },
  {
    id: '5',
    author: { id: 'u5', name: 'Quiet Storm', isAnonymous: true },
    content: "To whoever needs to hear this: Your feelings are valid. Your pain is real. And reaching out for help is brave, not weak. We're all in this together. 🤝",
    tags: ['support', 'mentalhealth', 'community'],
    reactions: { hug: 312, strength: 198, light: 156, love: 423 },
    commentCount: 67,
    createdAt: '12h ago',
    mood: 'hopeful',
  },
];

const REACTION_ICONS = {
  hug: { emoji: '🫂', label: 'Hug' },
  strength: { emoji: '💪', label: 'Strength' },
  light: { emoji: '🕯️', label: 'Light' },
  love: { emoji: '💜', label: 'Love' },
};

const MOOD_COLORS = {
  hopeful: { bg: 'rgba(167, 139, 250, 0.15)', border: 'rgba(167, 139, 250, 0.4)', text: '#a78bfa' },
  anxious: { bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.4)', text: '#fbbf24' },
  grateful: { bg: 'rgba(52, 211, 153, 0.15)', border: 'rgba(52, 211, 153, 0.4)', text: '#34d399' },
  struggling: { bg: 'rgba(156, 163, 175, 0.15)', border: 'rgba(156, 163, 175, 0.4)', text: '#9ca3af' },
  celebrating: { bg: 'rgba(251, 113, 133, 0.15)', border: 'rgba(251, 113, 133, 0.4)', text: '#fb7185' },
  reflecting: { bg: 'rgba(96, 165, 250, 0.15)', border: 'rgba(96, 165, 250, 0.4)', text: '#60a5fa' },
};

const TRENDING_TAGS = ['healing', 'anxiety', 'gratitude', 'smallwins', 'support', 'latenight', 'selfcare'];

export default function Pulse({ onBack, currentUser }: PulseProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'discover' | 'notifications'>('feed');
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [showCompose, setShowCompose] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<Post['mood'] | null>(null);
  const [onlineCount] = useState(1247);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  // Floating particles
  const [particles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: 5 + (i * 19) % 90,
      y: 65 + (i * 11) % 30,
      size: 2 + (i % 3),
      duration: 15 + (i * 2) % 10,
      delay: (i * 0.6) % 6,
    }))
  );

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleReaction = (postId: string, reaction: keyof Post['reactions']) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const wasReacted = post.userReaction === reaction;
        return {
          ...post,
          reactions: {
            ...post.reactions,
            [reaction]: wasReacted ? post.reactions[reaction] - 1 : post.reactions[reaction] + 1,
          },
          userReaction: wasReacted ? null : reaction,
        };
      }
      return post;
    }));
  };

  const handlePost = () => {
    if (!newPostContent.trim()) return;
    
    const newPost: Post = {
      id: Date.now().toString(),
      author: currentUser || { id: 'me', name: 'Anonymous Star', isAnonymous: true },
      content: newPostContent,
      tags: [],
      reactions: { hug: 0, strength: 0, light: 0, love: 0 },
      commentCount: 0,
      createdAt: 'Just now',
      mood: selectedMood || undefined,
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setSelectedMood(null);
    setShowCompose(false);
  };

  const filteredPosts = filterTag 
    ? posts.filter(p => p.tags.includes(filterTag))
    : posts;

  return (
    <>
      <style jsx>{`
        .pulse-room {
          min-height: 100vh;
          min-height: 100dvh;
          background: linear-gradient(180deg, 
            #0f0f1a 0%, 
            #151525 30%,
            #1a1a2e 60%, 
            #12121f 100%);
          position: relative;
          overflow-x: hidden;
        }

        /* ============ AMBIENT LAYERS ============ */
        .ambient-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }

        .glow-1 {
          background: radial-gradient(ellipse 50% 40% at 20% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 60%);
        }

        .glow-2 {
          background: radial-gradient(ellipse 40% 50% at 80% 80%, rgba(236, 72, 153, 0.06) 0%, transparent 60%);
        }

        .glow-3 {
          background: radial-gradient(ellipse 60% 30% at 50% 50%, rgba(59, 130, 246, 0.04) 0%, transparent 60%);
        }

        /* ============ PARTICLES ============ */
        .particle {
          position: fixed;
          border-radius: 50%;
          background: rgba(167, 139, 250, 0.4);
          box-shadow: 0 0 6px rgba(167, 139, 250, 0.3);
          animation: floatUp linear infinite;
          pointer-events: none;
        }

        @keyframes floatUp {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 0.6; transform: translateY(80vh) scale(1); }
          90% { opacity: 0.3; }
          100% { transform: translateY(-10vh) scale(0.5); opacity: 0; }
        }

        /* ============ ROOM DECORATION ============ */
        .room-elements {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: ${isLoaded ? 0.35 : 0};
          transition: opacity 1s ease;
        }

        /* World connection lines */
        .connection-lines {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .connection-line {
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(139, 92, 246, 0.3) 50%, 
            transparent 100%);
          animation: pulseLine 4s ease-in-out infinite;
        }

        @keyframes pulseLine {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }

        /* Glowing orbs representing online users */
        .user-orbs {
          position: absolute;
          inset: 0;
        }

        .user-orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, 
            rgba(167, 139, 250, 0.6) 0%, 
            rgba(139, 92, 246, 0.3) 50%, 
            transparent 70%);
          animation: orbPulse 3s ease-in-out infinite;
        }

        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }

        /* ============ HEADER ============ */
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: linear-gradient(180deg, 
            rgba(15, 15, 26, 0.98) 0%, 
            rgba(15, 15, 26, 0.9) 70%,
            transparent 100%);
          padding: calc(env(safe-area-inset-top, 0px) + 12px) 16px 20px;
          backdrop-filter: blur(20px);
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(-2px);
        }

        .online-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 50px;
          background: rgba(52, 211, 153, 0.1);
          border: 1px solid rgba(52, 211, 153, 0.3);
        }

        .online-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 10px rgba(52, 211, 153, 0.6);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        /* Heartbeat line */
        .heartbeat-line {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          overflow: hidden;
        }

        .heartbeat-wave {
          position: absolute;
          top: 0;
          left: -100%;
          width: 200%;
          height: 100%;
          background: linear-gradient(90deg,
            transparent 0%,
            transparent 40%,
            rgba(167, 139, 250, 0.5) 45%,
            rgba(236, 72, 153, 0.8) 50%,
            rgba(167, 139, 250, 0.5) 55%,
            transparent 60%,
            transparent 100%);
          animation: heartbeatWave 2s ease-in-out infinite;
        }

        @keyframes heartbeatWave {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }

        .online-count {
          font-size: 0.85rem;
          color: #34d399;
          font-weight: 500;
        }

        .title-section {
          text-align: center;
          margin-bottom: 16px;
        }

        .title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.8rem;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 4px;
        }

        .subtitle {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Tabs */
        .tabs {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .tab {
          padding: 10px 24px;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: transparent;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tab:hover {
          border-color: rgba(167, 139, 250, 0.4);
          color: rgba(255, 255, 255, 0.9);
        }

        .tab.active {
          background: rgba(167, 139, 250, 0.15);
          border-color: rgba(167, 139, 250, 0.4);
          color: #a78bfa;
        }

        /* ============ MAIN CONTENT ============ */
        .content {
          position: relative;
          z-index: 10;
          padding: calc(env(safe-area-inset-top, 0px) + 180px) 16px 100px;
          max-width: 600px;
          margin: 0 auto;
          opacity: ${isLoaded ? 1 : 0};
          transform: translateY(${isLoaded ? '0' : '20px'});
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        /* ============ TRENDING TAGS ============ */
        .trending-section {
          margin-bottom: 20px;
        }

        .trending-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 10px;
        }

        .trending-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .trending-tag {
          padding: 6px 14px;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .trending-tag:hover {
          background: rgba(167, 139, 250, 0.1);
          border-color: rgba(167, 139, 250, 0.3);
          color: #a78bfa;
        }

        .trending-tag.active {
          background: rgba(167, 139, 250, 0.2);
          border-color: rgba(167, 139, 250, 0.5);
          color: #a78bfa;
        }

        /* ============ FEED ============ */
        .feed {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ============ POST CARD ============ */
        .post-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .post-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 14px;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.4) 0%, 
            rgba(236, 72, 153, 0.4) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
        }

        .author-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .author-name {
          font-size: 0.95rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
        }

        .post-time {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .mood-badge {
          padding: 5px 12px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .post-content {
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 14px;
          white-space: pre-wrap;
        }

        .post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }

        .post-tag {
          padding: 4px 10px;
          border-radius: 50px;
          background: rgba(139, 92, 246, 0.1);
          color: rgba(167, 139, 250, 0.8);
          font-size: 0.75rem;
        }

        .post-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .reactions {
          display: flex;
          gap: 6px;
        }

        .reaction-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 8px 12px;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .reaction-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: scale(1.05);
        }

        .reaction-btn.active {
          background: rgba(167, 139, 250, 0.15);
          border-color: rgba(167, 139, 250, 0.4);
          color: #a78bfa;
        }

        .reaction-emoji {
          font-size: 1rem;
        }

        .comment-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .comment-btn:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        /* ============ COMPOSE BUTTON ============ */
        .compose-fab {
          position: fixed;
          bottom: calc(env(safe-area-inset-bottom, 0px) + 24px);
          right: 24px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border: none;
          color: white;
          font-size: 1.8rem;
          cursor: pointer;
          box-shadow: 
            0 4px 20px rgba(139, 92, 246, 0.4),
            0 0 40px rgba(139, 92, 246, 0.2);
          transition: all 0.3s ease;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .compose-fab:hover {
          transform: scale(1.1);
          box-shadow: 
            0 6px 30px rgba(139, 92, 246, 0.5),
            0 0 60px rgba(139, 92, 246, 0.3);
        }

        /* ============ COMPOSE MODAL ============ */
        .compose-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          z-index: 200;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .compose-modal {
          width: 100%;
          max-width: 600px;
          background: linear-gradient(180deg, #1a1a2e 0%, #151525 100%);
          border-radius: 24px 24px 0 0;
          padding: 24px;
          padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 24px);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .compose-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .compose-title {
          font-size: 1.2rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
        }

        .compose-close {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .compose-close:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .compose-textarea {
          width: 100%;
          min-height: 150px;
          padding: 16px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          line-height: 1.6;
          resize: none;
          margin-bottom: 16px;
          font-family: inherit;
        }

        .compose-textarea::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .compose-textarea:focus {
          outline: none;
          border-color: rgba(167, 139, 250, 0.4);
        }

        .mood-selector {
          margin-bottom: 20px;
        }

        .mood-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 10px;
        }

        .mood-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .mood-option {
          padding: 8px 16px;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: transparent;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: capitalize;
        }

        .mood-option:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }

        .mood-option.selected {
          background: var(--mood-bg);
          border-color: var(--mood-border);
          color: var(--mood-text);
        }

        .compose-submit {
          width: 100%;
          padding: 16px;
          border-radius: 50px;
          border: none;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          color: white;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .compose-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
        }

        .compose-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ============ RESPONSIVE ============ */
        @media (max-width: 768px) {
          .room-elements { opacity: ${isLoaded ? 0.25 : 0}; }
          .content { padding-top: calc(env(safe-area-inset-top, 0px) + 170px); }
        }

        @media (max-width: 480px) {
          .room-elements { opacity: ${isLoaded ? 0.15 : 0}; }
          .title { font-size: 1.5rem; }
          .tab { padding: 8px 16px; font-size: 0.8rem; }
          .post-card { padding: 16px; }
          .reactions { gap: 4px; }
          .reaction-btn { padding: 6px 10px; }
          .compose-fab { width: 54px; height: 54px; right: 16px; bottom: calc(env(safe-area-inset-bottom, 0px) + 16px); }
        }
      `}</style>

      <div className="pulse-room">
        {/* Ambient Layers */}
        <div className="ambient-layer glow-1" />
        <div className="ambient-layer glow-2" />
        <div className="ambient-layer glow-3" />

        {/* Room Decorations */}
        <div className="room-elements">
          {/* Particles */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle"
              style={{
                left: `${p.x}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}

          {/* Connection Lines */}
          <div className="connection-lines">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="connection-line"
                style={{
                  top: `${15 + i * 15}%`,
                  left: `${10 + (i * 7) % 30}%`,
                  width: `${30 + (i * 10) % 40}%`,
                  transform: `rotate(${-15 + i * 8}deg)`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>

          {/* User Orbs */}
          <div className="user-orbs">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="user-orb"
                style={{
                  top: `${10 + (i * 17) % 70}%`,
                  left: `${5 + (i * 23) % 85}%`,
                  width: `${8 + (i % 4) * 4}px`,
                  height: `${8 + (i % 4) * 4}px`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Header */}
        <header className="header">
          {/* Heartbeat Line */}
          <div className="heartbeat-line">
            <div className="heartbeat-wave" />
          </div>
          
          <div className="header-top">
            <button className="back-button" onClick={onBack}>
              <span>←</span>
              <span>Back</span>
            </button>
            <div className="online-indicator">
              <div className="online-dot" />
              <span className="online-count">{onlineCount.toLocaleString()} online</span>
            </div>
          </div>

          <div className="title-section">
            <h1 className="title">Pulse</h1>
            <p className="subtitle">Feel humanity's heartbeat</p>
          </div>

          <div className="tabs">
            <button
              className={`tab ${activeTab === 'feed' ? 'active' : ''}`}
              onClick={() => setActiveTab('feed')}
            >
              Feed
            </button>
            <button
              className={`tab ${activeTab === 'discover' ? 'active' : ''}`}
              onClick={() => setActiveTab('discover')}
            >
              Discover
            </button>
            <button
              className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="content">
          {/* Trending Tags */}
          <div className="trending-section">
            <div className="trending-label">Trending</div>
            <div className="trending-tags">
              {TRENDING_TAGS.map((tag) => (
                <button
                  key={tag}
                  className={`trending-tag ${filterTag === tag ? 'active' : ''}`}
                  onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Feed */}
          <div className="feed">
            {filteredPosts.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-header">
                  <div className="author-info">
                    <div className="avatar">
                      {post.author.isAnonymous ? '✨' : post.author.name[0]}
                    </div>
                    <div className="author-details">
                      <span className="author-name">{post.author.name}</span>
                      <span className="post-time">{post.createdAt}</span>
                    </div>
                  </div>
                  {post.mood && (
                    <span
                      className="mood-badge"
                      style={{
                        background: MOOD_COLORS[post.mood].bg,
                        border: `1px solid ${MOOD_COLORS[post.mood].border}`,
                        color: MOOD_COLORS[post.mood].text,
                      }}
                    >
                      {post.mood}
                    </span>
                  )}
                </div>

                <p className="post-content">{post.content}</p>

                {post.tags.length > 0 && (
                  <div className="post-tags">
                    {post.tags.map((tag) => (
                      <span key={tag} className="post-tag">#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="post-actions">
                  <div className="reactions">
                    {(Object.keys(REACTION_ICONS) as Array<keyof typeof REACTION_ICONS>).map((reaction) => (
                      <button
                        key={reaction}
                        className={`reaction-btn ${post.userReaction === reaction ? 'active' : ''}`}
                        onClick={() => handleReaction(post.id, reaction)}
                      >
                        <span className="reaction-emoji">{REACTION_ICONS[reaction].emoji}</span>
                        <span>{post.reactions[reaction]}</span>
                      </button>
                    ))}
                  </div>
                  <button className="comment-btn">
                    <span>💬</span>
                    <span>{post.commentCount}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Compose FAB */}
        <button className="compose-fab" onClick={() => setShowCompose(true)}>
          +
        </button>

        {/* Compose Modal */}
        {showCompose && (
          <div className="compose-overlay" onClick={() => setShowCompose(false)}>
            <div className="compose-modal" onClick={(e) => e.stopPropagation()}>
              <div className="compose-header">
                <span className="compose-title">Share your signal</span>
                <button className="compose-close" onClick={() => setShowCompose(false)}>×</button>
              </div>

              <textarea
                className="compose-textarea"
                placeholder="What's on your mind? Share your thoughts, wins, or send a signal for support..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                autoFocus
              />

              <div className="mood-selector">
                <div className="mood-label">How are you feeling?</div>
                <div className="mood-options">
                  {(Object.keys(MOOD_COLORS) as Array<keyof typeof MOOD_COLORS>).map((mood) => (
                    <button
                      key={mood}
                      className={`mood-option ${selectedMood === mood ? 'selected' : ''}`}
                      style={{
                        '--mood-bg': MOOD_COLORS[mood].bg,
                        '--mood-border': MOOD_COLORS[mood].border,
                        '--mood-text': MOOD_COLORS[mood].text,
                      } as React.CSSProperties}
                      onClick={() => setSelectedMood(selectedMood === mood ? null : mood)}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="compose-submit"
                onClick={handlePost}
                disabled={!newPostContent.trim()}
              >
                Send to Pulse
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}