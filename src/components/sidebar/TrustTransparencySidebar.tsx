"use client";

import { useEffect, useMemo, useState } from 'react';
import { useClerk, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  X,
  Plus,
  Settings,
  Sparkles,
  Moon,
  BookOpen,
  Palette,
  Library,
  ChevronRight,
  ChevronDown,
  Shield,
  Brain,
  Trash2,
  MessageCircle,
  Briefcase,
  DollarSign,
  Heart,
  Wand2,
} from 'lucide-react';
import { opsRoom } from '@/app/sanctuary/ops/consolidatedData';

type TrustTransparencySidebarProps = {
  isDark: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNewConversation?: () => void;
};

type AccessTier = 'anonymous' | 'free' | 'sanctuary';

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
      { id: 'brain-dump', name: 'Brain Dump', path: '/sanctuary/studio?activity=brain-dump' },
      { id: 'burn-list', name: 'Burn List', path: '/sanctuary/studio?activity=burn-list' },
      { id: 'stream-of-consciousness', name: 'Stream of Consciousness', path: '/sanctuary/studio?activity=stream-of-consciousness' },
      { id: 'unsent-letter', name: 'Unsent Letter', path: '/sanctuary/studio?activity=unsent-letter' },
      { id: 'hand-release', name: 'Hand Release', path: '/sanctuary/studio?activity=hand-release' },
      { id: 'movement-prompt', name: 'Movement Prompt', path: '/sanctuary/studio?activity=movement-prompt' },
      { id: 'posture-reset', name: 'Posture Reset', path: '/sanctuary/studio?activity=posture-reset' },
      { id: 'shake-it-out', name: 'Shake It Out', path: '/sanctuary/studio?activity=shake-it-out' },
      { id: 'ambient-creator', name: 'Ambient Creator', path: '/sanctuary/studio?activity=ambient-creator' },
      { id: 'hum-tone', name: 'Hum & Tone', path: '/sanctuary/studio?activity=hum-tone' },
      { id: 'playlist-builder', name: 'Playlist Builder', path: '/sanctuary/studio?activity=playlist-builder' },
      { id: 'sound-bath', name: 'Sound Bath', path: '/sanctuary/studio?activity=sound-bath' },
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
      { id: 'assessments', name: 'Assessments', path: '/sanctuary/library?view=assessments' },
    ]
  },
];

