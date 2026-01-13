'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

type SpacePsychologyScores = {
  visual: number;
  spatial: number;
  material: number;
  energy: number;
};

type SpacePsychologyProfile = {
  type: string;
  title: string;
  description: string;
  primary: string;
  design: string[];
  vds: string;
};

const QUESTIONS = [
  { id: 'q1', text: 'When you enter a new space, you first notice:', options: [
    { value: 'a', label: 'The light — natural or artificial, bright or dim', scores: { visual: 3, spatial: 1, material: 0, energy: 1 } },
    { value: 'b', label: 'The openness or enclosure — how much room there is', scores: { visual: 1, spatial: 3, material: 0, energy: 1 } },
    { value: 'c', label: 'The materials and textures around me', scores: { visual: 1, spatial: 0, material: 3, energy: 1 } },
    { value: 'd', label: 'The energy or mood of the space', scores: { visual: 1, spatial: 1, material: 1, energy: 3 } },
  ]},
  { id: 'q2', text: 'Your ideal workspace feels:', options: [
    { value: 'a', label: 'Open with good views and natural light', scores: { visual: 3, spatial: 2, material: 0, energy: 1 } },
    { value: 'b', label: 'Cozy and contained — a defined nest', scores: { visual: 0, spatial: 3, material: 2, energy: 1 } },
    { value: 'c', label: 'Warm with natural materials around me', scores: { visual: 0, spatial: 1, material: 3, energy: 2 } },
    { value: 'd', label: 'Calm and distraction-free above all', scores: { visual: 1, spatial: 1, material: 1, energy: 3 } },
  ]},
  { id: 'q3', text: 'Clutter in your environment:', options: [
    { value: 'a', label: 'Creates visual noise that bothers me', scores: { visual: 3, spatial: 1, material: 0, energy: 1 } },
    { value: 'b', label: 'Makes the space feel smaller and constrained', scores: { visual: 1, spatial: 3, material: 0, energy: 1 } },
    { value: 'c', label: 'Doesn\'t bother me if the objects have meaning', scores: { visual: 0, spatial: 0, material: 3, energy: 1 } },
    { value: 'd', label: 'Affects my ability to think and feel calm', scores: { visual: 1, spatial: 1, material: 0, energy: 3 } },
  ]},
  { id: 'q4', text: 'When choosing a seat in a restaurant or cafe:', options: [
    { value: 'a', label: 'I want to face the window or have a view', scores: { visual: 3, spatial: 1, material: 0, energy: 1 } },
    { value: 'b', label: 'I want my back to a wall', scores: { visual: 0, spatial: 3, material: 0, energy: 2 } },
    { value: 'c', label: 'I notice the chair comfort and table surface', scores: { visual: 0, spatial: 0, material: 3, energy: 1 } },
    { value: 'd', label: 'I avoid the loud or high-energy areas', scores: { visual: 1, spatial: 1, material: 0, energy: 3 } },
  ]},
  { id: 'q5', text: 'Color in a space affects you:', options: [
    { value: 'a', label: 'Strongly — I respond to palette immediately', scores: { visual: 3, spatial: 0, material: 1, energy: 1 } },
    { value: 'b', label: 'Somewhat — I prefer certain tones', scores: { visual: 2, spatial: 0, material: 1, energy: 1 } },
    { value: 'c', label: 'Less than texture and material quality', scores: { visual: 0, spatial: 0, material: 3, energy: 1 } },
    { value: 'd', label: 'It affects my mood more than I realize', scores: { visual: 1, spatial: 0, material: 0, energy: 3 } },
  ]},
  { id: 'q6', text: 'High ceilings make you feel:', options: [
    { value: 'a', label: 'Expansive and free', scores: { visual: 2, spatial: 3, material: 0, energy: 2 } },
    { value: 'b', label: 'A bit exposed or ungrounded', scores: { visual: 0, spatial: 3, material: 0, energy: 1 } },
    { value: 'c', label: 'Neutral — depends on other factors', scores: { visual: 1, spatial: 1, material: 1, energy: 1 } },
    { value: 'd', label: 'Inspired but also sometimes overwhelmed', scores: { visual: 1, spatial: 2, material: 0, energy: 3 } },
  ]},
  { id: 'q7', text: 'The material that most calms you:', options: [
    { value: 'a', label: 'Wood — warm and grounding', scores: { visual: 1, spatial: 0, material: 3, energy: 2 } },
    { value: 'b', label: 'Soft textiles — fabric, wool, linen', scores: { visual: 0, spatial: 1, material: 3, energy: 2 } },
    { value: 'c', label: 'Stone or concrete — solid and stable', scores: { visual: 1, spatial: 1, material: 3, energy: 1 } },
    { value: 'd', label: 'Plants and natural elements', scores: { visual: 2, spatial: 1, material: 2, energy: 3 } },
  ]},
  { id: 'q8', text: 'In a space that doesn\'t feel right, you usually:', options: [
    { value: 'a', label: 'Want to change the lighting first', scores: { visual: 3, spatial: 0, material: 0, energy: 1 } },
    { value: 'b', label: 'Want to rearrange the furniture', scores: { visual: 0, spatial: 3, material: 1, energy: 1 } },
    { value: 'c', label: 'Add or remove objects and textures', scores: { visual: 1, spatial: 0, material: 3, energy: 1 } },
    { value: 'd', label: 'Leave if I can — hard to pinpoint why', scores: { visual: 0, spatial: 1, material: 0, energy: 3 } },
  ]},
  { id: 'q9', text: 'The spaces you\'re drawn to are usually:', options: [
    { value: 'a', label: 'Light-filled with good proportions', scores: { visual: 3, spatial: 2, material: 0, energy: 1 } },
    { value: 'b', label: 'Intimate, defined, contained', scores: { visual: 0, spatial: 3, material: 1, energy: 1 } },
    { value: 'c', label: 'Rich in texture and tactile interest', scores: { visual: 1, spatial: 0, material: 3, energy: 1 } },
    { value: 'd', label: 'Whatever feels peaceful and right', scores: { visual: 1, spatial: 1, material: 1, energy: 3 } },
  ]},
  { id: 'q10', text: 'Your environment\'s impact on your nervous system:', options: [
    { value: 'a', label: 'Significant — I\'m very space-sensitive', scores: { visual: 2, spatial: 2, material: 2, energy: 3 } },
    { value: 'b', label: 'Noticeable — good design helps me function', scores: { visual: 2, spatial: 2, material: 2, energy: 2 } },
    { value: 'c', label: 'Moderate — I adapt but have preferences', scores: { visual: 1, spatial: 1, material: 1, energy: 1 } },
    { value: 'd', label: 'I\'m just learning how much it matters', scores: { visual: 1, spatial: 1, material: 1, energy: 2 } },
  ]},
];

