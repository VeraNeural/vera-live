"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Sparkles,
  Moon,
  BookOpen,
  Palette,
  Library,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  Briefcase,
  DollarSign,
  Brain,
  Heart,
  Wand2,
} from 'lucide-react';
import { opsRoom } from '@/app/sanctuary/ops/consolidatedData';

type SidebarSpacesProps = {
  isDark: boolean;
  onClose: () => void;
};

// Map icon strings to Lucide components
const categoryIcons: Record<string, React.ElementType> = {
  'message-circle': MessageCircle,
  'briefcase': Briefcase,
  'dollar-sign': DollarSign,
  'brain': Brain,
  'heart': Heart,
  'wand': Wand2,
};

const SPACES = [
  { id: 'zen', name: 'Zen', icon: Sparkles, path: '/sanctuary/zen' },
  { id: 'rest', name: 'Rest', icon: Moon, path: '/sanctuary/rest' },
  { id: 'journal', name: 'Journal', icon: BookOpen, path: '/sanctuary/journal' },
  { id: 'studio', name: 'Studio', icon: Palette, path: '/sanctuary/studio' },
  { id: 'library', name: 'Library', icon: Library, path: '/sanctuary/library' },
];

export function SidebarSpaces({ isDark, onClose }: SidebarSpacesProps) {
  const router = useRouter();
  const [opsExpanded, setOpsExpanded] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  const navigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    setExpandedActivity(null); // Close any open activity when switching categories
  };

  const toggleActivity = (activityId: string) => {
    setExpandedActivity(expandedActivity === activityId ? null : activityId);
  };

  // Theme colors
  const colors = {
    text: isDark ? 'rgba(255, 250, 245, 0.9)' : 'rgba(45, 40, 35, 0.9)',
    textMuted: isDark ? 'rgba(255, 250, 245, 0.5)' : 'rgba(45, 40, 35, 0.5)',
    textDim: isDark ? 'rgba(255, 250, 245, 0.3)' : 'rgba(45, 40, 35, 0.3)',
    hover: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
    border: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    accent: isDark ? 'rgba(200, 170, 120, 0.9)' : 'rgba(180, 140, 90, 0.9)',
  };

  const itemStyle = {
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
    fontSize: '14px',
    fontWeight: 500,
  };

  const subItemStyle = {
    ...itemStyle,
    padding: '8px 12px',
    fontSize: '13px',
    color: colors.textMuted,
  };

  const subSubItemStyle = {
    ...itemStyle,
    padding: '6px 12px',
    fontSize: '12px',
    color: colors.textMuted,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* OPS Section */}
      <div style={{ marginBottom: '8px' }}>
        {/* Ops Header */}
        <button
          onClick={() => setOpsExpanded(!opsExpanded)}
          style={itemStyle as React.CSSProperties}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.hover)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={18} style={{ color: colors.textMuted }} />
            <span>Ops</span>
          </div>
          {opsExpanded ? (
            <ChevronDown size={16} style={{ color: colors.textMuted }} />
          ) : (
            <ChevronRight size={16} style={{ color: colors.textMuted }} />
          )}
        </button>

        {/* Ops Categories */}
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
                    style={subItemStyle as React.CSSProperties}
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

                  {/* Activities */}
                  {isCategoryExpanded && (
                    <div style={{ marginLeft: '16px', marginTop: '2px' }}>
                      {category.activities.map((activity) => {
                        const hasDropdown = activity.type === 'dropdown' && activity.dropdownOptions;
                        const isActivityExpanded = expandedActivity === activity.id;

                        return (
                          <div key={activity.id} style={{ marginBottom: '2px' }}>
                            {/* Activity */}
                            <button
                              onClick={() => {
                                if (hasDropdown) {
                                  toggleActivity(activity.id);
                                } else {
                                  navigate(`/sanctuary/ops?category=${category.id}&activity=${activity.id}`);
                                }
                              }}
                              style={subSubItemStyle as React.CSSProperties}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = colors.hover;
                                e.currentTarget.style.color = colors.text;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = colors.textMuted;
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '12px' }}>{activity.icon}</span>
                                <span>{activity.title}</span>
                              </div>
                              {hasDropdown && (
                                isActivityExpanded ? (
                                  <ChevronDown size={12} style={{ color: colors.textMuted }} />
                                ) : (
                                  <ChevronRight size={12} style={{ color: colors.textMuted }} />
                                )
                              )}
                            </button>

                            {/* Dropdown Options */}
                            {hasDropdown && isActivityExpanded && activity.dropdownOptions && (
                              <div style={{ marginLeft: '20px', marginTop: '2px' }}>
                                {activity.dropdownOptions.map((option) => (
                                  <button
                                    key={option.id}
                                    onClick={() => navigate(`/sanctuary/ops?category=${category.id}&activity=${activity.id}&option=${option.id}`)}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      width: '100%',
                                      padding: '5px 10px',
                                      borderRadius: '6px',
                                      border: 'none',
                                      backgroundColor: 'transparent',
                                      color: colors.textDim,
                                      cursor: 'pointer',
                                      transition: 'all 150ms ease',
                                      fontSize: '11px',
                                      textAlign: 'left',
                                    } as React.CSSProperties}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = colors.hover;
                                      e.currentTarget.style.color = colors.text;
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                      e.currentTarget.style.color = colors.textDim;
                                    }}
                                  >
                                    <span>{option.icon}</span>
                                    <span>{option.label}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
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

      {/* SPACES Section */}
      <div style={{ padding: '0 4px', marginBottom: '8px' }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: colors.textDim,
          padding: '8px 12px 12px',
        }}>
          Spaces
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {SPACES.map((space) => {
            const Icon = space.icon;
            return (
              <button
                key={space.id}
                onClick={() => navigate(space.path)}
                style={itemStyle as React.CSSProperties}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.hover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={18} style={{ color: colors.textMuted }} />
                  <span>{space.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}