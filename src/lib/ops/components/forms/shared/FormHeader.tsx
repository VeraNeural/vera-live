import React from 'react';
import { OpsIcon } from '../../../icons';
import { FlexibleAction } from './types';

interface FormHeaderProps {
  action: FlexibleAction;
  colors: {
    text: string;
    accent: string;
  };
  isDark: boolean;
  separatorColor: string;
  layerCardStyle: React.CSSProperties;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  action,
  colors,
  isDark,
  separatorColor,
  layerCardStyle,
}) => {
  return (
    <div style={layerCardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
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
              : 'rgba(200, 160, 100, 0.15)',
          }}
        >
          <OpsIcon type={action.icon} color={colors.accent} />
        </div>
        <div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 22,
              fontWeight: 300,
              color: colors.text,
            }}
          >
            {action.title}
          </h2>
          <p style={{ fontSize: 13, color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(30,30,30,0.7)' }}>
            {action.description}
          </p>
        </div>
      </div>
      <div style={{ height: 1, backgroundColor: separatorColor }} />
    </div>
  );
};
