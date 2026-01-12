'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Question = {
  id: string;
  text: string;
  subtext?: string;
  options: {
    value: string;
    label: string;
    scores: {
      fight: number;
      flight: number;
      freeze: number;
      fawn: number;
    };
  }[];
};

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'When something unexpected disrupts your day, your first internal response is usually:',
    options: [
      { value: 'a', label: 'A surge of energy — ready to handle it', scores: { fight: 2, flight: 0, freeze: 0, fawn: 0 } },
      { value: 'b', label: 'An urge to step away or leave the situation', scores: { fight: 0, flight: 2, freeze: 0, fawn: 0 } },
      { value: 'c', label: 'A sense of blankness — hard to think clearly', scores: { fight: 0, flight: 0, freeze: 2, fawn: 0 } },
      { value: 'd', label: 'Immediately thinking about how others are affected', scores: { fight: 0, flight: 0, freeze: 0, fawn: 2 } },
    ]
  },
  {
    id: 'q2',
    text: 'In a disagreement, you tend to:',
    options: [
      { value: 'a', label: 'State your position firmly, even if it creates tension', scores: { fight: 2, flight: 0, freeze: 0, fawn: 0 } },
      { value: 'b', label: 'Find a reason to exit or delay the conversation', scores: { fight: 0, flight: 2, freeze: 0, fawn: 0 } },
      { value: 'c', label: 'Go quiet and wait for it to pass', scores: { fight: 0, flight: 0, freeze: 2, fawn: 0 } },
      { value: 'd', label: 'Adjust your stance to keep the peace', scores: { fight: 0, flight: 0, freeze: 0, fawn: 2 } },
    ]
  },
  {
    id: 'q3',
    text: 'After a stressful event, your body usually:',
    options: [
      { value: 'a', label: 'Stays activated — hard to wind down', scores: { fight: 2, flight: 1, freeze: 0, fawn: 0 } },
      { value: 'b', label: 'Feels restless — needs movement or distraction', scores: { fight: 0, flight: 2, freeze: 0, fawn: 0 } },
      { value: 'c', label: 'Feels heavy, tired, or disconnected', scores: { fight: 0, flight: 0, freeze: 2, fawn: 0 } },
      { value: 'd', label: 'Feels unsettled until you check on others', scores: { fight: 0, flight: 0, freeze: 0, fawn: 2 } },
    ]
  },
  {
    id: 'q4',
    text: 'When you sense someone is upset with you:',
    options: [
      { value: 'a', label: 'You feel defensive and ready to explain yourself', scores: { fight: 2, flight: 0, freeze: 0, fawn: 0 } },
      { value: 'b', label: 'You want to create distance until it blows over', scores: { fight: 0, flight: 2, freeze: 0, fawn: 0 } },
      { value: 'c', label: 'You feel paralyzed, unsure what to do', scores: { fight: 0, flight: 0, freeze: 2, fawn: 0 } },
      { value: 'd', label: 'You immediately try to fix it or apologize', scores: { fight: 0, flight: 0, freeze: 0, fawn: 2 } },
    ]
  },
  {
    id: 'q5',
    text: 'Your relationship with rest is:',
    options: [
      { value: 'a', label: 'Difficult — stillness feels unproductive', scores: { fight: 2, flight: 1, freeze: 0, fawn: 0 } },
      { value: 'b', label: 'Rest happens, but your mind keeps moving', scores: { fight: 0, flight: 2, freeze: 0, fawn: 0 } },
      { value: 'c', label: 'You rest but don\'t always feel restored', scores: { fight: 0, flight: 0, freeze: 2, fawn: 0 } },
      { value: 'd', label: 'Rest feels selfish when others need you', scores: { fight: 0, flight: 0, freeze: 0, fawn: 2 } },
    ]
  },
  {
    id: 'q6',
    text: 'When overwhelmed, you\'re most likely to:',
    options: [
      { value: 'a', label: 'Push harder to regain control', scores: { fight: 2, flight: 0, freeze: 0, fawn: 0 } },
      { value: 'b', label: 'Escape into something — screens, tasks, plans', scores: { fight: 0, flight: 2, freeze: 0, fawn: 0 } },
      { value: 'c', label: 'Shut down and do nothing', scores: { fight: 0, flight: 0, freeze: 2, fawn: 0 } },
      { value: 'd', label: 'Focus on someone else\'s needs instead', scores: { fight: 0, flight: 0, freeze: 0, fawn: 2 } },
    ]
  },
  {
    id: 'q7',
    text: 'In your body, stress often shows up as:',
    options: [
      { value: 'a', label: 'Tension in jaw, shoulders, or chest', scores: { fight: 2, flight: 0, freeze: 0, fawn: 0 } },
      { value: 'b', label: 'Restless legs, racing heart, shallow breathing', scores: { fight: 0, flight: 2, freeze: 0, fawn: 0 } },
      { value: 'c', label: 'Fatigue, heaviness, or numbness', scores: { fight: 0, flight: 0, freeze: 2, fawn: 0 } },
      { value: 'd', label: 'Stomach tension or holding your breath around others', scores: { fight: 0, flight: 0, freeze: 0, fawn: 2 } },
    ]
  },
  {
    id: 'q8',
    text: 'When making a difficult decision, you:',
    options: [
      { value: 'a', label: 'Decide quickly and deal with consequences later', scores: { fight: 2, flight: 0, freeze: 0, fawn: 0 } },
      { value: 'b', label: 'Keep researching or delaying the choice', scores: { fight: 0, flight: 2, freeze: 0, fawn: 0 } },
      { value: 'c', label: 'Feel stuck and unable to move forward', scores: { fight: 0, flight: 0, freeze: 2, fawn: 0 } },
      { value: 'd', label: 'Ask others what they think you should do', scores: { fight: 0, flight: 0, freeze: 0, fawn: 2 } },
    ]
  },
  {
    id: 'q9',
    text: 'Your energy throughout the day is typically:',
    options: [
      { value: 'a', label: 'High and sustained — until you crash', scores: { fight: 2, flight: 0, freeze: 0, fawn: 0 } },
      { value: 'b', label: 'Inconsistent — peaks and dips unpredictably', scores: { fight: 0, flight: 2, freeze: 0, fawn: 0 } },
      { value: 'c', label: 'Low baseline — hard to access motivation', scores: { fight: 0, flight: 0, freeze: 2, fawn: 0 } },
      { value: 'd', label: 'Depends on who you\'re around', scores: { fight: 0, flight: 0, freeze: 0, fawn: 2 } },
    ]
  },
  {
    id: 'q10',
    text: 'The last time you felt truly safe, your body felt:',
    options: [
      { value: 'a', label: 'Strong and capable', scores: { fight: 2, flight: 0, freeze: 0, fawn: 0 } },
      { value: 'b', label: 'Free and unburdened', scores: { fight: 0, flight: 2, freeze: 0, fawn: 0 } },
      { value: 'c', label: 'Still and quiet inside', scores: { fight: 0, flight: 0, freeze: 2, fawn: 0 } },
      { value: 'd', label: 'Connected and accepted', scores: { fight: 0, flight: 0, freeze: 0, fawn: 2 } },
    ]
  },
];

