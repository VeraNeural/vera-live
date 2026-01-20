'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { opsRoom, type Category, type Activity, type DropdownOption } from '@/app/sanctuary/ops/consolidatedData';
import { ActionSelector } from '@/lib/ops/components/ActionSelector';
import { DynamicForm } from '@/lib/ops/components/DynamicForm';
import { ProviderSelector } from '@/lib/ops/components/ProviderSelector';
import { ModeSelector } from '@/lib/ops/components/ModeSelector';
import { FormattedOutput } from '@/lib/ops/components/FormattedOutput';
import { OpsIcon } from '@/lib/ops/icons';
import { TIME_COLORS, getTimeOfDay } from '@/lib/ops/theme';
import { type AIProvider, type GenerationMode, type TimeOfDay, type ThemeMode } from '@/lib/ops/types';
import { default as LanguageExperience } from '@/lib/ops/experiences/Language';
import { ACTIVITY_PROMPT_FRAGMENTS } from '@/lib/ops/config/activityPromptFragments';
import { AppKitOrchestrator } from './orchestrators/AppKitOrchestrator';
import { WellnessOrchestrator } from './orchestrators/WellnessOrchestrator';
import { ThinkingOrchestrator } from './orchestrators/ThinkingOrchestrator';
import { MoneyOrchestrator } from './orchestrators/MoneyOrchestrator';

interface OpsRoomProps {
  onBack: () => void;
  initialView?: string;
  initialCategory?: string;
  initialActivity?: string;
  initialOption?: string;
}

