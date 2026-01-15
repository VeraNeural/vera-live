'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface DigitalVisionBoardProps {
  onBack: () => void;
  onComplete?: (data: { board: VisionBoardData }) => void;
}

interface VisionBoardData {
  title: string;
  theme: string;
  images: SelectedImage[];
  affirmation: string;
}

interface SelectedImage {
  id: string;
  category: string;
  emoji: string;
  label: string;
  position: number;
}

// Board themes
const BOARD_THEMES = [
  { id: 'calm', name: 'Inner Calm', description: 'Peace and tranquility', accent: '#7dd3fc' },
  { id: 'growth', name: 'Personal Growth', description: 'Becoming your best self', accent: '#86efac' },
  { id: 'healing', name: 'Healing Journey', description: 'Recovery and restoration', accent: '#f0abfc' },
  { id: 'joy', name: 'Simple Joys', description: 'Everyday happiness', accent: '#fcd34d' },
  { id: 'strength', name: 'Inner Strength', description: 'Resilience and courage', accent: '#fda4af' },
  { id: 'balance', name: 'Life Balance', description: 'Harmony in all things', accent: '#c4b5fd' },
];

// Image categories with visual representations
const IMAGE_CATEGORIES = [
  {
    id: 'nature',
    name: 'Nature',
    images: [
      { id: 'n1', emoji: '🌊', label: 'Ocean Waves' },
      { id: 'n2', emoji: '🌲', label: 'Forest' },
      { id: 'n3', emoji: '🌸', label: 'Cherry Blossoms' },
      { id: 'n4', emoji: '🏔️', label: 'Mountains' },
      { id: 'n5', emoji: '🌅', label: 'Sunset' },
      { id: 'n6', emoji: '🌿', label: 'Green Leaves' },
      { id: 'n7', emoji: '🦋', label: 'Butterfly' },
      { id: 'n8', emoji: '🌙', label: 'Moon' },
    ]
  },
  {
    id: 'comfort',
    name: 'Comfort',
    images: [
      { id: 'c1', emoji: '☕', label: 'Warm Drink' },
      { id: 'c2', emoji: '📚', label: 'Books' },
      { id: 'c3', emoji: '🕯️', label: 'Candle' },
      { id: 'c4', emoji: '🛋️', label: 'Cozy Space' },
      { id: 'c5', emoji: '🧶', label: 'Soft Textures' },
      { id: 'c6', emoji: '🎵', label: 'Music' },
      { id: 'c7', emoji: '🌱', label: 'Plants' },
      { id: 'c8', emoji: '🐱', label: 'Pet Companion' },
    ]
  },
  {
    id: 'wellness',
    name: 'Wellness',
    images: [
      { id: 'w1', emoji: '🧘', label: 'Meditation' },
      { id: 'w2', emoji: '💆', label: 'Self-Care' },
      { id: 'w3', emoji: '🌻', label: 'Positivity' },
      { id: 'w4', emoji: '💪', label: 'Strength' },
      { id: 'w5', emoji: '🫀', label: 'Heart Health' },
      { id: 'w6', emoji: '😌', label: 'Peace' },
      { id: 'w7', emoji: '🌈', label: 'Hope' },
      { id: 'w8', emoji: '✨', label: 'Healing' },
    ]
  },
  {
    id: 'aspirations',
    name: 'Aspirations',
    images: [
      { id: 'a1', emoji: '🎯', label: 'Goals' },
      { id: 'a2', emoji: '💡', label: 'Ideas' },
      { id: 'a3', emoji: '🚀', label: 'Progress' },
      { id: 'a4', emoji: '🏆', label: 'Achievement' },
      { id: 'a5', emoji: '🌟', label: 'Shine' },
      { id: 'a6', emoji: '🎨', label: 'Creativity' },
      { id: 'a7', emoji: '💝', label: 'Love' },
      { id: 'a8', emoji: '🙏', label: 'Gratitude' },
    ]
  },
];