export default function TrustTransparencySidebar({
  isDark,
  open,
  onOpenChange,
  onNewConversation,
}: TrustTransparencySidebarProps) {
  const router = useRouter();
  const [memoryEnabled, setMemoryEnabled] = useState<boolean | null>(null);
  const [isLoadingMemory, setIsLoadingMemory] = useState(false);
  const [opsExpanded, setOpsExpanded] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [spacesExpanded, setSpacesExpanded] = useState(false);
  const [expandedSpace, setExpandedSpace] = useState<string | null>(null);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [trustExpanded, setTrustExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { isLoaded, isSignedIn, user } = useUser();
  const clerk = useClerk();

  const accessTier: AccessTier = useMemo(() => {
    if (!isLoaded || !isSignedIn) return 'anonymous';
    const md = (user?.publicMetadata ?? {}) as Record<string, unknown>;
    const rawTier = md.accessTier as unknown;
    if (typeof rawTier === 'string') {
      const v = rawTier.trim().toLowerCase();
      if (v === 'sanctuary') return 'sanctuary';
      if (v === 'free') return 'free';
    }
    return 'free';
  }, [isLoaded, isSignedIn, user?.publicMetadata]);

  useEffect(() => {
    if (!open || accessTier !== 'sanctuary') return;
    const fetchMemoryStatus = async () => {
      try {
        const response = await fetch('/api/sanctuary/conversations?action=consent');
        const data = await response.json();
        setMemoryEnabled(data.hasConsented ?? null);
      } catch (error) {
        console.error('Failed to fetch memory status:', error);
      }
    };
    fetchMemoryStatus();
  }, [open, accessTier]);

  useEffect(() => {
    if (!open || accessTier !== 'sanctuary') return;
    const fetchConversations = async () => {
      setIsLoadingConversations(true);
      try {
        const response = await fetch('/api/sanctuary/conversations?action=recent&limit=10');
        const data = await response.json();
        setConversations(data.conversations || []);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setIsLoadingConversations(false);
      }
    };
    fetchConversations();
  }, [open, accessTier]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) {
      setShowDeleteConfirm(false);
    }
  }, [open]);

  const handleToggleMemory = async () => {
    if (isLoadingMemory) return;
    setIsLoadingMemory(true);
    try {
      const newValue = !memoryEnabled;
      await fetch('/api/sanctuary/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'consent', consent: newValue }),
      });
      setMemoryEnabled(newValue);
    } catch (error) {
      console.error('Failed to toggle memory:', error);
    } finally {
      setIsLoadingMemory(false);
    }
  };

  const handleDeleteAll = async () => {
    setIsLoadingMemory(true);
    try {
      await fetch('/api/sanctuary/conversations?action=all', { method: 'DELETE' });
      setMemoryEnabled(false);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete conversations:', error);
    } finally {
      setIsLoadingMemory(false);
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
      ? 'linear-gradient(180deg, rgba(18, 16, 24, 0.98) 0%, rgba(12, 10, 18, 0.99) 100%)'
      : 'linear-gradient(180deg, rgba(252, 250, 247, 0.98) 0%, rgba(245, 240, 232, 0.99) 100%)',
    border: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    text: isDark ? 'rgba(255, 250, 245, 0.9)' : 'rgba(45, 40, 35, 0.9)',
    textMuted: isDark ? 'rgba(255, 250, 245, 0.5)' : 'rgba(45, 40, 35, 0.5)',
    textDim: isDark ? 'rgba(255, 250, 245, 0.3)' : 'rgba(45, 40, 35, 0.3)',
    accent: isDark ? 'rgba(200, 170, 120, 0.9)' : 'rgba(180, 140, 90, 0.9)',
    accentBg: isDark ? 'rgba(200, 170, 120, 0.12)' : 'rgba(180, 140, 90, 0.1)',
    hover: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
    card: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => onOpenChange(false)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 998,
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 250ms ease',
        }}
      />

      {/* Sidebar Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 999,
          width: '340px',
          maxWidth: '88vw',
          background: colors.bg,
          borderRight: `1px solid ${colors.border}`,
          boxShadow: isDark
            ? '8px 0 40px rgba(0, 0, 0, 0.5)'
            : '8px 0 40px rgba(0, 0, 0, 0.1)',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: `1px solid ${colors.border}`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '24px',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: colors.text,
            }}>
              VERA
            </div>
            <button
              onClick={() => onOpenChange(false)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: `1px solid ${colors.border}`,
                backgroundColor: 'transparent',
                color: colors.textMuted,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 200ms ease',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* New Chat Button */}
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
              padding: '12px 16px',
              borderRadius: '12px',
              border: `1px solid ${colors.accent}`,
              backgroundColor: colors.accentBg,
              color: colors.accent,
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            <Plus size={18} />
            New conversation
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 12px',
        }}>
          
          {/* ============================================================ */}
          {/* OPS SECTION - WITH NESTED CATEGORIES AND ACTIVITIES */}
          {/* ============================================================ */}
          <div style={{ marginBottom: '8px' }}>
            <button
              onClick={() => setOpsExpanded(!opsExpanded)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'transparent',
                color: colors.text,
                cursor: 'pointer',
                transition: 'background-color 150ms ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings size={18} style={{ color: colors.textMuted }} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Ops</span>
              </div>
              {opsExpanded ? <ChevronDown size={16} style={{ color: colors.textMuted }} /> : <ChevronRight size={16} style={{ color: colors.textMuted }} />}
            </button>

            {/* Categories from consolidatedData.ts */}
            {opsExpanded && (
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
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: colors.textMuted,
                          cursor: 'pointer',
                          transition: 'all 150ms ease',
                          fontSize: '13px',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.hover;
                          e.currentTarget.style.color = colors.text;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = colors.textMuted;
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CategoryIcon size={14} />
                          <span>{category.name}</span>
                        </div>
                        {isCategoryExpanded ? (
                          <ChevronDown size={14} style={{ color: colors.textMuted }} />
                        ) : (
                          <ChevronRight size={14} style={{ color: colors.textMuted }} />
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
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  color: colors.textMuted,
                                  cursor: 'pointer',
                                  transition: 'all 150ms ease',
                                  fontSize: '12px',
                                  textAlign: 'left',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = colors.hover;
                                  e.currentTarget.style.color = colors.text;
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
            backgroundColor: colors.border,
            margin: '12px 12px',
          }} />

          {/* ============================================================ */}
          {/* SPACES SECTION - WITH NESTED ACTIVITIES */}
          {/* ============================================================ */}
          <div style={{ marginBottom: '8px' }}>
            <button
              onClick={() => setSpacesExpanded(!spacesExpanded)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'transparent',
                color: colors.text,
                cursor: 'pointer',
                transition: 'background-color 150ms ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={18} style={{ color: colors.textMuted }} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Spaces</span>
              </div>
              {spacesExpanded ? <ChevronDown size={16} style={{ color: colors.textMuted }} /> : <ChevronRight size={16} style={{ color: colors.textMuted }} />}
            </button>

            {/* Spaces with activities */}
            {spacesExpanded && (
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
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: colors.textMuted,
                          cursor: 'pointer',
                          transition: 'all 150ms ease',
                          fontSize: '13px',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.hover;
                          e.currentTarget.style.color = colors.text;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = colors.textMuted;
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <SpaceIcon size={14} />
                          <span>{space.name}</span>
                        </div>
                        {hasActivities && (
                          isSpaceExpanded ? (
                            <ChevronDown size={14} style={{ color: colors.textMuted }} />
                          ) : (
                            <ChevronRight size={14} style={{ color: colors.textMuted }} />
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
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  color: colors.textMuted,
                                  cursor: 'pointer',
                                  transition: 'all 150ms ease',
                                  fontSize: '12px',
                                  textAlign: 'left',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = colors.hover;
                                  e.currentTarget.style.color = colors.text;
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
            height: '1px',
            backgroundColor: colors.border,
            margin: '12px 12px',
          }} />

          {/* ============================================================ */}
          {/* CHATS SECTION */}
          {/* ============================================================ */}
          <div style={{ marginBottom: '8px' }}>
            <button
              onClick={() => setHistoryExpanded(!historyExpanded)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'transparent',
                color: colors.text,
                cursor: 'pointer',
                transition: 'background-color 150ms ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageCircle size={18} style={{ color: colors.textMuted }} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Chats</span>
              </div>
              {historyExpanded ? <ChevronDown size={16} style={{ color: colors.textMuted }} /> : <ChevronRight size={16} style={{ color: colors.textMuted }} />}
            </button>

            {/* Conversation list */}
            {historyExpanded && (
              <div style={{ marginLeft: '12px', marginTop: '4px' }}>
                {accessTier !== 'sanctuary' ? (
                  <div style={{
                    padding: '12px',
                    fontSize: '12px',
                    color: colors.textMuted,
                    textAlign: 'center',
                    lineHeight: 1.4,
                  }}>
                    Upgrade to Sanctuary to access conversation history
                  </div>
                ) : !memoryEnabled ? (
                  <div style={{
                    padding: '12px',
                    fontSize: '12px',
                    color: colors.textMuted,
                    textAlign: 'center',
                    lineHeight: 1.4,
                  }}>
                    Enable Memory to save conversation history
                  </div>
                ) : isLoadingConversations ? (
                  <div style={{
                    padding: '12px',
                    fontSize: '12px',
                    color: colors.textMuted,
                    textAlign: 'center',
                  }}>
                    Loading...
                  </div>
                ) : conversations.length === 0 ? (
                  <div style={{
                    padding: '12px',
                    fontSize: '12px',
                    color: colors.textMuted,
                    textAlign: 'center',
                  }}>
                    No conversations yet
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => navigate(`/sanctuary?conversation=${conv.id}`)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: colors.textMuted,
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                        fontSize: '12px',
                        textAlign: 'left',
                        marginBottom: '2px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.hover;
                        e.currentTarget.style.color = colors.text;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.textMuted;
                      }}
                    >
                      <span style={{ fontWeight: 500, marginBottom: '2px' }}>
                        {conv.title || 'Untitled'}
                      </span>
                      <span style={{ fontSize: '10px', opacity: 0.7 }}>
                        {new Date(conv.updated_at).toLocaleDateString()}
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
            backgroundColor: colors.border,
            margin: '12px 12px',
          }} />

          {/* ============================================================ */}
          {/* TRUST & TRANSPARENCY */}
          {/* ============================================================ */}
          <div style={{ margin: '0 4px' }}>
            <button
              onClick={() => setTrustExpanded(!trustExpanded)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'transparent',
                color: colors.text,
                cursor: 'pointer',
                transition: 'background-color 150ms ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={18} style={{ color: colors.textMuted }} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Trust & Transparency</span>
              </div>
              {trustExpanded ? <ChevronDown size={16} style={{ color: colors.textMuted }} /> : <ChevronRight size={16} style={{ color: colors.textMuted }} />}
            </button>

            {trustExpanded && (
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
                  margin: '0 0 12px 0',
                }}>
                  VERA works through conversation. She listens for what is actually needed, then helps you move one step at a time.
                </p>
                <p style={{
                  fontSize: '12px',
                  lineHeight: 1.6,
                  color: colors.textMuted,
                  margin: 0,
                }}>
                  {accessTier === 'sanctuary'
                    ? 'You are in Sanctuary. Memory is available with consent, and usage limits are lifted.'
                    : accessTier === 'free'
                    ? 'Free account. Conversations are not saved as long-term history.'
                    : 'Anonymous conversations are temporary and not tied to you.'}
                </p>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* MEMORY SECTION (Sanctuary only) */}
          {/* ============================================================ */}
          {accessTier === 'sanctuary' && (
            <>
              <div style={{
                height: '1px',
                backgroundColor: colors.border,
                margin: '12px 12px',
              }} />
              
              <div style={{
                margin: '0 4px 16px',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Brain size={18} style={{ color: colors.accent }} />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: colors.text }}>
                      Memory
                    </span>
                  </div>
                  <button
                    onClick={handleToggleMemory}
                    disabled={isLoadingMemory}
                    style={{
                      width: '44px',
                      height: '24px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: memoryEnabled ? colors.accent : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'),
                      cursor: isLoadingMemory ? 'wait' : 'pointer',
                      position: 'relative',
                      transition: 'background-color 200ms ease',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '3px',
                        left: memoryEnabled ? '23px' : '3px',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        transition: 'left 200ms ease',
                      }}
                    />
                  </button>
                </div>

                <p style={{
                  fontSize: '12px',
                  lineHeight: 1.5,
                  color: colors.textMuted,
                  margin: 0,
                }}>
                  {memoryEnabled
                    ? 'VERA remembers your conversations for continuity.'
                    : 'Conversations are private and not saved.'}
                </p>

                {memoryEnabled && !showDeleteConfirm && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      width: '100%',
                      marginTop: '12px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${isDark ? 'rgba(220, 100, 100, 0.3)' : 'rgba(200, 80, 80, 0.3)'}`,
                      backgroundColor: 'transparent',
                      color: isDark ? 'rgba(220, 140, 140, 1)' : 'rgba(180, 80, 80, 1)',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <Trash2 size={14} />
                    Clear all conversations
                  </button>
                )}

                {showDeleteConfirm && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: isDark ? 'rgba(220, 100, 100, 0.1)' : 'rgba(200, 80, 80, 0.08)',
                    border: `1px solid ${isDark ? 'rgba(220, 100, 100, 0.2)' : 'rgba(200, 80, 80, 0.2)'}`,
                  }}>
                    <p style={{
                      fontSize: '12px',
                      color: colors.text,
                      margin: '0 0 10px 0',
                    }}>
                      This cannot be undone.
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={handleDeleteAll}
                        disabled={isLoadingMemory}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: isDark ? 'rgba(220, 100, 100, 0.3)' : 'rgba(200, 80, 80, 0.2)',
                          color: isDark ? 'rgba(255, 200, 200, 1)' : 'rgba(150, 50, 50, 1)',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: isLoadingMemory ? 'wait' : 'pointer',
                        }}
                      >
                        {isLoadingMemory ? 'Deleting...' : 'Delete'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: `1px solid ${colors.border}`,
                          backgroundColor: 'transparent',
                          color: colors.textMuted,
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: `1px solid ${colors.border}`,
        }}>
          {accessTier !== 'anonymous' && (
            <button
              onClick={() => clerk.openUserProfile()}
              style={{
                width: '100%',
                padding: '10px 16px',
                marginBottom: '12px',
                borderRadius: '10px',
                border: `1px solid ${colors.border}`,
                backgroundColor: 'transparent',
                color: colors.text,
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              Manage account
            </button>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}>
            <button
              style={{
                border: 'none',
                background: 'none',
                color: colors.textDim,
                fontSize: '11px',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              Privacy
            </button>
            <span style={{ color: colors.textDim, fontSize: '11px' }}>·</span>
            <button
              style={{
                border: 'none',
                background: 'none',
                color: colors.textDim,
                fontSize: '11px',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              Terms
            </button>
          </div>
        </div>
      </div>
    </>
  );
}