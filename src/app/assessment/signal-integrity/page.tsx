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
      noiseResistance: number;
      attentionBoundary: number;
      recoverySpeed: number;
      signalClarity: number;
    };
  }[];
};

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'After scrolling through social media for 20 minutes, you typically feel:',
    options: [
      { value: 'a', label: 'About the same as before', scores: { noiseResistance: 3, attentionBoundary: 2, recoverySpeed: 2, signalClarity: 2 } },
      { value: 'b', label: 'Slightly scattered but fine', scores: { noiseResistance: 2, attentionBoundary: 1, recoverySpeed: 2, signalClarity: 1 } },
      { value: 'c', label: 'Noticeably drained or agitated', scores: { noiseResistance: 1, attentionBoundary: 0, recoverySpeed: 1, signalClarity: 0 } },
      { value: 'd', label: 'I avoid it because I know how it affects me', scores: { noiseResistance: 2, attentionBoundary: 3, recoverySpeed: 2, signalClarity: 3 } },
    ]
  },
  {
    id: 'q2',
    text: 'When multiple people need your attention at once:',
    options: [
      { value: 'a', label: 'I can hold all threads without losing track', scores: { noiseResistance: 3, attentionBoundary: 2, recoverySpeed: 2, signalClarity: 2 } },
      { value: 'b', label: 'I manage but feel stretched thin', scores: { noiseResistance: 2, attentionBoundary: 1, recoverySpeed: 1, signalClarity: 1 } },
      { value: 'c', label: 'I start making mistakes or forgetting things', scores: { noiseResistance: 0, attentionBoundary: 0, recoverySpeed: 1, signalClarity: 0 } },
      { value: 'd', label: 'I immediately prioritize and defer the rest', scores: { noiseResistance: 2, attentionBoundary: 3, recoverySpeed: 2, signalClarity: 3 } },
    ]
  },
  {
    id: 'q3',
    text: 'Your relationship with notifications is:',
    options: [
      { value: 'a', label: 'They don\'t affect my focus much', scores: { noiseResistance: 3, attentionBoundary: 2, recoverySpeed: 2, signalClarity: 2 } },
      { value: 'b', label: 'I check them but can return to what I was doing', scores: { noiseResistance: 2, attentionBoundary: 1, recoverySpeed: 2, signalClarity: 1 } },
      { value: 'c', label: 'Each one pulls me away and I lose my thread', scores: { noiseResistance: 0, attentionBoundary: 0, recoverySpeed: 0, signalClarity: 0 } },
      { value: 'd', label: 'I keep most of them off intentionally', scores: { noiseResistance: 2, attentionBoundary: 3, recoverySpeed: 3, signalClarity: 3 } },
    ]
  },
  {
    id: 'q4',
    text: 'When you need to make a decision, too many options makes you:',
    options: [
      { value: 'a', label: 'More confident, I like having choices', scores: { noiseResistance: 3, attentionBoundary: 2, recoverySpeed: 2, signalClarity: 2 } },
      { value: 'b', label: 'Slightly overwhelmed but I manage', scores: { noiseResistance: 2, attentionBoundary: 1, recoverySpeed: 1, signalClarity: 1 } },
      { value: 'c', label: 'Paralyzed, I often avoid deciding', scores: { noiseResistance: 0, attentionBoundary: 0, recoverySpeed: 0, signalClarity: 0 } },
      { value: 'd', label: 'I narrow options quickly before evaluating', scores: { noiseResistance: 2, attentionBoundary: 3, recoverySpeed: 2, signalClarity: 3 } },
    ]
  },
  {
    id: 'q5',
    text: 'After a day of meetings or calls, your mind:',
    options: [
      { value: 'a', label: 'Feels clear and ready for more', scores: { noiseResistance: 3, attentionBoundary: 2, recoverySpeed: 3, signalClarity: 2 } },
      { value: 'b', label: 'Needs a brief reset then I\'m fine', scores: { noiseResistance: 2, attentionBoundary: 2, recoverySpeed: 2, signalClarity: 2 } },
      { value: 'c', label: 'Feels foggy and hard to use', scores: { noiseResistance: 0, attentionBoundary: 0, recoverySpeed: 0, signalClarity: 0 } },
      { value: 'd', label: 'I schedule recovery time in advance', scores: { noiseResistance: 1, attentionBoundary: 3, recoverySpeed: 2, signalClarity: 3 } },
    ]
  },
  {
    id: 'q6',
    text: 'When exposed to others\' strong emotions (online or in person):',
    options: [
      { value: 'a', label: 'I can observe without absorbing', scores: { noiseResistance: 3, attentionBoundary: 3, recoverySpeed: 2, signalClarity: 2 } },
      { value: 'b', label: 'I feel some of it but shake it off', scores: { noiseResistance: 2, attentionBoundary: 2, recoverySpeed: 2, signalClarity: 1 } },
      { value: 'c', label: 'It stays with me for hours or longer', scores: { noiseResistance: 0, attentionBoundary: 0, recoverySpeed: 0, signalClarity: 0 } },
      { value: 'd', label: 'I limit exposure because I know the cost', scores: { noiseResistance: 1, attentionBoundary: 3, recoverySpeed: 1, signalClarity: 3 } },
    ]
  },
  {
    id: 'q7',
    text: 'Your ability to hear your own thoughts clearly is:',
    options: [
      { value: 'a', label: 'Consistent, I know what I think and feel', scores: { noiseResistance: 2, attentionBoundary: 2, recoverySpeed: 2, signalClarity: 3 } },
      { value: 'b', label: 'Variable, depends on the day', scores: { noiseResistance: 1, attentionBoundary: 1, recoverySpeed: 2, signalClarity: 2 } },
      { value: 'c', label: 'Often clouded by noise or others\' input', scores: { noiseResistance: 0, attentionBoundary: 0, recoverySpeed: 1, signalClarity: 0 } },
      { value: 'd', label: 'Clear when I protect my space', scores: { noiseResistance: 1, attentionBoundary: 3, recoverySpeed: 2, signalClarity: 2 } },
    ]
  },
  {
    id: 'q8',
    text: 'When you set aside time for focused work:',
    options: [
      { value: 'a', label: 'I can sustain attention for long stretches', scores: { noiseResistance: 3, attentionBoundary: 2, recoverySpeed: 2, signalClarity: 3 } },
      { value: 'b', label: 'I manage 30-60 minutes before needing a break', scores: { noiseResistance: 2, attentionBoundary: 2, recoverySpeed: 2, signalClarity: 2 } },
      { value: 'c', label: 'I struggle to get started or stay on track', scores: { noiseResistance: 0, attentionBoundary: 0, recoverySpeed: 1, signalClarity: 0 } },
      { value: 'd', label: 'I can focus deeply if the environment is right', scores: { noiseResistance: 1, attentionBoundary: 3, recoverySpeed: 2, signalClarity: 2 } },
    ]
  },
  {
    id: 'q9',
    text: 'Comparison to others on social platforms makes you:',
    options: [
      { value: 'a', label: 'Unaffected, I know it\'s curated', scores: { noiseResistance: 3, attentionBoundary: 3, recoverySpeed: 2, signalClarity: 3 } },
      { value: 'b', label: 'Occasionally doubt myself, then move on', scores: { noiseResistance: 2, attentionBoundary: 1, recoverySpeed: 2, signalClarity: 1 } },
      { value: 'c', label: 'Often feel worse about myself or my life', scores: { noiseResistance: 0, attentionBoundary: 0, recoverySpeed: 0, signalClarity: 0 } },
      { value: 'd', label: 'I curate my feed to avoid this', scores: { noiseResistance: 2, attentionBoundary: 3, recoverySpeed: 2, signalClarity: 2 } },
    ]
  },
  {
    id: 'q10',
    text: 'At the end of a high-input day, you need:',
    options: [
      { value: 'a', label: 'Normal wind-down, sleep resets me', scores: { noiseResistance: 3, attentionBoundary: 2, recoverySpeed: 3, signalClarity: 2 } },
      { value: 'b', label: 'Some quiet time but not too much', scores: { noiseResistance: 2, attentionBoundary: 2, recoverySpeed: 2, signalClarity: 2 } },
      { value: 'c', label: 'Extended silence and solitude to recover', scores: { noiseResistance: 0, attentionBoundary: 1, recoverySpeed: 0, signalClarity: 1 } },
      { value: 'd', label: 'I rarely let days get that full', scores: { noiseResistance: 2, attentionBoundary: 3, recoverySpeed: 2, signalClarity: 3 } },
    ]
  },
];