type ProfileType = 'Guardian' | 'Navigator' | 'Observer' | 'Harmonizer' | 'Adaptive';

type Profile = {
  type: ProfileType;
  title: string;
  description: string;
  strengths: string[];
  watchFor: string[];
  regulation: string[];
};

const PROFILES: Record<ProfileType, Profile> = {
  Guardian: {
    type: 'Guardian',
    title: 'The Guardian',
    description: 'Your nervous system is wired for protection and action. You meet challenges head-on and have strong capacity for mobilization. Your system prioritizes control and decisive response.',
    strengths: [
      'Quick decision-making under pressure',
      'Strong boundaries when needed',
      'Natural leadership in crisis',
      'High energy reserves for important tasks'
    ],
    watchFor: [
      'Difficulty downshifting after stress',
      'Tension accumulation in the body',
      'Rest feeling like weakness',
      'Over-functioning when slowing down would help'
    ],
    regulation: [
      'Physical release before mental processing',
      'Environments that honor your need for agency',
      'Permission to rest as strategic, not lazy',
      'Grounding practices that feel active, not passive'
    ]
  },
  Navigator: {
    type: 'Navigator',
    title: 'The Navigator',
    description: 'Your system is attuned to movement and possibility. You process through action, planning, and forward motion. Your nervous system prefers options and escape routes.',
    strengths: [
      'Excellent at seeing alternatives',
      'Adaptable in changing circumstances',
      'Quick mental processing',
      'Natural ability to pivot and adjust'
    ],
    watchFor: [
      'Restlessness mistaken for anxiety',
      'Difficulty being present when still',
      'Over-planning as avoidance',
      'Running from rather than toward'
    ],
    regulation: [
      'Movement-based settling practices',
      'Environments with multiple exits and flow',
      'Processing through walking or motion',
      'Channeling flight energy into exploration'
    ]
  },
  Observer: {
    type: 'Observer',
    title: 'The Observer',
    description: 'Your nervous system has learned to conserve and protect through stillness. You have deep capacity for reflection and observation. Your system prioritizes safety through withdrawal.',
    strengths: [
      'Deep thinking and analysis',
      'Ability to wait and observe before acting',
      'Conservation of energy for what matters',
      'Rich inner world and reflection'
    ],
    watchFor: [
      'Shutdown mistaken for peace',
      'Disconnection from body signals',
      'Isolation extending beyond restoration',
      'Energy depletion before recognizing it'
    ],
    regulation: [
      'Gentle reactivation practices',
      'Environments that feel safe for emergence',
      'Small movements that rebuild connection',
      'Warmth, weight, and sensory anchoring'
    ]
  },
  Harmonizer: {
    type: 'Harmonizer',
    title: 'The Harmonizer',
    description: 'Your nervous system is highly attuned to others. You regulate through connection and have strong relational intelligence. Your system prioritizes belonging and social safety.',
    strengths: [
      'Deep empathy and attunement',
      'Skilled at reading social dynamics',
      'Natural peacemaking abilities',
      'Strong relational bonds'
    ],
    watchFor: [
      'Others\' needs overshadowing your own',
      'Difficulty knowing your own preferences',
      'Over-giving leading to depletion',
      'Self-abandonment for connection'
    ],
    regulation: [
      'Practices that start with self-attunement',
      'Environments where you can take up space',
      'Permission to have needs and preferences',
      'Connection that doesn\'t require performance'
    ]
  },
  Adaptive: {
    type: 'Adaptive',
    title: 'The Adaptive',
    description: 'Your nervous system draws from multiple response patterns depending on context. You have range and flexibility, with no single dominant survival strategy.',
    strengths: [
      'Contextual intelligence',
      'Flexible response capacity',
      'Balance across situations',
      'Integrated survival strategies'
    ],
    watchFor: [
      'Uncertainty about your true baseline',
      'Context-switching fatigue',
      'Difficulty predicting your own responses',
      'Others not knowing what to expect'
    ],
    regulation: [
      'Practices that help you find center',
      'Environments that allow full expression',
      'Regular check-ins with your own state',
      'Integration rather than optimization'
    ]
  }
};

