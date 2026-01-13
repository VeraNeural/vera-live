'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

type SensoryScores = {
  light: number;
  sound: number;
  texture: number;
  space: number;
};

type SensoryProfileType = {
  type: string;
  title: string;
  description: string;
  thresholds: string;
  strengths: string[];
  needs: string[];
  environment: string[];
};

const PROFILE_SECTIONS = ['strengths', 'needs', 'environment'] as const;
type ProfileSection = (typeof PROFILE_SECTIONS)[number];

const QUESTIONS = [
  { id: 'q1', text: 'Bright overhead lighting in a space makes you:', options: [
    { value: 'a', label: 'Alert and productive', scores: { light: 3, sound: 0, texture: 0, space: 0 } },
    { value: 'b', label: 'Neutral, I barely notice', scores: { light: 2, sound: 0, texture: 0, space: 0 } },
    { value: 'c', label: 'Slightly agitated over time', scores: { light: 1, sound: 0, texture: 0, space: 0 } },
    { value: 'd', label: 'Drained, I need softer light', scores: { light: 0, sound: 0, texture: 0, space: 0 } },
  ]},
  { id: 'q2', text: 'Background noise (coffee shop, office chatter) affects your focus:', options: [
    { value: 'a', label: 'Helps me concentrate', scores: { light: 0, sound: 3, texture: 0, space: 0 } },
    { value: 'b', label: 'Doesn\'t affect me much', scores: { light: 0, sound: 2, texture: 0, space: 0 } },
    { value: 'c', label: 'Distracting but manageable', scores: { light: 0, sound: 1, texture: 0, space: 0 } },
    { value: 'd', label: 'Makes deep work nearly impossible', scores: { light: 0, sound: 0, texture: 0, space: 0 } },
  ]},
  { id: 'q3', text: 'Clothing tags, seams, or certain fabrics:', options: [
    { value: 'a', label: 'I never notice them', scores: { light: 0, sound: 0, texture: 3, space: 0 } },
    { value: 'b', label: 'Occasionally annoying', scores: { light: 0, sound: 0, texture: 2, space: 0 } },
    { value: 'c', label: 'I cut tags out and choose fabrics carefully', scores: { light: 0, sound: 0, texture: 1, space: 0 } },
    { value: 'd', label: 'Can ruin my entire day', scores: { light: 0, sound: 0, texture: 0, space: 0 } },
  ]},
  { id: 'q4', text: 'In a crowded, visually busy environment:', options: [
    { value: 'a', label: 'I feel energized by the activity', scores: { light: 0, sound: 0, texture: 0, space: 3 } },
    { value: 'b', label: 'I can filter out what I don\'t need', scores: { light: 0, sound: 0, texture: 0, space: 2 } },
    { value: 'c', label: 'I feel scattered after a while', scores: { light: 0, sound: 0, texture: 0, space: 1 } },
    { value: 'd', label: 'I need to leave or find a quiet corner', scores: { light: 0, sound: 0, texture: 0, space: 0 } },
  ]},
  { id: 'q5', text: 'Your ideal room temperature is:', options: [
    { value: 'a', label: 'Warm, I\'m often cold', scores: { light: 0, sound: 0, texture: 1, space: 0 } },
    { value: 'b', label: 'Cool, I overheat easily', scores: { light: 0, sound: 0, texture: 1, space: 0 } },
    { value: 'c', label: 'I adapt to whatever', scores: { light: 0, sound: 0, texture: 3, space: 0 } },
    { value: 'd', label: 'Very specific, deviation bothers me', scores: { light: 0, sound: 0, texture: 0, space: 0 } },
  ]},
  { id: 'q6', text: 'Strong scents (perfume, cleaning products, food):', options: [
    { value: 'a', label: 'Pleasant or unnoticed', scores: { light: 0, sound: 0, texture: 3, space: 1 } },
    { value: 'b', label: 'I notice but adjust quickly', scores: { light: 0, sound: 0, texture: 2, space: 1 } },
    { value: 'c', label: 'Can trigger headaches or discomfort', scores: { light: 0, sound: 0, texture: 0, space: 0 } },
    { value: 'd', label: 'I actively avoid scented environments', scores: { light: 0, sound: 0, texture: 0, space: 0 } },
  ]},
  { id: 'q7', text: 'When trying to sleep, you need:', options: [
    { value: 'a', label: 'Complete darkness and silence', scores: { light: 0, sound: 0, texture: 0, space: 0 } },
    { value: 'b', label: 'Some white noise or dim light is fine', scores: { light: 1, sound: 1, texture: 1, space: 1 } },
    { value: 'c', label: 'Background sound helps me sleep', scores: { light: 2, sound: 2, texture: 2, space: 2 } },
    { value: 'd', label: 'I can sleep anywhere', scores: { light: 3, sound: 3, texture: 3, space: 3 } },
  ]},
  { id: 'q8', text: 'Clutter in your environment:', options: [
    { value: 'a', label: 'Doesn\'t bother me at all', scores: { light: 0, sound: 0, texture: 0, space: 3 } },
    { value: 'b', label: 'I notice but can work around it', scores: { light: 0, sound: 0, texture: 0, space: 2 } },
    { value: 'c', label: 'Affects my ability to think clearly', scores: { light: 0, sound: 0, texture: 0, space: 1 } },
    { value: 'd', label: 'Must be cleared before I can function', scores: { light: 0, sound: 0, texture: 0, space: 0 } },
  ]},
  { id: 'q9', text: 'Sudden loud sounds (door slamming, car horn):', options: [
    { value: 'a', label: 'Barely register', scores: { light: 0, sound: 3, texture: 0, space: 0 } },
    { value: 'b', label: 'Startle me briefly then I\'m fine', scores: { light: 0, sound: 2, texture: 0, space: 0 } },
    { value: 'c', label: 'Trigger a strong physical reaction', scores: { light: 0, sound: 0, texture: 0, space: 0 } },
    { value: 'd', label: 'Can dysregulate me for hours', scores: { light: 0, sound: 0, texture: 0, space: 0 } },
  ]},
  { id: 'q10', text: 'Your ideal workspace has:', options: [
    { value: 'a', label: 'Natural light, quiet, minimal visual noise', scores: { light: 0, sound: 0, texture: 0, space: 0 } },
    { value: 'b', label: 'Some activity and background energy', scores: { light: 2, sound: 2, texture: 2, space: 2 } },
    { value: 'c', label: 'I can work anywhere if I have headphones', scores: { light: 2, sound: 1, texture: 2, space: 1 } },
    { value: 'd', label: 'I haven\'t figured out what works best', scores: { light: 1, sound: 1, texture: 1, space: 1 } },
  ]},
];

