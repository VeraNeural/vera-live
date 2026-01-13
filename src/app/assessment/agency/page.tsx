'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

type AgencyScores = {
  clarity: number;
  followthrough: number;
  recovery: number;
  empowerment: number;
};

type AgencyProfile = {
  type: string;
  title: string;
  description: string;
  strengths: string[];
  growth: string[];
  support: string[];
};

const PROFILE_SECTIONS = ['strengths', 'growth', 'support'] as const;
type ProfileSection = (typeof PROFILE_SECTIONS)[number];

const QUESTIONS = [
  { id: 'q1', text: 'When facing a decision, your first instinct is to:', options: [
    { value: 'a', label: 'Trust my gut and move', scores: { clarity: 3, followthrough: 2, recovery: 2, empowerment: 3 } },
    { value: 'b', label: 'Gather information before committing', scores: { clarity: 2, followthrough: 2, recovery: 2, empowerment: 2 } },
    { value: 'c', label: 'Ask someone I trust what they think', scores: { clarity: 1, followthrough: 1, recovery: 2, empowerment: 1 } },
    { value: 'd', label: 'Wait and see if the decision makes itself', scores: { clarity: 0, followthrough: 0, recovery: 1, empowerment: 0 } },
  ]},
  { id: 'q2', text: 'After making a choice, you typically:', options: [
    { value: 'a', label: 'Move forward without looking back', scores: { clarity: 2, followthrough: 3, recovery: 3, empowerment: 3 } },
    { value: 'b', label: 'Feel settled once I\'ve committed', scores: { clarity: 2, followthrough: 3, recovery: 2, empowerment: 2 } },
    { value: 'c', label: 'Second-guess for a while then settle', scores: { clarity: 1, followthrough: 1, recovery: 1, empowerment: 1 } },
    { value: 'd', label: 'Often revisit and reconsider', scores: { clarity: 0, followthrough: 0, recovery: 0, empowerment: 0 } },
  ]},
  { id: 'q3', text: 'When a decision turns out wrong, you:', options: [
    { value: 'a', label: 'Course-correct quickly and move on', scores: { clarity: 2, followthrough: 2, recovery: 3, empowerment: 3 } },
    { value: 'b', label: 'Analyze what happened, then adjust', scores: { clarity: 2, followthrough: 2, recovery: 2, empowerment: 2 } },
    { value: 'c', label: 'Blame myself for missing something', scores: { clarity: 1, followthrough: 1, recovery: 0, empowerment: 0 } },
    { value: 'd', label: 'Use it as evidence I shouldn\'t decide', scores: { clarity: 0, followthrough: 0, recovery: 0, empowerment: 0 } },
  ]},
  { id: 'q4', text: 'Your relationship with your own preferences:', options: [
    { value: 'a', label: 'Clear, I know what I want', scores: { clarity: 3, followthrough: 2, recovery: 2, empowerment: 3 } },
    { value: 'b', label: 'Mostly clear, sometimes uncertain', scores: { clarity: 2, followthrough: 2, recovery: 2, empowerment: 2 } },
    { value: 'c', label: 'Often unsure what I actually want', scores: { clarity: 1, followthrough: 1, recovery: 1, empowerment: 1 } },
    { value: 'd', label: 'I usually adapt to what others want', scores: { clarity: 0, followthrough: 0, recovery: 1, empowerment: 0 } },
  ]},
  { id: 'q5', text: 'When you commit to something, your follow-through is:', options: [
    { value: 'a', label: 'Reliable, I do what I say', scores: { clarity: 2, followthrough: 3, recovery: 2, empowerment: 3 } },
    { value: 'b', label: 'Good when it matters, flexible otherwise', scores: { clarity: 2, followthrough: 2, recovery: 2, empowerment: 2 } },
    { value: 'c', label: 'Inconsistent, depends on my state', scores: { clarity: 1, followthrough: 1, recovery: 1, empowerment: 1 } },
    { value: 'd', label: 'I avoid committing to avoid failing', scores: { clarity: 0, followthrough: 0, recovery: 0, empowerment: 0 } },
  ]},
  { id: 'q6', text: 'When empowered, your body feels:', options: [
    { value: 'a', label: 'Grounded and expanded', scores: { clarity: 2, followthrough: 2, recovery: 2, empowerment: 3 } },
    { value: 'b', label: 'Energized and ready', scores: { clarity: 2, followthrough: 2, recovery: 2, empowerment: 3 } },
    { value: 'c', label: 'Relieved and calm', scores: { clarity: 2, followthrough: 2, recovery: 2, empowerment: 2 } },
    { value: 'd', label: 'I don\'t recognize this feeling often', scores: { clarity: 1, followthrough: 1, recovery: 1, empowerment: 0 } },
  ]},
  { id: 'q7', text: 'Asking for what you need:', options: [
    { value: 'a', label: 'Comes naturally, I advocate well', scores: { clarity: 3, followthrough: 2, recovery: 2, empowerment: 3 } },
    { value: 'b', label: 'Possible but requires effort', scores: { clarity: 2, followthrough: 2, recovery: 2, empowerment: 2 } },
    { value: 'c', label: 'Difficult, I often stay silent', scores: { clarity: 1, followthrough: 1, recovery: 1, empowerment: 0 } },
    { value: 'd', label: 'I\'m not sure what I need most of the time', scores: { clarity: 0, followthrough: 0, recovery: 1, empowerment: 0 } },
  ]},
  { id: 'q8', text: 'Your sense of agency (that you can affect your life):', options: [
    { value: 'a', label: 'Strong and consistent', scores: { clarity: 3, followthrough: 3, recovery: 3, empowerment: 3 } },
    { value: 'b', label: 'Present but variable', scores: { clarity: 2, followthrough: 2, recovery: 2, empowerment: 2 } },
    { value: 'c', label: 'Fragile, easily disrupted', scores: { clarity: 1, followthrough: 1, recovery: 1, empowerment: 1 } },
    { value: 'd', label: 'Mostly absent, things happen to me', scores: { clarity: 0, followthrough: 0, recovery: 0, empowerment: 0 } },
  ]},
  { id: 'q9', text: 'When facing too many options, you:', options: [
    { value: 'a', label: 'Narrow quickly using clear criteria', scores: { clarity: 3, followthrough: 2, recovery: 2, empowerment: 2 } },
    { value: 'b', label: 'Take time but eventually choose', scores: { clarity: 2, followthrough: 2, recovery: 2, empowerment: 2 } },
    { value: 'c', label: 'Get overwhelmed and stall', scores: { clarity: 0, followthrough: 0, recovery: 1, empowerment: 0 } },
    { value: 'd', label: 'Let someone else decide', scores: { clarity: 0, followthrough: 0, recovery: 1, empowerment: 0 } },
  ]},
  { id: 'q10', text: 'Looking back at major life decisions:', options: [
    { value: 'a', label: 'Mostly proud of my choices', scores: { clarity: 3, followthrough: 3, recovery: 3, empowerment: 3 } },
    { value: 'b', label: 'A mix: some regret, mostly okay', scores: { clarity: 2, followthrough: 2, recovery: 2, empowerment: 2 } },
    { value: 'c', label: 'Significant regret about key moments', scores: { clarity: 1, followthrough: 1, recovery: 0, empowerment: 1 } },
    { value: 'd', label: 'Feel like life happened to me', scores: { clarity: 0, followthrough: 0, recovery: 0, empowerment: 0 } },
  ]},
];

