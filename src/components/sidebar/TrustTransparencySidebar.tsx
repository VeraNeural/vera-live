"use client";

import { useEffect, useMemo, useState } from 'react';
import { useClerk, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Target,
  Sparkles,
  Moon,
  BookOpen,
  Palette,
  Library,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Shield,
  Brain,
  Trash2,
  MessageCircle,
  Briefcase,
  DollarSign,
  Heart,
  Wand2,
  Lock,
} from 'lucide-react';
import { opsRoom } from '@/app/sanctuary/ops/consolidatedData';
import { PrivacySettingsModal } from '@/components/settings/PrivacySettingsModal';

type TrustTransparencySidebarProps = {
  isDark: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNewConversation?: () => void;
  onLoadConversation?: (conversationId: string) => void;
};

type AccessTier = 'anonymous' | 'free' | 'forge' | 'sanctuary';

// Map icon strings from data to Lucide components
const categoryIcons: Record<string, React.ElementType> = {
  'message-circle': MessageCircle,
  'clipboard-list': Briefcase,
  'dollar-sign': DollarSign,
  'brain': Brain,
  'heart': Heart,
  'sparkles': Wand2,
};

const SPACES = [
  { 
    id: 'zen', 
    name: 'Zen', 
    icon: Sparkles, 
    path: '/sanctuary/zen',
    activities: [
      { id: 'breathe', name: 'Breathe', path: '/sanctuary/zen?view=breathe' },
      { id: 'orient', name: 'Orient', path: '/sanctuary/zen?view=orient' },
      { id: 'shake', name: 'Shake', path: '/sanctuary/zen?view=shake' },
      { id: 'ground', name: 'Ground', path: '/sanctuary/zen?view=ground' },
    ]
  },
  { 
    id: 'rest', 
    name: 'Rest', 
    icon: Moon, 
    path: '/sanctuary/rest',
    activities: [
      { id: 'soundscapes', name: 'Soundscapes', path: '/sanctuary/rest?view=soundscapes' },
      { id: 'stories', name: 'Sleep Stories', path: '/sanctuary/rest?view=stories' },
      { id: 'meditations', name: 'Meditations', path: '/sanctuary/rest?view=meditations' },
    ]
  },
  { 
    id: 'journal', 
    name: 'Journal', 
    icon: BookOpen, 
    path: '/sanctuary/journal',
    activities: []
  },
  { 
    id: 'studio', 
    name: 'Studio', 
    icon: Palette, 
    path: '/sanctuary/studio',
    activities: [
      { id: 'art-and-drawing', name: 'Art & Drawing', path: '/sanctuary/studio/art-and-drawing' },
      { id: 'mindful-crafts', name: 'Mindful Crafts', path: '/sanctuary/studio/mindful-crafts' },
      { id: 'build-and-create', name: 'Build & Create', path: '/sanctuary/studio/build-and-create' },
      { id: 'free-expression', name: 'Free Expression', path: '/sanctuary/studio/free-expression' },
      { id: 'sound-and-vibe', name: 'Sound & Vibe', path: '/sanctuary/studio/sound-and-vibe' },
      { id: 'written-release', name: 'Written Release', path: '/sanctuary/studio/written-release' },
      { id: 'body-expression', name: 'Body Expression', path: '/sanctuary/studio/body-expression' },
    ]
  },
  { 
    id: 'library', 
    name: 'Library', 
    icon: Library, 
    path: '/sanctuary/library',
    activities: [
      { id: 'discover', name: 'Discover', path: '/sanctuary/library?view=discover' },
      { id: 'learn', name: 'Learn', path: '/sanctuary/library?view=learn' },
      { id: 'stories', name: 'Stories', path: '/sanctuary/library?view=stories' },
    ]
  },
];