const PROFILES = {
  Visual: { type: 'Visual', title: 'Visually Led', description: 'Light, color, and visual composition are primary for your spatial experience. You respond strongly to what you see and need visual harmony for regulation.', primary: 'Light and visual composition', design: ['Prioritize natural light access', 'Consider light quality at different times of day', 'Visual simplicity supports your regulation', 'Color palette should be intentional and cohesive', 'Clear sightlines reduce visual noise'], vds: 'Your VDS consultation should begin with a lighting assessment and visual audit of existing conditions.' },
  Spatial: { type: 'Spatial', title: 'Spatially Sensitive', description: 'How space is organized — openness, enclosure, boundaries — significantly impacts your sense of safety and regulation.', primary: 'Spatial organization and boundaries', design: ['Consider ceiling height and room proportions', 'Define zones clearly — work, rest, transition', 'Back-to-wall seating supports your regulation', 'Balance openness with contained refuges', 'Furniture placement affects your sense of safety'], vds: 'Your VDS consultation should map spatial flow and identify where you feel contained vs. exposed.' },
  Material: { type: 'Material', title: 'Materially Attuned', description: 'Texture, material quality, and tactile experience are central to your spatial wellbeing. You feel spaces through touch and material presence.', primary: 'Material quality and texture', design: ['Invest in tactile quality of surfaces you touch', 'Natural materials support your regulation', 'Layer textures for sensory richness', 'Remove materials that feel wrong', 'Temperature of materials matters to you'], vds: 'Your VDS consultation should include a materials palette and tactile experience mapping.' },
  Energetic: { type: 'Energetic', title: 'Energetically Responsive', description: 'You sense the overall energy and mood of spaces before noticing specifics. Your nervous system responds to the gestalt of environmental conditions.', primary: 'Overall energetic quality', design: ['Trust your initial response to spaces', 'Multiple factors combine for you — address holistically', 'Calm is non-negotiable for your regulation', 'Sound and air quality may be hidden factors', 'Spaces need to feel right, not just look right'], vds: 'Your VDS consultation should begin with an energy audit — what feels right, what doesn\'t, and why.' }
};

