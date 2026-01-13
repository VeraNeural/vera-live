'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Question = {
  id: string;
  text: string;
  options: {
    value: string;
    label: string;
    scores: {
      rhythmAlignment: number;
      energyManagement: number;
      transitionEase: number;
      intentionality: number;
    };
  }[];
};

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'Your mornings usually begin:',
    options: [
      { value: 'a', label: 'Slowly, I need time before engaging', scores: { rhythmAlignment: 2, energyManagement: 2, transitionEase: 1, intentionality: 2 } },
      { value: 'b', label: 'Quickly, I\'m ready to move', scores: { rhythmAlignment: 2, energyManagement: 1, transitionEase: 2, intentionality: 1 } },
      { value: 'c', label: 'Reactively, whatever demands attention first', scores: { rhythmAlignment: 0, energyManagement: 0, transitionEase: 1, intentionality: 0 } },
      { value: 'd', label: 'With a consistent routine I protect', scores: { rhythmAlignment: 3, energyManagement: 3, transitionEase: 2, intentionality: 3 } },
    ]
  },
  {
    id: 'q2',
    text: 'The transition between work and personal time is:',
    options: [
      { value: 'a', label: 'Seamless, I shift easily', scores: { rhythmAlignment: 2, energyManagement: 2, transitionEase: 3, intentionality: 2 } },
      { value: 'b', label: 'Requires a buffer activity', scores: { rhythmAlignment: 2, energyManagement: 2, transitionEase: 2, intentionality: 2 } },
      { value: 'c', label: 'Difficult, work follows me home mentally', scores: { rhythmAlignment: 0, energyManagement: 0, transitionEase: 0, intentionality: 1 } },
      { value: 'd', label: 'Nonexistent, they blur together', scores: { rhythmAlignment: 0, energyManagement: 0, transitionEase: 0, intentionality: 0 } },
    ]
  },
  {
    id: 'q3',
    text: 'Your energy throughout the day:',
    options: [
      { value: 'a', label: 'Peaks in the morning, fades by evening', scores: { rhythmAlignment: 2, energyManagement: 2, transitionEase: 2, intentionality: 2 } },
      { value: 'b', label: 'Builds through the day, peaks late', scores: { rhythmAlignment: 2, energyManagement: 2, transitionEase: 2, intentionality: 2 } },
      { value: 'c', label: 'Unpredictable, varies without pattern', scores: { rhythmAlignment: 0, energyManagement: 0, transitionEase: 0, intentionality: 0 } },
      { value: 'd', label: 'I know my patterns and schedule around them', scores: { rhythmAlignment: 3, energyManagement: 3, transitionEase: 2, intentionality: 3 } },
    ]
  },
  {
    id: 'q4',
    text: 'Your relationship with meals is:',
    options: [
      { value: 'a', label: 'Regular times that anchor my day', scores: { rhythmAlignment: 3, energyManagement: 3, transitionEase: 2, intentionality: 3 } },
      { value: 'b', label: 'I eat when hungry, times vary', scores: { rhythmAlignment: 2, energyManagement: 1, transitionEase: 2, intentionality: 1 } },
      { value: 'c', label: 'Often skipped or forgotten', scores: { rhythmAlignment: 0, energyManagement: 0, transitionEase: 1, intentionality: 0 } },
      { value: 'd', label: 'Grabbed quickly between other things', scores: { rhythmAlignment: 0, energyManagement: 0, transitionEase: 1, intentionality: 0 } },
    ]
  },
  {
    id: 'q5',
    text: 'Physical movement in your life is:',
    options: [
      { value: 'a', label: 'Scheduled and consistent', scores: { rhythmAlignment: 3, energyManagement: 3, transitionEase: 2, intentionality: 3 } },
      { value: 'b', label: 'Intuitive, when my body asks for it', scores: { rhythmAlignment: 2, energyManagement: 2, transitionEase: 2, intentionality: 2 } },
      { value: 'c', label: 'Rare, I know I should but don\'t', scores: { rhythmAlignment: 0, energyManagement: 0, transitionEase: 1, intentionality: 0 } },
      { value: 'd', label: 'Woven into daily activities naturally', scores: { rhythmAlignment: 2, energyManagement: 2, transitionEase: 3, intentionality: 2 } },
    ]
  },
  {
    id: 'q6',
    text: 'When your schedule gets disrupted:',
    options: [
      { value: 'a', label: 'I adapt quickly and rebuild', scores: { rhythmAlignment: 2, energyManagement: 2, transitionEase: 3, intentionality: 2 } },
      { value: 'b', label: 'It throws me off but I recover by next day', scores: { rhythmAlignment: 1, energyManagement: 1, transitionEase: 2, intentionality: 1 } },
      { value: 'c', label: 'It cascades and I struggle to regain rhythm', scores: { rhythmAlignment: 0, energyManagement: 0, transitionEase: 0, intentionality: 0 } },
      { value: 'd', label: 'I protect my schedule fiercely to prevent this', scores: { rhythmAlignment: 2, energyManagement: 2, transitionEase: 1, intentionality: 3 } },
    ]
  },
  {
    id: 'q7',
    text: 'Your evening wind-down:',
    options: [
      { value: 'a', label: 'Has a consistent pattern that signals rest', scores: { rhythmAlignment: 3, energyManagement: 3, transitionEase: 3, intentionality: 3 } },
      { value: 'b', label: 'Depends on how the day went', scores: { rhythmAlignment: 1, energyManagement: 1, transitionEase: 1, intentionality: 1 } },
      { value: 'c', label: 'I work until I\'m too tired to continue', scores: { rhythmAlignment: 0, energyManagement: 0, transitionEase: 0, intentionality: 0 } },
      { value: 'd', label: 'Screens until sleep', scores: { rhythmAlignment: 0, energyManagement: 0, transitionEase: 0, intentionality: 0 } },
    ]
  },
  {
    id: 'q8',
    text: 'Your social energy works best with:',
    options: [
      { value: 'a', label: 'Planned gatherings I can prepare for', scores: { rhythmAlignment: 2, energyManagement: 2, transitionEase: 1, intentionality: 3 } },
      { value: 'b', label: 'Spontaneous connection when I\'m feeling it', scores: { rhythmAlignment: 2, energyManagement: 2, transitionEase: 2, intentionality: 1 } },
      { value: 'c', label: 'Mostly solitude with occasional exceptions', scores: { rhythmAlignment: 2, energyManagement: 2, transitionEase: 2, intentionality: 2 } },
      { value: 'd', label: 'Whatever happens, I haven\'t figured this out', scores: { rhythmAlignment: 0, energyManagement: 0, transitionEase: 1, intentionality: 0 } },
    ]
  },
  {
    id: 'q9',
    text: 'How you actually spend time vs. how you want to spend it:',
    options: [
      { value: 'a', label: 'Closely aligned, I live intentionally', scores: { rhythmAlignment: 3, energyManagement: 3, transitionEase: 3, intentionality: 3 } },
      { value: 'b', label: 'Some gaps but I\'m working on it', scores: { rhythmAlignment: 2, energyManagement: 2, transitionEase: 2, intentionality: 2 } },
      { value: 'c', label: 'Significant gap, I wish things were different', scores: { rhythmAlignment: 0, energyManagement: 0, transitionEase: 1, intentionality: 1 } },
      { value: 'd', label: 'I haven\'t stopped to compare', scores: { rhythmAlignment: 0, energyManagement: 0, transitionEase: 1, intentionality: 0 } },
    ]
  },
  {
    id: 'q10',
    text: 'Weekends for you are:',
    options: [
      { value: 'a', label: 'Restorative, I protect this time', scores: { rhythmAlignment: 3, energyManagement: 3, transitionEase: 2, intentionality: 3 } },
      { value: 'b', label: 'Active, I do what I can\'t during the week', scores: { rhythmAlignment: 2, energyManagement: 1, transitionEase: 2, intentionality: 2 } },
      { value: 'c', label: 'Just more of the same', scores: { rhythmAlignment: 0, energyManagement: 0, transitionEase: 1, intentionality: 0 } },
      { value: 'd', label: 'Recovery from overextension', scores: { rhythmAlignment: 0, energyManagement: 0, transitionEase: 0, intentionality: 1 } },
    ]
  },
];