const GLOBAL_STYLES = `
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

const GENERATION_MODES: Record<GenerationMode, { name: string }> = {
  single: { name: 'Single AI' },
  specialist: { name: 'Specialist' },
  consensus: { name: 'Consensus' },
  'review-chain': { name: 'Review Chain' },
  compare: { name: 'Compare' },
};

const AI_PROVIDERS: Record<AIProvider, { name: string; color: string }> = {
  claude: { name: 'Claude', color: '#D97706' },
  gpt4: { name: 'GPT-4', color: '#10B981' },
  grok: { name: 'Grok', color: '#8B5CF6' },
};

const SPACES = ['Personal', 'Work', 'Relationships', 'Legal / Financial', 'General'] as const;
type Space = (typeof SPACES)[number];

type SavedOutput = {
  id: string;
  space: Space;
  timestamp: string;
  activityId: string;
  text: string;
};

type FocusMode = 'think' | 'decide' | 'do' | 'create' | 'reflect';
type AccessTier = 'anonymous' | 'free' | 'forge' | 'sanctuary';

export default function OpsRoom({ onBack, initialView, initialCategory, initialActivity, initialOption }: OpsRoomProps) {
  const { isLoaded: clerkLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');
  const [manualTheme, setManualTheme] = useState<ThemeMode>('auto');
  const [isLoaded, setIsLoaded] = useState(false);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<Activity | null>(null);
  const [selectedDropdownOption, setSelectedDropdownOption] = useState<DropdownOption | null>(null);

  const [generationMode, setGenerationMode] = useState<GenerationMode>('specialist');
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('claude');
  const [showModeSelector, setShowModeSelector] = useState(false);

  const [simpleInput, setSimpleInput] = useState('');
  const [formFields, setFormFields] = useState<Record<string, string>>({});

  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [compareOutputs, setCompareOutputs] = useState<{ provider: AIProvider; content: string }[] | null>(null);
  const [usedProvider, setUsedProvider] = useState<AIProvider | null>(null);
  const [copied, setCopied] = useState(false);
  const [showClosingMessage, setShowClosingMessage] = useState(false);
  const [signalLayer, setSignalLayer] = useState('');
  const [handoffFlags, setHandoffFlags] = useState<string[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<Space>('General');
  const [lastDecodeInput, setLastDecodeInput] = useState('');
  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'error'>('idle');
  const [decodeEntryType, setDecodeEntryType] = useState<string>('text');
  const [handoffContext, setHandoffContext] = useState('');
  const [focusMode, setFocusMode] = useState<FocusMode>('think');
  const [respondMode, setRespondMode] = useState<string>('quick');
  const [respondTone, setRespondTone] = useState<string>('neutral');
  const [boundaryMode, setBoundaryMode] = useState<string>('boundary-script');
  const [boundaryTone, setBoundaryTone] = useState<string>('gentle');
  const [boundaryDelivery, setBoundaryDelivery] = useState<string>('');
  const [communicationInput, setCommunicationInput] = useState('');
  const [communicationBoundaryInput, setCommunicationBoundaryInput] = useState('');
  const [communicationRespondIntent, setCommunicationRespondIntent] = useState('');
  const [communicationIncludeBoundary, setCommunicationIncludeBoundary] = useState(false);
  const [communicationDecodeOutput, setCommunicationDecodeOutput] = useState<string | null>(null);
  const [communicationBoundaryOutput, setCommunicationBoundaryOutput] = useState<string | null>(null);
  const [communicationRespondOutput, setCommunicationRespondOutput] = useState<string | null>(null);
  const [communicationDecodeGenerating, setCommunicationDecodeGenerating] = useState(false);
  const [communicationBoundaryGenerating, setCommunicationBoundaryGenerating] = useState(false);
  const [communicationRespondGenerating, setCommunicationRespondGenerating] = useState(false);
  const [communicationBoundaryNeeded, setCommunicationBoundaryNeeded] = useState(false);
  const [communicationBoundaryMode, setCommunicationBoundaryMode] = useState(false);
  const [communicationBoundaryType, setCommunicationBoundaryType] = useState<string>('boundary-script');
  const [communicationBoundaryTone, setCommunicationBoundaryTone] = useState<string>('gentle');
  const [showCommunicationAnalysis, setShowCommunicationAnalysis] = useState(false);
  const [communicationSignalLayer, setCommunicationSignalLayer] = useState('');
  const [communicationCoreMove, setCommunicationCoreMove] = useState('');
  const [communicationTimeOrientation, setCommunicationTimeOrientation] = useState('');
  const [communicationWhatsMissing, setCommunicationWhatsMissing] = useState<string[]>([]);
  const [communicationCleanContrast, setCommunicationCleanContrast] = useState('');
  const [showCommunicationWhatsMissing, setShowCommunicationWhatsMissing] = useState(false);
  const [showCommunicationCleanContrast, setShowCommunicationCleanContrast] = useState(false);
  // Work & Life unified flow states
  const [workLifeInput, setWorkLifeInput] = useState('');
  const [workLifeAnalysisOutput, setWorkLifeAnalysisOutput] = useState<string | null>(null);
  const [workLifeActionOutput, setWorkLifeActionOutput] = useState<string | null>(null);
  const [workLifeGenerating, setWorkLifeGenerating] = useState(false);
  const [showWorkLifeAnalysis, setShowWorkLifeAnalysis] = useState(false);
  const [workLifeStage, setWorkLifeStage] = useState<'input' | 'clarify' | 'result'>('input');
  const [workLifeClarifyQuestion, setWorkLifeClarifyQuestion] = useState('');
  const [workLifeClarifyOptions, setWorkLifeClarifyOptions] = useState<string[]>([]);
  const [workLifeClarifyInsight, setWorkLifeClarifyInsight] = useState('');
  const [workLifeUserChoice, setWorkLifeUserChoice] = useState('');
  const [workLifeCustomAnswer, setWorkLifeCustomAnswer] = useState('');
  const [workLifeDumpStage, setWorkLifeDumpStage] = useState<'initial' | 'sorted'>('initial');
  const [workLifeDumpInput, setWorkLifeDumpInput] = useState('');
  const [workLifeSortedOutput, setWorkLifeSortedOutput] = useState<string | null>(null);
  const [workLifeSortedGenerating, setWorkLifeSortedGenerating] = useState(false);
  const [workLifeMode, setWorkLifeMode] = useState<string>('task-breakdown');
  const [workLifeTone, setWorkLifeTone] = useState<string>('clear');
  const [workLifeContext, setWorkLifeContext] = useState<string>('');
  const [workLifeSecondaryMode, setWorkLifeSecondaryMode] = useState<string>('');
  const [thinkingMode, setThinkingMode] = useState<string>('brainstorm');
  const [thinkingSecondaryMode, setThinkingSecondaryMode] = useState<string>('');
  const [thinkingStyle, setThinkingStyle] = useState<string>('simple');
  const [thinkingDepth, setThinkingDepth] = useState<string>('short');
  const [relationshipMode, setRelationshipMode] = useState<string>('perspective-shift');
  const [relationshipTone, setRelationshipTone] = useState<string>('gentle');
  const [relationshipDepth, setRelationshipDepth] = useState<string>('short');
  const [careerTone, setCareerTone] = useState<string>('professional');
  const [createActivityId, setCreateActivityId] = useState<string>('write-email');
  const [createOptionId, setCreateOptionId] = useState<string>('');
  const [moneyMode, setMoneyMode] = useState<string>('budget-check');
  const [moneyPerspective, setMoneyPerspective] = useState<string>('conservative');
  const [moneyScope, setMoneyScope] = useState<string>('');
  const [moneyContext, setMoneyContext] = useState<string>('');
  const [moneySecondaryMode, setMoneySecondaryMode] = useState<string>('');
  // Money unified flow states
  const [moneyInput, setMoneyInput] = useState('');
  const [moneyAnalysisOutput, setMoneyAnalysisOutput] = useState<string | null>(null);
  const [moneyActionOutput, setMoneyActionOutput] = useState<string | null>(null);
  const [moneyGenerating, setMoneyGenerating] = useState(false);
  const [showMoneyAnalysis, setShowMoneyAnalysis] = useState(false);
  const [moneyDumpInput, setMoneyDumpInput] = useState('');
  const [moneySortedOutput, setMoneySortedOutput] = useState<string | null>(null);
  const [moneySorting, setMoneySorting] = useState(false);
  // Thinking & Learning unified flow states
  const [thinkingInput, setThinkingInput] = useState('');
  const [thinkingAnalysisOutput, setThinkingAnalysisOutput] = useState<string | null>(null);
  const [thinkingActionOutput, setThinkingActionOutput] = useState<string | null>(null);
  const [thinkingDumpInput, setThinkingDumpInput] = useState('');
  const [thinkingSortedOutput, setThinkingSortedOutput] = useState('');
  const [thinkingSorting, setThinkingSorting] = useState(false);
  const [thinkingGenerating, setThinkingGenerating] = useState(false);
  const [showThinkingAnalysis, setShowThinkingAnalysis] = useState(false);
  const [thinkingDetectedMode, setThinkingDetectedMode] = useState<'thinking' | 'learning' | null>(null);
  const [thinkingClarifyQuestion, setThinkingClarifyQuestion] = useState('');
  const [thinkingClarifyOptions, setThinkingClarifyOptions] = useState<string[]>([]);
  const [thinkingClarifyInsight, setThinkingClarifyInsight] = useState('');
  const [thinkingUserChoice, setThinkingUserChoice] = useState('');
  const [thinkingCustomAnswer, setThinkingCustomAnswer] = useState('');
  const [thinkingStage, setThinkingStage] = useState<'input' | 'clarify' | 'result'>('input');

  // Life Stuff unified flow states
  const [wellnessInput, setWellnessInput] = useState('');
  const [wellnessAnalysisOutput, setWellnessAnalysisOutput] = useState<string | null>(null);
  const [wellnessActionOutput, setWellnessActionOutput] = useState<string | null>(null);
  const [wellnessGenerating, setWellnessGenerating] = useState(false);
  const [showWellnessAnalysis, setShowWellnessAnalysis] = useState(false);
  const [wellnessStage, setWellnessStage] = useState<'input' | 'clarify' | 'result'>('input');
  const [wellnessMode, setWellnessMode] = useState<'relationship' | 'self-care' | null>(null);
  const [wellnessUserChoice, setWellnessUserChoice] = useState('');
  const [wellnessClarifyQuestion, setWellnessClarifyQuestion] = useState('');
  const [wellnessClarifyOptions, setWellnessClarifyOptions] = useState<string[]>([]);
  const [wellnessClarifyInsight, setWellnessClarifyInsight] = useState('');
  const [wellnessCustomAnswer, setWellnessCustomAnswer] = useState('');
  const [wellnessDumpInput, setWellnessDumpInput] = useState('');
  const [wellnessSortedOutput, setWellnessSortedOutput] = useState<string | null>(null);
  const [wellnessSorting, setWellnessSorting] = useState(false);

  // Application Kit states
  const [appKitJobDescription, setAppKitJobDescription] = useState('');
  const [appKitResume, setAppKitResume] = useState('');
  const [appKitHighlights, setAppKitHighlights] = useState('');
  const [appKitGenerating, setAppKitGenerating] = useState(false);
  const [appKitStage, setAppKitStage] = useState<'input' | 'results'>('input');
  const [appKitResumeOutput, setAppKitResumeOutput] = useState('');
  const [appKitCoverLetterOutput, setAppKitCoverLetterOutput] = useState('');
  const [appKitFollowUpOutput, setAppKitFollowUpOutput] = useState('');
  const [appKitInterviewPrepOutput, setAppKitInterviewPrepOutput] = useState('');
  const [appKitThankYouOutput, setAppKitThankYouOutput] = useState('');
  const [appKitActiveTab, setAppKitActiveTab] = useState('resume');

  const [coreMove, setCoreMove] = useState('');
  const [timeOrientation, setTimeOrientation] = useState('');
  const [whatsMissing, setWhatsMissing] = useState<string[]>([]);
  const [cleanContrast, setCleanContrast] = useState('');
  const [showWhatsMissing, setShowWhatsMissing] = useState(false);
  const [showCleanContrast, setShowCleanContrast] = useState(false);
  const [accessTier, setAccessTier] = useState<AccessTier | null>(null);

  const outputRef = useRef<HTMLDivElement>(null);

  const forgeOnlyActivityIds = new Set([
    'app-spec',
    'technical-design-doc',
    'api-contract',
    'landing-page-outline',
    'marketing-pack',
  ]);

  useEffect(() => {
    let isMounted = true;
    const fetchTier = async () => {
      try {
        const res = await fetch('/api/user/tier');
        const data = await res.json();
        const tier = typeof data?.tier === 'string' ? data.tier.toLowerCase() : 'free';
        if (!isMounted) return;
        if (tier === 'anonymous' || tier === 'free' || tier === 'forge' || tier === 'sanctuary') {
          setAccessTier(tier as AccessTier);
        } else {
          setAccessTier('free');
        }
      } catch {
        if (!isMounted) setAccessTier(null);
      }
    };
    fetchTier();
    return () => {
      isMounted = false;
    };
  }, []);

  const fallbackTier = useMemo<AccessTier>(() => {
    if (!clerkLoaded || !isSignedIn) return 'anonymous';
    const md = (user?.publicMetadata ?? {}) as Record<string, unknown>;
    const rawTier = md.accessTier as unknown;
    if (typeof rawTier === 'string') {
      const v = rawTier.trim().toLowerCase();
      if (v === 'sanctuary' || v === 'forge' || v === 'free') return v as AccessTier;
    }
    return 'free';
  }, [clerkLoaded, isSignedIn, user?.publicMetadata]);

  const resolvedTier = accessTier ?? fallbackTier;
  const canAccessForge = resolvedTier === 'forge' || resolvedTier === 'sanctuary';
  const showForgeUpsell =
    resolvedTier === 'free' && Boolean(selectedAction && forgeOnlyActivityIds.has(selectedAction.id));

  const workLifeCategory = opsRoom.categories.find((c) => c.id === 'work-life');
  const workLifeActivities = workLifeCategory?.activities ?? [];
  const workLifeGroupedActivities = workLifeActivities.filter((activity) => activity.id !== 'career');
  const defaultWorkLifeId = 'get-unstuck';
  const isWorkLifeGroupedActivity = (id?: string | null): boolean =>
    Boolean(id && (id === 'get-unstuck' || workLifeGroupedActivities.some((activity) => activity.id === id)));
  const workLifeActivityPrompts = workLifeGroupedActivities.reduce<Record<string, string>>((acc, activity) => {
    const fragment = ACTIVITY_PROMPT_FRAGMENTS[activity.id];
    if (fragment) acc[activity.id] = fragment;
    return acc;
  }, {});

  const moneyCategory = opsRoom.categories.find((c) => c.id === 'money');
  const moneyActivities = moneyCategory?.activities ?? [];
  const moneyActivityIds = new Set(moneyActivities.map((activity) => activity.id));
  const isMoneyActivity = (id?: string | null): boolean => Boolean(id && moneyActivityIds.has(id));
  const moneyActivityPrompts = moneyActivities.reduce<Record<string, string>>((acc, activity) => {
    const fragment = ACTIVITY_PROMPT_FRAGMENTS[activity.id];
    if (fragment) acc[activity.id] = fragment;
    return acc;
  }, {});

  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
    setTimeout(() => setIsLoaded(true), 100);
    const interval = setInterval(() => setTimeOfDay(getTimeOfDay()), 60000);
    return () => clearInterval(interval);
  }, []);

  const normalizeCategoryFromView = (view?: string): { category: string; actionId?: string; languageTab?: 'learn' | 'translate' } | null => {
    const v = (view || '').toLowerCase().trim();
    if (!v) return null;

    // Direct category IDs from new structure
    if (opsRoom.categories.some((c) => c.id === v)) return { category: v };

    // Map old category names to new ones
    if (v === 'communication') return { category: 'communication' };
    if (v === 'work-career' || v === 'work' || v === 'get-unstuck') return { category: 'work-life' };
    if (v === 'money-finance' || v === 'money') return { category: 'money' };
    if (v === 'planning-goals' || v === 'planning') return { category: 'work-life' };
    if (v === 'learning-growth' || v === 'learning') return { category: 'thinking-learning' };
    if (v === 'reflect-connect' || v === 'relationships') return { category: 'relationships-wellness' };
    if (v === 'creativity' || v === 'content') return { category: 'create' };

    return null;
  };

  useEffect(() => {
    const mapped = normalizeCategoryFromView(initialView);
    if (!mapped) return;
    setActiveCategory(mapped.category);
    if (mapped.actionId) {
      const category = opsRoom.categories.find((c) => c.id === mapped.category);
      const action = category?.activities.find((a) => a.id === mapped.actionId) ?? null;
      setSelectedAction(action);

      if (mapped.actionId === 'language-learning' && mapped.languageTab) {
        try {
          window.localStorage.setItem('vera.ops.language.lastTab.v1', mapped.languageTab);
        } catch {
          // ignore
        }
      }
    } else {
      setSelectedAction(null);
    }
  }, [initialView]);

  // Handle direct navigation from sidebar (category + activity + option)
  useEffect(() => {
    if (!initialCategory) return;
    
    const category = opsRoom.categories.find(c => c.id === initialCategory);
    if (!category) return;

    if (initialCategory === 'communication') {
      setActiveCategory(initialCategory);
      setSelectedAction(communicationAction);
      setSelectedDropdownOption(null);
      setFormFields({});
      setSimpleInput('');
      return;
    }
    
    if (!initialActivity) {
      setActiveCategory(initialCategory);
      return;
    }

    const activity = category.activities.find(a => a.id === initialActivity);
    if (!activity) return;
    
    setActiveCategory(initialCategory);
    if (initialCategory === 'create') {
      if (activity.id === 'write-email' || activity.id === 'social-post') {
        setSelectedAction(activity);
        setCreateActivityId(activity.id);
        setCreateOptionId(initialOption || '');
        setSelectedDropdownOption(null);
        return;
      }
      if (activity.id === 'bio-about' || activity.id === 'creative-writing') {
        setSelectedAction(createSharedAction);
        setCreateActivityId(activity.id);
        setCreateOptionId('');
        setSelectedDropdownOption(null);
        return;
      }
    }
    if (initialCategory === 'work-life' && activity.id !== 'career') {
      const nextId = isWorkLifeGroupedActivity(activity.id) ? activity.id : defaultWorkLifeId;
      setWorkLifeMode(nextId);
    }

    if (initialCategory === 'money' && isMoneyActivity(activity.id)) {
      setMoneyMode(activity.id);
    }

    setSelectedAction(activity);
    
    // Standalone or custom-component → form shows directly (selectedDropdownOption stays null)
    // Dropdown without option param → shows option cards (selectedDropdownOption stays null)
    // Dropdown with option param → go to specific option form
    
    if (activity.id === 'boundaries') {
      setSelectedDropdownOption(null);
      return;
    }

    if (activity.type === 'dropdown' && initialOption && activity.dropdownOptions) {
      const option = activity.dropdownOptions.find(o => o.id === initialOption);
      if (option) {
        setSelectedDropdownOption(option);
      }
    }
  }, [initialCategory, initialActivity, initialOption]);

  useEffect(() => {
    if (activeCategory !== 'thinking-learning') return;
    if (selectedAction?.id === 'thinking-orchestrator') return;
    if (selectedAction?.id === 'language-learning') return;
    setSelectedAction(thinkingAction);
    setSelectedDropdownOption(null);
    setFormFields({});
    setSimpleInput('');
  }, [activeCategory, selectedAction]);

  useEffect(() => {
    if (activeCategory !== 'work-life') return;
    if (selectedAction?.id === 'worklife-orchestrator') return;
    setSelectedAction(workLifeAction);
    setSelectedDropdownOption(null);
    setFormFields({});
    setSimpleInput('');
  }, [activeCategory, selectedAction?.id]);

  useEffect(() => {
    if (activeCategory !== 'money') return;
    if (selectedAction?.id === 'money-orchestrator') return;
    setSelectedAction(moneyAction);
    setSelectedDropdownOption(null);
    setFormFields({});
    setSimpleInput('');
  }, [activeCategory, selectedAction?.id]);

  useEffect(() => {
    if (activeCategory !== 'relationships-wellness') return;
    if (selectedAction?.id === 'wellness-orchestrator') return;
    setSelectedAction(wellnessAction);
    setSelectedDropdownOption(null);
    setFormFields({});
    setSimpleInput('');
  }, [activeCategory]);

  useEffect(() => {
    if (activeCategory !== 'communication') return;
    if (selectedAction?.id === 'communication-orchestrator') return;
    setSelectedAction(communicationAction);
    setSelectedDropdownOption(null);
    setFormFields({});
    setSimpleInput('');
  }, [activeCategory, selectedAction?.id]);

  useEffect(() => {
    if (activeCategory !== 'create') return;
    if (selectedAction?.id === 'create') return;
    if (selectedAction?.id === 'write-email') return;
    if (selectedAction?.id === 'social-post') return;
    if (selectedAction?.id === 'bio-about') return;
    if (selectedAction?.id === 'creative-writing') return;
    const sharedCreateIds = new Set(['bio-about', 'creative-writing']);
    if (!sharedCreateIds.has(createActivityId)) {
      setCreateActivityId('bio-about');
      setCreateOptionId('');
    }
    setSelectedAction(createAction);
    setSelectedDropdownOption(null);
    setFormFields({});
    setSimpleInput('');
  }, [activeCategory, createActivityId]);

  const isDark = manualTheme === 'dark' ? true : manualTheme === 'light' ? false : (timeOfDay === 'evening' || timeOfDay === 'night');
  const colors = isDark ? TIME_COLORS.evening : TIME_COLORS[timeOfDay];
  const separatorColor = isDark ? 'rgba(235, 210, 180, 0.12)' : 'rgba(140, 110, 80, 0.12)';
  const inputBg = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.96)';
  const inputBorder = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(160, 130, 90, 0.12)';
  const layerCardStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px',
    borderRadius: 16,
    background: colors.cardBg,
    border: `1px solid ${colors.cardBorder}`,
    marginBottom: 16,
  };
  const sectionLabelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.06em',
    color: colors.textMuted,
    margin: '0 0 8px 4px',
  };

  const buildSignalLayer = (inputText: string): string => {
    const lower = inputText.toLowerCase();
    const notes: string[] = [];

    if (/\bdeadline\b|\bby end of day\b|\basap\b|\bimmediately\b|\bby tonight\b/.test(lower)) {
      notes.push('The timing compresses the window and pulls the reader toward a fast response.');
    }
    if (/\bjust\b|\bonly\b|\bquick\b|\bsimple\b|\bfast\b/.test(lower)) {
      notes.push('The framing minimizes perceived effort and nudges the reader toward agreement.');
    }
    if (/\bas discussed\b|\bper our\b|\bfollowing up\b|\bper earlier\b/.test(lower)) {
      notes.push('The sequencing leans on prior context to create forward motion without re-arguing the case.');
    }
    if (/\bif you\b|\bonce you\b|\bafter you\b|\bwhen you\b/.test(lower)) {
      notes.push('The structure uses conditional advancement to steer the exchange toward a next step.');
    }
    if (/\bapproval\b|\boffer\b|\bcontract\b|\bfinalize\b|\bsign\b/.test(lower)) {
      notes.push('The wording signals formality and pulls the reader toward completion.');
    }
    if (/\bbonus\b|\bdiscount\b|\bavailability\b|\blimited\b|\bslot\b/.test(lower)) {
      notes.push('The sequencing narrows availability and pulls the reader toward earlier action.');
    }

    if (notes.length === 0) {
      notes.push('The message uses pacing and framing to pull the reader toward a particular timing and response posture.');
    }
    return notes.join(' ');
  };

  const buildCoreMove = (inputText: string): string => {
    const lower = inputText.toLowerCase();
    if (/\basap\b|\bimmediately\b|\bby end of day\b|\bby tonight\b/.test(lower)) {
      return 'This message trades flexibility for speed.';
    }
    if (/\bdiscount\b|\bbonus\b|\blimited\b|\bslot\b/.test(lower)) {
      return 'This message frames urgency as opportunity.';
    }
    if (/\bfollowing up\b|\bper our\b|\bas discussed\b/.test(lower)) {
      return 'This message turns prior context into forward motion.';
    }
    if (/\bif you\b|\bonce you\b|\bafter you\b/.test(lower)) {
      return 'This message sets a step that implies the next step.';
    }
    return 'This message frames the request as the natural next move.';
  };

  const buildTimeOrientation = (inputText: string): string => {
    const lower = inputText.toLowerCase();
    if (/\bby end of day\b|\bby eod\b|\bby tonight\b/.test(lower)) {
      return 'This message pushes for same-day action without stating a deadline.';
    }
    if (/\basap\b|\bimmediately\b|\bsoon\b/.test(lower)) {
      return 'This message compresses timing without anchoring it to a specific date.';
    }
    if (/\bwhen you\b|\bonce you\b|\bafter you\b/.test(lower)) {
      return 'This message sequences the response after a condition rather than a time.';
    }
    return 'This message implies timing through sequence rather than explicit dates.';
  };

  const buildWhatsMissing = (inputText: string): string[] => {
    const lower = inputText.toLowerCase();
    const missing: string[] = [];
    if (!/\bfrom\b|\bsincerely\b|\bregards\b|\bthanks,\b|\b-\b/.test(lower)) {
      missing.push('There is no clear sender identity.');
    }
    if (!/\bterms\b|\bdetails\b|\bconditions\b|\bexpectations\b|\bagreement\b/.test(lower)) {
      missing.push('There are no stated terms.');
    }
    if (!/\bdate\b|\bday\b|\bweek\b|\bmonth\b|\bdeadline\b|\bby\b \d{1,2}\b/.test(lower)) {
      missing.push('There is no stated timeframe.');
    }
    if (missing.length === 0) {
      missing.push('There is no explicit context for why this is being asked now.');
    }
    return missing;
  };

  const buildCleanContrast = (inputText: string): string => {
    const lower = inputText.toLowerCase();
    if (/\bprice\b|\bquote\b|\bcontract\b|\bterms\b/.test(lower)) {
      return 'The message would state the request and the terms without timing pressure.';
    }
    if (/\bmeeting\b|\bcall\b|\bschedule\b/.test(lower)) {
      return 'The message would state the request and the time window without urgency cues.';
    }
    return 'The message would state the request plainly without pressure cues.';
  };

  const buildHandoffFlags = (inputText: string): string[] => {
    const lower = inputText.toLowerCase();
    const flags: string[] = [];
    if (/[?]|\bcan you\b|\bcould you\b|\bplease\b|\breply\b|\brespond\b/.test(lower)) {
      flags.push('supports_quick_reply');
    }
    if (/\bdecide\b|\bchoice\b|\boption\b|\bshould i\b|\bwhat do i do\b/.test(lower)) {
      flags.push('supports_devil_advocate');
    }
    if (/\brewrite\b|\brefine\b|\bedit\b|\brephrase\b/.test(lower)) {
      flags.push('supports_rewrite');
    }
    if (/\bboundary\b|\bboundaries\b|\bsay no\b|\bpush back\b/.test(lower)) {
      flags.push('supports_boundary_response');
    }
    return flags;
  };

  const buildHandoffContext = () => {
    const missing = whatsMissing.length ? `What's missing: ${whatsMissing.join(' ')}` : '';
    const parts = [coreMove, timeOrientation, missing].filter(Boolean);
    return parts.join(' ');
  };

  const resetCommunicationFlow = () => {
    setCommunicationInput('');
    setCommunicationBoundaryInput('');
    setCommunicationRespondIntent('');
    setCommunicationIncludeBoundary(false);
    setCommunicationDecodeOutput(null);
    setCommunicationBoundaryOutput(null);
    setCommunicationRespondOutput(null);
    setCommunicationDecodeGenerating(false);
    setCommunicationBoundaryGenerating(false);
    setCommunicationRespondGenerating(false);
    setCommunicationBoundaryNeeded(false);
    setCommunicationBoundaryMode(false);
    setCommunicationBoundaryType('boundary-script');
    setCommunicationBoundaryTone('gentle');
    setShowCommunicationAnalysis(false);
    setCommunicationSignalLayer('');
    setCommunicationCoreMove('');
    setCommunicationTimeOrientation('');
    setCommunicationWhatsMissing([]);
    setCommunicationCleanContrast('');
    setShowCommunicationWhatsMissing(false);
    setShowCommunicationCleanContrast(false);
    setDecodeEntryType('text');
    setRespondMode('quick');
    setRespondTone('neutral');
    setBoundaryMode('boundary-script');
    setBoundaryTone('gentle');
    setBoundaryDelivery('');
  };

  const buildCommunicationLayerContext = (activityLabel: string, modifiers: string[], tone?: string, includeFocus?: boolean) => {
    const contextTone = tone || 'default';
    const focusContext = includeFocus ? focusPrompts[focusMode] : '';
    return [
      'Domain: Communication',
      `Activity: ${activityLabel}`,
      modifiers.length ? `Modifiers: ${modifiers.join('; ')}` : 'Modifiers: none',
      `Tone: ${contextTone}`,
      focusContext,
    ].filter(Boolean).join(' | ');
  };

  const getCommunicationDecodePlaceholder = () => {
    const allOptions = [...decodeEntryOptions.primary, ...decodeEntryOptions.secondary];
    const match = allOptions.find((opt) => opt.id === decodeEntryType);
    return match?.placeholder || 'Paste the message you want to decode...';
  };

  const handleCommunicationGenerate = async () => {
    const input = communicationInput.trim();
    if (!input) return;

    setCommunicationDecodeGenerating(true);
    setCommunicationRespondGenerating(true);
    setCommunicationDecodeOutput(null);
    setCommunicationRespondOutput(null);
    setCommunicationBoundaryNeeded(false);
    setCommunicationSignalLayer('');
    setCommunicationCoreMove('');
    setCommunicationTimeOrientation('');
    setCommunicationWhatsMissing([]);
    setCommunicationCleanContrast('');
    setShowCommunicationWhatsMissing(false);
    setShowCommunicationCleanContrast(false);

    const decodeContext = buildCommunicationLayerContext(
      'Decode',
      [],
      undefined,
      false
    );
    const decodePrompt = [
      decodeContext,
      'Provide at most 3 short bullet insights. Each bullet max 12 words. No extra text.',
    ].filter(Boolean).join(' | ');

    try {
      const decodeResponse = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: decodePrompt,
          userInput: input,
          mode: generationMode,
          provider: selectedProvider,
          taskType: 'decode-message',
          activityId: 'decode-message',
        }),
      });

      const decodeData = await decodeResponse.json();
      if (!decodeResponse.ok) throw new Error(decodeData.error || 'Generation failed');

      const decodeText = decodeData.content || '';
      setCommunicationDecodeOutput(decodeText);
      setCommunicationSignalLayer(buildSignalLayer(input));
      setCommunicationCoreMove(buildCoreMove(input));
      setCommunicationTimeOrientation(buildTimeOrientation(input));
      setCommunicationWhatsMissing(buildWhatsMissing(input));
      setCommunicationCleanContrast(buildCleanContrast(input));

      const boundaryFlag = buildHandoffFlags(input).includes('supports_boundary_response');
      setCommunicationBoundaryNeeded(boundaryFlag);

      const respondContext = buildCommunicationLayerContext(
        'Respond',
        [],
        undefined,
        false
      );
      const respondPrompt = [
        respondContext,
        'Write a single, send-ready response. No analysis, no alternatives, no formatting.',
      ].filter(Boolean).join(' | ');

      const respondInput = `Original message:\n${input}\n\nDecode insights:\n${decodeText}`;

      const respondResponse = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: respondPrompt,
          userInput: respondInput,
          mode: generationMode,
          provider: selectedProvider,
          taskType: 'respond',
          activityId: 'respond',
        }),
      });

      const respondData = await respondResponse.json();
      if (!respondResponse.ok) throw new Error(respondData.error || 'Generation failed');
      setCommunicationRespondOutput(respondData.content);
    } catch {
      setCommunicationDecodeOutput('Something went wrong. Please try again.');
      setCommunicationRespondOutput('Something went wrong. Please try again.');
    } finally {
      setCommunicationDecodeGenerating(false);
      setCommunicationRespondGenerating(false);
    }
  };

  const isDirectedDecode = (entryType: string) => {
    const disallowed = ['summary', 'document', 'legal'];
    return !disallowed.includes(entryType);
  };

  const hasResponsePressure = () => {
    return handoffFlags.includes('supports_quick_reply') || handoffFlags.includes('supports_devil_advocate');
  };

  const handleHandoff = (action: 'quick-reply' | 'devil-advocate') => {
    if (!lastDecodeInput) return;

    const findCategoryForActivity = (activityId: string) =>
      opsRoom.categories.find((c) => c.activities.some((a) => a.id === activityId)) || null;

    const respondCategory = findCategoryForActivity('respond');
    const respond = respondCategory?.activities.find((a) => a.id === 'respond') ?? null;
    const devilCategory = findCategoryForActivity('devil-advocate');
    const devil = devilCategory?.activities.find((a) => a.id === 'devil-advocate') ?? null;

    if (action === 'quick-reply' && respond) {
      if (respondCategory) setActiveCategory(respondCategory.id);
      setSelectedAction(respond as Activity);
      setSelectedDropdownOption(null);
      setRespondMode('quick');
      setSimpleInput(lastDecodeInput);
      setFormFields({});
      setOutput(null);
      setCompareOutputs(null);
      setSignalLayer('');
      setHandoffContext(buildHandoffContext());
      return;
    }

    if (action === 'devil-advocate' && devil) {
      if (devilCategory) setActiveCategory(devilCategory.id);
      setSelectedAction(devil as Activity);
      setSelectedDropdownOption(null);
      setSimpleInput(lastDecodeInput);
      setFormFields({});
      setOutput(null);
      setCompareOutputs(null);
      setSignalLayer('');
      setHandoffContext(buildHandoffContext());
    }
  };

  const respondPrompts: Record<string, string> = {
    quick: 'Write a concise, ready-to-send reply. No explanations, analysis, intent interpretation, emotional labels, or advice framing. No bullets, headings, emojis, or formatting. Provide a single response only.',
    'follow-up': 'Write a follow-up reply that is direct and professional. No explanations, analysis, intent interpretation, emotional labels, or advice framing. No bullets, headings, emojis, or formatting. Provide a single response only.',
    acknowledge: 'Acknowledge receipt without committing. No explanations, analysis, intent interpretation, emotional labels, or advice framing. No bullets, headings, emojis, or formatting. Provide a single response only.',
    'buy-time': 'Buy time without avoidance. No explanations, analysis, intent interpretation, emotional labels, or advice framing. No bullets, headings, emojis, or formatting. Provide a single response only.',
    apology: 'Apologize without over-explaining. No explanations, analysis, intent interpretation, emotional labels, or advice framing. No bullets, headings, emojis, or formatting. Provide a single response only.',
    decline: 'Decline clearly without justification. No explanations, analysis, intent interpretation, emotional labels, or advice framing. No bullets, headings, emojis, or formatting. Provide a single response only.',
    'set-boundary': 'Set a boundary with clear limits and neutral tone. No explanations, analysis, intent interpretation, emotional labels, or advice framing. No bullets, headings, emojis, or formatting. Provide a single response only.',
    clarify: 'Ask for clarification neutrally and specifically. No explanations, analysis, intent interpretation, emotional labels, or advice framing. No bullets, headings, emojis, or formatting. Provide a single response only.',
    reframe: 'Reframe the exchange calmly and professionally. No explanations, analysis, intent interpretation, emotional labels, or advice framing. No bullets, headings, emojis, or formatting. Provide a single response only.',
    'confirm-understanding': 'Confirm understanding by reflecting the content neutrally. No explanations, analysis, intent interpretation, emotional labels, or advice framing. No bullets, headings, emojis, or formatting. Provide a single response only.',
  };

  const respondTonePrompts: Record<string, string> = {
    neutral: 'Tone: neutral and clear.',
    warm: 'Tone: warm and human without being overly friendly.',
    firm: 'Tone: firm and steady without escalation.',
    professional: 'Tone: professional and precise.',
  };

  const respondModeOptions = [
    { id: 'quick', label: 'Quick Reply' },
    { id: 'follow-up', label: 'Follow Up' },
    { id: 'acknowledge', label: 'Acknowledge' },
    { id: 'buy-time', label: 'Buy Time' },
    { id: 'apology', label: 'Apology' },
    { id: 'decline', label: 'Decline' },
    { id: 'set-boundary', label: 'Set Boundary' },
    { id: 'clarify', label: 'Clarify' },
    { id: 'reframe', label: 'Reframe' },
    { id: 'confirm-understanding', label: 'Confirm' },
  ];

  const respondToneOptions = [
    { id: 'neutral', label: 'Neutral' },
    { id: 'warm', label: 'Warm' },
    { id: 'firm', label: 'Firm' },
    { id: 'professional', label: 'Professional' },
  ];

  const boundaryModeOptions = [
    { id: 'boundary-script', label: 'Boundary Script' },
    { id: 'tough-conversation', label: 'Tough Conversation' },
    { id: 'say-no-clearly', label: 'Say No Clearly' },
  ];

  const boundaryToneOptions = [
    { id: 'gentle', label: 'Gentle' },
    { id: 'firm', label: 'Firm' },
    { id: 'professional', label: 'Professional' },
    { id: 'personal', label: 'Personal' },
  ];

  const boundaryDeliveryOptions = [
    { id: 'short-direct', label: 'Short & Direct' },
    { id: 'long-thoughtful', label: 'Long & Thoughtful' },
    { id: 'written-message', label: 'Written Message' },
    { id: 'spoken-conversation', label: 'Spoken Line' },
  ];

  const decodeEntryOptions = {
    primary: [
      { id: 'email', label: 'Email', placeholder: 'Paste the email you want to decode...' },
      { id: 'text', label: 'Text', placeholder: 'Paste the text you want to decode...' },
      { id: 'summary', label: 'Summary', placeholder: 'Paste the content you want summarized...' },
    ],
    secondary: [
      { id: 'promise', label: 'Promise', placeholder: 'Paste the promise you want to decode...' },
      { id: 'request', label: 'Request', placeholder: 'Paste the request you want to decode...' },
      { id: 'sales', label: 'Sales', placeholder: 'Paste the sales message you want to decode...' },
      { id: 'boundary', label: 'Boundary', placeholder: 'Paste the boundary message you want to decode...' },
      { id: 'legal', label: 'Legal', placeholder: 'Paste the legal notice you want to decode...' },
      { id: 'work', label: 'Work', placeholder: 'Paste the work message you want to decode...' },
      { id: 'personal', label: 'Personal', placeholder: 'Paste the personal message you want to decode...' },
      { id: 'power', label: 'Power', placeholder: 'Paste the message you want to decode...' },
    ],
  };

  const boundaryModePrompts: Record<string, string> = {
    'boundary-script': 'Write a short boundary statement. No explanations, analysis, intent interpretation, emotional labels, or advice framing. No apologies unless explicitly requested by the user. No bullets, headings, emojis, or formatting. Provide a single response only.',
    'tough-conversation': 'Write two short lines of ready-to-send language. The first line is a grounding response. The second line is an optional follow-up if pressure continues. No explanations, analysis, intent interpretation, emotional labels, or advice framing. No bullets, headings, emojis, or formatting.',
    'say-no-clearly': 'Write a short, clear decline that holds the boundary. No explanations, analysis, intent interpretation, emotional labels, or advice framing. No apologies unless explicitly requested by the user. No bullets, headings, emojis, or formatting. Provide a single response only.',
  };

  const boundaryTonePrompts: Record<string, string> = {
    gentle: 'Tone: gentle and calm.',
    firm: 'Tone: firm and steady.',
    professional: 'Tone: professional and neutral.',
    personal: 'Tone: personal and grounded.',
  };

  const boundaryDeliveryPrompts: Record<string, string> = {
    'short-direct': 'Keep it short and direct.',
    'long-thoughtful': 'Make it longer and more thoughtful while staying concise and clear.',
    'written-message': 'Format as a written message suitable for text or email.',
    'spoken-conversation': 'Format as a spoken line suitable to say aloud.',
  };

  const workLifeModePrompts: Record<string, string> = {
    task: 'Output a step-by-step actionable list with a clear goal, ordered steps, dependencies, effort level per step, and a first executable next action. Respect time scope when provided (today/short/long-term).',
    decision: 'Use this structure in order: Clarify the decision. Options table with pros / cons / risks. Constraints & tradeoffs. Recommendation with rationale. No advice language or judgment.',
    planning: 'Produce a timeline or phased plan with sequencing, dependencies, and bottlenecks. Include priorities and what can be deferred. Avoid advice or motivation.',
    career: 'Frame the response professionally with clarity and options, grounded in skills, experience, and directional choices. No coaching language or hype.',
  };

  const workLifeTonePrompts: Record<string, string> = {
    clear: 'Tone only: clear and direct with shorter sentences. Do not change structure.',
    strategic: 'Tone only: strategic and focused. Do not change structure.',
    practical: 'Tone only: practical and grounded. Do not change structure.',
    calm: 'Tone only: calm and steady. Do not change structure.',
  };

  const workLifeContextPrompts: Record<string, string> = {
    'short-actionable': 'Scope: short and actionable; keep depth minimal.',
    'detailed-thoughtful': 'Scope: detailed and thoughtful; expand depth and sequencing.',
    'today-week': 'Scope: today or this week; prioritize near-term sequencing.',
    'long-term': 'Scope: long-term horizon; emphasize extended sequencing.',
  };

  const workLifeSecondaryPrompts: Record<string, string> = {
    prioritization: 'Secondary mode: reorder by impact vs effort.',
    time: 'Secondary mode: convert output into time blocks.',
    overwhelm: 'Secondary mode: simplify to 3 stabilizing steps.',
    project: 'Secondary mode: emphasize dependencies and milestones.',
  };

  const thinkingGlobalPrompt = 'Global rules: Support cognition and understanding. No emotional processing or therapy language. No advice about life decisions. Prioritize clarity over completeness. No emotional language.';

  const thinkingModePrompts: Record<string, string> = {
    brainstorm: 'Purpose: generate possibilities without judgment. Output structure: bullet list of ideas. Group ideas into themes if more than 6. No evaluation unless explicitly requested.',
    summarize: 'Purpose: compress information. Output structure: Core idea (1–2 sentences). Key points (bullets). Optional takeaway line.',
    'explain-like': 'Purpose: match explanation depth to selected level. Output structure: one clear explanation at the selected depth. Rules: Simple = no jargon; Medium = light structure with examples; Deep = technical, precise, dense. No metaphors unless Simple or Creative is selected.',
    'perspective-shift': 'Purpose: reframe ideas, not emotions. Output structure: identify current framing; offer 2–3 alternative conceptual lenses; explain how each lens changes understanding. Do not validate feelings or reference personal experience.',
  };

  const thinkingSecondaryPrompts: Record<string, string> = {
    'compare-ideas': 'Modifier: compare ideas directly and contrast differences. Do not replace the primary mode output structure.',
    'clarify-thinking': 'Modifier: clarify assumptions and tighten reasoning. Do not replace the primary mode output structure.',
    'reduce-complexity': 'Modifier: reduce complexity into fewer, clearer parts. Do not replace the primary mode output structure.',
    'expand-options': 'Modifier: expand options beyond obvious choices. Do not replace the primary mode output structure.',
    'mental-model': 'Modifier: use a mental model to structure the thinking. Do not replace the primary mode output structure.',
  };

  const thinkingStylePrompts: Record<string, string> = {
    simple: 'Style: simple and plain language. No jargon. Metaphors allowed sparingly if helpful.',
    structured: 'Style: structured and organized. Headings or numbered sections if needed. Avoid metaphors.',
    creative: 'Style: creative and exploratory. Metaphors allowed sparingly. Stay clear and non-emotional.',
    analytical: 'Style: analytical and precise. Use formal terms. Avoid metaphors.',
  };

  const thinkingDepthPrompts: Record<string, string> = {
    short: 'Depth: short and concise. Focus on essentials only.',
    medium: 'Depth: medium. Add light structure and 1–2 examples if appropriate.',
    deep: 'Depth: deep. Technical, precise, and dense while staying clear.',
  };

  const moneyModePrompts: Record<string, string> = {
    'budget-check': 'Identify leaks and flag unsustainable ratios. No shaming language.',
    'savings-goal': 'Translate the goal into a monthly requirement, adjust for time horizon, and name tradeoffs clearly.',
    'decision-helper': 'Use this exact structure: 1) Situation Snapshot — restate the decision in one sentence and explicitly name the constraint (cash flow, risk, timing). 2) Key Numbers — monthly impact, short-term cost, long-term cost, opportunity cost. If numbers are missing, ask for them before proceeding. 3) Option Comparison Table (text) — Option A vs Option B (or more if provided), pros/cons, financial pressure level (Low/Medium/High). 4) Risk & Stability Check — how fragile this is if income changes; what breaks first if assumptions fail. 5) Recommendation — one clear recommendation plus one alternative if priorities change, explicitly tied to the numbers. 6) Next Action — one concrete next step for today. Keep it analytical and grounding. No formulas shown; results in plain language.',
    'money-conversations': 'Generate scripts only. No calculations unless explicitly requested.',
  };

  const moneySecondaryPrompts: Record<string, string> = {
    'cash-flow': 'Secondary mode: focus on cash flow structure and impacts.',
    'tradeoff-analysis': 'Secondary mode: emphasize tradeoffs explicitly.',
    'scenario-comparison': 'Secondary mode: compare scenarios side-by-side.',
    'risk-scan': 'Secondary mode: surface risk exposure clearly.',
    'cost-breakdown': 'Secondary mode: break costs into components and derived totals.',
  };

  const moneyToolPrompt = 'If the input includes numbers, costs, income, or timelines, you may internally compute monthly surplus/deficit, break-even timeline, runway (months covered), cost per month, and percent of income committed. Do not show formulas; state results in plain language.';

  const relationshipGlobalPrompt = 'Global rules: Support emotional clarity and regulation with a calm, grounded, non-escalating tone. Never validate harmful behavior. Never push action before clarity. No therapy language, no diagnosis, no trauma processing, no advice unless explicitly requested. This is not a replacement for professional support.';

  const relationshipModePrompts: Record<string, string> = {
    'perspective-shift': 'Output structure: Name the emotional lens currently active. Offer 2–3 alternative interpretations. Highlight what is controllable vs not. End with a stabilizing reframe (not advice). Do not give solutions, tell the user what to do, or over-empathize.',
    'vent-session': 'Output structure: Reflect emotions neutrally (no validation of harm). Name the underlying need or boundary. Normalize emotion without endorsing reaction. Close with grounding language (not action). Do not agree with accusations, escalate anger, or encourage confrontation.',
    'self-check-in': 'Output structure: Identify emotional state(s). Identify body signal if present. Identify dominant need (rest, clarity, reassurance, space). End with one grounding question to ask oneself. Do not give advice, analyze other people, or problem-solve.',
    'relationship-help': 'Output structure: Clarify the relational dynamic. Separate facts from interpretations. Identify boundary or need. Offer ONE neutral communication option (optional, not directive). Do not take sides, diagnose the other person, or use therapy language.',
  };

  const relationshipTonePrompts: Record<string, string> = {
    gentle: 'Tone modifier: gentle and non-escalating. Do not change structure.',
    honest: 'Tone modifier: honest and direct without harshness. Do not change structure.',
    grounded: 'Tone modifier: grounded and steady. Do not change structure.',
    supportive: 'Tone modifier: supportive and calm without over-empathizing. Do not change structure.',
  };

  const relationshipDepthPrompts: Record<string, string> = {
    short: 'Depth: short and concise. Prioritize clarity over completeness.',
    medium: 'Depth: medium. Add modest detail while staying clear and bounded.',
    deep: 'Depth: deep. Expand structure while remaining grounded and concise.',
  };

  const moneyPerspectivePrompts: Record<string, string> = {
    conservative: 'Perspective: conservative and cautious.',
    balanced: 'Perspective: balanced and even-handed.',
    aggressive: 'Perspective: aggressive and growth-oriented.',
    'risk-aware': 'Perspective: risk-aware and protective.',
  };

  const moneyScopePrompts: Record<string, string> = {
    monthly: 'Scope: monthly view.',
    'short-term': 'Scope: short-term (3–6 months).',
    'long-term': 'Scope: long-term horizon.',
    'one-time': 'Scope: one-time decision.',
  };

  const moneyContextPrompts: Record<string, string> = {
    personal: 'Context: personal finances.',
    household: 'Context: household finances.',
    'business-freelance': 'Context: business or freelance finances.',
    'shared-finances': 'Context: shared finances.',
  };

  // FOCUS is a global reasoning mode only. It never changes routes, navigation, or available activities.
  const focusModes: Array<{ id: FocusMode; label: string }> = [
    { id: 'think', label: 'THINK' },
    { id: 'decide', label: 'DECIDE' },
    { id: 'do', label: 'DO' },
    { id: 'create', label: 'CREATE' },
    { id: 'reflect', label: 'REFLECT' },
  ];

  const focusPrompts: Record<FocusMode, string> = {
    think: 'FOCUS: THINK — exploratory reasoning, multiple perspectives, open-ended framing. No final recommendation unless explicitly asked. Override default reasoning style while keeping activity content and modifiers.',
    decide: 'FOCUS: DECIDE — clear options with tradeoffs explicitly listed. A recommended choice is required with confidence-oriented language. Override default reasoning style while keeping activity content and modifiers.',
    do: 'FOCUS: DO — actionable steps, sequential instructions, minimal explanation, execution-first tone. Override default reasoning style while keeping activity content and modifiers.',
    create: 'FOCUS: CREATE — generative output (drafts, scripts, messages), polished language, ready-to-use result, minimal meta-commentary. Override default reasoning style while keeping activity content and modifiers.',
    reflect: 'FOCUS: REFLECT — insight-oriented framing, pattern recognition, gentle observational tone, no pressure toward action. Override default reasoning style while keeping activity content and modifiers.',
  };

  const buildLayerContext = (actionId: string) => {
    const category = selectedAction ? opsRoom.categories.find((c) => c.activities.some((a) => a.id === selectedAction.id)) : null;
    const domain = category?.name || activeCategory || 'General';
    const activityLabel = selectedDropdownOption?.label || selectedAction?.title || actionId;
    const modifiers: string[] = [];

    if (isWorkLifeGroupedActivity(actionId)) {
      modifiers.push(`Mode: ${workLifeMode}`);
      if (workLifeTone) modifiers.push(`Modifier: ${workLifeTone}`);
      if (workLifeContext) modifiers.push(`Modifier: ${workLifeContext}`);
      if (workLifeSecondaryMode) modifiers.push(`Modifier: ${workLifeSecondaryMode}`);
    }
    if (actionId === 'thinking-learning') {
      modifiers.push(`Mode: ${thinkingMode}`);
      if (thinkingStyle) modifiers.push(`Modifier: ${thinkingStyle}`);
      if (thinkingDepth) modifiers.push(`Modifier: ${thinkingDepth}`);
      if (thinkingSecondaryMode) modifiers.push(`Modifier: ${thinkingSecondaryMode}`);
    }
    if (isMoneyActivity(actionId)) {
      modifiers.push(`Modifier: ${moneyPerspective}`);
      if (moneyScope) modifiers.push(`Modifier: ${moneyScope}`);
      if (moneyContext) modifiers.push(`Modifier: ${moneyContext}`);
      if (moneySecondaryMode) modifiers.push(`Modifier: ${moneySecondaryMode}`);
    }
    if (actionId === 'relationships-wellness') {
      modifiers.push(`Mode: ${relationshipMode}`);
      if (relationshipTone) modifiers.push(`Modifier: ${relationshipTone}`);
      if (relationshipDepth) modifiers.push(`Modifier: ${relationshipDepth}`);
    }
    if (actionId === 'boundaries') {
      modifiers.push(`Mode: ${boundaryMode}`);
      if (boundaryTone) modifiers.push(`Modifier: ${boundaryTone}`);
      if (boundaryDelivery) modifiers.push(`Modifier: ${boundaryDelivery}`);
    }
    if (actionId === 'respond') {
      modifiers.push(`Mode: ${respondMode}`);
    }

    const toneValue = relationshipTone || workLifeTone || boundaryTone;
    const tone = toneValue || 'default';

    const focusContract = focusMode
      ? `\n\n[FOCUS_MODE]\nmode: ${focusMode}\nscope: reasoning_only\nconstraints:\n- do not add content\n- do not change tone\n- do not change structure\n- do not override activity intent\n[/FOCUS_MODE]\n\nActivity intent always has priority over Focus\nFocus modifies reasoning emphasis only\nFocus must never introduce new instructions or content`
      : '';

    const toneContract = toneValue
      ? `\n\n[TONE_PROFILE]\ntone: ${toneValue}\nscope: language_only\nconstraints:\n- do not alter intent\n- do not add or remove content\n- do not change structure\n- do not override activity contract\n[/TONE_PROFILE]\n\nTone modifies wording and phrasing only\nActivity contract always has priority over Tone\nIf Tone conflicts with Activity intent, ignore Tone`
      : '';

    return [
      `Domain: ${domain}`,
      `Activity: ${activityLabel}`,
      modifiers.length ? `Modifiers: ${modifiers.join('; ')}` : 'Modifiers: none',
      `Tone: ${tone}`,
      focusPrompts[focusMode],
    ].join(' | ') + focusContract + toneContract;
  };

  const thinkingAction: Activity = {
    id: 'thinking-orchestrator',
    title: 'Clear My Head',
    description: 'Clear thinking. Deep learning. No fluff.',
    icon: 'brain',
    type: 'standalone',
    placeholder: 'What are you trying to think through or understand?',
    systemPrompt: '',
    disclaimer: '',
    allowSave: true,
  };

  const wellnessAction: Activity = {
    id: 'wellness-orchestrator',
    title: 'Check In',
    description: 'For your heart, your head, and your habits.',
    icon: 'heart',
    type: 'standalone',
    placeholder: "What's on your mind?",
    systemPrompt: '',
    disclaimer: '',
    allowSave: true,
  };

  const appKitAction = {
    id: 'appkit-orchestrator',
    title: 'Application Kit',
    description: 'Everything you need to land the job',
    icon: 'briefcase',
    type: 'standalone',
    placeholder: 'Build your complete application kit',
    systemPrompt: '',
    disclaimer: 'VERA helps you present your best self. Always review and personalize before sending.',
    allowSave: true
  };

  const createSharedAction: Activity = {
    id: 'create',
    title: 'Creative Writing',
    description: 'Stories, poems, and creative expression',
    icon: 'pen-tool',
    type: 'standalone',
    placeholder: 'Genre? Themes? Any starting point?',
    systemPrompt: '',
    disclaimer: '',
    allowSave: true,
  };

  const createAction: Activity = {
    id: 'create',
    title: 'Create',
    description: 'Write, post, and express yourself',
    icon: 'sparkles',
    type: 'standalone',
    placeholder: 'What do you want to create?',
    systemPrompt: '',
    disclaimer: '',
    allowSave: true,
  };

  const relationshipsAction: Activity = {
    id: 'relationships-wellness',
    title: 'Life Stuff',
    description: 'Emotional clarity and regulation with calm grounding.',
    icon: 'heart',
    type: 'standalone',
    placeholder: 'What situation are you trying to understand or steady?',
    systemPrompt: '',
    disclaimer: '',
    allowSave: true,
  };

  const communicationAction: Activity = {
    id: 'communication-orchestrator',
    title: 'Communication Flow',
    description: 'Decode, set boundaries, and respond with focus.',
    icon: 'message-circle',
    type: 'standalone',
    placeholder: 'Paste the message you want to decode...',
    systemPrompt: '',
    disclaimer: '',
    allowSave: true,
  };

  const workLifeAction: Activity = {
    id: 'worklife-orchestrator',
    title: 'Get Unstuck',
    description: 'Too much in your head? Let\'s sort it out together.',
    icon: 'clipboard-list',
    type: 'standalone',
    placeholder: 'Describe what you need help with...',
    systemPrompt: '',
    disclaimer: '',
    allowSave: true,
  };

  const moneyAction: Activity = {
    id: 'money-orchestrator',
    title: 'Money',
    description: 'Your pocket CFO who tells it like it is',
    icon: 'dollar-sign',
    type: 'standalone',
    placeholder: 'What\'s going on with your money?',
    systemPrompt: '',
    disclaimer: '',
    allowSave: true,
  };

  useEffect(() => {
    if (!selectedAction || selectedAction.id !== 'respond') return;
    if (!simpleInput.trim()) return;
    if (isGenerating) return;
    if (!respondMode) return;
    if (output !== null) {
      handleGenerate();
    }
  }, [respondMode]);

  const saveOutput = () => {
    if (!selectedAction || !selectedAction.allowSave) return;
    if (!output) return;
    const activityId = selectedDropdownOption?.id || selectedAction.id;
    const text = output.trim();
    if (!text) return;

    const saved: SavedOutput = {
      id: `${Date.now()}`,
      space: selectedSpace || 'General',
      timestamp: new Date().toISOString(),
      activityId,
      text,
    };

    try {
      const key = 'vera.savedOutputs.v1';
      const existingRaw = localStorage.getItem(key);
      const existing: SavedOutput[] = existingRaw ? JSON.parse(existingRaw) : [];
      existing.unshift(saved);
      localStorage.setItem(key, JSON.stringify(existing));
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 1500);
    } catch (err) {
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 1500);
    }
  };

  const handleGenerate = async (payload?: { thinkingMode?: { id: string; label: string; persona?: string } }) => {
    if (!selectedAction) return;

    // Determine which fields and prompt to use (dropdown option takes precedence)
    const isCreateUnified = selectedAction.id === 'create';
    const isCreateDropdown = selectedAction.id === 'write-email' || selectedAction.id === 'social-post';
    const useCreateSelection = isCreateUnified || isCreateDropdown;
    const createFields = selectedCreateOption?.fields || selectedCreateActivity?.fields;
    const effectiveFields = useCreateSelection
      ? createFields
      : (selectedDropdownOption?.fields || selectedAction.fields);
    const actionId = isCreateUnified
      ? 'create'
      : (selectedDropdownOption?.id || selectedAction.id);
    const relationshipActionId = selectedAction?.id === 'relationship-help' ? 'relationship-help' : actionId;
    const hasRelationshipPrompt = !!(relationshipActionId && relationshipModePrompts[relationshipActionId]);

    const activityFragment = ACTIVITY_PROMPT_FRAGMENTS[actionId];

    const effectivePrompt = actionId === 'respond'
      ? (respondPrompts[respondMode] || respondPrompts.quick)
      : actionId === 'boundaries'
      ? [
          boundaryModePrompts[boundaryMode] || boundaryModePrompts['boundary-script'],
          boundaryTonePrompts[boundaryTone] || boundaryTonePrompts.gentle,
          boundaryDelivery ? boundaryDeliveryPrompts[boundaryDelivery] : '',
        ].filter(Boolean).join(' ')
      : isWorkLifeGroupedActivity(actionId)
      ? [
          activityFragment || workLifeActivityPrompts[actionId] || selectedAction.systemPrompt,
          workLifeTonePrompts[workLifeTone] || workLifeTonePrompts.clear,
          workLifeContext ? workLifeContextPrompts[workLifeContext] : '',
          workLifeSecondaryMode ? workLifeSecondaryPrompts[workLifeSecondaryMode] : '',
        ].filter(Boolean).join(' ')
      : actionId === 'thinking-learning'
      ? [
          thinkingGlobalPrompt,
          thinkingModePrompts[thinkingMode] || thinkingModePrompts.brainstorm,
          thinkingStylePrompts[thinkingStyle] || thinkingStylePrompts.simple,
          thinkingDepthPrompts[thinkingDepth] || thinkingDepthPrompts.short,
          thinkingSecondaryMode ? thinkingSecondaryPrompts[thinkingSecondaryMode] : '',
        ].filter(Boolean).join(' ')
      : isMoneyActivity(actionId)
      ? [
          activityFragment || moneyActivityPrompts[actionId] || selectedAction.systemPrompt,
          moneyPerspectivePrompts[moneyPerspective] || moneyPerspectivePrompts.conservative,
          moneyScope ? moneyScopePrompts[moneyScope] : '',
          moneyContext ? moneyContextPrompts[moneyContext] : '',
          moneyToolPrompt,
          moneySecondaryMode ? moneySecondaryPrompts[moneySecondaryMode] : '',
        ].filter(Boolean).join(' ')
      : actionId === 'relationships-wellness'
      ? [
          relationshipGlobalPrompt,
          relationshipModePrompts[relationshipMode] || relationshipModePrompts['perspective-shift'],
          relationshipTonePrompts[relationshipTone] || relationshipTonePrompts.gentle,
          relationshipDepthPrompts[relationshipDepth] || relationshipDepthPrompts.short,
        ].filter(Boolean).join(' ')
      : hasRelationshipPrompt
      ? [
          relationshipGlobalPrompt,
          relationshipModePrompts[relationshipActionId as keyof typeof relationshipModePrompts],
        ].filter(Boolean).join(' ')
      : useCreateSelection
      ? (selectedCreateOption?.systemPrompt || selectedCreateActivity?.systemPrompt || '')
      : (selectedDropdownOption?.systemPrompt || selectedAction.systemPrompt);

    const layerContext = buildLayerContext(actionId);
    const finalPrompt = [layerContext, effectivePrompt].filter(Boolean).join(' | ');

    let userInput = '';
    if (effectiveFields) {
      userInput = effectiveFields.map(f => `${f.label}: ${formFields[f.name] || 'Not specified'}`).join('\n');
    } else {
      userInput = simpleInput;
    }
    const actionIdForContext = useCreateSelection
      ? (selectedCreateOption?.id || selectedCreateActivity?.id || selectedAction.id)
      : (selectedDropdownOption?.id || selectedAction.id);
    if (handoffContext && (actionIdForContext === 'quick-reply' || actionIdForContext === 'devil-advocate')) {
      userInput = `${userInput}\n\nDecode insight context: ${handoffContext}`;
    }
    if (!userInput.trim()) return;

    setIsGenerating(true);
    setOutput(null);
    setCompareOutputs(null);
    setSaveState('idle');

    try {
      const response = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: finalPrompt,
          userInput,
          mode: generationMode,
          provider: selectedProvider,
          taskType: useCreateSelection
            ? (selectedCreateOption?.id || selectedCreateActivity?.id || selectedAction.id)
            : (selectedDropdownOption?.id || selectedAction.id),
          activityId: useCreateSelection
            ? (selectedCreateOption?.id || selectedCreateActivity?.id || selectedAction.id)
            : (selectedDropdownOption?.id || selectedAction.id),
          ...(payload?.thinkingMode ? { thinkingMode: payload.thinkingMode } : {}),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Generation failed');

      if (generationMode === 'compare' && data.responses) {
        setCompareOutputs(data.responses);
      } else {
        setOutput(data.content);
        setUsedProvider(data.provider || null);

        const actionId = selectedDropdownOption?.id || selectedAction.id;
        if (actionId === 'decode-message') {
          setLastDecodeInput(userInput);
          setSignalLayer(buildSignalLayer(userInput));
          setHandoffFlags(buildHandoffFlags(userInput));
          setCoreMove(buildCoreMove(userInput));
          setTimeOrientation(buildTimeOrientation(userInput));
          setWhatsMissing(buildWhatsMissing(userInput));
          setCleanContrast(buildCleanContrast(userInput));
          setShowWhatsMissing(false);
          setShowCleanContrast(false);
        } else {
          setSignalLayer('');
          setHandoffFlags([]);
          setCoreMove('');
          setTimeOrientation('');
          setWhatsMissing([]);
          setCleanContrast('');
          setShowWhatsMissing(false);
          setShowCleanContrast(false);
          setHandoffContext('');
          if (actionId !== 'respond') {
            setRespondMode('quick');
          }
        }
      }
    } catch (err) {
      setOutput('Something went wrong. Please try again.');
      setSignalLayer('');
      setHandoffFlags([]);
      setCoreMove('');
      setTimeOrientation('');
      setWhatsMissing([]);
      setCleanContrast('');
      setShowWhatsMissing(false);
      setShowCleanContrast(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text?: string) => {
    const textToCopy = text || output;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSelectedAction(null);
    setSelectedDropdownOption(null);
    setSimpleInput('');
    setFormFields({});
    setOutput(null);
    setCompareOutputs(null);
    setUsedProvider(null);
    setSignalLayer('');
    setHandoffFlags([]);
    setLastDecodeInput('');
    setSaveState('idle');
    setCoreMove('');
    setTimeOrientation('');
    setWhatsMissing([]);
    setCleanContrast('');
    setShowWhatsMissing(false);
    setShowCleanContrast(false);
    setHandoffContext('');
    setRespondMode('quick');
    setBoundaryMode('boundary-script');
    setBoundaryTone('gentle');
    setBoundaryDelivery('');
    setWorkLifeMode(defaultWorkLifeId);
    setWorkLifeTone('clear');
    setWorkLifeContext('');
    setWorkLifeSecondaryMode('');
    setThinkingMode('brainstorm');
    setThinkingSecondaryMode('');
    setThinkingStyle('simple');
    setThinkingDepth('short');
    setMoneyMode('budget-check');
    setMoneyPerspective('conservative');
    setMoneyScope('');
    setMoneyContext('');
    resetCommunicationFlow();
  };

  const handleBack = () => {
    // Came from sidebar - always go back to sanctuary
    if (initialActivity) {
      onBack();
      return;
    }
    
    // Normal navigation (user browsing within OpsRoom)
    if (output || compareOutputs) {
      handleReset();
    } else if (selectedDropdownOption) {
      setSelectedDropdownOption(null);
      setSimpleInput('');
      setFormFields({});
    } else if (selectedAction?.id === 'communication-orchestrator') {
      resetCommunicationFlow();
      setSelectedAction(null);
    } else if (selectedAction) {
      setSelectedAction(null);
      setSimpleInput('');
      setFormFields({});
    } else if (activeCategory) {
      setActiveCategory(null);
    } else {
      onBack();
    }
  };

  const isFormValid = () => {
    if (!selectedAction) return false;
    const isCreateUnified = selectedAction.id === 'create';
    const isCreateDropdown = selectedAction.id === 'write-email' || selectedAction.id === 'social-post';
    if ((isCreateUnified || isCreateDropdown) && selectedCreateActivity?.dropdownOptions?.length && !selectedCreateOption) return false;
    if (selectedAction.id === 'career' && !selectedDropdownOption) return false;
    const effectiveFields = (isCreateUnified || isCreateDropdown)
      ? (selectedCreateOption?.fields || selectedCreateActivity?.fields)
      : (selectedDropdownOption?.fields || selectedAction.fields);
    if (effectiveFields) {
      const required = effectiveFields.filter(f => f.required);
      return required.every(f => formFields[f.name]?.trim());
    }
    return simpleInput.trim().length > 0;
  };

  const handleFormFieldChange = (fieldId: string, value: string) => {
    setFormFields(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSelectCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSelectedAction(null);
    setSelectedDropdownOption(null);
  };

  const handleSelectAction = (action: Activity) => {
    if (forgeOnlyActivityIds.has(action.id) && !canAccessForge) {
      router.push('/forge');
      return;
    }
    if (['decode-message', 'respond', 'boundaries'].includes(action.id)) {
      setSelectedAction(communicationAction);
      setSelectedDropdownOption(null);
      setFormFields({});
      setSimpleInput('');
      return;
    }
    // Redirect get-unstuck activities to unified orchestrator
    if (action.id === 'get-unstuck' || isWorkLifeGroupedActivity(action.id)) {
      setSelectedAction(workLifeAction);
      setSelectedDropdownOption(null);
      setFormFields({});
      setSimpleInput('');
      return;
    }
    // Redirect money-orchestrator activities to unified orchestrator
    if (action.id === 'money-orchestrator' || action.id === 'money') {
      setSelectedAction(moneyAction);
      setSelectedDropdownOption(null);
      setFormFields({});
      setSimpleInput('');
      return;
    }
    // Redirect thinking activities to unified orchestrator
    if (action.id === 'thinking-orchestrator' || action.id === 'thinking-learning' || action.id === 'think-learn') {
      setSelectedAction(thinkingAction);
      setSelectedDropdownOption(null);
      setFormFields({});
      setSimpleInput('');
      return;
    }
    // Redirect wellness activities to unified orchestrator
    if (action.id === 'wellness-orchestrator') {
      setSelectedAction(wellnessAction);
      setSelectedDropdownOption(null);
      setFormFields({});
      setSimpleInput('');
      return;
    }
    setSelectedAction(action);
    setSelectedDropdownOption(null);
    setFormFields({});
    setSimpleInput('');
    if (action.id === 'respond') {
      setRespondMode('quick');
    }
    if (action.id === 'boundaries') {
      setBoundaryMode('boundary-script');
      setBoundaryTone('gentle');
      setBoundaryDelivery('');
    }
    if (action.id === 'get-unstuck') {
      setWorkLifeMode(defaultWorkLifeId);
      setWorkLifeTone('clear');
      setWorkLifeContext('');
      setWorkLifeSecondaryMode('');
    }
    if (isWorkLifeGroupedActivity(action.id)) {
      setWorkLifeMode(action.id);
    }
    if (action.id === 'thinking-learning') {
      setThinkingMode('brainstorm');
      setThinkingSecondaryMode('');
      setThinkingStyle('simple');
      setThinkingDepth('short');
    }
    if (action.id === 'money') {
      setMoneyMode('budget-check');
      setMoneyPerspective('conservative');
      setMoneyScope('');
      setMoneyContext('');
      setMoneySecondaryMode('');
    }
    if (isMoneyActivity(action.id)) {
      setMoneyMode(action.id);
    }
    if (action.id === 'relationships-wellness') {
      setRelationshipMode('perspective-shift');
      setRelationshipTone('gentle');
      setRelationshipDepth('short');
    }
    if (action.id === 'career') {
      setCareerTone('professional');
      setSelectedDropdownOption(null);
    }
    if (action.id === 'create') {
      const createCategory = opsRoom.categories.find((c) => c.id === 'create');
      const defaultActivity = createCategory?.activities.find((a) => a.id === 'bio-about')?.id || 'bio-about';
      setCreateActivityId(defaultActivity);
      setCreateOptionId('');
    }
    if (action.id === 'write-email' || action.id === 'social-post') {
      setCreateActivityId(action.id);
      setCreateOptionId('');
    }
    if (action.id === 'bio-about' || action.id === 'creative-writing') {
      setSelectedAction(createSharedAction);
      setCreateActivityId(action.id);
      setCreateOptionId('');
    }
  };

  const handleSelectDropdownOption = (option: DropdownOption) => {
    setSelectedDropdownOption(option);
    setFormFields({});
    setSimpleInput('');
  };

  const getDecodeInsights = (text: string): string[] => {
    const clean = text.replace(/\r/g, '').trim();
    if (!clean) return [];
    const rawLines = clean
      .split('\n')
      .map((line) => line.replace(/^[-*•\d.\s]+/, '').trim())
      .filter(Boolean);
    if (rawLines.length) return rawLines.slice(0, 3);
    const sentenceParts = clean
      .split(/(?<=[.!?])\s+/)
      .map((line) => line.replace(/^[-*•\d.\s]+/, '').trim())
      .filter(Boolean);
    return sentenceParts.slice(0, 3);
  };

  const createCategory = opsRoom.categories.find((c) => c.id === 'create');
  const createActivities = createCategory?.activities || [];
  const createSharedActivities = createActivities.filter((a) => ['bio-about', 'creative-writing'].includes(a.id));
  const createDropdownActivities = createActivities.filter((a) => ['write-email', 'social-post'].includes(a.id));
  const selectedCreateActivity = selectedAction?.id === 'create'
    ? (createSharedActivities.find((a) => a.id === createActivityId) || createSharedActivities[0] || null)
    : (selectedAction && ['write-email', 'social-post'].includes(selectedAction.id)
        ? selectedAction
        : (createActivities.find((a) => a.id === createActivityId) || createActivities[0] || null));
  const selectedCreateOption = selectedCreateActivity?.dropdownOptions?.find((o) => o.id === createOptionId) || null;

  return (
    <>
      <style jsx global>{GLOBAL_STYLES}</style>

      <div style={{ position: 'fixed', inset: 0, background: colors.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Ambient Background */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
            width: 'min(120vw, 700px)', height: 'min(80vh, 500px)',
            background: isDark
              ? 'radial-gradient(ellipse at 50% 30%, rgba(255, 180, 100, 0.08) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at 50% 30%, rgba(255, 220, 180, 0.4) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
        </div>

        {/* Header */}
        <header style={{ padding: '16px', paddingTop: 'max(16px, env(safe-area-inset-top))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50 }}>
          <button onClick={handleBack} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
            background: colors.cardBg, border: `1px solid ${colors.cardBorder}`,
            borderRadius: 50, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: colors.textMuted,
          }}>
            <OpsIcon type="arrow-left" color={colors.textMuted} />
            <span>Back</span>
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            {['light', 'auto', 'dark'].map((theme) => (
              <button
                key={theme}
                onClick={() => setManualTheme(theme as ThemeMode)}
                style={{
                  padding: '8px 12px', borderRadius: 20, border: `1px solid ${manualTheme === theme ? colors.accent : colors.cardBorder}`,
                  background: manualTheme === theme ? (isDark ? 'rgba(255,180,100,0.1)' : 'rgba(200,160,100,0.15)') : 'transparent',
                  cursor: 'pointer', fontSize: 12, fontWeight: 500, color: manualTheme === theme ? colors.accent : colors.textMuted,
                }}
              >
                {theme}
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 20px 40px', opacity: isLoaded ? 1 : 0, transition: 'opacity 0.4s ease-out' }}>
          {!activeCategory && !selectedAction && !output && !compareOutputs && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 40, fontWeight: 300, color: colors.text, marginBottom: 8 }}>Focus</h1>
                <p style={{ fontSize: 15, color: colors.textMuted }}>Select a category from the sidebar to get started</p>
              </div>

              <ProviderSelector
                selectedMode={generationMode}
                selectedProvider={selectedProvider}
                onOpenModeSelector={() => setShowModeSelector(true)}
                colors={colors}
                isDark={isDark}
              />
              <div style={{ width: '100%', maxWidth: 700, marginTop: 18 }}>
                <div style={{ padding: '16px', borderRadius: 16, background: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
                  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: colors.textMuted, marginBottom: 10 }}>
                    FOCUS
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {focusModes.map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setFocusMode(mode.id)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 999,
                          border: `1px solid ${focusMode === mode.id ? colors.accent : colors.cardBorder}`,
                          background: focusMode === mode.id
                            ? (isDark ? 'rgba(255,180,100,0.1)' : 'rgba(200,160,100,0.15)')
                            : 'transparent',
                          color: focusMode === mode.id ? colors.text : colors.textMuted,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeCategory && !selectedAction && !output && !compareOutputs && (() => {
            const category = opsRoom.categories.find(c => c.id === activeCategory);
            if (!category) return null;
            return (
              <ActionSelector
                category={activeCategory}
                categoryTitle={category.name}
                actions={category.activities}
                onSelectAction={(action) => handleSelectAction(action as Activity)}
                colors={colors}
                isDark={isDark}
              />
            );
          })()}

          {selectedAction?.id === 'language-learning' && !output && !compareOutputs && !isGenerating && (
            <>
              <div style={{ width: '100%', maxWidth: 700, marginBottom: 16 }}>
                <div style={{ padding: '16px', borderRadius: 16, background: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
                  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: colors.textMuted, marginBottom: 10 }}>
                    FOCUS
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {focusModes.map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setFocusMode(mode.id)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 999,
                          border: `1px solid ${focusMode === mode.id ? colors.accent : colors.cardBorder}`,
                          background: focusMode === mode.id
                            ? (isDark ? 'rgba(255,180,100,0.1)' : 'rgba(200,160,100,0.15)')
                            : 'transparent',
                          color: focusMode === mode.id ? colors.text : colors.textMuted,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <LanguageExperience
                colors={colors}
                isDark={isDark}
                onExit={() => setSelectedAction(null)}
              />
            </>
          )}

          {selectedAction && selectedAction.id !== 'language-learning' && !compareOutputs && (
            selectedAction.id === 'communication-orchestrator' ? (
              <>
                <div style={{ width: '100%', animation: 'fadeIn 0.4s ease-out', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: '100%', maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Header */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontSize: 24, fontWeight: 600, color: colors.text }}>
                        Communication
                      </div>
                      <div style={{ fontSize: 14, color: colors.textMuted }}>
                        Understand what's really being said. Respond with clarity.
                      </div>
                    </div>

                    {/* SECTION ONE: DECODE */}
                    <div style={{
                      width: '100%',
                      padding: '18px',
                      borderRadius: 12,
                      background: colors.cardBg,
                      border: `1px solid ${colors.cardBorder}`,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Decode
                      </div>
                      <textarea
                        value={communicationInput}
                        onChange={(e) => setCommunicationInput(e.target.value)}
                        placeholder="Paste or say the message you want help with."
                        rows={5}
                        className="input-field"
                        style={{
                          width: '100%',
                          padding: '18px 18px',
                          borderRadius: 12,
                          border: `1px solid ${inputBorder}`,
                          background: inputBg,
                          color: colors.text,
                          fontSize: 16,
                          lineHeight: 1.6,
                          resize: 'vertical',
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }}>
                        <button
                          onClick={handleCommunicationGenerate}
                          disabled={communicationDecodeGenerating || communicationRespondGenerating || !communicationInput.trim()}
                          style={{
                            padding: '10px 18px',
                            borderRadius: 8,
                            border: 'none',
                            background: communicationDecodeGenerating || communicationRespondGenerating || !communicationInput.trim()
                              ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(140,110,80,0.2)')
                              : colors.accent,
                            color: communicationDecodeGenerating || communicationRespondGenerating || !communicationInput.trim() ? colors.textMuted : 'white',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: communicationDecodeGenerating || communicationRespondGenerating || !communicationInput.trim() ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {communicationDecodeGenerating || communicationRespondGenerating ? 'Working...' : 'Generate response'}
                        </button>
                      </div>
                    </div>

                    {communicationBoundaryNeeded && (
                      <div style={{ fontSize: 12, color: colors.textMuted }}>
                        A boundary is needed here.
                      </div>
                    )}

                    {/* SECTION TWO: ANALYSIS */}
                    <div style={{
                      width: '100%',
                      padding: '18px',
                      borderRadius: 12,
                      background: colors.cardBg,
                      border: `1px solid ${colors.cardBorder}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Analysis
                        </div>
                        <button
                          onClick={() => setShowCommunicationAnalysis(!showCommunicationAnalysis)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 6,
                            border: `1px solid ${colors.cardBorder}`,
                            background: 'transparent',
                            color: colors.textMuted,
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: 'pointer',
                          }}
                        >
                          {showCommunicationAnalysis ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      {showCommunicationAnalysis && (
                        <div style={{ marginTop: 12, maxHeight: 400, overflowY: 'auto' }}>
                          {communicationDecodeOutput ? (
                            <FormattedOutput content={communicationDecodeOutput} colors={colors} isDark={isDark} />
                          ) : (
                            <div style={{ color: colors.textMuted, fontSize: 13 }}>Analysis will appear here.</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* BOUNDARY CALLOUT - appears if analysis mentions boundary-related patterns */}
                    {communicationDecodeOutput && !communicationBoundaryMode && (() => {
                      const lower = communicationDecodeOutput.toLowerCase();
                      return lower.includes('boundary') || lower.includes('pressure/urgency') || lower.includes('guilt language') || lower.includes('manipulation pattern');
                    })() && (
                      <div style={{
                        width: '100%',
                        padding: '16px 20px',
                        borderRadius: 12,
                        background: isDark ? 'rgba(194, 154, 108, 0.12)' : 'rgba(194, 154, 108, 0.15)',
                        border: `1px solid ${isDark ? 'rgba(194, 154, 108, 0.25)' : 'rgba(194, 154, 108, 0.35)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                      }}>
                        <span style={{ fontSize: 14, color: colors.text }}>
                          This looks like a boundary situation.
                        </span>
                        <button
                          onClick={() => setCommunicationBoundaryMode(true)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: 8,
                            border: 'none',
                            background: isDark ? 'rgba(194, 154, 108, 0.25)' : 'rgba(194, 154, 108, 0.3)',
                            color: colors.text,
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Need help setting a boundary?
                        </button>
                      </div>
                    )}

                    {/* SECTION: BOUNDARY MODE */}
                    {communicationBoundaryMode && (
                      <div style={{
                        width: '100%',
                        padding: '18px',
                        borderRadius: 12,
                        background: isDark ? 'rgba(194, 154, 108, 0.08)' : 'rgba(194, 154, 108, 0.1)',
                        border: `1px solid ${isDark ? 'rgba(194, 154, 108, 0.2)' : 'rgba(194, 154, 108, 0.25)'}`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Boundary
                          </div>
                          <button
                            onClick={() => setCommunicationBoundaryMode(false)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: 6,
                              border: `1px solid ${colors.cardBorder}`,
                              background: 'transparent',
                              color: colors.textMuted,
                              fontSize: 12,
                              cursor: 'pointer',
                            }}
                          >
                            ✕
                          </button>
                        </div>
                        <div style={{ fontSize: 14, color: colors.text, marginBottom: 16 }}>
                          Choose how you want to set this boundary
                        </div>

                        {/* Boundary Type Options */}
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                          {[
                            { id: 'boundary-script', label: 'Boundary Script', desc: 'A full script for setting the boundary' },
                            { id: 'say-no', label: 'Say No Clearly', desc: 'A direct, clear no' },
                            { id: 'soften-hold', label: 'Soften But Hold', desc: 'Gentle but firm boundary' },
                          ].map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => setCommunicationBoundaryType(opt.id)}
                              style={{
                                padding: '10px 16px',
                                borderRadius: 8,
                                border: communicationBoundaryType === opt.id
                                  ? `2px solid ${colors.accent}`
                                  : `1px solid ${colors.cardBorder}`,
                                background: communicationBoundaryType === opt.id
                                  ? (isDark ? 'rgba(194, 154, 108, 0.15)' : 'rgba(194, 154, 108, 0.12)')
                                  : colors.cardBg,
                                color: colors.text,
                                fontSize: 13,
                                fontWeight: 500,
                                cursor: 'pointer',
                                flex: '1 1 auto',
                                minWidth: 120,
                              }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>

                        {/* Tone Selector */}
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>Tone</div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {['Gentle', 'Firm', 'Professional', 'Personal'].map((tone) => (
                              <button
                                key={tone}
                                onClick={() => setCommunicationBoundaryTone(tone.toLowerCase())}
                                style={{
                                  padding: '6px 14px',
                                  borderRadius: 20,
                                  border: communicationBoundaryTone === tone.toLowerCase()
                                    ? `2px solid ${colors.accent}`
                                    : `1px solid ${colors.cardBorder}`,
                                  background: communicationBoundaryTone === tone.toLowerCase()
                                    ? (isDark ? 'rgba(194, 154, 108, 0.15)' : 'rgba(194, 154, 108, 0.12)')
                                    : 'transparent',
                                  color: colors.text,
                                  fontSize: 12,
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                }}
                              >
                                {tone}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Generate Button */}
                        <button
                          onClick={async () => {
                            setCommunicationBoundaryGenerating(true);
                            setCommunicationRespondOutput(null);
                            try {
                              const boundaryTypeLabels: Record<string, string> = {
                                'boundary-script': 'Boundary Script',
                                'say-no': 'Say No Clearly',
                                'soften-hold': 'Soften But Hold',
                              };
                              const selectedType = boundaryTypeLabels[communicationBoundaryType] || 'Boundary Script';
                              const originalMessage = communicationInput.trim();
                              
                              if (!originalMessage) {
                                console.error('[Boundary] No original message provided');
                                setCommunicationRespondOutput('Please enter a message first.');
                                setCommunicationBoundaryGenerating(false);
                                return;
                              }

                              const systemPrompt = `You are VERA, helping someone set a boundary in response to a message they received.

Here is the message they received:
---
${originalMessage}
---

${communicationDecodeOutput ? `Analysis of this message:
---
${communicationDecodeOutput}
---

` : ''}The user wants to respond with a boundary. Generate a response based on:

Boundary type: ${selectedType}
- 'Boundary Script': A complete message that acknowledges the other person while clearly stating the boundary with warmth and firmness.
- 'Say No Clearly': A brief, direct response that declines without over-explaining or apologizing excessively.
- 'Soften But Hold': A gentle response that shows care for the relationship while still holding the boundary firmly.

Tone: ${communicationBoundaryTone}

Write ONLY the response they can copy and send. Make it specific to the actual message they received. No analysis, no alternatives, no meta-commentary.`;

                              console.log('[Boundary] originalMessage:', originalMessage);
                              console.log('[Boundary] systemPrompt:', systemPrompt);

                              const res = await fetch('/api/ops/generate', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  systemPrompt,
                                  userInput: originalMessage,
                                  mode: generationMode,
                                  provider: selectedProvider,
                                  taskType: 'respond',
                                  activityId: 'respond',
                                }),
                              });
                              const data = await res.json();
                              console.log('[Boundary] API response:', data);
                              if (!res.ok) throw new Error(data.error || 'Generation failed');
                              setCommunicationRespondOutput(data.content || 'Unable to generate response.');
                            } catch (err) {
                              console.error('Boundary generation error:', err);
                              setCommunicationRespondOutput('Error generating boundary response.');
                            } finally {
                              setCommunicationBoundaryGenerating(false);
                            }
                          }}
                          disabled={communicationBoundaryGenerating || !communicationInput.trim()}
                          style={{
                            width: '100%',
                            padding: '12px 20px',
                            borderRadius: 8,
                            border: 'none',
                            background: communicationInput.trim() ? colors.accent : colors.cardBorder,
                            color: communicationInput.trim() ? '#fff' : colors.textMuted,
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: communicationInput.trim() ? 'pointer' : 'default',
                          }}
                        >
                          {communicationBoundaryGenerating ? 'Generating...' : 'Generate Boundary Response'}
                        </button>
                      </div>
                    )}

                    {/* SECTION THREE: RESPOND */}
                    <div style={{
                      width: '100%',
                      padding: '18px',
                      borderRadius: 12,
                      background: colors.cardBg,
                      border: `1px solid ${colors.cardBorder}`,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Respond
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>
                          A response you can send
                        </div>
                        <button
                          onClick={() => {
                            handleCopy(communicationRespondOutput || '');
                            setShowClosingMessage(true);
                            setTimeout(() => setShowClosingMessage(false), 3000);
                          }}
                          disabled={!communicationRespondOutput}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 8,
                            border: `1px solid ${colors.cardBorder}`,
                            background: colors.cardBg,
                            cursor: communicationRespondOutput ? 'pointer' : 'default',
                            fontSize: 12,
                            fontWeight: 500,
                            color: communicationRespondOutput ? colors.text : colors.textMuted,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <OpsIcon type="copy" color={colors.accent} />
                          Copy
                        </button>
                      </div>
                      <div className="output-area" style={{
                        padding: '20px',
                        background: colors.cardBg,
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: 10,
                        minHeight: 120,
                        maxHeight: '45vh',
                        overflowY: 'auto',
                        color: colors.text,
                        fontSize: 14,
                        lineHeight: 1.6,
                      }}>
                        {communicationRespondGenerating && !communicationRespondOutput ? (
                          <div style={{ color: colors.textMuted, fontSize: 13 }}>Generating...</div>
                        ) : communicationRespondOutput ? (
                          <FormattedOutput content={communicationRespondOutput} colors={colors} isDark={isDark} />
                        ) : (
                          <div style={{ color: colors.textMuted, fontSize: 13 }}>Response will appear here.</div>
                        )}
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 12,
                      marginTop: 8,
                    }}>
                      <button
                        onClick={() => {
                          setCommunicationInput('');
                          setCommunicationDecodeOutput(null);
                          setCommunicationRespondOutput(null);
                          setShowCommunicationAnalysis(false);
                        }}
                        style={{
                          padding: '10px 20px',
                          borderRadius: 8,
                          border: `1px solid ${isDark ? 'rgb(156 163 175)' : 'rgb(209 213 219)'}`,
                          background: 'transparent',
                          color: isDark ? 'rgb(209 213 219)' : 'rgb(75 85 99)',
                          fontSize: 14,
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'rgb(251 191 36)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = isDark ? 'rgb(156 163 175)' : 'rgb(209 213 219)';
                        }}
                      >
                        Start Over
                      </button>
                      <button
                        onClick={async () => {
                          if (communicationRespondOutput) {
                            try {
                              await navigator.clipboard.writeText(communicationRespondOutput);
                              setShowClosingMessage(true);
                              setTimeout(() => setShowClosingMessage(false), 3000);
                            } catch (err) {
                              console.error('Failed to copy:', err);
                            }
                          }
                        }}
                        disabled={!communicationRespondOutput}
                        style={{
                          padding: '10px 20px',
                          borderRadius: 8,
                          border: 'none',
                          background: communicationRespondOutput ? 'rgb(217 119 6)' : (isDark ? 'rgb(55 65 81)' : 'rgb(229 231 235)'),
                          color: communicationRespondOutput ? 'white' : (isDark ? 'rgb(156 163 175)' : 'rgb(107 114 128)'),
                          fontSize: 14,
                          fontWeight: 500,
                          cursor: communicationRespondOutput ? 'pointer' : 'default',
                          boxShadow: communicationRespondOutput ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (communicationRespondOutput) {
                            e.currentTarget.style.background = 'rgb(180 83 9)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (communicationRespondOutput) {
                            e.currentTarget.style.background = 'rgb(217 119 6)';
                          }
                        }}
                      >
                        Copy Response
                      </button>
                      <button
                        onClick={() => {
                          if (!communicationRespondOutput) return;
                          const title = 'Understand & Respond - ' + (communicationInput.trim().slice(0, 50) || 'Response');
                          const saved: SavedOutput = {
                            id: `${Date.now()}`,
                            space: selectedSpace || 'General',
                            timestamp: new Date().toISOString(),
                            activityId: 'communication-orchestrator',
                            text: `${title}\n\n${communicationRespondOutput.trim()}`,
                          };
                          try {
                            const key = 'vera.savedOutputs.v1';
                            const existingRaw = localStorage.getItem(key);
                            const existing: SavedOutput[] = existingRaw ? JSON.parse(existingRaw) : [];
                            existing.unshift(saved);
                            localStorage.setItem(key, JSON.stringify(existing));
                            setSaveState('saved');
                            setTimeout(() => setSaveState('idle'), 2000);
                          } catch (err) {
                            console.error('Save error:', err);
                            setSaveState('error');
                            setTimeout(() => setSaveState('idle'), 2000);
                          }
                        }}
                        disabled={!communicationRespondOutput}
                        style={{
                          padding: '10px 20px',
                          borderRadius: 8,
                          border: '1px solid rgb(245 158 11)',
                          background: saveState === 'saved' ? 'rgb(245 158 11)' : 'transparent',
                          color: saveState === 'saved' ? 'white' : 'rgb(245 158 11)',
                          fontSize: 14,
                          fontWeight: 500,
                          cursor: communicationRespondOutput ? 'pointer' : 'default',
                          opacity: communicationRespondOutput ? 1 : 0.5,
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (communicationRespondOutput && saveState === 'idle') {
                            e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (communicationRespondOutput && saveState === 'idle') {
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}
                      >
                        {saveState === 'saved' ? 'Saved!' : saveState === 'error' ? 'Error' : 'Save'}
                      </button>
                      <button
                        onClick={() => router.push('/sanctuary')}
                        style={{
                          padding: '10px 20px',
                          borderRadius: 8,
                          border: '1px solid rgb(251 191 36)',
                          background: 'transparent',
                          color: 'rgb(251 191 36)',
                          fontSize: 14,
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(251, 191, 36, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        Talk to VERA
                      </button>
                    </div>

                    {/* DISCLAIMER */}
                    <div style={{
                      textAlign: 'center',
                      marginTop: 24,
                      fontSize: 11,
                      color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(60,50,45,0.4)',
                      lineHeight: 1.5,
                    }}>
                      VERA is a decision-support tool, not a substitute for professional advice. Trust your own judgment and seek professional help when needed.
                    </div>

                    {/* CLOSING MESSAGE */}
                    {showClosingMessage && (
                      <div style={{
                        textAlign: 'center',
                        marginTop: 20,
                        fontSize: 14,
                        fontStyle: 'italic',
                        color: colors.accent,
                        opacity: 1,
                        animation: 'fadeIn 0.5s ease-out',
                      }}>
                        You've got this. Trust yourself.
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : selectedAction.id === 'worklife-orchestrator' ? (
              <>
                <div style={{ width: '100%', animation: 'fadeIn 0.4s ease-out', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: '100%', maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Header */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontSize: 24, fontWeight: 600, color: colors.text }}>
                        Get Unstuck
                      </div>
                      <div style={{ fontSize: 14, color: colors.textMuted }}>
                        Too much in your head? Let's sort it out together.
                      </div>
                    </div>

                    {/* SECTION ONE: INPUT */}
                    <div style={{
                      width: '100%',
                      padding: '18px',
                      borderRadius: 12,
                      background: colors.cardBg,
                      border: `1px solid ${colors.cardBorder}`,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        What's Going On
                      </div>
                      <textarea
                        value={workLifeInput}
                        onChange={(e) => setWorkLifeInput(e.target.value)}
                        placeholder="I have too much to do... / I can't decide... / I have a meeting coming up..."
                        rows={5}
                        className="input-field"
                        disabled={workLifeStage !== 'input'}
                        style={{
                          width: '100%',
                          padding: '18px 18px',
                          borderRadius: 12,
                          border: `1px solid ${inputBorder}`,
                          background: inputBg,
                          color: colors.text,
                          fontSize: 16,
                          lineHeight: 1.6,
                          resize: 'vertical',
                          opacity: workLifeStage !== 'input' ? 0.7 : 1,
                        }}
                      />
                      {workLifeStage === 'input' && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }}>
                          <button
                            onClick={async () => {
                              const input = workLifeInput.trim();
                              if (!input) return;

                              setWorkLifeGenerating(true);

                              const clarifyPrompt = `You are VERA. Someone just shared a work or life challenge. Before giving advice, you need to understand what's REALLY going on.

Your job: Ask ONE clarifying question that gets to the root of their struggle — not the task, but the feeling or pattern underneath.

Examples of good clarifying questions:
- 'Is the freeze coming from not knowing what to do, or from knowing exactly what to do but not wanting to face it?'
- 'Are you overwhelmed by how much there is, or by the fear of not doing it perfectly?'
- 'Is this about the task itself, or about what might happen (or not happen) when it's done?'

Format your response as JSON:
{
  "question": "Your clarifying question here",
  "options": ["Option 1", "Option 2", "Option 3 (optional)"],
  "insight": "One sentence about what you're sensing beneath their words"
}

Only return the JSON, nothing else.`;

                              try {
                                const clarifyResponse = await fetch('/api/ops/generate', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    systemPrompt: clarifyPrompt,
                                    userInput: input,
                                    mode: generationMode,
                                    provider: selectedProvider,
                                    taskType: 'worklife-clarify',
                                    activityId: 'worklife-clarify',
                                  }),
                                });

                                const clarifyData = await clarifyResponse.json();
                                if (!clarifyResponse.ok) throw new Error(clarifyData.error || 'Generation failed');

                                const clarifyText = clarifyData.content || '';
                                try {
                                  const parsed = JSON.parse(clarifyText);
                                  setWorkLifeClarifyQuestion(parsed.question || '');
                                  setWorkLifeClarifyOptions(parsed.options || []);
                                  setWorkLifeClarifyInsight(parsed.insight || '');
                                  setWorkLifeStage('clarify');
                                } catch {
                                  // If JSON parsing fails, use fallback
                                  setWorkLifeClarifyQuestion('What feels most true about why you\'re stuck?');
                                  setWorkLifeClarifyOptions(['I don\'t know where to start', 'I\'m afraid of doing it wrong', 'I\'m avoiding something deeper']);
                                  setWorkLifeClarifyInsight('');
                                  setWorkLifeStage('clarify');
                                }
                              } catch (err) {
                                console.error('Work & Life clarify error:', err);
                                // Fallback to direct result if clarify fails
                                setWorkLifeStage('result');
                              } finally {
                                setWorkLifeGenerating(false);
                              }
                            }}
                            disabled={workLifeGenerating || !workLifeInput.trim()}
                            style={{
                              padding: '10px 18px',
                              borderRadius: 8,
                              border: 'none',
                              background: workLifeGenerating || !workLifeInput.trim()
                                ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(140,110,80,0.2)')
                                : colors.accent,
                              color: workLifeGenerating || !workLifeInput.trim() ? colors.textMuted : 'white',
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: workLifeGenerating || !workLifeInput.trim() ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {workLifeGenerating ? 'Working...' : 'Help me with this'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* SECTION TWO: CLARIFY */}
                    {workLifeStage === 'clarify' && (
                      <div style={{
                        width: '100%',
                        padding: '18px',
                        borderRadius: 12,
                        background: isDark ? 'rgba(194, 154, 108, 0.08)' : 'rgba(194, 154, 108, 0.1)',
                        border: `1px solid ${isDark ? 'rgba(194, 154, 108, 0.2)' : 'rgba(194, 154, 108, 0.25)'}`,
                      }}>
                        {workLifeClarifyInsight && (
                          <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 16, fontStyle: 'italic' }}>
                            {workLifeClarifyInsight}
                          </div>
                        )}
                        <div style={{ fontSize: 16, color: colors.text, marginBottom: 16, fontWeight: 500 }}>
                          {workLifeClarifyQuestion}
                        </div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                          {workLifeClarifyOptions.map((option, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setWorkLifeUserChoice(option);
                                setWorkLifeCustomAnswer('');
                              }}
                              style={{
                                padding: '10px 16px',
                                borderRadius: 8,
                                border: workLifeUserChoice === option
                                  ? `2px solid ${colors.accent}`
                                  : `1px solid ${colors.cardBorder}`,
                                background: workLifeUserChoice === option
                                  ? (isDark ? 'rgba(194, 154, 108, 0.15)' : 'rgba(194, 154, 108, 0.12)')
                                  : colors.cardBg,
                                color: colors.text,
                                fontSize: 14,
                                cursor: 'pointer',
                                flex: '1 1 auto',
                                minWidth: 140,
                              }}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <input
                            type="text"
                            value={workLifeCustomAnswer}
                            onChange={(e) => {
                              setWorkLifeCustomAnswer(e.target.value);
                              if (e.target.value.trim()) setWorkLifeUserChoice('');
                            }}
                            placeholder="Or tell me in your own words..."
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: 8,
                              border: `1px solid ${inputBorder}`,
                              background: inputBg,
                              color: colors.text,
                              fontSize: 14,
                            }}
                          />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            onClick={async () => {
                              const choice = workLifeCustomAnswer.trim() || workLifeUserChoice;
                              if (!choice) return;

                              setWorkLifeUserChoice(choice);
                              setWorkLifeGenerating(true);
                              setWorkLifeStage('result');
                              setWorkLifeAnalysisOutput(null);
                              setWorkLifeActionOutput(null);

                              const combinedInput = `${workLifeInput.trim()}\n\nWhen asked "${workLifeClarifyQuestion}", they answered: "${choice}"`;

                              const analysisPrompt = `You are VERA — a wise, calm guide who helps people get unstuck with work and life challenges. Someone is sharing what's overwhelming them. They've also answered a clarifying question about what's really going on.

Respond with ALL sections below. Use the exact headers:

**What I'm hearing:**
One sentence. Reflect back what they're dealing with — show them you understand. Incorporate their clarifying answer.

**Why you might be stuck:**
2-3 sentences. Name the nervous system pattern humanly. Is it overwhelm? Decision fatigue? Fear of getting it wrong? Avoidance? Normalize it. Example: 'When everything feels equally urgent, your brain can't prioritize — so it freezes. That's not laziness. That's overwhelm.'

**What's actually true:**
2-3 sentences. Ground them in reality. Cut through the catastrophizing. Example: 'You don't have to do everything today. You have to do ONE thing. The rest can wait.'

**What might help:**
1-2 sentences. A gentle internal check-in or permission. Example: 'What would feel like a win today, even if it's small?'

Tone: Warm, wise, human. Never clinical. Never a lecture.`;

                              try {
                                // FIRST CALL: Analysis
                                const analysisResponse = await fetch('/api/ops/generate', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    systemPrompt: analysisPrompt,
                                    userInput: combinedInput,
                                    mode: generationMode,
                                    provider: selectedProvider,
                                    taskType: 'worklife-analysis',
                                    activityId: 'worklife-analysis',
                                  }),
                                });

                                const analysisData = await analysisResponse.json();
                                if (!analysisResponse.ok) throw new Error(analysisData.error || 'Generation failed');

                                const analysisText = analysisData.content || '';
                                setWorkLifeAnalysisOutput(analysisText);

                                // SECOND CALL: Action
                                const actionPrompt = `You are VERA. Someone just shared what's overwhelming them about work or life, and they clarified what's really going on. Your job is to give them ONE specific, concrete, doable action — not vague advice.

Rules:
- Be SPECIFIC. Not 'write down your tasks' but 'Open a notes app right now and type the first 3 things that come to mind when you think about what's stressing you.'
- Be IMMEDIATE. Something they can do in the next 5 minutes.
- Be SMALL. The smaller the better. Momentum matters more than magnitude.
- NEVER tell them to 'prioritize' or 'organize' — that's the problem, not the solution.
- Use their clarifying answer to tailor the action to what's really blocking them.

Format:

**Do this right now:**
[One specific action they can take in the next 5 minutes. Be concrete — include exactly what to do, not concepts.]

**Why this works:**
[One sentence — connect it to breaking the freeze/overwhelm and their specific blocker]

**Then, if you want:**
[One optional follow-up step, or offer to help them go deeper: 'Tell me what those 3 things are and I'll help you pick which one to tackle first.']

Tone: Direct, warm, actionable. Like a friend who cuts through the noise and tells you exactly what to do next.`;

                                const actionInput = `${combinedInput}\n\nContext from analysis:\n${analysisText}`;

                                const actionResponse = await fetch('/api/ops/generate', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    systemPrompt: actionPrompt,
                                    userInput: actionInput,
                                    mode: generationMode,
                                    provider: selectedProvider,
                                    taskType: 'worklife-action',
                                    activityId: 'worklife-action',
                                  }),
                                });

                                const actionData = await actionResponse.json();
                                if (!actionResponse.ok) throw new Error(actionData.error || 'Generation failed');

                                setWorkLifeActionOutput(actionData.content || '');
                              } catch (err) {
                                console.error('Work & Life generation error:', err);
                                setWorkLifeAnalysisOutput('Something went wrong. Please try again.');
                                setWorkLifeActionOutput('Something went wrong. Please try again.');
                              } finally {
                                setWorkLifeGenerating(false);
                              }
                            }}
                            disabled={workLifeGenerating || (!workLifeUserChoice && !workLifeCustomAnswer.trim())}
                            style={{
                              padding: '10px 18px',
                              borderRadius: 8,
                              border: 'none',
                              background: (!workLifeUserChoice && !workLifeCustomAnswer.trim())
                                ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(140,110,80,0.2)')
                                : colors.accent,
                              color: (!workLifeUserChoice && !workLifeCustomAnswer.trim()) ? colors.textMuted : 'white',
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: (!workLifeUserChoice && !workLifeCustomAnswer.trim()) ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {workLifeGenerating ? 'Working...' : 'Continue'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* SECTION THREE: ANALYSIS (collapsible) - only in result stage */}
                    {workLifeStage === 'result' && workLifeAnalysisOutput && (
                      <div style={{
                        width: '100%',
                        padding: '18px',
                        borderRadius: 12,
                        background: colors.cardBg,
                        border: `1px solid ${colors.cardBorder}`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showWorkLifeAnalysis ? 12 : 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Analysis
                          </div>
                          <button
                            onClick={() => setShowWorkLifeAnalysis(!showWorkLifeAnalysis)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: 6,
                              border: `1px solid ${colors.cardBorder}`,
                              background: 'transparent',
                              color: colors.textMuted,
                              fontSize: 12,
                              cursor: 'pointer',
                            }}
                          >
                            {showWorkLifeAnalysis ? 'Hide' : 'Show'}
                          </button>
                        </div>
                        {showWorkLifeAnalysis && (
                          <div className="output-area" style={{
                            padding: '16px',
                            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                            borderRadius: 10,
                            color: colors.text,
                            fontSize: 14,
                            lineHeight: 1.6,
                            maxHeight: 350,
                            overflowY: 'auto',
                          }}>
                            <FormattedOutput content={workLifeAnalysisOutput} colors={colors} isDark={isDark} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* SECTION FOUR: YOUR NEXT STEP - only in result stage */}
                    {workLifeStage === 'result' && (
                      <div style={{
                        width: '100%',
                        padding: '18px',
                        borderRadius: 12,
                        background: colors.cardBg,
                        border: `1px solid ${colors.cardBorder}`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Your Next Step
                          </div>
                          <button
                            onClick={() => {
                              handleCopy(workLifeActionOutput || '');
                            }}
                            disabled={!workLifeActionOutput}
                            style={{
                              padding: '6px 10px',
                              borderRadius: 8,
                              border: `1px solid ${colors.cardBorder}`,
                              background: colors.cardBg,
                              cursor: workLifeActionOutput ? 'pointer' : 'default',
                              fontSize: 12,
                              fontWeight: 500,
                              color: workLifeActionOutput ? colors.text : colors.textMuted,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <OpsIcon type="copy" color={colors.accent} />
                            Copy
                          </button>
                        </div>
                        <div className="output-area" style={{
                          padding: '20px',
                          background: colors.cardBg,
                          border: `1px solid ${colors.cardBorder}`,
                          borderRadius: 10,
                          minHeight: 120,
                          maxHeight: 300,
                          overflowY: 'auto',
                          color: colors.text,
                          fontSize: 14,
                          lineHeight: 1.6,
                        }}>
                          {workLifeGenerating && !workLifeActionOutput ? (
                            <div style={{ color: colors.textMuted, fontSize: 13 }}>Generating...</div>
                          ) : workLifeActionOutput ? (
                            <FormattedOutput content={workLifeActionOutput} colors={colors} isDark={isDark} />
                          ) : (
                            <div style={{ color: colors.textMuted, fontSize: 13 }}>Your next step will appear here.</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* SECTION FIVE: GO DEEPER - only in result stage */}
                    {workLifeStage === 'result' && !workLifeGenerating && workLifeActionOutput && workLifeDumpStage === 'initial' && (
                      <div style={{
                        width: '100%',
                        padding: '18px',
                        borderRadius: 12,
                        background: isDark ? 'rgba(194, 154, 108, 0.08)' : 'rgba(194, 154, 108, 0.06)',
                        border: `1px solid ${isDark ? 'rgba(194, 154, 108, 0.2)' : 'rgba(194, 154, 108, 0.15)'}`,
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: colors.accent, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                          Go Deeper
                        </div>
                        <div style={{ fontSize: 14, color: colors.text, marginBottom: 16, lineHeight: 1.6 }}>
                          Want me to actually help? Dump your entire task list here — every email, errand, deadline, &quot;should do&quot;, and mental note. I&apos;ll sort it for you.
                        </div>
                        <textarea
                          value={workLifeDumpInput}
                          onChange={(e) => setWorkLifeDumpInput(e.target.value)}
                          placeholder="Respond to Sarah's email, finish Q3 report, pick up dry cleaning, call mom back, schedule dentist, review that proposal, buy birthday gift, pay bills, update LinkedIn, fix leaky faucet..."
                          style={{
                            width: '100%',
                            minHeight: 140,
                            padding: '14px',
                            borderRadius: 10,
                            border: `1px solid ${inputBorder}`,
                            background: inputBg,
                            color: colors.text,
                            fontSize: 14,
                            lineHeight: 1.6,
                            resize: 'vertical',
                          }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                          <button
                            onClick={async () => {
                              if (!workLifeDumpInput.trim()) return;
                              setWorkLifeSortedGenerating(true);
                              setWorkLifeSortedOutput(null);

                              const sortPrompt = `You are VERA. Someone just dumped their overwhelming list of tasks/worries. Your job is to ACTUALLY SORT IT for them — not give generic advice.

Look at their specific items and categorize them:

**What I see:**
Count the items. Group any that are actually part of the same project. Call out what you notice.

**Not yours to do right now:**
Any items that are waiting on someone else, or aren't actually actionable today. If none, say "Everything here is on you — no waiting on others."

**Quick wins (under 5 min):**
Small tasks they can knock out fast to build momentum. Be specific — use their words.

**The real one:**
Identify the ONE thing that's probably causing the most mental weight — name it specifically from their list.

**Your move:**
Tell them exactly what to do first. Be specific: "Do [specific item] right now. It'll take [X] minutes. Then come back and we'll tackle [the real one]."

Be SPECIFIC to their actual list. Use their exact words. Name their items. Don't be generic.`;

                              console.log('Sorting list:', workLifeDumpInput);
                              try {
                                const res = await fetch('/api/ops/generate', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    activityId: 'worklife-sorted',
                                    systemPrompt: sortPrompt,
                                    userInput: workLifeDumpInput.trim(),
                                    selectedModel: 'claude-3-5-sonnet-20241022',
                                    space: selectedSpace,
                                  }),
                                });
                                console.log('Sort API response:', res);
                                
                                if (!res.ok) {
                                  console.error('Sort API error - status:', res.status);
                                  setWorkLifeSortedOutput(`API error: ${res.status}. Try again.`);
                                  setWorkLifeDumpStage('sorted');
                                  return;
                                }
                                
                                const data = await res.json();
                                console.log('Sort parsed data:', data);
                                
                                // Extract content from response - check various possible fields
                                const sortedContent = data.content || data.response || data.result || data.text || '';
                                
                                if (sortedContent) {
                                  setWorkLifeSortedOutput(sortedContent);
                                  setWorkLifeDumpStage('sorted');
                                } else {
                                  console.error('Sort API - no content found. Full data:', data);
                                  setWorkLifeSortedOutput('No response received. Please try again.');
                                  setWorkLifeDumpStage('sorted');
                                }
                              } catch (err) {
                                console.error('Sort error:', err);
                                setWorkLifeSortedOutput(`Error: ${err instanceof Error ? err.message : 'Unknown error'}. Try again.`);
                                setWorkLifeDumpStage('sorted');
                              } finally {
                                setWorkLifeSortedGenerating(false);
                              }
                            }}
                            disabled={!workLifeDumpInput.trim() || workLifeSortedGenerating}
                            style={{
                              padding: '10px 18px',
                              borderRadius: 8,
                              border: 'none',
                              background: (!workLifeDumpInput.trim() || workLifeSortedGenerating)
                                ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(140,110,80,0.2)')
                                : colors.accent,
                              color: (!workLifeDumpInput.trim() || workLifeSortedGenerating) ? colors.textMuted : 'white',
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: (!workLifeDumpInput.trim() || workLifeSortedGenerating) ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {workLifeSortedGenerating ? 'Sorting...' : 'Sort this for me'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* SECTION SIX: SORTED OUTPUT - only after sorting */}
                    {workLifeStage === 'result' && workLifeDumpStage === 'sorted' && workLifeSortedOutput && (
                      <div style={{
                        width: '100%',
                        padding: '18px',
                        borderRadius: 12,
                        background: colors.cardBg,
                        border: `1px solid ${colors.cardBorder}`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: colors.accent, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Here&apos;s What I See
                          </div>
                          <button
                            onClick={() => handleCopy(workLifeSortedOutput || '')}
                            style={{
                              padding: '6px 10px',
                              borderRadius: 8,
                              border: `1px solid ${colors.cardBorder}`,
                              background: colors.cardBg,
                              cursor: 'pointer',
                              fontSize: 12,
                              fontWeight: 500,
                              color: colors.text,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <OpsIcon type="copy" color={colors.accent} />
                            Copy
                          </button>
                        </div>
                        <div className="output-area" style={{
                          padding: '20px',
                          background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                          borderRadius: 10,
                          color: colors.text,
                          fontSize: 14,
                          lineHeight: 1.7,
                          maxHeight: 450,
                          overflowY: 'auto',
                        }}>
                          <FormattedOutput content={workLifeSortedOutput} colors={colors} isDark={isDark} />
                        </div>
                      </div>
                    )}

                    {/* ACTION BUTTONS - only in result stage */}
                    {workLifeStage === 'result' && (
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button
                          onClick={() => {
                            setWorkLifeInput('');
                            setWorkLifeAnalysisOutput(null);
                            setWorkLifeActionOutput(null);
                            setShowWorkLifeAnalysis(false);
                            setWorkLifeStage('input');
                            setWorkLifeClarifyQuestion('');
                            setWorkLifeClarifyOptions([]);
                            setWorkLifeClarifyInsight('');
                            setWorkLifeUserChoice('');
                            setWorkLifeCustomAnswer('');
                            setWorkLifeDumpStage('initial');
                            setWorkLifeDumpInput('');
                            setWorkLifeSortedOutput(null);
                          }}
                          style={{
                            padding: '10px 20px',
                            borderRadius: 8,
                            border: `1px solid ${isDark ? 'rgb(156 163 175)' : 'rgb(209 213 219)'}`,
                            background: 'transparent',
                            color: isDark ? 'rgb(209 213 219)' : 'rgb(75 85 99)',
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgb(251 191 36)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = isDark ? 'rgb(156 163 175)' : 'rgb(209 213 219)';
                          }}
                        >
                          Start Over
                        </button>
                        <button
                          onClick={async () => {
                            if (workLifeActionOutput) {
                              try {
                                await navigator.clipboard.writeText(workLifeActionOutput);
                              } catch (err) {
                                console.error('Failed to copy:', err);
                              }
                            }
                          }}
                          disabled={!workLifeActionOutput}
                          style={{
                            padding: '10px 20px',
                            borderRadius: 8,
                            border: 'none',
                            background: workLifeActionOutput ? 'rgb(217 119 6)' : (isDark ? 'rgb(55 65 81)' : 'rgb(229 231 235)'),
                            color: workLifeActionOutput ? 'white' : (isDark ? 'rgb(156 163 175)' : 'rgb(107 114 128)'),
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: workLifeActionOutput ? 'pointer' : 'default',
                            boxShadow: workLifeActionOutput ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (workLifeActionOutput) {
                              e.currentTarget.style.background = 'rgb(180 83 9)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (workLifeActionOutput) {
                              e.currentTarget.style.background = 'rgb(217 119 6)';
                            }
                          }}
                        >
                          Copy Response
                        </button>
                        <button
                          onClick={() => {
                            if (!workLifeActionOutput) return;
                            const title = 'Work & Life - ' + (workLifeInput.trim().slice(0, 50) || 'Next Step');
                            const saved: SavedOutput = {
                              id: `${Date.now()}`,
                              space: selectedSpace || 'General',
                              timestamp: new Date().toISOString(),
                              activityId: 'worklife-orchestrator',
                              text: `${title}\n\n${workLifeActionOutput.trim()}`,
                            };
                            try {
                              const key = 'vera.savedOutputs.v1';
                              const existingRaw = localStorage.getItem(key);
                              const existing: SavedOutput[] = existingRaw ? JSON.parse(existingRaw) : [];
                              existing.unshift(saved);
                              localStorage.setItem(key, JSON.stringify(existing));
                              setSaveState('saved');
                              setTimeout(() => setSaveState('idle'), 2000);
                            } catch (err) {
                              console.error('Save error:', err);
                              setSaveState('error');
                              setTimeout(() => setSaveState('idle'), 2000);
                            }
                          }}
                          disabled={!workLifeActionOutput}
                          style={{
                            padding: '10px 20px',
                            borderRadius: 8,
                            border: '1px solid rgb(245 158 11)',
                            background: saveState === 'saved' ? 'rgb(245 158 11)' : 'transparent',
                            color: saveState === 'saved' ? 'white' : 'rgb(245 158 11)',
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: workLifeActionOutput ? 'pointer' : 'default',
                            opacity: workLifeActionOutput ? 1 : 0.5,
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (workLifeActionOutput && saveState === 'idle') {
                              e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (workLifeActionOutput && saveState === 'idle') {
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          {saveState === 'saved' ? 'Saved!' : saveState === 'error' ? 'Error' : 'Save'}
                        </button>
                        <button
                          onClick={() => router.push('/sanctuary')}
                          style={{
                            padding: '10px 20px',
                            borderRadius: 8,
                            border: '1px solid rgb(251 191 36)',
                            background: 'transparent',
                            color: 'rgb(251 191 36)',
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(251, 191, 36, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          Talk to VERA
                        </button>
                      </div>
                    )}

                    {/* DISCLAIMER */}
                    <div style={{
                      textAlign: 'center',
                      marginTop: 24,
                      fontSize: 11,
                      color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(60,50,45,0.4)',
                      lineHeight: 1.5,
                    }}>
                      VERA is a decision-support tool, not a substitute for professional advice. Trust your own judgment and seek professional help when needed.
                    </div>
                  </div>
                </div>
              </>
            ) : selectedAction.id === 'money-orchestrator' ? (
              <MoneyOrchestrator
                colors={colors}
                isDark={isDark}
              />
            ) : selectedAction.id === 'thinking-orchestrator' ? (
              <ThinkingOrchestrator
                colors={colors}
                isDark={isDark}
              />
            ) : selectedAction.id === 'wellness-orchestrator' ? (
              <WellnessOrchestrator
                colors={colors}
                isDark={isDark}
              />
            ) : selectedAction?.id === 'appkit-orchestrator' ? (
              <AppKitOrchestrator
                colors={colors}
                isDark={isDark}
              />
            ) : selectedAction.type === 'dropdown' && !selectedDropdownOption && selectedAction.id !== 'respond' && selectedAction.id !== 'boundaries' && selectedAction.id !== 'write-email' && selectedAction.id !== 'social-post' && selectedAction.id !== 'career' ? (
              <div style={{ width: '100%', maxWidth: 600, animation: 'fadeIn 0.4s ease-out' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 300, color: colors.text, marginBottom: 8 }}>
                    {selectedAction.title}
                  </h2>
                  <p style={{ fontSize: 14, color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(30,30,30,0.7)' }}>{selectedAction.description}</p>
                </div>
                <div style={{ height: 1, background: isDark ? 'rgba(235, 210, 180, 0.12)' : 'rgba(140, 110, 80, 0.12)', margin: '0 0 18px 0' }} />
                <div style={{ display: 'grid', gap: 12 }}>
                  {selectedAction.dropdownOptions?.map((option) => (
                    <button
                      key={option.id}
                      className="card-btn"
                      onClick={() => handleSelectDropdownOption(option)}
                      style={{
                        padding: '18px 20px',
                        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.85)',
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: 14,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                      }}
                    >
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isDark ? 'rgba(255, 180, 100, 0.1)' : 'rgba(200, 160, 100, 0.12)',
                        border: `1px solid ${isDark ? 'rgba(255, 180, 100, 0.18)' : 'rgba(200, 160, 100, 0.2)'}`,
                        flexShrink: 0,
                      }}>
                        <OpsIcon type={option.icon} color={colors.accent} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: colors.text, marginBottom: 4 }}>
                          {option.label}
                        </div>
                        <div style={{ fontSize: 13, color: colors.textMuted }}>
                          {option.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <DynamicForm
                action={selectedAction.id === 'create'
                  ? {
                      ...createSharedAction,
                      placeholder: selectedCreateOption?.placeholder || selectedCreateActivity?.placeholder || createSharedAction.placeholder,
                      fields: selectedCreateOption?.fields || selectedCreateActivity?.fields,
                    }
                  : (selectedAction.id === 'write-email' || selectedAction.id === 'social-post')
                  ? {
                      ...selectedAction,
                      placeholder: selectedCreateOption?.placeholder || selectedCreateActivity?.placeholder || selectedAction.placeholder,
                      fields: selectedCreateOption?.fields || selectedCreateActivity?.fields,
                    }
                  : (selectedDropdownOption ? {
                      ...selectedAction,
                      title: selectedDropdownOption.label,
                      description: selectedDropdownOption.description,
                      placeholder: selectedDropdownOption.placeholder,
                      fields: selectedDropdownOption.fields,
                    } : selectedAction)
                }
                activeOptionId={selectedDropdownOption?.id}
                output={output}
                simpleInput={simpleInput}
                formFields={formFields}
                onSimpleInputChange={setSimpleInput}
                onFormFieldChange={handleFormFieldChange}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                isValid={isFormValid()}
                colors={colors}
                isDark={isDark}
                onDecodeEntryChange={setDecodeEntryType}
                respondMode={respondMode}
                onRespondModeChange={setRespondMode}
                boundaryMode={boundaryMode}
                onBoundaryModeChange={setBoundaryMode}
                boundaryTone={boundaryTone}
                onBoundaryToneChange={setBoundaryTone}
                boundaryDelivery={boundaryDelivery}
                onBoundaryDeliveryChange={setBoundaryDelivery}
                workLifeMode={workLifeMode}
                onWorkLifeModeChange={(modeId) => {
                  setWorkLifeMode(modeId);
                  const activity = workLifeGroupedActivities.find((item) => item.id === modeId);
                  if (activity) {
                    setSelectedAction(activity);
                    setSelectedDropdownOption(null);
                    setFormFields({});
                    setSimpleInput('');
                  }
                }}
                workLifeActivities={workLifeGroupedActivities}
                workLifeTone={workLifeTone}
                onWorkLifeToneChange={setWorkLifeTone}
                workLifeContext={workLifeContext}
                onWorkLifeContextChange={setWorkLifeContext}
                workLifeSecondaryMode={workLifeSecondaryMode}
                onWorkLifeSecondaryModeChange={setWorkLifeSecondaryMode}
                thinkingMode={thinkingMode}
                onThinkingModeChange={setThinkingMode}
                thinkingStyle={thinkingStyle}
                onThinkingStyleChange={setThinkingStyle}
                thinkingDepth={thinkingDepth}
                onThinkingDepthChange={setThinkingDepth}
                thinkingSecondaryMode={thinkingSecondaryMode}
                onThinkingSecondaryModeChange={setThinkingSecondaryMode}
                moneyMode={moneyMode}
                onMoneyModeChange={(modeId) => {
                  setMoneyMode(modeId);
                  const activity = moneyActivities.find((item) => item.id === modeId);
                  if (activity) {
                    setSelectedAction(activity);
                    setSelectedDropdownOption(null);
                    setFormFields({});
                    setSimpleInput('');
                  }
                }}
                moneyActivities={moneyActivities}
                moneyPerspective={moneyPerspective}
                onMoneyPerspectiveChange={setMoneyPerspective}
                moneyScope={moneyScope}
                onMoneyScopeChange={setMoneyScope}
                moneyContext={moneyContext}
                onMoneyContextChange={setMoneyContext}
                moneySecondaryMode={moneySecondaryMode}
                onMoneySecondaryModeChange={setMoneySecondaryMode}
                relationshipMode={relationshipMode}
                onRelationshipModeChange={setRelationshipMode}
                relationshipTone={relationshipTone}
                onRelationshipToneChange={setRelationshipTone}
                relationshipDepth={relationshipDepth}
                onRelationshipDepthChange={setRelationshipDepth}
                focusMode={focusMode}
                onFocusModeChange={(modeId) => setFocusMode(modeId as FocusMode)}
                createActivities={selectedAction.id === 'create' ? createSharedActivities : createDropdownActivities}
                createActivityId={createActivityId}
                onCreateActivityChange={(id) => {
                  setCreateActivityId(id);
                  setCreateOptionId('');
                  setFormFields({});
                  setSimpleInput('');
                }}
                createOptionId={createOptionId}
                onCreateOptionChange={(id) => {
                  setCreateOptionId(id);
                  setFormFields({});
                  setSimpleInput('');
                }}
                careerTone={careerTone}
                onCareerToneChange={setCareerTone}
                onSelectDropdownOption={handleSelectDropdownOption}
              />
            )
          )}

          {(isGenerating || output) && !compareOutputs && selectedAction?.id !== 'language-learning' && selectedAction?.id !== 'communication-orchestrator' && selectedAction?.id !== 'worklife-orchestrator' && !(selectedAction?.id === 'career' && selectedDropdownOption?.id === 'application-kit') && (
            <div ref={outputRef} style={{ width: '100%', maxWidth: 700, marginTop: 24, animation: 'fadeIn 0.4s ease-out' }}>
              <div style={{ height: 1, background: separatorColor, marginBottom: 16 }} />

              {isGenerating && !output ? (
                <div style={{ padding: '16px', borderRadius: 16, background: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px', borderRadius: 14, background: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
                    <div className="generating" style={{ width: 20, height: 20, borderRadius: '50%' }} />
                    <p style={{ fontSize: 14, color: colors.textMuted, margin: 0 }}>
                      {generationMode === 'compare' ? 'Generating from all 3 AIs...' :
                       generationMode === 'consensus' ? 'Getting consensus from all AIs...' :
                       generationMode === 'review-chain' ? 'Running review chain...' :
                       'Generating...'}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ padding: '16px', borderRadius: 16, background: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
                    <div className="output-area" style={{ 
                      padding: '28px', 
                      background: colors.cardBg, 
                      border: `1px solid ${colors.cardBorder}`, 
                      borderRadius: 16, 
                      maxHeight: '60vh', 
                      overflowY: 'auto',
                      boxShadow: isDark ? 'none' : '0 2px 12px rgba(0, 0, 0, 0.08)' 
                    }}>
                      <FormattedOutput
                        content={output || ''}
                        colors={colors}
                        isDark={isDark}
                        showSignatureBadge={selectedAction?.id === 'decode-message'}
                      />
                    </div>
                    {selectedAction?.id === 'decode-message' && coreMove && (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ height: 1, background: separatorColor, marginBottom: 12 }} />
                        <div style={{
                          fontSize: 14,
                          color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(35,30,25,0.8)',
                          lineHeight: 1.6,
                        }}>
                          {coreMove}
                        </div>
                      </div>
                    )}
                    {selectedAction?.id === 'decode-message' && timeOrientation && (
                      <div style={{ marginTop: 10 }}>
                        <div style={{
                          fontSize: 12,
                          color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(35,30,25,0.65)',
                          lineHeight: 1.6,
                        }}>
                          {timeOrientation}
                        </div>
                      </div>
                    )}
                    {selectedAction?.id === 'decode-message' && signalLayer && (
                      <div style={{ marginTop: 16 }}>
                        <div style={{
                          fontSize: 11,
                          color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(40,35,30,0.5)',
                          marginBottom: 6,
                        }}>
                          Signal layer
                        </div>
                        <div style={{
                          fontSize: 13,
                          color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(35,30,25,0.7)',
                          lineHeight: 1.6,
                        }}>
                          {signalLayer}
                        </div>
                      </div>
                    )}

                    {selectedAction?.id === 'decode-message' && (
                      <div style={{ marginTop: 14 }}>
                        <button
                          onClick={() => setShowWhatsMissing((prev) => !prev)}
                          style={{
                            padding: '6px 0',
                            border: 'none',
                            background: 'transparent',
                            color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(40,35,30,0.55)',
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          What’s Missing
                        </button>
                        {showWhatsMissing && (
                          <div style={{ marginTop: 8 }}>
                            {whatsMissing.map((line, idx) => (
                              <div key={idx} style={{
                                fontSize: 12,
                                color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(35,30,25,0.7)',
                                lineHeight: 1.6,
                                marginBottom: 6,
                              }}>
                                {line}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {selectedAction?.id === 'decode-message' && (
                      <div style={{ marginTop: 12 }}>
                        <button
                          onClick={() => setShowCleanContrast((prev) => !prev)}
                          style={{
                            padding: '6px 0',
                            border: 'none',
                            background: 'transparent',
                            color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(40,35,30,0.55)',
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          If this were straightforward
                        </button>
                        {showCleanContrast && (
                          <div style={{
                            marginTop: 8,
                            fontSize: 12,
                            color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(35,30,25,0.7)',
                            lineHeight: 1.6,
                          }}>
                            {cleanContrast}
                          </div>
                        )}
                      </div>
                    )}

                    {selectedAction?.id === 'decode-message' && output && (
                      <div style={{ marginTop: 12, fontSize: 12, color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(35,30,25,0.65)', lineHeight: 1.6 }}>
                        Waiting does not remove options.
                      </div>
                    )}

                    {selectedAction?.id === 'decode-message' && output && isDirectedDecode(decodeEntryType) && hasResponsePressure() && (
                      <div style={{ marginTop: 14 }}>
                        <div style={{
                          fontSize: 11,
                          color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(40,35,30,0.5)',
                          marginBottom: 6,
                        }}>
                          Available next steps, if useful
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleHandoff('quick-reply')}
                            style={{
                              padding: '8px 12px',
                              borderRadius: 999,
                              border: `1px solid ${colors.cardBorder}`,
                              background: 'transparent',
                              color: colors.textMuted,
                              fontSize: 12,
                              cursor: 'pointer',
                            }}
                          >
                            Draft a reply
                          </button>
                          <button
                            onClick={() => handleHandoff('devil-advocate')}
                            style={{
                              padding: '8px 12px',
                              borderRadius: 999,
                              border: `1px solid ${colors.cardBorder}`,
                              background: 'transparent',
                              color: colors.textMuted,
                              fontSize: 12,
                              cursor: 'pointer',
                            }}
                          >
                            Test the logic
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '16px', borderRadius: 16, background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, marginTop: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: output ? 16 : 0 }}>
                      {/* Provider identity removed - VERA only voice */}
                      <button onClick={() => handleCopy()} style={{ padding: '10px 16px', borderRadius: 50, border: `1px solid ${colors.cardBorder}`, background: colors.cardBg, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: colors.text, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <OpsIcon type={copied ? 'check' : 'copy'} color={colors.accent} />
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    {output && (
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
                        <select
                          value={selectedSpace}
                          onChange={(e) => setSelectedSpace(e.target.value as Space)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 10,
                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.25)' : colors.cardBorder}`,
                            background: isDark ? 'rgba(255,255,255,0.08)' : colors.cardBg,
                            color: colors.text,
                            fontSize: 13,
                            cursor: 'pointer',
                          }}
                          aria-label="Space"
                        >
                          {SPACES.map((space) => (
                            <option key={space} value={space}>
                              {space}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={saveOutput}
                          disabled={!selectedAction?.allowSave}
                          style={{
                            padding: '8px 14px',
                            borderRadius: 10,
                            border: 'none',
                            background: selectedAction?.allowSave ? colors.accent : (isDark ? 'rgba(255,255,255,0.16)' : 'rgba(140,110,80,0.2)'),
                            color: selectedAction?.allowSave ? 'white' : colors.textMuted,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: selectedAction?.allowSave ? 'pointer' : 'not-allowed',
                          }}
                        >
                          {saveState === 'saved' ? 'Saved' : saveState === 'error' ? 'Save failed' : 'Save insight'}
                        </button>
                      </div>
                    )}
                    <button onClick={handleReset} style={{ padding: '14px', borderRadius: 50, border: 'none', background: colors.accent, color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                      Start Over
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {compareOutputs && (
            <div style={{ width: '100%', maxWidth: 900, animation: 'fadeIn 0.4s ease-out' }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: colors.text, marginBottom: 20, textAlign: 'center' }}>Compare Results</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                {compareOutputs.map(({ provider, content }, index) => (
                  <div key={provider} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 50, fontSize: 13, fontWeight: 500, color: colors.text }}>
                        Version {index + 1}
                      </div>
                      <button onClick={() => handleCopy(content)} style={{ padding: '8px 12px', borderRadius: 50, border: `1px solid ${colors.cardBorder}`, background: colors.cardBg, cursor: 'pointer', fontSize: 12, fontWeight: 500, color: colors.text }}>
                        <OpsIcon type="copy" color={colors.accent} />
                      </button>
                    </div>
                    <div className="output-area" style={{ 
                      padding: '24px', 
                      background: colors.cardBg, 
                      border: `1px solid ${colors.cardBorder}`, 
                      borderRadius: 14, 
                      maxHeight: '50vh', 
                      overflowY: 'auto', 
                      flex: 1,
                      boxShadow: isDark ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.06)' 
                    }}>
                      <FormattedOutput
                        content={content}
                        colors={colors}
                        isDark={isDark}
                        showSignatureBadge={selectedAction?.id === 'decode-message'}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleReset} style={{ marginTop: 20, padding: '14px', borderRadius: 50, border: 'none', background: colors.accent, color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                Start Over
              </button>
            </div>
          )}
        </div>

        <ModeSelector
          isOpen={showModeSelector}
          onClose={() => setShowModeSelector(false)}
          selectedMode={generationMode}
          onSelectMode={setGenerationMode}
          selectedProvider={selectedProvider}
          onSelectProvider={setSelectedProvider}
          colors={colors}
          isDark={isDark}
        />
      </div>
    </>
  );
}
