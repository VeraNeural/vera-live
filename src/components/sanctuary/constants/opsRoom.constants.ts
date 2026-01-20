import { type AIProvider, type GenerationMode } from '@/lib/ops/types';

export const GLOBAL_STYLES = `
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

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .card-btn {
    transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  }
  .card-btn:hover { transform: translateY(-2px); }
  .card-btn:active { transform: scale(0.98); }

  .input-field {
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .input-field:focus { outline: none; }

  .output-area::-webkit-scrollbar { width: 4px; }
  .output-area::-webkit-scrollbar-track { background: transparent; }
  .output-area::-webkit-scrollbar-thumb { background: rgba(150, 140, 130, 0.3); border-radius: 4px; }

  .generating {
    background: linear-gradient(90deg, rgba(200,180,150,0.1) 25%, rgba(200,180,150,0.2) 50%, rgba(200,180,150,0.1) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  select.input-field {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
    padding-right: 40px !important;
  }

  select.input-field option {
    background: #1a1a24;
    color: #e8e4de;
    padding: 12px;
  }

  @media (prefers-color-scheme: light) {
    select.input-field option {
      background: #ffffff;
      color: #2a2a2a;
    }
  }

  .ops-category-grid {
    grid-template-columns: repeat(3, 1fr) !important;
  }

  @media (max-width: 400px) {
    .ops-category-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
`;

export const GENERATION_MODES: Record<GenerationMode, { name: string }> = {
  single: { name: 'Single AI' },
  specialist: { name: 'Specialist' },
  consensus: { name: 'Consensus' },
  'review-chain': { name: 'Review Chain' },
  compare: { name: 'Compare' },
};

export const AI_PROVIDERS: Record<AIProvider, { name: string; color: string }> = {
  claude: { name: 'Claude', color: '#D97706' },
  gpt4: { name: 'GPT-4', color: '#10B981' },
  grok: { name: 'Grok', color: '#8B5CF6' },
};

export const SPACES = ['Personal', 'Work', 'Relationships', 'Legal / Financial', 'General'] as const;
export type Space = (typeof SPACES)[number];