export default function NervousSystemMap() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState({ fight: 0, flight: 0, freeze: 0, fawn: 0 });
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
      fight: prev.fight + optionScores.fight,
      flight: prev.flight + optionScores.flight,
      freeze: prev.freeze + optionScores.freeze,
      fawn: prev.fawn + optionScores.fawn,
    }));

    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    } else {
      setTimeout(() => calculateResults(), 300);
    }
  };

  const calculateResults = () => {
    const finalScores = { ...scores };
    const max = Math.max(finalScores.fight, finalScores.flight, finalScores.freeze, finalScores.fawn);
    const total = finalScores.fight + finalScores.flight + finalScores.freeze + finalScores.fawn;
    
    // Check if adaptive (no clear dominant)
    const dominantCount = Object.values(finalScores).filter(s => s >= max - 2).length;
    
    let profileType: ProfileType;
    if (dominantCount >= 3 || (max / total) < 0.35) {
      profileType = 'Adaptive';
    } else if (finalScores.fight === max) {
      profileType = 'Guardian';
    } else if (finalScores.flight === max) {
      profileType = 'Navigator';
    } else if (finalScores.freeze === max) {
      profileType = 'Observer';
    } else {
      profileType = 'Harmonizer';
    }

    setProfile(PROFILES[profileType]);
    setShowResults(true);
  };

  const getProgressWidth = () => {
    return ((currentQuestion + 1) / QUESTIONS.length) * 100;
  };

  if (!mounted) {
    return <div style={{ minHeight: '100vh', background: '#f8f6f2' }} />;
  }

  if (showResults && profile) {
    return (
      <>
        <style jsx>{`
          .results-page {
            min-height: 100vh;
            background: ${isDark
              ? 'linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0d0d18 100%)'
              : 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #e8e2d8 100%)'};
            padding: 20px;
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          }

          .results-container {
            max-width: 600px;
            margin: 0 auto;
            padding-top: 40px;
            padding-bottom: 60px;
          }

          .results-header {
            text-align: center;
            margin-bottom: 40px;
          }

          .results-label {
            font-size: 0.6rem;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'};
            margin-bottom: 16px;
          }

          .profile-type {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: clamp(2rem, 6vw, 3rem);
            font-weight: 300;
            color: ${isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)'};
            margin-bottom: 20px;
          }

          .profile-description {
            font-size: 1rem;
            color: ${isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)'};
            line-height: 1.7;
          }

          .scores-visual {
            display: flex;
            justify-content: center;
            gap: 24px;
            margin: 40px 0;
            flex-wrap: wrap;
          }

          .score-item {
            text-align: center;
          }

          .score-bar-container {
            width: 60px;
            height: 100px;
            background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
            border-radius: 30px;
            position: relative;
            overflow: hidden;
            margin-bottom: 8px;
          }

          .score-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            border-radius: 30px;
            transition: height 1s ease;
          }

          .score-label {
            font-size: 0.7rem;
            color: ${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)'};
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .section {
            background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)'};
            border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'};
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 16px;
          }

          .section-title {
            font-size: 0.65rem;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'};
            margin-bottom: 16px;
          }

          .section-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .section-list li {
            font-size: 0.9rem;
            color: ${isDark ? 'rgba(255,255,255,0.75)' : 'rgba(42,42,42,0.75)'};
            padding: 8px 0;
            border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'};
            line-height: 1.5;
          }

          .section-list li:last-child {
            border-bottom: none;
          }

          .actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 40px;
          }

          .primary-btn {
            padding: 16px 32px;
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            border: none;
            border-radius: 12px;
            color: white;
            font-size: 0.95rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 6px 20px rgba(139,92,246,0.25);
          }

          .primary-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(139,92,246,0.35);
          }

          .secondary-btn {
            padding: 14px 28px;
            background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)'};
            border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
            border-radius: 12px;
            color: ${isDark ? 'rgba(255,255,255,0.8)' : 'rgba(42,42,42,0.8)'};
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .secondary-btn:hover {
            background: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,1)'};
          }

          .next-assessment {
            text-align: center;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'};
          }

          .next-label {
            font-size: 0.75rem;
            color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'};
            margin-bottom: 12px;
          }

          .next-link {
            color: ${isDark ? 'rgba(139,92,246,0.9)' : 'rgba(139,92,246,0.8)'};
            text-decoration: none;
            font-weight: 500;
            cursor: pointer;
          }
        `}</style>

        <div className="results-page">
          <div className="results-container">
            <div className="results-header">
              <p className="results-label">Your Nervous System Profile</p>
              <h1 className="profile-type">{profile.title}</h1>
              <p className="profile-description">{profile.description}</p>
            </div>

            <div className="scores-visual">
              {[
                { key: 'fight', label: 'Fight', color: '#ef4444' },
                { key: 'flight', label: 'Flight', color: '#f59e0b' },
                { key: 'freeze', label: 'Freeze', color: '#6366f1' },
                { key: 'fawn', label: 'Fawn', color: '#ec4899' },
              ].map(({ key, label, color }) => (
                <div key={key} className="score-item">
                  <div className="score-bar-container">
                    <div 
                      className="score-bar" 
                      style={{ 
                        height: `${(scores[key as keyof typeof scores] / 20) * 100}%`,
                        background: `linear-gradient(180deg, ${color}40 0%, ${color}80 100%)`
                      }} 
                    />
                  </div>
                  <span className="score-label">{label}</span>
                </div>
              ))}
            </div>

            <div className="section">
              <h3 className="section-title">Your Strengths</h3>
              <ul className="section-list">
                {profile.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>

            <div className="section">
              <h3 className="section-title">Watch For</h3>
              <ul className="section-list">
                {profile.watchFor.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>

            <div className="section">
              <h3 className="section-title">What Supports Your Regulation</h3>
              <ul className="section-list">
                {profile.regulation.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>

            <div className="actions">
              <button className="primary-btn" onClick={() => router.push('/sanctuary')}>
                Enter Your Space
              </button>
              <button className="secondary-btn" onClick={() => router.push('/assessment')}>
                Back to All Assessments
              </button>
            </div>

            <div className="next-assessment">
              <p className="next-label">Continue mapping</p>
              <a className="next-link" onClick={() => router.push('/assessment/signal-integrity')}>
                Signal Integrity Map →
              </a>
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
        .assessment-page {
          min-height: 100vh;
          min-height: 100dvh;
          background: ${isDark
            ? 'linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0d0d18 100%)'
            : 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #e8e2d8 100%)'};
          padding: 20px;
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
          border-radius: 50px;
          color: ${isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)'};
          font-size: 0.85rem;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)'};
        }

        .progress-text {
          font-size: 0.8rem;
          color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'};
        }

        .progress-bar {
          height: 3px;
          background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
          border-radius: 2px;
          margin-bottom: 40px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-width: 600px;
          margin: 0 auto;
          width: 100%;
        }

        .assessment-title {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: ${isDark ? 'rgba(255,255,255,0.35)' : 'rgba(42,42,42,0.35)'};
          margin-bottom: 24px;
          text-align: center;
        }

        .question-text {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.3rem, 4vw, 1.6rem);
          font-weight: 400;
          color: ${isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.85)'};
          line-height: 1.5;
          text-align: center;
          margin-bottom: 40px;
        }

        .options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .option {
          padding: 18px 24px;
          background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'};
          border-radius: 14px;
          color: ${isDark ? 'rgba(255,255,255,0.8)' : 'rgba(42,42,42,0.8)'};
          font-size: 0.95rem;
          line-height: 1.5;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .option:hover {
          background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)'};
          border-color: ${isDark ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.2)'};
          transform: translateY(-2px);
        }

        .option.selected {
          background: ${isDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)'};
          border-color: rgba(139,92,246,0.4);
        }

        @media (max-width: 600px) {
          .question-text {
            font-size: 1.2rem;
          }

          .option {
            padding: 16px 20px;
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="assessment-page">
        <div className="header">
          <a href="/assessment" className="back-btn">← Exit</a>
          <span className="progress-text">{currentQuestion + 1} of {QUESTIONS.length}</span>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${getProgressWidth()}%` }} />
        </div>

        <div className="content">
          <p className="assessment-title">Nervous System Map</p>
          
          <h2 className="question-text">{question.text}</h2>

          <div className="options">
            {question.options.map((option) => (
              <button
                key={option.value}
                className={`option ${answers[question.id] === option.value ? 'selected' : ''}`}
                onClick={() => handleAnswer(question.id, option.value, option.scores)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}