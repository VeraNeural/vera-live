'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ComfortKitBuilderProps {
  onBack: () => void;
  onComplete?: (data: { kit: ComfortKit }) => void;
}

interface ComfortKit {
  name: string;
  purpose: string;
  items: KitItem[];
  reminder: string;
}

interface KitItem {
  id: string;
  name: string;
  category: string;
  emoji: string;
  why?: string;
}

// Kit purposes
const KIT_PURPOSES = [
  { id: 'anxiety', name: 'Anxiety Relief', description: 'For moments of worry or panic', emoji: '🫂' },
  { id: 'sadness', name: 'Sadness Support', description: 'For low days and grief', emoji: '💙' },
  { id: 'stress', name: 'Stress Recovery', description: 'For overwhelm and burnout', emoji: '🌿' },
  { id: 'sleep', name: 'Sleep Aid', description: 'For restless nights', emoji: '🌙' },
  { id: 'grounding', name: 'Grounding Kit', description: 'For feeling disconnected', emoji: '🌳' },
  { id: 'joy', name: 'Joy Boost', description: 'For lifting your spirits', emoji: '☀️' },
];

// Item categories
const ITEM_CATEGORIES = [
  {
    id: 'sensory',
    name: 'Sensory Soothers',
    description: 'Touch, smell, sight, sound',
    items: [
      { id: 's1', name: 'Soft Blanket', emoji: '🧣' },
      { id: 's2', name: 'Stress Ball', emoji: '🔴' },
      { id: 's3', name: 'Essential Oils', emoji: '🫧' },
      { id: 's4', name: 'Scented Candle', emoji: '🕯️' },
      { id: 's5', name: 'Calming Music Playlist', emoji: '🎵' },
      { id: 's6', name: 'Weighted Blanket', emoji: '🛏️' },
      { id: 's7', name: 'Hand Cream', emoji: '🧴' },
      { id: 's8', name: 'Smooth Stone', emoji: '🪨' },
      { id: 's9', name: 'Fidget Toy', emoji: '🔷' },
      { id: 's10', name: 'Eye Mask', emoji: '😴' },
    ]
  },
  {
    id: 'comfort',
    name: 'Comfort Items',
    description: 'Familiar and nurturing',
    items: [
      { id: 'c1', name: 'Favorite Tea/Coffee', emoji: '☕' },
      { id: 'c2', name: 'Comfort Snacks', emoji: '🍫' },
      { id: 'c3', name: 'Cozy Socks', emoji: '🧦' },
      { id: 'c4', name: 'Hot Water Bottle', emoji: '♨️' },
      { id: 'c5', name: 'Favorite Book', emoji: '📖' },
      { id: 'c6', name: 'Photo of Loved Ones', emoji: '🖼️' },
      { id: 'c7', name: 'Stuffed Animal', emoji: '🧸' },
      { id: 'c8', name: 'Comfort Movie List', emoji: '🎬' },
      { id: 'c9', name: 'Favorite Sweater', emoji: '🧥' },
      { id: 'c10', name: 'Warm Drink Recipe', emoji: '🥛' },
    ]
  },
  {
    id: 'activities',
    name: 'Coping Activities',
    description: 'Things to do',
    items: [
      { id: 'a1', name: 'Journal & Pen', emoji: '📝' },
      { id: 'a2', name: 'Coloring Book', emoji: '🎨' },
      { id: 'a3', name: 'Puzzle', emoji: '🧩' },
      { id: 'a4', name: 'Breathing Exercise Card', emoji: '🌬️' },
      { id: 'a5', name: 'Meditation App', emoji: '🧘' },
      { id: 'a6', name: 'Simple Craft Supplies', emoji: '✂️' },
      { id: 'a7', name: 'Walking Route Map', emoji: '🗺️' },
      { id: 'a8', name: 'Stretching Guide', emoji: '🤸' },
      { id: 'a9', name: 'Gratitude Prompts', emoji: '🙏' },
      { id: 'a10', name: 'Positive Affirmations', emoji: '💬' },
    ]
  },
  {
    id: 'connection',
    name: 'Connection Tools',
    description: 'Reaching out',
    items: [
      { id: 'n1', name: 'Contact List of Supporters', emoji: '📱' },
      { id: 'n2', name: 'Therapist Info', emoji: '💼' },
      { id: 'n3', name: 'Crisis Hotline Numbers', emoji: '📞' },
      { id: 'n4', name: 'Encouraging Messages', emoji: '💌' },
      { id: 'n5', name: 'Voice Memos from Loved Ones', emoji: '🎙️' },
      { id: 'n6', name: 'Online Support Group Links', emoji: '👥' },
      { id: 'n7', name: 'Pet or Plant to Care For', emoji: '🌱' },
      { id: 'n8', name: 'Reminder Notes to Self', emoji: '📋' },
    ]
  },
];