type ProfileType = 'Fortress' | 'Filter' | 'Sponge' | 'Architect';

type Profile = {
  type: ProfileType;
  title: string;
  description: string;
  capacity: string;
  strengths: string[];
  vulnerabilities: string[];
  protection: string[];
};

const PROFILES: Record<ProfileType, Profile> = {
  Fortress: {
    type: 'Fortress',
    title: 'The Fortress',
    description: 'Your signal integrity is naturally strong. External noise has difficulty penetrating your cognitive space. You maintain clarity in high-input environments.',
    capacity: 'High signal tolerance, strong natural boundaries',
    strengths: [
      'Maintain clarity in chaotic environments',
      'Resistant to social contagion',
      'Quick cognitive recovery',
      'Decision-making stays consistent under load'
    ],
    vulnerabilities: [
      'May miss subtle signals that matter',
      'Can appear unaffected when others need acknowledgment',
      'May underestimate others\' sensitivity',
      'Delay noticing when you do hit limits'
    ],
    protection: [
      'Trust your natural filtering',
      'Check in occasionally on what you might be missing',
      'Your boundaries serve you, maintain them',
      'Model signal protection for others'
    ]
  },
  Filter: {
    type: 'Filter',
    title: 'The Filter',
    description: 'You have good signal management with intentional effort. You\'ve learned to create boundaries and protect your attention. Your clarity depends on maintained practices.',
    capacity: 'Moderate tolerance, learned boundaries',
    strengths: [
      'Conscious awareness of signal impact',
      'Can adapt boundaries to context',
      'Good at teaching others to protect signal',
      'Balance between openness and protection'
    ],
    vulnerabilities: [
      'Boundaries require ongoing energy',
      'Can slip when stressed or tired',
      'May over-control in reaction to past overwhelm',
      'Recovery practices feel non-negotiable'
    ],
    protection: [
      'Your systems work, protect them',
      'Build recovery into your schedule, not after',
      'Name your limits before you hit them',
      'Environmental design matters for you'
    ]
  },
  Sponge: {
    type: 'Sponge',
    title: 'The Sponge',
    description: 'You absorb signal easily, both useful information and noise. Your system processes deeply but has difficulty filtering. Protection is essential, not optional.',
    capacity: 'Low noise tolerance, deep processing',
    strengths: [
      'Notice subtleties others miss',
      'Deep processing leads to insight',
      'High empathy and attunement',
      'Rich inner experience'
    ],
    vulnerabilities: [
      'Overwhelm comes faster than you expect',
      'Others\' emotions enter your system',
      'Recovery takes longer than seems fair',
      'Digital environments are particularly costly'
    ],
    protection: [
      'Aggressive boundary-setting is self-care',
      'Limit exposure windows, not just content',
      'Recovery is not laziness, it\'s necessity',
      'Your sensitivity is valuable in protected doses'
    ]
  },
  Architect: {
    type: 'Architect',
    title: 'The Architect',
    description: 'You have strong signal awareness and actively design your information environment. You know your limits and build systems to protect clarity.',
    capacity: 'Variable tolerance, high design intelligence',
    strengths: [
      'Proactive environment design',
      'Strong meta-awareness of signal impact',
      'Can teach others to protect attention',
      'Balance depth and protection'
    ],
    vulnerabilities: [
      'May over-engineer protection',
      'Control can become rigidity',
      'New environments require adjustment period',
      'May struggle when systems are disrupted'
    ],
    protection: [
      'Your design instinct is correct, trust it',
      'Build flexibility into your systems',
      'Allow some unstructured input for serendipity',
      'Share your architecture with others who need it'
    ]
  }
};