export default function SpacePsychology() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<SpacePsychologyScores>({ visual: 0, spatial: 0, material: 0, energy: 0 });
  const [showResults, setShowResults] = useState(false);
  const [profile, setProfile] = useState<SpacePsychologyProfile | null>(null);

  useEffect(() => { setMounted(true); const hour = new Date().getHours(); if (hour >= 5 && hour < 12) setTimeOfDay('morning'); else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon'); else if (hour >= 17 && hour < 21) setTimeOfDay('evening'); else setTimeOfDay('night'); }, []);
  const isDark = timeOfDay === 'evening' || timeOfDay === 'night';

  const handleAnswer = (optionScores: SpacePsychologyScores) => {
    setScores(prev => ({ visual: prev.visual + optionScores.visual, spatial: prev.spatial + optionScores.spatial, material: prev.material + optionScores.material, energy: prev.energy + optionScores.energy }));
    if (currentQuestion < QUESTIONS.length - 1) setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    else setTimeout(() => calculateResults(), 300);
  };

  const calculateResults = () => {
    const max = Math.max(scores.visual, scores.spatial, scores.material, scores.energy);
    type ProfileKey = keyof typeof PROFILES;
    let profileType: ProfileKey;
    if (scores.visual === max) profileType = 'Visual';
    else if (scores.spatial === max) profileType = 'Spatial';
    else if (scores.material === max) profileType = 'Material';
    else profileType = 'Energetic';
    setProfile(PROFILES[profileType]);
    setShowResults(true);
  };

  if (!mounted) return <div style={{ minHeight: '100vh', background: '#f8f6f2' }} />;

  if (showResults && profile) {
    return (
      <div style={{ minHeight: '100vh', background: isDark ? 'linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0d0d18 100%)' : 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #e8e2d8 100%)', padding: 20, fontFamily: 'Outfit, -apple-system, sans-serif' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', paddingTop: 40, paddingBottom: 60 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)', marginBottom: 16 }}>Your Space Psychology Profile</p>
            <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 300, color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)', marginBottom: 20 }}>{profile.title}</h1>
            <p style={{ fontSize: '1rem', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)', lineHeight: 1.7 }}>{profile.description}</p>
            <span style={{ display: 'inline-block', padding: '8px 16px', background: isDark ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.08)', border: `1px solid ${isDark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.15)'}`, borderRadius: 50, color: isDark ? 'rgba(139,92,246,0.9)' : 'rgba(139,92,246,0.8)', fontSize: '0.75rem', marginTop: 20 }}>Primary: {profile.primary}</span>
          </div>
          <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <h3 style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)', marginBottom: 16 }}>Design Principles for You</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>{profile.design.map((s: string, i: number) => <li key={i} style={{ fontSize: '0.9rem', color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(42,42,42,0.75)', padding: '8px 0', borderBottom: i < profile.design.length - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}` : 'none', lineHeight: 1.5 }}>{s}</li>)}</ul>
          </div>
          <div style={{ background: isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.05)', border: `1px solid ${isDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)'}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: isDark ? 'rgba(139,92,246,0.8)' : 'rgba(139,92,246,0.7)', marginBottom: 12 }}>VDS Studio Recommendation</h3>
            <p style={{ fontSize: '0.9rem', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)', lineHeight: 1.6 }}>{profile.vds}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 40 }}>
            <button onClick={() => router.push('/vds')} style={{ padding: '16px 32px', background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)', border: 'none', borderRadius: 12, color: 'white', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer' }}>Book VDS Consultation</button>
            <button onClick={() => router.push('/sanctuary')} style={{ padding: '14px 28px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 12, color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(42,42,42,0.8)', fontSize: '0.9rem', cursor: 'pointer' }}>Enter Your Space</button>
            <button onClick={() => router.push('/assessment')} style={{ padding: '14px 28px', background: 'transparent', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 12, color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)', fontSize: '0.85rem', cursor: 'pointer' }}>Back to All Assessments</button>
          </div>
        </div>
      </div>
    );
  }

  const question = QUESTIONS[currentQuestion];
  return (
    <div style={{ minHeight: '100vh', background: isDark ? 'linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0d0d18 100%)' : 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #e8e2d8 100%)', padding: 20, fontFamily: 'Outfit, -apple-system, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <a href="/assessment" style={{ padding: '10px 18px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`, borderRadius: 50, color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)', fontSize: '0.85rem', textDecoration: 'none' }}>← Exit</a>
        <span style={{ fontSize: '0.8rem', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)' }}>{currentQuestion + 1} of {QUESTIONS.length}</span>
      </div>
      <div style={{ height: 3, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', borderRadius: 2, marginBottom: 40 }}>
        <div style={{ height: '100%', width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%`, background: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)', borderRadius: 2, transition: 'width 0.3s ease' }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 600, margin: '0 auto', width: '100%' }}>
        <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(42,42,42,0.35)', marginBottom: 24, textAlign: 'center' }}>Space Psychology</p>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', fontWeight: 400, color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.85)', lineHeight: 1.5, textAlign: 'center', marginBottom: 40 }}>{question.text}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {question.options.map((option) => (
            <button key={option.value} onClick={() => handleAnswer(option.scores)} style={{ padding: '18px 24px', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`, borderRadius: 14, color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(42,42,42,0.8)', fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left' }}>{option.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}