const PROFILES = {
  Sovereign: { type: 'Sovereign', title: 'The Sovereign', description: 'You have strong access to agency. Decisions feel like expressions of self rather than burdens. You trust your capacity to choose and adapt.', strengths: ['Clear internal compass', 'High decision velocity', 'Strong follow-through integrity', 'Quick recovery from mistakes'], growth: ['Watch for impatience with others\' process', 'Allow input without losing agency', 'Rest is not weakness', 'Model agency without imposing it'], support: ['Environments that honor your autonomy', 'Minimal friction between intention and action', 'Space for decisive movement', 'Trust from others in your process'] },
  Builder: { type: 'Builder', title: 'The Builder', description: 'You are constructing agency intentionally. You\'ve developed practices that support choice and are building trust in your own decisions.', strengths: ['Growing decision confidence', 'Learning from experience', 'Developing clear preferences', 'Building follow-through patterns'], growth: ['Continue trusting small decisions', 'Notice progress without demanding perfection', 'Celebrate follow-through, not just outcomes', 'Your systems are working; maintain them'], support: ['Structured decision frameworks', 'Reflection time built in', 'Positive reinforcement loops', 'Spaces that reduce decision fatigue'] },
  Emerging: { type: 'Emerging', title: 'The Emerging', description: 'Your agency is present but inconsistent. Under certain conditions you feel capable; under others, choice feels inaccessible.', strengths: ['Awareness of when agency is present', 'Capacity exists; access is the issue', 'Responsive to supportive conditions', 'Growing self-understanding'], growth: ['Map the conditions where agency emerges', 'Reduce decisions when depleted', 'Build agency in low-stakes areas first', 'Self-compassion is not self-indulgence'], support: ['Environments that reduce overwhelm', 'Limited but meaningful choices', 'Recovery built into structure', 'External validation while building internal'] },
  Reclaiming: { type: 'Reclaiming', title: 'The Reclaiming', description: 'Agency has been compressed by circumstance, history, or system overload. You are in a phase of reclaiming your capacity to choose.', strengths: ['The desire to reclaim is itself agency', 'Awareness of what\'s missing', 'Survival strategies that served you', 'Foundation for rebuilding'], growth: ['One tiny choice at a time', 'Agency is rebuilt, not found', 'External structure can scaffold internal agency', 'What happened wasn\'t about your capacity'], support: ['Very low-stakes decision practice', 'Others who can hold complexity with you', 'Environments that ask very little', 'Permission to not decide right now'] }
};