const PROFILES = {
  Resilient: { type: 'Resilient', title: 'Sensory Resilient', description: 'Your sensory system has high thresholds. You can function across diverse environments without significant impact on regulation or focus.', thresholds: 'High tolerance across sensory domains', strengths: ['Can work in varied environments', 'Not easily disrupted by sensory input', 'Flexible about physical conditions', 'Adaptable to others\' preferences'], needs: ['May miss environmental cues that affect others', 'Check in with more sensitive people in shared spaces', 'Notice when you\'re tolerating rather than thriving', 'Don\'t assume others share your tolerance'], environment: ['You have flexibility; use it for optimization, not just tolerance', 'Your spaces can serve multiple functions', 'Consider investing in quality over sensory protection', 'Experiment with what enhances rather than what\'s bearable'] },
  Selective: { type: 'Selective', title: 'Selectively Sensitive', description: 'Your sensory system has specific sensitivities while remaining resilient in other areas. You know what bothers you and can often work around it.', thresholds: 'Variable: specific triggers, general resilience', strengths: ['Clear awareness of your triggers', 'Can adapt when you know what to expect', 'Specific solutions work well', 'Can advocate for specific needs'], needs: ['Identify your top 2-3 sensory priorities', 'Protect those specific needs above all', 'Don\'t let tolerance in other areas mask your real needs', 'Communicate your specifics to others'], environment: ['Design around your known triggers first', 'Layer solutions; you don\'t need total control', 'Have backup options for your sensitive areas', 'Quality matters more in your trigger zones'] },
  Sensitive: { type: 'Sensitive', title: 'Sensory Sensitive', description: 'Your sensory system processes input deeply. Environments affect your regulation, focus, and energy more than average.', thresholds: 'Lower thresholds across multiple domains', strengths: ['Notice subtleties others miss', 'Can create deeply optimized environments', 'High awareness of environmental impact', 'Often attuned to quality and aesthetics'], needs: ['Environmental control is not optional for you', 'Recovery time after sensory-heavy experiences', 'Permission to modify shared spaces', 'Strategies for environments you can\'t control'], environment: ['Invest in sensory protection; it\'s infrastructure', 'Create at least one fully controlled space', 'Layer protection: lighting, sound, texture', 'Plan for recovery after high-input days'] },
  HighlyAttuned: { type: 'HighlyAttuned', title: 'Highly Attuned', description: 'Your sensory system is exceptionally responsive. Environmental factors significantly impact your wellbeing and require proactive management.', thresholds: 'Very low: requires careful environmental design', strengths: ['Extraordinary awareness of environment', 'Can detect what others can\'t', 'Deep aesthetic and sensory intelligence', 'When environment is right, you thrive'], needs: ['Environmental protection is essential, not preference', 'Advance planning for new environments', 'Exit strategies and recovery spaces', 'Others need to understand your requirements'], environment: ['Full control of primary spaces is necessary', 'Portable protection tools (headphones, sunglasses)', 'Scout new environments before committing', 'Your space is a therapeutic tool; invest accordingly'] }
};

