import React from 'react';
import { Category } from '../types';
import { OpsIcon } from '../icons';

interface CategorySelectorProps {
  categories: { id: Category; title: string; icon: string; description: string }[];
  onSelectCategory: (categoryId: Category) => void;
  colors: {
    text: string;
    textMuted: string;
    accent: string;
    cardBorder: string;
  };
  isDark: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  onSelectCategory,
  colors,
  isDark,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        maxWidth: 600,
        width: '100%',
        animation: 'fadeIn 0.4s ease-out',
      }}
      className="ops-category-grid"
    >
      {categories.map((cat) => (
        <button
          key={cat.id}
          className="card-btn"
          onClick={() => onSelectCategory(cat.id)}
          style={{
            padding: '18px 12px',
            background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.85)',
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
              width: 40,
              height: 40,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isDark
                ? 'rgba(255, 180, 100, 0.1)'
                : 'rgba(200, 160, 100, 0.12)',
              border: `1px solid ${
                isDark ? 'rgba(255, 180, 100, 0.18)' : 'rgba(200, 160, 100, 0.2)'
              }`,
              marginBottom: 10,
            }}
          >
            <OpsIcon type={cat.icon} color={colors.accent} />
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: colors.text,
              lineHeight: 1.3,
              marginBottom: 4,
            }}
          >
            {cat.title}
          </div>
          <div style={{ fontSize: 11, color: colors.textMuted, lineHeight: 1.3 }}>
            {cat.description}
          </div>
        </button>
      ))}
    </div>
  );
};