export default function TrustTransparencySidebar({
  isDark,
  open,
  onOpenChange,
  onNewConversation,
  onLoadConversation,
}: TrustTransparencySidebarProps) {
  const router = useRouter();
  const [opsExpanded, setOpsExpanded] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [spacesExpanded, setSpacesExpanded] = useState(false);
  const [expandedSpace, setExpandedSpace] = useState<string | null>(null);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [trustExpanded, setTrustExpanded] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const { isLoaded, isSignedIn, user } = useUser();
  const clerk = useClerk();

  // Format relative time helper
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const [serverTier, setServerTier] = useState<AccessTier | null>(null);

  useEffect(() => {
    if (!open) return;
    let isMounted = true;
    const fetchTier = async () => {
      try {
        const res = await fetch('/api/user/tier');
        const data = await res.json();
        const tier = typeof data?.tier === 'string' ? data.tier.toLowerCase() : 'free';
        if (!isMounted) return;
        if (tier === 'sanctuary' || tier === 'forge' || tier === 'free' || tier === 'anonymous') {
          setServerTier(tier as AccessTier);
        } else {
          setServerTier('free');
        }
      } catch {
        if (isMounted) setServerTier(null);
      }
    };
    fetchTier();
    return () => {
      isMounted = false;
    };
  }, [open]);

  const accessTier: AccessTier = useMemo(() => {
    if (serverTier) return serverTier;
    if (!isLoaded || !isSignedIn) return 'anonymous';
    const md = (user?.publicMetadata ?? {}) as Record<string, unknown>;
    const rawTier = md.accessTier as unknown;
    if (typeof rawTier === 'string') {
      const v = rawTier.trim().toLowerCase();
      if (v === 'sanctuary') return 'sanctuary';
      if (v === 'forge') return 'forge';
      if (v === 'free') return 'free';
    }
    return 'free';
  }, [serverTier, isLoaded, isSignedIn, user?.publicMetadata]);

  // Load conversations from localStorage
  useEffect(() => {
    if (!open) return;
    const loadConversations = () => {
      try {
        const stored = localStorage.getItem('vera-conversations');
        const conversations = stored ? JSON.parse(stored) : [];
        setConversations(conversations.slice(0, 10)); // Show only 10 most recent
      } catch (error) {
        console.error('Failed to load conversations:', error);
        setConversations([]);
      }
    };
    loadConversations();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange]);

  const handleDeleteAll = () => {
    try {
      localStorage.removeItem('vera-conversations');
      setConversations([]);
    } catch (error) {
      console.error('Failed to delete conversations:', error);
    }
  };

  const navigate = (path: string) => {
    router.push(path);
    onOpenChange(false);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleSpace = (spaceId: string) => {
    setExpandedSpace(expandedSpace === spaceId ? null : spaceId);
  };

  // Theme colors
  const colors = {
    bg: isDark 
      ? 'linear-gradient(180deg, rgba(18, 16, 24, 0.99) 0%, rgba(12, 10, 18, 0.99) 100%)'
      : 'linear-gradient(180deg, #ffffff 0%, #faf9f7 100%)', // Clean white, not beige
    border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
    text: isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(20, 20, 20, 0.9)', // Strong contrast
    textMuted: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 30, 30, 0.85)', // Clearly readable
    textSecondary: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(30, 30, 30, 0.5)', // Secondary text
    textDim: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(30, 30, 30, 0.3)',
    textHover: isDark ? '#ffffff' : '#000000', // Full contrast on hover
    accent: isDark ? '#e8d5b5' : '#8b6914', // Golden accent, readable
    accentBg: isDark ? 'rgba(200, 160, 100, 0.15)' : 'rgba(180, 140, 90, 0.12)',
    accentBorder: isDark ? 'rgba(200, 160, 100, 0.4)' : 'rgba(180, 140, 90, 0.35)',
    hover: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
    card: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
  };

  const canAccessForge = accessTier === 'forge' || accessTier === 'sanctuary';
  const forgeLabel = canAccessForge ? 'Forge' : 'Forge — Build with VERA';
  const separatorColor = isDark ? 'rgba(235, 210, 180, 0.12)' : 'rgba(140, 110, 80, 0.12)';

  return (
    <>
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
        width: open ? '340px' : '60px',
        maxWidth: open ? '340px' : '60px',
        background: colors.bg,
        borderRight: `1px solid ${colors.border}`,
        boxShadow: isDark
          ? '2px 0 12px rgba(0, 0, 0, 0.15)'
          : '2px 0 12px rgba(0, 0, 0, 0.05)',
        transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
        {/* Header */}
        <div style={{
          padding: open ? '20px 20px 16px' : '16px 12px',
          borderBottom: `1px solid ${colors.border}`,
          minHeight: '76px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-start' : 'center',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: open ? '16px' : '0',
            gap: '8px',
          }}>
            <div 
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: open ? 24 : 18,
                fontWeight: 700,
                color: isDark ? '#ffffff' : '#1a1a1a',
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}>
              {open ? 'VERA' : 'V'}
            </div>
            <button
              onClick={() => onOpenChange(!open)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
                background: 'transparent',
                color: colors.textSecondary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 150ms ease',
              }}
              title={open ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: open ? '16px 12px' : '16px 8px',
        }}>
          {/* New Conversation */}
          {open && (
            <button
              onClick={() => {
                if (onNewConversation) {
                  onNewConversation();
                }
                navigate('/sanctuary');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                background: 'transparent',
                border: '1.5px solid #d4a574',
                color: '#8b7355',
                fontWeight: 500,
                fontSize: 14,
                padding: '12px 16px',
                borderRadius: 12,
                cursor: 'pointer',
                transition: 'all 200ms ease',
                marginBottom: '12px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#faf6f1';
                e.currentTarget.style.borderColor = '#c9b896';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = '#d4a574';
              }}
            >
              <Plus size={18} />
              New conversation
            </button>
          )}
          
          {/* ============================================================ */}
          {/* FOCUS SECTION - WITH NESTED CATEGORIES AND ACTIVITIES */}
          {/* ============================================================ */}
          <div style={{ marginBottom: '8px' }}>
            <button
              onClick={() => {
                if (!open) {
                  onOpenChange(true);
                  return;
                }
                setOpsExpanded(!opsExpanded);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: open ? 'space-between' : 'center',
                width: '100%',
                fontSize: 14,
                fontWeight: 700,
                color: colors.text,
                textTransform: 'none',
                letterSpacing: '0.01em',
                padding: open ? '12px 16px' : '12px 8px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'background-color 150ms ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title={!open ? 'Focus' : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: open ? '10px' : '0' }}>
                <Target size={18} style={{ opacity: isDark ? 0.8 : 0.7, color: 'currentColor', width: 18, height: 18 }} />
                {open && <span>Focus</span>}
              </div>
              {open && (opsExpanded ? <ChevronDown size={16} style={{ opacity: isDark ? 0.8 : 0.7, color: 'currentColor' }} /> : <ChevronRight size={16} style={{ opacity: isDark ? 0.8 : 0.7, color: 'currentColor' }} />)}
            </button>

            {/* Categories from consolidatedData.ts */}
            {open && opsExpanded && (
              <div style={{ marginLeft: '12px', marginTop: '4px' }}>
                {opsRoom.categories.map((category) => {
                  const CategoryIcon = categoryIcons[category.icon] || MessageCircle;
                  const isCategoryExpanded = expandedCategory === category.id;

                  return (
                    <div key={category.id} style={{ marginBottom: '2px' }}>
                      {/* Category Header */}
                      <button
                        onClick={() => toggleCategory(category.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          fontSize: 14,
                          fontWeight: 500,
                          color: colors.textMuted,
                          padding: '10px 16px 10px 40px',
                          borderRadius: 8,
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.hover;
                          e.currentTarget.style.color = colors.textHover;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = colors.textMuted;
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CategoryIcon size={18} style={{ opacity: isDark ? 0.8 : 0.7, color: 'currentColor', width: 18, height: 18 }} />
                          <span>{category.name}</span>
                        </div>
                        {isCategoryExpanded ? (
                          <ChevronDown size={14} style={{ opacity: isDark ? 0.8 : 0.7, color: 'currentColor' }} />
                        ) : (
                          <ChevronRight size={14} style={{ opacity: isDark ? 0.8 : 0.7, color: 'currentColor' }} />
                        )}
                      </button>

                      {/* Activities under this category */}
                      {isCategoryExpanded && (
                        <div style={{ marginLeft: '16px', marginTop: '2px' }}>
                          {category.activities.map((activity) => (
                            <div key={activity.id} style={{ marginBottom: '2px' }}>
                              <button
                                onClick={() => navigate(`/sanctuary/ops?category=${category.id}&activity=${activity.id}`)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  width: '100%',
                                  fontSize: 14,
                                  fontWeight: 500,
                                  color: colors.textMuted,
                                  padding: '10px 16px 10px 56px', // More indented under category
                                  borderRadius: 8,
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                  textAlign: 'left',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = colors.hover;
                                  e.currentTarget.style.color = colors.textHover;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.color = colors.textMuted;
                                }}
                              >
                                <span>{activity.title}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{
            height: '1px',
            backgroundColor: separatorColor,
            margin: '12px 12px',
          }} />

          {/* ============================================================ */}
          {/* SPACES SECTION - WITH NESTED ACTIVITIES */}
          {/* ============================================================ */}
          <div style={{ marginBottom: '8px' }}>
            <button
              onClick={() => {
                if (!open) {
                  onOpenChange(true);
                  return;
                }
                setSpacesExpanded(!spacesExpanded);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: open ? 'space-between' : 'center',
                width: '100%',
                padding: open ? '10px 12px' : '10px 8px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'transparent',
                color: colors.text,
                cursor: 'pointer',
                transition: 'background-color 150ms ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title={!open ? 'Spaces' : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: open ? '10px' : '0' }}>
                <Sparkles size={18} style={{ color: colors.textSecondary }} />
                {open && <span style={{ fontSize: '14px', fontWeight: 600 }}>Spaces</span>}
              </div>
              {open && (spacesExpanded ? <ChevronDown size={16} style={{ color: colors.textSecondary }} /> : <ChevronRight size={16} style={{ color: colors.textSecondary }} />)}
            </button>

            {/* Spaces with activities */}
            {open && spacesExpanded && (
              <div style={{ marginLeft: '12px', marginTop: '4px' }}>
                {SPACES.map((space) => {
                  const SpaceIcon = space.icon;
                  const isSpaceExpanded = expandedSpace === space.id;
                  const hasActivities = space.activities.length > 0;

                  return (
                    <div key={space.id} style={{ marginBottom: '2px' }}>
                      {/* Space Header */}
                      <button
                        onClick={() => hasActivities ? toggleSpace(space.id) : navigate(space.path)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          fontSize: 14,
                          fontWeight: 500,
                          color: colors.textMuted,
                          padding: '10px 16px 10px 40px',
                          borderRadius: 8,
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.hover;
                          e.currentTarget.style.color = colors.textHover;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = colors.textMuted;
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <SpaceIcon size={18} style={{ opacity: isDark ? 0.8 : 0.7, color: 'currentColor', width: 18, height: 18 }} />
                          <span>{space.name}</span>
                        </div>
                        {hasActivities && (
                          isSpaceExpanded ? (
                            <ChevronDown size={14} style={{ opacity: isDark ? 0.8 : 0.7, color: 'currentColor' }} />
                          ) : (
                            <ChevronRight size={14} style={{ opacity: isDark ? 0.8 : 0.7, color: 'currentColor' }} />
                          )
                        )}
                      </button>

                      {/* Activities under this space */}
                      {hasActivities && isSpaceExpanded && (
                        <div style={{ marginLeft: '16px', marginTop: '2px' }}>
                          {space.activities.map((activity) => (
                            <div key={activity.id} style={{ marginBottom: '2px' }}>
                              <button
                                onClick={() => navigate(activity.path)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  width: '100%',
                                  fontSize: 14,
                                  fontWeight: 500,
                                  color: colors.textMuted,
                                  padding: '10px 16px 10px 56px', // More indented under space
                                  borderRadius: 8,
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                  textAlign: 'left',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = colors.hover;
                                  e.currentTarget.style.color = colors.textHover;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.color = colors.textMuted;
                                }}
                              >
                                <span>{activity.name}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{
            height: 1,
            background: separatorColor,
            margin: '8px 16px',
          }} />

          {/* ============================================================ */}
          {/* CHATS SECTION */}
          {/* ============================================================ */}
          <div style={{ marginBottom: '8px' }}>
            <button
              onClick={() => {
                if (!open) {
                  onOpenChange(true);
                  return;
                }
                setHistoryExpanded(!historyExpanded);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: open ? 'space-between' : 'center',
                width: '100%',
                fontSize: 14,
                fontWeight: 700,
                color: colors.text,
                textTransform: 'none',
                letterSpacing: '0.01em',
                padding: open ? '12px 16px' : '12px 8px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'background-color 150ms ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title={!open ? 'Chats' : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: open ? '10px' : '0' }}>
                <MessageCircle size={18} style={{ opacity: isDark ? 0.8 : 0.7, color: 'currentColor', width: 18, height: 18 }} />
                {open && <span>Chats</span>}
              </div>
              {open && (historyExpanded ? <ChevronDown size={16} style={{ opacity: isDark ? 0.8 : 0.7, color: 'currentColor' }} /> : <ChevronRight size={16} style={{ opacity: isDark ? 0.8 : 0.7, color: 'currentColor' }} />)}
            </button>

            {/* Conversation list */}
            {open && historyExpanded && (
              <div style={{ marginLeft: '12px', marginTop: '4px' }}>
                {conversations.length === 0 ? (
                  <div style={{
                    padding: '12px',
                    fontSize: '12px',
                    color: colors.textMuted,
                    textAlign: 'center',
                    lineHeight: 1.4,
                  }}>
                    No conversations yet
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => {
                        if (onLoadConversation) {
                          onLoadConversation(conv.id);
                        } else {
                          navigate(`/sanctuary?conversation=${conv.id}`);
                        }
                      }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: colors.text,
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                        textAlign: 'left',
                        marginBottom: '2px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.hover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: 500, 
                        marginBottom: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                        color: colors.text,
                      }}>
                        {conv.title || 'New conversation'}
                      </span>
                      <span style={{ 
                        fontSize: '11px', 
                        color: colors.textMuted,
                      }}>
                        {formatRelativeTime(conv.updated_at)}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{
            height: '1px',
            backgroundColor: separatorColor,
            margin: '12px 12px',
          }} />

          {/* ============================================================ */}
          {/* TRUST & TRANSPARENCY */}
          {/* ============================================================ */}
          <div style={{ margin: '0 4px' }}>
            <button
              onClick={() => {
                if (!open) {
                  onOpenChange(true);
                  return;
                }
                setTrustExpanded(!trustExpanded);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: open ? 'space-between' : 'center',
                width: '100%',
                fontSize: 14,
                fontWeight: 700,
                color: colors.text,
                textTransform: 'none',
                letterSpacing: '0.01em',
                padding: open ? '12px 16px' : '12px 8px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'background-color 150ms ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title={!open ? 'Trust & Transparency' : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: open ? '10px' : '0' }}>
                <Shield size={18} style={{ opacity: isDark ? 0.8 : 0.7, color: 'currentColor', width: 18, height: 18 }} />
                {open && <span>Trust & Transparency</span>}
              </div>
              {open && (trustExpanded ? <ChevronDown size={16} style={{ opacity: isDark ? 0.8 : 0.7, color: 'currentColor' }} /> : <ChevronRight size={16} style={{ opacity: isDark ? 0.8 : 0.7, color: 'currentColor' }} />)}
            </button>

            {open && trustExpanded && (
              <div style={{
                marginTop: '8px',
                marginLeft: '8px',
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
              }}>
                <p style={{
                  fontSize: '12px',
                  lineHeight: 1.6,
                  color: colors.textMuted,
                  margin: '0 0 10px 0',
                }}>
                  VERA is a conversational interface designed to help you work through thoughts, choices, and tasks with clarity.
                </p>
                <p style={{
                  fontSize: '12px',
                  lineHeight: 1.6,
                  color: colors.textMuted,
                  margin: '0 0 10px 0',
                }}>
                  Focus is a structured mode inside VERA that guides a single objective at a time so the conversation stays narrow and usable.
                </p>
                <p style={{
                  fontSize: '12px',
                  lineHeight: 1.6,
                  color: colors.textMuted,
                  margin: '0 0 10px 0',
                }}>
                  VERA is built from a set of conversational policies and routing logic that determine how prompts are interpreted and how responses are generated.
                </p>
                <p style={{
                  fontSize: '12px',
                  lineHeight: 1.6,
                  color: colors.textMuted,
                  margin: '0 0 10px 0',
                }}>
                  VERA does not diagnose, provide medical or legal advice, or make decisions on your behalf.
                </p>
                <p style={{
                  fontSize: '12px',
                  lineHeight: 1.6,
                  color: colors.textMuted,
                  margin: '0 0 10px 0',
                }}>
                  Conversation data is handled based on your access level and consent choices. Anonymous sessions are not linked to an account. Free accounts store limited history. Sanctuary enables longer-term memory when you allow it.
                </p>
                <p style={{
                  fontSize: '12px',
                  lineHeight: 1.6,
                  color: colors.textMuted,
                  margin: 0,
                }}>
                  You can review and adjust these settings at any time in your account area.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: open ? '16px 20px' : '12px 8px',
          borderTop: `1px solid ${colors.border}`,
        }}>
          {false && open && (
            <button
              onClick={() => navigate(canAccessForge ? '/forge/room' : '/forge')}
              style={{
                width: '100%',
                background: colors.card,
                border: `1px solid ${colors.border}`,
                color: colors.textMuted,
                fontWeight: 500,
                fontSize: 14,
                padding: '10px 16px',
                marginBottom: '12px',
                borderRadius: 10,
                cursor: 'pointer',
                opacity: canAccessForge ? 1 : 0.65,
                transition: 'all 150ms ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Target size={16} style={{ opacity: 0.8 }} />
                {forgeLabel}
              </span>
              {!canAccessForge && <Lock size={14} style={{ opacity: 0.7 }} />}
            </button>
          )}

          {open && accessTier !== 'anonymous' && (
            <button
              onClick={() => clerk.openUserProfile()}
              style={{
                width: '100%',
                background: colors.card,
                border: `1px solid ${colors.border}`,
                color: colors.textMuted,
                fontWeight: 500,
                fontSize: 14,
                padding: '10px 16px',
                marginBottom: '12px',
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              Manage account
            </button>
          )}

          {open && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
            }}>
              <button
                onClick={() => setPrivacyModalOpen(true)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: 12,
                  color: colors.textSecondary,
                  fontWeight: 400,
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                Privacy
              </button>
              <span style={{ color: colors.textSecondary, fontSize: 12 }}>·</span>
              <button
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: 12,
                  color: colors.textSecondary,
                  fontWeight: 400,
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                Terms
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Privacy Settings Modal */}
      <PrivacySettingsModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        isDark={isDark}
      />
    </>
  );
}