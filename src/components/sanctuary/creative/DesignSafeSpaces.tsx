'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface DesignSafeSpaceProps {
  onBack: () => void;
  onComplete?: (data: { space: SafeSpaceDesign }) => void;
}

interface SafeSpaceDesign {
  environment: string;
  lighting: string;
  sounds: string[];
  scents: string[];
  textures: string[];
  objects: string[];
  colors: string[];
  mood: string;
}

// Environment options
const ENVIRONMENTS = [
  { id: 'cozy-room', name: 'Cozy Room', icon: '🏠', description: 'A warm, enclosed space' },
  { id: 'nature-retreat', name: 'Nature Retreat', icon: '🌲', description: 'Surrounded by trees and plants' },
  { id: 'beach', name: 'Beach Shore', icon: '🏖️', description: 'Ocean waves and sand' },
  { id: 'mountain', name: 'Mountain View', icon: '⛰️', description: 'High peaks and fresh air' },
  { id: 'garden', name: 'Secret Garden', icon: '🌸', description: 'Flowers and gentle pathways' },
  { id: 'cloud', name: 'Cloud Haven', icon: '☁️', description: 'Floating, weightless serenity' },
];

// Lighting options
const LIGHTING_OPTIONS = [
  { id: 'soft-warm', name: 'Soft & Warm', description: 'Golden, candle-like glow' },
  { id: 'natural', name: 'Natural Daylight', description: 'Gentle sunlight streaming in' },
  { id: 'dim', name: 'Dim & Cozy', description: 'Low, ambient lighting' },
  { id: 'starlight', name: 'Starlight', description: 'Twinkling night sky' },
  { id: 'sunrise', name: 'Sunrise Colors', description: 'Pink and orange hues' },
  { id: 'moonlight', name: 'Moonlight', description: 'Cool, silvery glow' },
];

// Sound options
const SOUND_OPTIONS = [
  { id: 'silence', name: 'Peaceful Silence' },
  { id: 'rain', name: 'Gentle Rain' },
  { id: 'waves', name: 'Ocean Waves' },
  { id: 'birds', name: 'Bird Songs' },
  { id: 'wind', name: 'Soft Wind' },
  { id: 'fire', name: 'Crackling Fire' },
  { id: 'music', name: 'Soft Music' },
  { id: 'chimes', name: 'Wind Chimes' },
];

// Scent options
const SCENT_OPTIONS = [
  { id: 'lavender', name: 'Lavender' },
  { id: 'vanilla', name: 'Vanilla' },
  { id: 'pine', name: 'Fresh Pine' },
  { id: 'ocean', name: 'Ocean Breeze' },
  { id: 'flowers', name: 'Fresh Flowers' },
  { id: 'rain', name: 'Petrichor (Rain)' },
  { id: 'cinnamon', name: 'Warm Cinnamon' },
  { id: 'clean', name: 'Clean Linen' },
];

// Texture options
const TEXTURE_OPTIONS = [
  { id: 'soft-blanket', name: 'Soft Blanket' },
  { id: 'plush-pillow', name: 'Plush Pillows' },
  { id: 'warm-wood', name: 'Warm Wood' },
  { id: 'cool-stone', name: 'Cool Stone' },
  { id: 'soft-grass', name: 'Soft Grass' },
  { id: 'silk', name: 'Smooth Silk' },
  { id: 'fuzzy-rug', name: 'Fuzzy Rug' },
  { id: 'sand', name: 'Fine Sand' },
];

// Comfort objects
const COMFORT_OBJECTS = [
  { id: 'books', name: 'Stack of Books' },
  { id: 'plants', name: 'Potted Plants' },
  { id: 'candles', name: 'Candles' },
  { id: 'tea', name: 'Warm Tea/Coffee' },
  { id: 'pet', name: 'A Loving Pet' },
  { id: 'photos', name: 'Cherished Photos' },
  { id: 'journal', name: 'Journal & Pen' },
  { id: 'instrument', name: 'Musical Instrument' },
  { id: 'art', name: 'Art Supplies' },
  { id: 'crystals', name: 'Crystals/Stones' },
];

// Color palette options
const COLOR_OPTIONS = [
  { id: 'cream', color: '#fef3c7', name: 'Warm Cream' },
  { id: 'sage', color: '#d1fae5', name: 'Sage Green' },
  { id: 'sky', color: '#dbeafe', name: 'Sky Blue' },
  { id: 'lavender', color: '#ede9fe', name: 'Soft Lavender' },
  { id: 'rose', color: '#fce7f3', name: 'Dusty Rose' },
  { id: 'sand', color: '#fef9c3', name: 'Sandy Beige' },
  { id: 'slate', color: '#e2e8f0', name: 'Cool Slate' },
  { id: 'peach', color: '#ffedd5', name: 'Warm Peach' },
];

