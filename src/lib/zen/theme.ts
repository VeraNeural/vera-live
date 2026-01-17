export const PHASE_COLORS = {
  inhale: 'rgba(139, 92, 246, 0.95)',
  hold: 'rgba(139, 119, 183, 0.95)',
  exhale: 'rgba(99, 102, 241, 0.95)',
} as const;

const KEYFRAMES_CSS = `
  @keyframes breathe {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.08); opacity: 1; }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }

  @keyframes orbPulse {
    0%, 100% { box-shadow: 0 0 40px rgba(139, 119, 183, 0.2), 0 0 80px rgba(139, 119, 183, 0.1); }
    50% { box-shadow: 0 0 60px rgba(139, 119, 183, 0.3), 0 0 100px rgba(139, 119, 183, 0.15); }
  }
`;

export const GLOBAL_STYLES = {
  colors: {
    orbRingBorder: 'rgba(139, 119, 183, 0.15)',
    orbGlowStrong: 'rgba(139, 119, 183, 0.25)',
    orbGlowSoft: 'rgba(139, 119, 183, 0.1)',
    orbHighlight: 'rgba(255, 255, 255, 0.2)',

    selectedOptionBg: 'rgba(139, 92, 246, 0.2)',
    progressDotCompleted: 'rgba(139, 119, 183, 0.5)',

    ctaText: '#fff',
    ctaGradientEnd: '#6366f1',
  },

  gradients: {
    orbSurface:
      'radial-gradient(circle at 35% 35%, rgba(180, 160, 220, 0.3) 0%, rgba(139, 119, 183, 0.15) 50%, rgba(100, 80, 160, 0.08) 100%)',
    orbInnerGlow: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',

    // Uses runtime `accentGlow` in ZenRoom for ambient background.
    nebulaGlowTemplate: 'radial-gradient(ellipse at center, {{accentGlow}} 0%, transparent 60%)',

    // Uses runtime `accent` in ZenRoom for CTA buttons.
    ctaTemplate: 'linear-gradient(135deg, {{accent}} 0%, #6366f1 100%)',
  },

  animations: {
    keyframesCss: KEYFRAMES_CSS,
    keyframes: {
      breathe: 'breathe',
      fadeIn: 'fadeIn',
      pulse: 'pulse',
      orbPulse: 'orbPulse',
    },
    presets: {
      ringBreathe: 'breathe 6s ease-in-out infinite',
      screenFadeIn: 'fadeIn 0.5s ease-out',
      orbIdle: 'orbPulse 4s ease-in-out infinite',
    },
  },

  shadows: {
    orbStatic: '0 0 50px rgba(139, 119, 183, 0.25), 0 0 100px rgba(139, 119, 183, 0.1)',
    orbPulseFrom: '0 0 40px rgba(139, 119, 183, 0.2), 0 0 80px rgba(139, 119, 183, 0.1)',
    orbPulseTo: '0 0 60px rgba(139, 119, 183, 0.3), 0 0 100px rgba(139, 119, 183, 0.15)',
    ctaTemplate: '0 4px 24px {{accentGlow}}',
  },

  borders: {
    cardRadius: 16,
    pillRadius: 50,
    borderWidth: 1,
  },

  spacing: {
    headerPadding: 16,
    contentPadding: 20,
    orbSize: 120,
    orbRingInset: 16,
    gapSm: 6,
    gapMd: 12,
    gapLg: 24,
  },

  globalCss: `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }
  
  html, body {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

${KEYFRAMES_CSS}

  .practice-card {
    transition: transform 0.2s ease, background 0.2s ease;
  }
  .practice-card:active {
    transform: scale(0.97);
  }

  .option-btn {
    transition: all 0.2s ease;
  }
  .option-btn:active {
    transform: scale(0.96);
  }
  `,
} as const;