export default function SignalIntegrityMap() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState({ noiseResistance: 0, attentionBoundary: 0, recoverySpeed: 0, signalClarity: 0 });
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
      noiseResistance: prev.noiseResistance + optionScores.noiseResistance,
      attentionBoundary: prev.attentionBoundary + optionScores.attentionBoundary,
      recoverySpeed: prev.recoverySpeed + optionScores.recoverySpeed,
      signalClarity: prev.signalClarity + optionScores.signalClarity,
    }));

    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    } else {
      setTimeout(() => calculateResults(), 300);
    }
  };

  const calculateResults = () => {
    const total = scores.noiseResistance + scores.attentionBoundary + scores.recoverySpeed + scores.signalClarity;
    const boundaryRatio = scores.attentionBoundary / (total || 1);
    
    let profileType: ProfileType;
    
    if (total >= 80) {
      profileType = 'Fortress';
    } else if (boundaryRatio > 0.35) {
      profileType = 'Architect';
    } else if (total >= 50) {
      profileType = 'Filter';
    } else {
      profileType = 'Sponge';
    }

    setProfile(PROFILES[profileType]);
    setShowResults(true);
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
          .capacity-badge {
            display: inline-block;
            padding: 8px 16px;
            background: ${isDark ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.08)'};
            border: 1px solid ${isDark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.15)'};
            border-radius: 50px;
            color: ${isDark ? 'rgba(139,92,246,0.9)' : 'rgba(139,92,246,0.8)'};
            font-size: 0.75rem;
            margin-top: 20px;
          }
          .scores-visual {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 40px 0;
            flex-wrap: wrap;
          }
          .score-item {
            text-align: center;
          }
          .score-bar-container {
            width: 50px;
            height: 80px;
            background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
            border-radius: 25px;
            position: relative;
            overflow: hidden;
            margin-bottom: 8px;
          }
          .score-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            border-radius: 25px;
            background: linear-gradient(180deg, rgba(139,92,246,0.4) 0%, rgba(139,92,246,0.8) 100%);
            transition: height 1s ease;
          }
          .score-label {
            font-size: 0.6rem;
            color: ${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)'};
            text-transform: uppercase;
            letter-spacing: 0.03em;
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
              <p className="results-label">Your Signal Integrity Profile</p>
              <h1 className="profile-type">{profile.title}</h1>
              <p className="profile-description">{profile.description}</p>
              <span className="capacity-badge">{profile.capacity}</span>
            </div>

            <div className="scores-visual">
              {[
                { key: 'noiseResistance', label: 'Noise' },
                { key: 'attentionBoundary', label: 'Boundary' },
                { key: 'recoverySpeed', label: 'Recovery' },
                { key: 'signalClarity', label: 'Clarity' },
              ].map(({ key, label }) => (
                <div key={key} className="score-item">
                  <div className="score-bar-container">
                    <div 
                      className="score-bar" 
                      style={{ height: `${(scores[key as keyof typeof scores] / 30) * 100}%` }} 
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
              <h3 className="section-title">Vulnerabilities</h3>
              <ul className="section-list">
                {profile.vulnerabilities.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>

            <div className="section">
              <h3 className="section-title">How to Protect Your Signal</h3>
              <ul className="section-list">
                {profile.protection.map((s, i) => <li key={i}>{s}</li>)}
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
              <a className="next-link" onClick={() => router.push('/assessment/lifestyle')}>
                Lifestyle Decode →
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
          <p className="assessment-title">Signal Integrity Map</p>
          <h2 className="question-text">{question.text}</h2>
          <div className="options">
            {question.options.map((option) => (
              <button
                key={option.value}
                className="option"
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