// Mood options
const MOOD_OPTIONS = [
  { id: 'peaceful', name: 'Peaceful & Calm' },
  { id: 'cozy', name: 'Cozy & Warm' },
  { id: 'energizing', name: 'Gently Energizing' },
  { id: 'dreamy', name: 'Dreamy & Soft' },
  { id: 'grounding', name: 'Grounding & Stable' },
  { id: 'inspiring', name: 'Inspiring & Open' },
];

type Phase = 'intro' | 'environment' | 'atmosphere' | 'details' | 'reflection';

export default function DesignSafeSpace({ onBack, onComplete }: DesignSafeSpaceProps) {
  const { isDark, colors } = useTheme();
  const [phase, setPhase] = useState<Phase>('intro');
  
  const [selectedEnvironment, setSelectedEnvironment] = useState('');
  const [selectedLighting, setSelectedLighting] = useState('');
  const [selectedSounds, setSelectedSounds] = useState<string[]>([]);
  const [selectedScents, setSelectedScents] = useState<string[]>([]);
  const [selectedTextures, setSelectedTextures] = useState<string[]>([]);
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState('');

  const toggleSelection = (item: string, list: string[], setList: (items: string[]) => void, max: number = 4) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else if (list.length < max) {
      setList([...list, item]);
    }
  };

  const getEnvironmentIcon = () => {
    const env = ENVIRONMENTS.find(e => e.id === selectedEnvironment);
    return env?.icon || '✨';
  };

  const bg = isDark
    ? 'linear-gradient(180deg, #0c0c14 0%, #12121c 50%, #0a0a10 100%)'
    : 'linear-gradient(180deg, #faf8f5 0%, #f5f0ea 50%, #efe8e0 100%)';

  const accent = 'rgba(129,140,248,0.9)';

  const renderSelectionChip = (id: string, name: string, isSelected: boolean, onToggle: () => void, small: boolean = false) => (
    <button
      key={id}
      onClick={onToggle}
      style={{
        padding: small ? '8px 12px' : '10px 16px',
        background: isSelected 
          ? (isDark ? 'rgba(129,140,248,0.2)' : 'rgba(129,140,248,0.15)')
          : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)'),
        border: `1px solid ${isSelected ? 'rgba(129,140,248,0.5)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')}`,
        borderRadius: 20,
        color: isSelected ? colors.text : colors.textMuted,
        fontSize: small ? 12 : 13,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {name}
    </button>
  );

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 30px rgba(129,140,248,0.3); } 50% { box-shadow: 0 0 50px rgba(129,140,248,0.5); } }
        .env-card { transition: all 0.2s ease; }
        .env-card:active { transform: scale(0.97); }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, background: bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ padding: 'max(env(safe-area-inset-top, 12px), 12px) 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`, zIndex: 20 }}>
          <button onClick={onBack} style={{ padding: '8px 16px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`, borderRadius: 20, color: colors.text, fontSize: 13, fontWeight: 450, cursor: 'pointer' }}>← Back</button>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.textMuted }}>Safe Space</span>
          <div style={{ width: 70 }} />
        </header>

        {/* INTRO PHASE */}
        {phase === 'intro' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: `linear-gradient(135deg, rgba(129,140,248,0.2) 0%, rgba(167,139,250,0.2) 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, animation: 'float 4s ease-in-out infinite, glow 3s ease-in-out infinite' }}>
              <span style={{ fontSize: 48 }}>🏡</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', fontWeight: 300, color: colors.text, marginBottom: 12, letterSpacing: '-0.02em' }}>Design Your Safe Space</h1>
            <p style={{ fontSize: 14, color: colors.textMuted, maxWidth: 320, lineHeight: 1.6, marginBottom: 40 }}>Create a mental sanctuary you can visit anytime. Visualize every detail — the sights, sounds, and feelings of your perfect peaceful place.</p>
            <button onClick={() => setPhase('environment')} style={{ padding: '14px 36px', background: `linear-gradient(135deg, ${accent} 0%, rgba(129,140,248,0.85) 100%)`, border: 'none', borderRadius: 25, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(129,140,248,0.3)' }}>Begin Designing</button>
          </div>
        )}

        {/* ENVIRONMENT PHASE */}
        {phase === 'environment' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 16px', paddingBottom: 'max(env(safe-area-inset-bottom, 20px), 20px)', overflow: 'auto', WebkitOverflowScrolling: 'touch', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.3rem, 5vw, 1.6rem)', fontWeight: 300, color: colors.text, marginBottom: 8 }}>Choose Your Environment</h2>
              <p style={{ fontSize: 13, color: colors.textMuted }}>Where does your safe space exist?</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
              {ENVIRONMENTS.map((env) => (
                <button key={env.id} onClick={() => setSelectedEnvironment(env.id)} className="env-card" style={{ padding: '20px 16px', background: selectedEnvironment === env.id ? (isDark ? 'rgba(129,140,248,0.15)' : 'rgba(129,140,248,0.1)') : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)'), border: `1px solid ${selectedEnvironment === env.id ? 'rgba(129,140,248,0.4)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')}`, borderRadius: 16, textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{env.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 4 }}>{env.name}</div>
                  <div style={{ fontSize: 11, color: colors.textMuted }}>{env.description}</div>
                </button>
              ))}
            </div>

            <button onClick={() => setPhase('atmosphere')} disabled={!selectedEnvironment} style={{ padding: '14px 28px', background: selectedEnvironment ? `linear-gradient(135deg, ${accent} 0%, rgba(129,140,248,0.85) 100%)` : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'), border: 'none', borderRadius: 25, color: selectedEnvironment ? 'white' : colors.textMuted, fontSize: 14, fontWeight: 600, cursor: selectedEnvironment ? 'pointer' : 'default', alignSelf: 'center', marginTop: 'auto' }}>Continue</button>
          </div>
        )}

        {/* ATMOSPHERE PHASE */}
        {phase === 'atmosphere' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 16px', paddingBottom: 'max(env(safe-area-inset-bottom, 20px), 20px)', overflow: 'auto', WebkitOverflowScrolling: 'touch', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{getEnvironmentIcon()}</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.2rem, 4vw, 1.4rem)', fontWeight: 300, color: colors.text, marginBottom: 4 }}>Set the Atmosphere</h2>
            </div>

            {/* Lighting */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Lighting</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {LIGHTING_OPTIONS.map((light) => renderSelectionChip(light.id, light.name, selectedLighting === light.id, () => setSelectedLighting(light.id)))}
              </div>
            </div>

            {/* Sounds */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sounds (up to 3)</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SOUND_OPTIONS.map((sound) => renderSelectionChip(sound.id, sound.name, selectedSounds.includes(sound.id), () => toggleSelection(sound.id, selectedSounds, setSelectedSounds, 3), true))}
              </div>
            </div>

            {/* Scents */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scents (up to 2)</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SCENT_OPTIONS.map((scent) => renderSelectionChip(scent.id, scent.name, selectedScents.includes(scent.id), () => toggleSelection(scent.id, selectedScents, setSelectedScents, 2), true))}
              </div>
            </div>

            <button onClick={() => setPhase('details')} disabled={!selectedLighting} style={{ padding: '14px 28px', background: selectedLighting ? `linear-gradient(135deg, ${accent} 0%, rgba(129,140,248,0.85) 100%)` : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'), border: 'none', borderRadius: 25, color: selectedLighting ? 'white' : colors.textMuted, fontSize: 14, fontWeight: 600, cursor: selectedLighting ? 'pointer' : 'default', alignSelf: 'center', marginTop: 'auto' }}>Continue</button>
          </div>
        )}

        {/* DETAILS PHASE */}
        {phase === 'details' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 16px', paddingBottom: 'max(env(safe-area-inset-bottom, 20px), 20px)', overflow: 'auto', WebkitOverflowScrolling: 'touch', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.2rem, 4vw, 1.4rem)', fontWeight: 300, color: colors.text, marginBottom: 4 }}>Add the Details</h2>
              <p style={{ fontSize: 13, color: colors.textMuted }}>What makes it feel like yours?</p>
            </div>

            {/* Textures */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Textures to Touch (up to 3)</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {TEXTURE_OPTIONS.map((tex) => renderSelectionChip(tex.id, tex.name, selectedTextures.includes(tex.id), () => toggleSelection(tex.id, selectedTextures, setSelectedTextures, 3), true))}
              </div>
            </div>

            {/* Objects */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Comfort Objects (up to 4)</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {COMFORT_OBJECTS.map((obj) => renderSelectionChip(obj.id, obj.name, selectedObjects.includes(obj.id), () => toggleSelection(obj.id, selectedObjects, setSelectedObjects, 4), true))}
              </div>
            </div>

            {/* Colors */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Color Palette (up to 3)</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {COLOR_OPTIONS.map((col) => (
                  <button key={col.id} onClick={() => toggleSelection(col.id, selectedColors, setSelectedColors, 3)} style={{ width: 44, height: 44, borderRadius: 12, background: col.color, border: selectedColors.includes(col.id) ? '3px solid rgba(129,140,248,0.8)' : '2px solid rgba(0,0,0,0.1)', cursor: 'pointer', boxShadow: selectedColors.includes(col.id) ? '0 0 12px rgba(129,140,248,0.4)' : '0 2px 8px rgba(0,0,0,0.1)' }} title={col.name} />
                ))}
              </div>
            </div>

            {/* Mood */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Overall Mood</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {MOOD_OPTIONS.map((mood) => renderSelectionChip(mood.id, mood.name, selectedMood === mood.id, () => setSelectedMood(mood.id)))}
              </div>
            </div>

            <button onClick={() => setPhase('reflection')} style={{ padding: '14px 28px', background: `linear-gradient(135deg, ${accent} 0%, rgba(129,140,248,0.85) 100%)`, border: 'none', borderRadius: 25, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', alignSelf: 'center', marginTop: 'auto' }}>Complete Space</button>
          </div>
        )}

        {/* REFLECTION PHASE */}
        {phase === 'reflection' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', paddingBottom: 'max(env(safe-area-inset-bottom, 24px), 24px)', overflow: 'auto', WebkitOverflowScrolling: 'touch', animation: 'fadeIn 0.5s ease' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', fontWeight: 300, color: colors.text, marginBottom: 8, textAlign: 'center' }}>Your Safe Space</h2>
            
            {/* Visual representation */}
            <div style={{ width: '100%', maxWidth: 320, padding: 24, background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)', borderRadius: 20, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, marginBottom: 24 }}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 48 }}>{getEnvironmentIcon()}</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, color: colors.text, marginTop: 8 }}>{ENVIRONMENTS.find(e => e.id === selectedEnvironment)?.name}</h3>
              </div>
              
              {/* Color palette display */}
              {selectedColors.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                  {selectedColors.map(colId => {
                    const col = COLOR_OPTIONS.find(c => c.id === colId);
                    return col ? <div key={colId} style={{ width: 32, height: 32, borderRadius: 8, background: col.color, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} /> : null;
                  })}
                </div>
              )}

              <div style={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.8 }}>
                <p><strong style={{ color: colors.text }}>Lighting:</strong> {LIGHTING_OPTIONS.find(l => l.id === selectedLighting)?.name}</p>
                {selectedSounds.length > 0 && <p><strong style={{ color: colors.text }}>Sounds:</strong> {selectedSounds.map(id => SOUND_OPTIONS.find(s => s.id === id)?.name).join(', ')}</p>}
                {selectedScents.length > 0 && <p><strong style={{ color: colors.text }}>Scents:</strong> {selectedScents.map(id => SCENT_OPTIONS.find(s => s.id === id)?.name).join(', ')}</p>}
                {selectedTextures.length > 0 && <p><strong style={{ color: colors.text }}>Textures:</strong> {selectedTextures.map(id => TEXTURE_OPTIONS.find(t => t.id === id)?.name).join(', ')}</p>}
                {selectedObjects.length > 0 && <p><strong style={{ color: colors.text }}>Objects:</strong> {selectedObjects.map(id => COMFORT_OBJECTS.find(o => o.id === id)?.name).join(', ')}</p>}
                {selectedMood && <p><strong style={{ color: colors.text }}>Mood:</strong> {MOOD_OPTIONS.find(m => m.id === selectedMood)?.name}</p>}
              </div>
            </div>

            <div style={{ textAlign: 'center', maxWidth: 340, marginBottom: 32 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontStyle: 'italic', color: colors.text, marginBottom: 16, lineHeight: 1.5 }}>"Close your eyes and step inside"</p>
              <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.6 }}>Your safe space is always accessible. When you need peace, close your eyes, take a deep breath, and visualize yourself here. Every detail you've chosen is waiting for you.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280 }}>
              <button onClick={() => { if (onComplete) onComplete({ space: { environment: selectedEnvironment, lighting: selectedLighting, sounds: selectedSounds, scents: selectedScents, textures: selectedTextures, objects: selectedObjects, colors: selectedColors, mood: selectedMood } }); onBack(); }} style={{ padding: '14px 24px', background: `linear-gradient(135deg, ${accent} 0%, rgba(129,140,248,0.85) 100%)`, border: 'none', borderRadius: 25, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(129,140,248,0.3)' }}>Complete</button>
              <button onClick={() => setPhase('environment')} style={{ padding: '12px 24px', background: 'transparent', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 25, color: colors.textMuted, fontSize: 14, cursor: 'pointer' }}>Redesign Space</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}