type ProfileType = 'Rhythmic' | 'Adaptive' | 'Recovering' | 'Searching';

type Profile = {
  type: ProfileType;
  title: string;
  description: string;
  strengths: string[];
  opportunities: string[];
  design: string[];
};

const PROFILES: Record<ProfileType, Profile> = {
  Rhythmic: {
    type: 'Rhythmic',
    title: 'The Rhythmic',
    description: 'Your lifestyle has established patterns that support your energy and wellbeing. You\'ve learned what works and built systems to protect it.',
    strengths: [
      'Clear daily structure that supports regulation',
      'Energy patterns are predictable and workable',
      'Transitions have intentional buffers',
      'Time use aligns with values'
    ],
    opportunities: [
      'Watch for rigidity masking as structure',
      'Allow for spontaneity within the framework',
      'Share your systems with others who struggle',
      'Continue refining based on seasonal changes'
    ],
    design: [
      'Your environment should reinforce your rhythms',
      'Visual cues for transitions help maintain flow',
      'Protect morning and evening anchors especially',
      'Design for maintenance, not just creation'
    ]
  },
  Adaptive: {
    type: 'Adaptive',
    title: 'The Adaptive',
    description: 'Your lifestyle is flexible and responsive. You adjust to circumstances well but may benefit from more anchoring structure.',
    strengths: [
      'High adaptability to changing demands',
      'Comfortable with variety and spontaneity',
      'Can function across different rhythms',
      'Not dependent on strict routines'
    ],
    opportunities: [
      'Identify 2-3 non-negotiable anchors',
      'Notice when flexibility becomes reactivity',
      'Track energy patterns to find natural rhythms',
      'Build minimal structure without losing adaptability'
    ],
    design: [
      'Create flexible but defined zones in your space',
      'Use time-based cues rather than rigid schedules',
      'Design for multiple modes of working and resting',
      'Environments that support quick transitions'
    ]
  },
  Recovering: {
    type: 'Recovering',
    title: 'The Recovering',
    description: 'Your current lifestyle is in repair mode. You\'re aware of misalignment and working toward better patterns.',
    strengths: [
      'Awareness that change is needed',
      'Capacity for self-reflection',
      'Previous experience of what works',
      'Motivation to rebuild'
    ],
    opportunities: [
      'Start with one anchor point, not a complete overhaul',
      'Protect energy before optimizing time',
      'Reduce decisions through simple defaults',
      'Track what\'s working, not just what isn\'t'
    ],
    design: [
      'Reduce friction for healthy behaviors',
      'Make restoration visible and accessible',
      'Remove cues for depleting patterns',
      'Start with sleep and morning; they cascade'
    ]
  },
  Searching: {
    type: 'Searching',
    title: 'The Searching',
    description: 'Your lifestyle patterns are still forming or have been disrupted. This is a discovery phase.',
    strengths: [
      'Open to new patterns',
      'Not locked into dysfunction',
      'Potential for intentional design',
      'Clean slate for building'
    ],
    opportunities: [
      'Experiment without judgment',
      'Observe your natural tendencies before forcing structure',
      'Small anchors have outsized impact',
      'Energy management before time management'
    ],
    design: [
      'Start with one protected transition',
      'Create a single wind-down cue',
      'Design for discovery, not perfection',
      'Your space should reveal what works'
    ]
  }
};