export default function AgencyArchitecture() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<AgencyScores>({ clarity: 0, followthrough: 0, recovery: 0, empowerment: 0 });
  const [showResults, setShowResults] = useState(false);
  const [profile, setProfile] = useState<AgencyProfile | null>(null);

  useEffect(() => { setMounted(true); const hour = new Date().getHours(); if (hour >= 5 && hour < 12) setTimeOfDay('morning'); else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon'); else if (hour >= 17 && hour < 21) setTimeOfDay('evening'); else setTimeOfDay('night'); }, []);
  const isDark = timeOfDay === 'evening' || timeOfDay === 'night';

  const handleAnswer = (optionScores: AgencyScores) => {
    setScores(prev => ({ clarity: prev.clarity + optionScores.clarity, followthrough: prev.followthrough + optionScores.followthrough, recovery: prev.recovery + optionScores.recovery, empowerment: prev.empowerment + optionScores.empowerment }));
    if (currentQuestion < QUESTIONS.length - 1) setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    else setTimeout(() => calculateResults(), 300);
  };

  const calculateResults = () => {
    const total = scores.clarity + scores.followthrough + scores.recovery + scores.empowerment;
    type ProfileKey = keyof typeof PROFILES;
    let profileType: ProfileKey;
    if (total >= 90) profileType = 'Sovereign';
    else if (total >= 60) profileType = 'Builder';
    else if (total >= 35) profileType = 'Emerging';
    else profileType = 'Reclaiming';
    setProfile(PROFILES[profileType]);
    setShowResults(true);
  };

  if (!mounted) return <div style={{ minHeight: '100vh', background: '#f8f6f2' }} />;

  if (showResults && profile) {
    return (
      <div style={{ minHeight: '100vh', background: isDark ? 'linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0d0d18 100%)' : 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #e8e2d8 100%)', padding: 20, fontFamily: 'Outfit, -apple-system, sans-serif' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', paddingTop: 40, paddingBottom: 60 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)', marginBottom: 16 }}>Your Agency Profile</p>
            <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 300, color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)', marginBottom: 20 }}>{profile.title}</h1>
            <p style={{ fontSize: '1rem', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)', lineHeight: 1.7 }}>{profile.description}</p>
          </div>
          {PROFILE_SECTIONS.map((section: ProfileSection) => (
            <div key={section} style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
              <h3 style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)', marginBottom: 16 }}>{section === 'growth' ? 'Growth Edges' : section === 'support' ? 'What Supports You' : 'Your Strengths'}</h3>
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
        <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(42,42,42,0.35)', marginBottom: 24, textAlign: 'center' }}>Agency Architecture</p>
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