// Affirmations
const AFFIRMATIONS = [
  "I am worthy of peace and happiness",
  "Every day I grow stronger",
  "I choose calm over chaos",
  "I am exactly where I need to be",
  "My journey is unique and beautiful",
  "I release what no longer serves me",
  "I am capable of amazing things",
  "Peace flows through me",
  "I embrace each moment fully",
  "I am resilient and brave",
];

type Phase = 'intro' | 'theme' | 'collecting' | 'affirmation' | 'reflection';

export default function DigitalVisionBoard({ onBack, onComplete }: DigitalVisionBoardProps) {
  const { isDark, colors } = useTheme();
  const [phase, setPhase] = useState<Phase>('intro');
  
  const [boardTitle, setBoardTitle] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(BOARD_THEMES[0]);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [activeCategory, setActiveCategory] = useState(IMAGE_CATEGORIES[0].id);
  const [selectedAffirmation, setSelectedAffirmation] = useState('');
  const [customAffirmation, setCustomAffirmation] = useState('');

  const toggleImage = (image: { id: string; emoji: string; label: string }, category: string) => {
    const existing = selectedImages.find(img => img.id === image.id);
    if (existing) {
      setSelectedImages(selectedImages.filter(img => img.id !== image.id));
    } else if (selectedImages.length < 9) {
      setSelectedImages([...selectedImages, {
        ...image,
        category,
        position: selectedImages.length,
      }]);
    }
  };

  const isImageSelected = (id: string) => selectedImages.some(img => img.id === id);

  const bg = isDark
    ? 'linear-gradient(180deg, #0c0c14 0%, #12121c 50%, #0a0a10 100%)'
    : 'linear-gradient(180deg, #faf8f5 0%, #f5f0ea 50%, #efe8e0 100%)';

  const accent = selectedTheme.accent;

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-8px) rotate(2deg); } }
        .image-tile { transition: all 0.2s ease; }
        .image-tile:active { transform: scale(0.95); }
        .category-tab { transition: all 0.2s ease; }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, background: bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ padding: 'max(env(safe-area-inset-top, 12px), 12px) 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`, zIndex: 20 }}>
          <button onClick={onBack} style={{ padding: '8px 16px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`, borderRadius: 20, color: colors.text, fontSize: 13, fontWeight: 450, cursor: 'pointer' }}>← Back</button>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.textMuted }}>Vision Board</span>
          <div style={{ width: 70 }} />
        </header>

        {/* INTRO PHASE */}
        {phase === 'intro' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 32, animation: 'float 5s ease-in-out infinite' }}>
              {['🌊', '✨', '🌸', '💫', '🦋', '🌙', '🌿', '💝', '☀️'].map((emoji, i) => (
                <div key={i} style={{ width: 48, height: 48, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.1)', animation: `fadeIn 0.3s ease ${i * 0.05}s both` }} />
              ))}
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', fontWeight: 300, color: colors.text, marginBottom: 12, letterSpacing: '-0.02em' }}>Digital Vision Board</h1>
            <p style={{ fontSize: 14, color: colors.textMuted, maxWidth: 320, lineHeight: 1.6, marginBottom: 40 }}>Collect images that inspire calm and visualize your intentions. Create a digital collage that reflects your hopes, dreams, and peaceful aspirations.</p>
            <button onClick={() => setPhase('theme')} style={{ padding: '14px 36px', background: `linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)`, border: 'none', borderRadius: 25, color: isDark ? '#0f172a' : '#1e293b', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: `0 4px 20px ${accent}66` }}>Create Board</button>
          </div>
        )}

        {/* THEME PHASE */}
        {phase === 'theme' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 16px', paddingBottom: 'max(env(safe-area-inset-bottom, 20px), 20px)', overflow: 'auto', WebkitOverflowScrolling: 'touch', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.3rem, 5vw, 1.6rem)', fontWeight: 300, color: colors.text, marginBottom: 8 }}>Choose Your Theme</h2>
              <p style={{ fontSize: 13, color: colors.textMuted }}>What intention guides your board?</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {BOARD_THEMES.map((theme) => (
                <button key={theme.id} onClick={() => setSelectedTheme(theme)} style={{ padding: '16px', background: selectedTheme.id === theme.id ? (isDark ? `${theme.accent}22` : `${theme.accent}33`) : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)'), border: `1px solid ${selectedTheme.id === theme.id ? `${theme.accent}88` : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')}`, borderRadius: 14, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}99 100%)`, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: colors.text }}>{theme.name}</div>
                    <div style={{ fontSize: 12, color: colors.textMuted }}>{theme.description}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Board Title */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Name Your Board (optional)</p>
              <input type="text" value={boardTitle} onChange={(e) => setBoardTitle(e.target.value)} placeholder={`My ${selectedTheme.name} Board`} style={{ width: '100%', padding: '12px 16px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 12, color: colors.text, fontSize: 14, outline: 'none' }} />
            </div>

            <button onClick={() => setPhase('collecting')} style={{ padding: '14px 28px', background: `linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)`, border: 'none', borderRadius: 25, color: isDark ? '#0f172a' : '#1e293b', fontSize: 14, fontWeight: 600, cursor: 'pointer', alignSelf: 'center', marginTop: 'auto' }}>Start Collecting</button>
          </div>
        )}

        {/* COLLECTING PHASE */}
        {phase === 'collecting' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 16px)', overflow: 'hidden' }}>
            {/* Mini board preview */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, padding: 12, background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)', borderRadius: 12, border: `1px solid ${accent}44` }}>
                {[...Array(9)].map((_, i) => {
                  const img = selectedImages[i];
                  return (
                    <div key={i} style={{ aspectRatio: '1', background: img ? `${accent}33` : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'), borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: img ? 18 : 12, color: colors.textMuted }}>
                      {img ? img.emoji : ''}
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 8 }}>{selectedImages.length}/9 images selected</p>
            </div>

            {/* Category tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 4 }}>
              {IMAGE_CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className="category-tab" style={{ padding: '8px 16px', background: activeCategory === cat.id ? `${accent}33` : 'transparent', border: `1px solid ${activeCategory === cat.id ? accent : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')}`, borderRadius: 20, color: activeCategory === cat.id ? colors.text : colors.textMuted, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{cat.name}</button>
              ))}
            </div>

            {/* Image grid */}
            <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {IMAGE_CATEGORIES.find(c => c.id === activeCategory)?.images.map((img) => {
                  const selected = isImageSelected(img.id);
                  return (
                    <button key={img.id} onClick={() => toggleImage(img, activeCategory)} className="image-tile" style={{ aspectRatio: '1', background: selected ? `${accent}33` : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)'), border: `2px solid ${selected ? accent : 'transparent'}`, borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer', boxShadow: selected ? `0 0 16px ${accent}44` : '0 2px 8px rgba(0,0,0,0.1)' }}>
                      <span style={{ fontSize: 28 }}>{img.emoji}</span>
                      <span style={{ fontSize: 10, color: colors.textMuted }}>{img.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button onClick={() => setPhase('affirmation')} disabled={selectedImages.length === 0} style={{ padding: '14px 28px', background: selectedImages.length > 0 ? `linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)` : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'), border: 'none', borderRadius: 25, color: selectedImages.length > 0 ? (isDark ? '#0f172a' : '#1e293b') : colors.textMuted, fontSize: 14, fontWeight: 600, cursor: selectedImages.length > 0 ? 'pointer' : 'default', alignSelf: 'center', marginTop: 16 }}>Add Affirmation</button>
          </div>
        )}

        {/* AFFIRMATION PHASE */}
        {phase === 'affirmation' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 16px', paddingBottom: 'max(env(safe-area-inset-bottom, 20px), 20px)', overflow: 'auto', WebkitOverflowScrolling: 'touch', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.3rem, 5vw, 1.6rem)', fontWeight: 300, color: colors.text, marginBottom: 8 }}>Add an Affirmation</h2>
              <p style={{ fontSize: 13, color: colors.textMuted }}>Words to anchor your vision</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {AFFIRMATIONS.map((aff, index) => (
                <button key={index} onClick={() => { setSelectedAffirmation(aff); setCustomAffirmation(''); }} style={{ padding: '14px 16px', background: selectedAffirmation === aff ? `${accent}22` : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)'), border: `1px solid ${selectedAffirmation === aff ? `${accent}66` : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')}`, borderRadius: 12, textAlign: 'left', cursor: 'pointer' }}>
                  <span style={{ fontSize: 14, color: selectedAffirmation === aff ? colors.text : colors.textMuted, fontStyle: 'italic' }}>"{aff}"</span>
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>Or write your own:</p>
              <textarea value={customAffirmation} onChange={(e) => { setCustomAffirmation(e.target.value); setSelectedAffirmation(''); }} placeholder="My personal affirmation..." style={{ width: '100%', padding: '14px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 12, color: colors.text, fontSize: 14, resize: 'none', height: 80, outline: 'none', fontFamily: 'inherit' }} />
            </div>

            <button onClick={() => setPhase('reflection')} style={{ padding: '14px 28px', background: `linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)`, border: 'none', borderRadius: 25, color: isDark ? '#0f172a' : '#1e293b', fontSize: 14, fontWeight: 600, cursor: 'pointer', alignSelf: 'center', marginTop: 'auto' }}>Complete Board</button>
          </div>
        )}

        {/* REFLECTION PHASE */}
        {phase === 'reflection' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', paddingBottom: 'max(env(safe-area-inset-bottom, 24px), 24px)', overflow: 'auto', WebkitOverflowScrolling: 'touch', animation: 'fadeIn 0.5s ease' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', fontWeight: 300, color: colors.text, marginBottom: 4, textAlign: 'center' }}>{boardTitle || `My ${selectedTheme.name} Board`}</h2>
            <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 20 }}>{selectedTheme.name}</p>

            {/* Vision board display */}
            <div style={{ width: '100%', maxWidth: 300, padding: 16, background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)', borderRadius: 20, border: `2px solid ${accent}44`, marginBottom: 16, boxShadow: `0 8px 32px ${accent}22` }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
                {selectedImages.slice(0, 9).map((img, i) => (
                  <div key={i} style={{ aspectRatio: '1', background: `${accent}22`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    {img.emoji}
                  </div>
                ))}
              </div>
              
              {/* Affirmation */}
              <div style={{ textAlign: 'center', padding: '12px 8px', background: `${accent}15`, borderRadius: 12 }}>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontStyle: 'italic', color: colors.text, lineHeight: 1.4 }}>"{customAffirmation || selectedAffirmation || 'I am at peace'}"</p>
              </div>
            </div>

            <div style={{ textAlign: 'center', maxWidth: 340, marginBottom: 32 }}>
              <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.6 }}>Your vision board is a visual reminder of what matters most. Return to it when you need inspiration, or update it as your journey evolves.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280 }}>
              <button onClick={() => { if (onComplete) onComplete({ board: { title: boardTitle || `My ${selectedTheme.name} Board`, theme: selectedTheme.id, images: selectedImages, affirmation: customAffirmation || selectedAffirmation } }); onBack(); }} style={{ padding: '14px 24px', background: `linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)`, border: 'none', borderRadius: 25, color: isDark ? '#0f172a' : '#1e293b', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: `0 4px 20px ${accent}44` }}>Complete</button>
              <button onClick={() => setPhase('collecting')} style={{ padding: '12px 24px', background: 'transparent', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 25, color: colors.textMuted, fontSize: 14, cursor: 'pointer' }}>Edit Board</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}