export default function LifestyleDecode() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState({ rhythmAlignment: 0, energyManagement: 0, transitionEase: 0, intentionality: 0 });
  const [showResults, setShowResults] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
    else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
    else setTimeOfDay('night');
  }, []);

  const isDark = timeOfDay === 'evening' || timeOfDay === 'night';

  const handleAnswer = (questionId: string, optionValue: string, optionScores: typeof scores) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionValue }));
    setScores(prev => ({
      rhythmAlignment: prev.rhythmAlignment + optionScores.rhythmAlignment,
      energyManagement: prev.energyManagement + optionScores.energyManagement,
      transitionEase: prev.transitionEase + optionScores.transitionEase,
      intentionality: prev.intentionality + optionScores.intentionality,
    }));

    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    } else {
      setTimeout(() => calculateResults(), 300);
    }
  };

  const calculateResults = () => {
    const total = scores.rhythmAlignment + scores.energyManagement + scores.transitionEase + scores.intentionality;
    
    let profileType: ProfileType;
    if (total >= 90) {
      profileType = 'Rhythmic';
    } else if (total >= 60) {
      profileType = 'Adaptive';
    } else if (total >= 35) {
      profileType = 'Recovering';
    } else {
      profileType = 'Searching';
    }

    setProfile(PROFILES[profileType]);
    setShowResults(true);
  };

  if (!mounted) return <div style={{ minHeight: '100vh', background: '#f8f6f2' }} />;

  if (showResults && profile) {
    return (
      <>
        <style jsx>{`
          .results-page { min-height: 100vh; background: ${isDark ? 'linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0d0d18 100%)' : 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #e8e2d8 100%)'}; padding: 20px; font-family: 'Outfit', -apple-system, sans-serif; }
          .results-container { max-width: 600px; margin: 0 auto; padding-top: 40px; padding-bottom: 60px; }
          .results-header { text-align: center; margin-bottom: 40px; }
          .results-label { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.2em; color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'}; margin-bottom: 16px; }
          .profile-type { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(2rem, 6vw, 3rem); font-weight: 300; color: ${isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)'}; margin-bottom: 20px; }
          .profile-description { font-size: 1rem; color: ${isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)'}; line-height: 1.7; }
          .section { background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)'}; border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}; border-radius: 16px; padding: 24px; margin-bottom: 16px; }
          .section-title { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'}; margin-bottom: 16px; }
          .section-list { list-style: none; padding: 0; margin: 0; }
          .section-list li { font-size: 0.9rem; color: ${isDark ? 'rgba(255,255,255,0.75)' : 'rgba(42,42,42,0.75)'}; padding: 8px 0; border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}; line-height: 1.5; }
          .section-list li:last-child { border-bottom: none; }
          .actions { display: flex; flex-direction: column; gap: 12px; margin-top: 40px; }
          .primary-btn { padding: 16px 32px; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); border: none; border-radius: 12px; color: white; font-size: 0.95rem; font-weight: 500; cursor: pointer; }
          .secondary-btn { padding: 14px 28px; background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)'}; border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}; border-radius: 12px; color: ${isDark ? 'rgba(255,255,255,0.8)' : 'rgba(42,42,42,0.8)'}; font-size: 0.9rem; cursor: pointer; }
          .next-assessment { text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}; }
          .next-label { font-size: 0.75rem; color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'}; margin-bottom: 12px; }
          .next-link { color: ${isDark ? 'rgba(139,92,246,0.9)' : 'rgba(139,92,246,0.8)'}; text-decoration: none; font-weight: 500; cursor: pointer; }
        `}</style>
        <div className="results-page">
          <div className="results-container">
            <div className="results-header">
              <p className="results-label">Your Lifestyle Profile</p>
              <h1 className="profile-type">{profile.title}</h1>
              <p className="profile-description">{profile.description}</p>
            </div>
            <div className="section">
              <h3 className="section-title">Your Strengths</h3>
              <ul className="section-list">{profile.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
            <div className="section">
              <h3 className="section-title">Opportunities</h3>
              <ul className="section-list">{profile.opportunities.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
            <div className="section">
              <h3 className="section-title">Design Recommendations</h3>
              <ul className="section-list">{profile.design.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
            <div className="actions">
              <button className="primary-btn" onClick={() => router.push('/sanctuary')}>Enter Your Space</button>
              <button className="secondary-btn" onClick={() => router.push('/assessment')}>Back to All Assessments</button>
            </div>
            <div className="next-assessment">
              <p className="next-label">Continue mapping</p>
              <a className="next-link" onClick={() => router.push('/assessment/sensory')}>Sensory Profile →</a>
            </div>
          </div>
        </div>
      </>
    );
  }

  const question = QUESTIONS[currentQuestion];

  return (
    <>
      <style jsx>{`
        .assessment-page { min-height: 100vh; background: ${isDark ? 'linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0d0d18 100%)' : 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #e8e2d8 100%)'}; padding: 20px; font-family: 'Outfit', -apple-system, sans-serif; display: flex; flex-direction: column; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .back-btn { padding: 10px 18px; background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)'}; border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}; border-radius: 50px; color: ${isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)'}; font-size: 0.85rem; text-decoration: none; cursor: pointer; }
        .progress-text { font-size: 0.8rem; color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'}; }
        .progress-bar { height: 3px; background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}; border-radius: 2px; margin-bottom: 40px; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%); border-radius: 2px; transition: width 0.3s ease; }
        .content { flex: 1; display: flex; flex-direction: column; justify-content: center; max-width: 600px; margin: 0 auto; width: 100%; }
        .assessment-title { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.2em; color: ${isDark ? 'rgba(255,255,255,0.35)' : 'rgba(42,42,42,0.35)'}; margin-bottom: 24px; text-align: center; }
        .question-text { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(1.3rem, 4vw, 1.6rem); font-weight: 400; color: ${isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.85)'}; line-height: 1.5; text-align: center; margin-bottom: 40px; }
        .options { display: flex; flex-direction: column; gap: 12px; }
        .option { padding: 18px 24px; background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)'}; border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}; border-radius: 14px; color: ${isDark ? 'rgba(255,255,255,0.8)' : 'rgba(42,42,42,0.8)'}; font-size: 0.95rem; cursor: pointer; text-align: left; transition: all 0.3s ease; }
        .option:hover { background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)'}; transform: translateY(-2px); }
      `}</style>
      <div className="assessment-page">
        <div className="header">
          <a href="/assessment" className="back-btn">← Exit</a>
          <span className="progress-text">{currentQuestion + 1} of {QUESTIONS.length}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }} />
        </div>
        <div className="content">
          <p className="assessment-title">Lifestyle Decode</p>
          <h2 className="question-text">{question.text}</h2>
          <div className="options">
            {question.options.map((option) => (
              <button key={option.value} className="option" onClick={() => handleAnswer(question.id, option.value, option.scores)}>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}