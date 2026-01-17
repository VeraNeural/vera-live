import React from 'react';
import { Category, ActionItem } from '../types';
import { OpsIcon } from '../icons';

// Allow both ActionItem and Activity types
type ActionLike = Pick<ActionItem, 'id' | 'title' | 'description' | 'icon'>;

interface ActionSelectorProps<T extends ActionLike = ActionLike> {
  category: Category | string;
  categoryTitle: string;
  actions: T[];
  onSelectAction: (action: T) => void;
  colors: {
    text: string;
    textMuted: string;
    accent: string;
    cardBorder: string;
  };
  isDark: boolean;
}

const getCategoryDescription = (category: Category | string): string => {
  const descriptions: Record<string, string> = {
    communication: 'Choose a tool to help you communicate clearly and confidently.',
    work: 'Tools to help you navigate your career with clarity and confidence.',
    life: 'Handle the tasks that drain your energy so you can focus on what matters.',
    content: 'Create content that connects and resonates with your audience.',
    thinking: 'Frameworks to help you think through decisions and untangle complexity.',
    health: 'Support for building sustainable habits and taking care of yourself.',
    money: 'Tools to help you plan, budget, and build financial stability.',
    learning: 'Accelerate your learning and deepen your understanding.',
    relationships: 'Strengthen connections and navigate relationship dynamics.',
    creativity: 'Unlock ideas and explore creative possibilities.',
    planning: 'Set meaningful goals and create actionable plans.',
  };
  return descriptions[category] || '';
};

export const ActionSelector: React.FC<ActionSelectorProps> = ({
  category,
  categoryTitle,
  actions,
  onSelectAction,
  colors,
  isDark,
}) => {
  return (
    <div style={{ width: '100%', maxWidth: 600, animation: 'fadeIn 0.4s ease-out' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 28,
            fontWeight: 300,
            color: colors.text,
            marginBottom: 8,
          }}
        >
          {categoryTitle}
        </h2>
        <p
          style={{
            fontSize: 14,
            color: colors.textMuted,
            maxWidth: 400,
            margin: '0 auto',
            lineHeight: 1.5,
          }}
        >
          {getCategoryDescription(category)}
        </p>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
        }}
        className="ops-category-grid"
      >
        {actions.map((action) => (
          <button
            key={action.id}
            className="card-btn"
            onClick={() => onSelectAction(action)}
            style={{
              padding: '20px 14px',
              background: isDark
                ? 'rgba(255,255,255,0.06)'
                : 'rgba(255,255,255,0.85)',
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 14,
              cursor: 'pointer',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isDark
                  ? 'rgba(255, 180, 100, 0.1)'
                  : 'rgba(200, 160, 100, 0.12)',
                border: `1px solid ${
                  isDark ? 'rgba(255, 180, 100, 0.18)' : 'rgba(200, 160, 100, 0.2)'
                }`,
                marginBottom: 12,
              }}
            >
              <OpsIcon type={action.icon} color={colors.accent} />
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: colors.text,
                lineHeight: 1.3,
                marginBottom: 6,
              }}
            >
              {action.title}
            </div>
            <div style={{ fontSize: 12, color: colors.textMuted, lineHeight: 1.4 }}>
              {action.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
