/**
 * CategoryGrid Component
 * 
 * Displays a grid of activity categories for selection
 */

'use client';

import React from 'react';
import type { CategoryItem, StudioColors } from '../types';
import { CATEGORY_ICONS } from '../icons';
import { ExpressIcon } from '../icons';

interface CategoryGridProps {
  categories: CategoryItem[];
  colors: StudioColors;
  onCategoryClick: (categoryId: string) => void;
}

export function CategoryGrid({ categories, colors, onCategoryClick }: CategoryGridProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 12,
      maxWidth: 360,
      width: '100%',
      animation: 'fadeIn 0.4s ease-out',
    }}>
      {categories.map((category) => {
        const IconComponent = CATEGORY_ICONS[category.id] || ExpressIcon;
        return (
          <button
            key={category.id}
            className="card-btn"
            onClick={() => onCategoryClick(category.id)}
            style={{
              padding: '22px 16px',
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 16,
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
              <IconComponent size={28} color={colors.accentDim} />
            </div>
            <h3 style={{
              fontSize: 15,
              fontWeight: 600,
              color: colors.text,
              marginBottom: 6,
            }}>
              {category.title}
            </h3>
            <p style={{
              fontSize: 12,
              color: colors.textDim,
              marginBottom: 10,
              lineHeight: 1.4,
            }}>
              {category.description}
            </p>
            <span style={{
              fontSize: 11,
              color: colors.accentDim,
            }}>
              {category.count} activities
            </span>
          </button>
        );
      })}
    </div>
  );
}