// Self-compassion reminders
const REMINDERS = [
  "It's okay to not be okay",
  "This feeling will pass",
  "You've gotten through hard times before",
  "Be gentle with yourself",
  "You deserve comfort and care",
  "Take it one moment at a time",
  "Your feelings are valid",
  "It's okay to ask for help",
  "You are not alone in this",
  "Rest is productive",
];

type Phase = 'intro' | 'purpose' | 'items' | 'personalize' | 'reflection';

export default function ComfortKitBuilder({ onBack, onComplete }: ComfortKitBuilderProps) {
  const { isDark, colors } = useTheme();
  const [phase, setPhase] = useState<Phase>('intro');
  
  const [selectedPurpose, setSelectedPurpose] = useState(KIT_PURPOSES[0]);
  const [selectedItems, setSelectedItems] = useState<KitItem[]>([]);
  const [activeCategory, setActiveCategory] = useState(ITEM_CATEGORIES[0].id);
  const [kitName, setKitName] = useState('');
  const [selectedReminder, setSelectedReminder] = useState('');
  const [customReminder, setCustomReminder] = useState('');

  const toggleItem = (item: { id: string; name: string; emoji: string }, category: string) => {
    const existing = selectedItems.find(i => i.id === item.id);
    if (existing) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else if (selectedItems.length < 12) {
      setSelectedItems([...selectedItems, { ...item, category }]);
    }
  };

  const isItemSelected = (id: string) => selectedItems.some(i => i.id === id);

  const bg = isDark
    ? 'linear-gradient(180deg, #0c0c14 0%, #12121c 50%, #0a0a10 100%)'
    : 'linear-gradient(180deg, #faf8f5 0%, #f5f0ea 50%, #efe8e0 100%)';

  const accent = 'rgba(244,114,182,0.9)';

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes heartbeat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .item-card { transition: all 0.2s ease; }
        .item-card:active { transform: scale(0.95); }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, background: bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ padding: 'max(env(safe-area-inset-top, 12px), 12px) 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`, zIndex: 20 }}>
          <button onClick={onBack} style={{ padding: '8px 16px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`, borderRadius: 20, color: colors.text, fontSize: 13, fontWeight: 450, cursor: 'pointer' }}>← Back</button>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.textMuted }}>Comfort Kit</span>
          <div style={{ width: 70 }} />
        </header>

        {/* INTRO PHASE */}
        {phase === 'intro' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ width: 100, height: 100, borderRadius: 20, background: `linear-gradient(135deg, rgba(244,114,182,0.2) 0%, rgba(251,113,133,0.2) 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, animation: 'float 4s ease-in-out infinite' }}>
              <span style={{ fontSize: 48, animation: 'heartbeat 2s ease-in-out infinite' }}>🎁</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', fontWeight: 300, color: colors.text, marginBottom: 12, letterSpacing: '-0.02em' }}>Comfort Kit Builder</h1>
            <p style={{ fontSize: 14, color: colors.textMuted, maxWidth: 320, lineHeight: 1.6, marginBottom: 40 }}>Create a personalized toolkit of comforting items and activities. Having a plan for difficult moments helps you take care of yourself when you need it most.</p>
            <button onClick={() => setPhase('purpose')} style={{ padding: '14px 36px', background: `linear-gradient(135deg, ${accent} 0%, rgba(244,114,182,0.85) 100%)`, border: 'none', borderRadius: 25, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(244,114,182,0.3)' }}>Build Your Kit</button>
          </div>
        )}

        {/* PURPOSE PHASE */}
        {phase === 'purpose' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 16px', paddingBottom: 'max(env(safe-area-inset-bottom, 20px), 20px)', overflow: 'auto', WebkitOverflowScrolling: 'touch', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.3rem, 5vw, 1.6rem)', fontWeight: 300, color: colors.text, marginBottom: 8 }}>What's This Kit For?</h2>
              <p style={{ fontSize: 13, color: colors.textMuted }}>Choose the moments you want to prepare for</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
              {KIT_PURPOSES.map((purpose) => (
                <button key={purpose.id} onClick={() => setSelectedPurpose(purpose)} className="item-card" style={{ padding: '18px 14px', background: selectedPurpose.id === purpose.id ? (isDark ? 'rgba(244,114,182,0.15)' : 'rgba(244,114,182,0.1)') : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)'), border: `1px solid ${selectedPurpose.id === purpose.id ? 'rgba(244,114,182,0.4)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')}`, borderRadius: 16, textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{purpose.emoji}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 4 }}>{purpose.name}</div>
                  <div style={{ fontSize: 11, color: colors.textMuted }}>{purpose.description}</div>
                </button>
              ))}
            </div>

            <button onClick={() => setPhase('items')} style={{ padding: '14px 28px', background: `linear-gradient(135deg, ${accent} 0%, rgba(244,114,182,0.85) 100%)`, border: 'none', borderRadius: 25, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', alignSelf: 'center', marginTop: 'auto' }}>Choose Items</button>
          </div>
        )}

        {/* ITEMS PHASE */}
        {phase === 'items' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 16px)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{selectedPurpose.emoji}</div>
              <p style={{ fontSize: 12, color: colors.textMuted }}>{selectedItems.length}/12 items selected</p>
            </div>

            {/* Category tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 4 }}>
              {ITEM_CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ padding: '8px 14px', background: activeCategory === cat.id ? `${accent}33` : 'transparent', border: `1px solid ${activeCategory === cat.id ? accent : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')}`, borderRadius: 20, color: activeCategory === cat.id ? colors.text : colors.textMuted, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{cat.name}</button>
              ))}
            </div>

            {/* Category description */}
            <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 12, fontStyle: 'italic' }}>{ITEM_CATEGORIES.find(c => c.id === activeCategory)?.description}</p>

            {/* Items grid */}
            <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {ITEM_CATEGORIES.find(c => c.id === activeCategory)?.items.map((item) => {
                  const selected = isItemSelected(item.id);
                  return (
                    <button key={item.id} onClick={() => toggleItem(item, activeCategory)} className="item-card" style={{ padding: '14px 12px', background: selected ? `${accent}22` : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)'), border: `1px solid ${selected ? accent : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')}`, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left' }}>
                      <span style={{ fontSize: 24 }}>{item.emoji}</span>
                      <span style={{ fontSize: 13, color: selected ? colors.text : colors.textMuted }}>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button onClick={() => setPhase('personalize')} disabled={selectedItems.length === 0} style={{ padding: '14px 28px', background: selectedItems.length > 0 ? `linear-gradient(135deg, ${accent} 0%, rgba(244,114,182,0.85) 100%)` : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'), border: 'none', borderRadius: 25, color: selectedItems.length > 0 ? 'white' : colors.textMuted, fontSize: 14, fontWeight: 600, cursor: selectedItems.length > 0 ? 'pointer' : 'default', alignSelf: 'center', marginTop: 16 }}>Personalize Kit</button>
          </div>
        )}

        {/* PERSONALIZE PHASE */}
        {phase === 'personalize' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 16px', paddingBottom: 'max(env(safe-area-inset-bottom, 20px), 20px)', overflow: 'auto', WebkitOverflowScrolling: 'touch', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.2rem, 4vw, 1.4rem)', fontWeight: 300, color: colors.text, marginBottom: 4 }}>Personalize Your Kit</h2>
            </div>

            {/* Kit name */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Name Your Kit</p>
              <input type="text" value={kitName} onChange={(e) => setKitName(e.target.value)} placeholder={`My ${selectedPurpose.name} Kit`} style={{ width: '100%', padding: '12px 16px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 12, color: colors.text, fontSize: 14, outline: 'none' }} />
            </div>

            {/* Self-compassion reminder */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Add a Self-Compassion Reminder</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflow: 'auto' }}>
                {REMINDERS.map((reminder, index) => (
                  <button key={index} onClick={() => { setSelectedReminder(reminder); setCustomReminder(''); }} style={{ padding: '12px 14px', background: selectedReminder === reminder ? `${accent}22` : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)'), border: `1px solid ${selectedReminder === reminder ? `${accent}66` : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')}`, borderRadius: 10, textAlign: 'left', cursor: 'pointer' }}>
                    <span style={{ fontSize: 13, color: selectedReminder === reminder ? colors.text : colors.textMuted }}>"{reminder}"</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>Or write your own:</p>
              <textarea value={customReminder} onChange={(e) => { setCustomReminder(e.target.value); setSelectedReminder(''); }} placeholder="A reminder for difficult moments..." style={{ width: '100%', padding: '14px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 12, color: colors.text, fontSize: 14, resize: 'none', height: 70, outline: 'none', fontFamily: 'inherit' }} />
            </div>

            <button onClick={() => setPhase('reflection')} style={{ padding: '14px 28px', background: `linear-gradient(135deg, ${accent} 0%, rgba(244,114,182,0.85) 100%)`, border: 'none', borderRadius: 25, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', alignSelf: 'center', marginTop: 'auto' }}>Complete Kit</button>
          </div>
        )}

        {/* REFLECTION PHASE */}
        {phase === 'reflection' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', paddingBottom: 'max(env(safe-area-inset-bottom, 24px), 24px)', overflow: 'auto', WebkitOverflowScrolling: 'touch', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{selectedPurpose.emoji}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', fontWeight: 300, color: colors.text, marginBottom: 4, textAlign: 'center' }}>{kitName || `My ${selectedPurpose.name} Kit`}</h2>
            <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 20 }}>{selectedItems.length} comfort items</p>

            {/* Kit contents */}
            <div style={{ width: '100%', maxWidth: 340, padding: 20, background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)', borderRadius: 20, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, marginBottom: 16 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {selectedItems.map((item) => (
                  <div key={item.id} style={{ padding: '8px 12px', background: `${accent}15`, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 16 }}>{item.emoji}</span>
                    <span style={{ fontSize: 12, color: colors.text }}>{item.name}</span>
                  </div>
                ))}
              </div>

              {/* Reminder */}
              <div style={{ padding: '14px', background: isDark ? 'rgba(244,114,182,0.1)' : 'rgba(244,114,182,0.08)', borderRadius: 12, borderLeft: `3px solid ${accent}` }}>
                <p style={{ fontSize: 11, color: colors.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Remember</p>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontStyle: 'italic', color: colors.text, lineHeight: 1.4 }}>"{customReminder || selectedReminder || "Be gentle with yourself"}"</p>
              </div>
            </div>

            <div style={{ textAlign: 'center', maxWidth: 340, marginBottom: 32 }}>
              <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.6 }}>Your comfort kit is ready. Consider gathering these items in a real box or bag so they're ready when you need them. Taking care of yourself is an act of courage.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280 }}>
              <button onClick={() => { if (onComplete) onComplete({ kit: { name: kitName || `My ${selectedPurpose.name} Kit`, purpose: selectedPurpose.id, items: selectedItems, reminder: customReminder || selectedReminder } }); onBack(); }} style={{ padding: '14px 24px', background: `linear-gradient(135deg, ${accent} 0%, rgba(244,114,182,0.85) 100%)`, border: 'none', borderRadius: 25, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(244,114,182,0.3)' }}>Complete</button>
              <button onClick={() => setPhase('items')} style={{ padding: '12px 24px', background: 'transparent', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 25, color: colors.textMuted, fontSize: 14, cursor: 'pointer' }}>Edit Kit</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}