export default function SensoryProfile() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<SensoryScores>({ light: 0, sound: 0, texture: 0, space: 0 });
  const [showResults, setShowResults] = useState(false);
  const [profile, setProfile] = useState<SensoryProfileType | null>(null);

  useEffect(() => { setMounted(true); const hour = new Date().getHours(); if (hour >= 5 && hour < 12) setTimeOfDay('morning'); else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon'); else if (hour >= 17 && hour < 21) setTimeOfDay('evening'); else setTimeOfDay('night'); }, []);
  const isDark = timeOfDay === 'evening' || timeOfDay === 'night';

  const handleAnswer = (optionScores: SensoryScores) => {
    setScores(prev => ({ light: prev.light + optionScores.light, sound: prev.sound + optionScores.sound, texture: prev.texture + optionScores.texture, space: prev.space + optionScores.space }));
    if (currentQuestion < QUESTIONS.length - 1) { setTimeout(() => setCurrentQuestion(prev => prev + 1), 300); } else { setTimeout(() => calculateResults(), 300); }
  };

  const calculateResults = () => {
    const total = scores.light + scores.sound + scores.texture + scores.space;
    type ProfileKey = keyof typeof PROFILES;
    let profileType: ProfileKey;
    if (total >= 25) profileType = 'Resilient';
    else if (total >= 15) profileType = 'Selective';
    else if (total >= 10) profileType = 'Sensitive';
    else profileType = 'HighlyAttuned';
    setProfile(PROFILES[profileType]);
    setShowResults(true);
  };

  if (!mounted) return <div style={{ minHeight: '100vh', background: '#f8f6f2' }} />;

  if (showResults && profile) {
    return (
      <div style={{ minHeight: '100vh', background: isDark ? 'linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0d0d18 100%)' : 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #e8e2d8 100%)', padding: 20, fontFamily: 'Outfit, -apple-system, sans-serif' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', paddingTop: 40, paddingBottom: 60 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)', marginBottom: 16 }}>Your Sensory Profile</p>
            <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 300, color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)', marginBottom: 20 }}>{profile.title}</h1>
            <p style={{ fontSize: '1rem', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)', lineHeight: 1.7 }}>{profile.description}</p>
          </div>
          {PROFILE_SECTIONS.map((section: ProfileSection) => (
            <div key={section} style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
              <h3 style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)', marginBottom: 16 }}>{section === 'needs' ? 'What You Need' : section === 'environment' ? 'Environmental Design' : 'Your Strengths'}</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>{profile[section].map((s: string, i: number) => <li key={i} style={{ fontSize: '0.9rem', color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(42,42,42,0.75)', padding: '8px 0', borderBottom: i < profile[section].length - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}` : 'none', lineHeight: 1.5 }}>{s}</li>)}</ul>
            </div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 40 }}>
            <button onClick={() => router.push('/sanctuary')} style={{ padding: '16px 32px', background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)', border: 'none', borderRadius: 12, color: 'white', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer' }}>Enter Your Space</button>
            <button onClick={() => router.push('/assessment')} style={{ padding: '14px 28px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 12, color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(42,42,42,0.8)', fontSize: '0.9rem', cursor: 'pointer' }}>Back to All Assessments</button>
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
        <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(42,42,42,0.35)', marginBottom: 24, textAlign: 'center' }}>Sensory Profile</p>
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