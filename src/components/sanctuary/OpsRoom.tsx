'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
import { WorkLifeOrchestrator } from './orchestrators/WorkLifeOrchestrator';
import { CommunicationOrchestrator } from './orchestrators/CommunicationOrchestrator';
import { createStyles } from './styles/opsRoom.styles';
import { GLOBAL_STYLES, GENERATION_MODES, AI_PROVIDERS, SPACES, type Space } from './constants/opsRoom.constants';
import { type SavedOutput, type FocusMode, type AccessTier } from './types/opsRoom.types';
import { logError, safeLocalStorage, safeCopyToClipboard, handleApiResponse, DEFAULT_ERROR_MESSAGE } from './utils/errorHandler';
import { useOpsRoomEffects } from './hooks/useOpsRoomEffects';
import {
  thinkingAction,
  wellnessAction,
  appKitAction,
  createSharedAction,
  createAction,
  relationshipsAction,
  communicationAction,
  workLifeAction,
  moneyAction,
} from './data/activities';

interface OpsRoomProps {
  onBack: () => void;
  initialView?: string;
  initialCategory?: string;
  initialActivity?: string;
  initialOption?: string;
}

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

  const normalizeCategoryFromView = useCallback((view?: string): { category: string; actionId?: string; languageTab?: 'learn' | 'translate' } | null => {
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
  }, []);

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

      const decodeData = await handleApiResponse(decodeResponse) as { content?: string };

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

      const respondData = await handleApiResponse(respondResponse) as { content?: string };
      setCommunicationRespondOutput(respondData.content || '');
    } catch (error) {
      logError(error, { operation: 'communicationGenerate', activityId: 'decode-message' });
      setCommunicationDecodeOutput(DEFAULT_ERROR_MESSAGE);
      setCommunicationRespondOutput(DEFAULT_ERROR_MESSAGE);
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
      const existing: SavedOutput[] = safeLocalStorage<SavedOutput[]>('get', key) || [];
      existing.unshift(saved);
      safeLocalStorage('set', key, existing);
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 1500);
    } catch (err) {
      logError(err, { operation: 'saveOutput', activityId });
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

      const data = await handleApiResponse(response) as { content?: string; provider?: AIProvider; responses?: { provider: AIProvider; content: string }[] };

      if (generationMode === 'compare' && data.responses) {
        setCompareOutputs(data.responses);
      } else {
        setOutput(data.content || '');
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
      logError(err, { operation: 'handleGenerate', activityId: selectedAction.id, provider: selectedProvider });
      setOutput(DEFAULT_ERROR_MESSAGE);
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

  // Use centralized effects hook
  useOpsRoomEffects({
    setAccessTier,
    setTimeOfDay,
    setIsLoaded,
    setActiveCategory,
    setSelectedAction,
    setSelectedDropdownOption,
    setFormFields,
    setSimpleInput,
    setCreateActivityId,
    setCreateOptionId,
    setWorkLifeMode,
    setMoneyMode,
    initialView,
    initialCategory,
    initialActivity,
    initialOption,
    activeCategory,
    selectedAction,
    isGenerating,
    simpleInput,
    respondMode,
    output,
    createActivityId,
    communicationAction,
    thinkingAction,
    workLifeAction,
    moneyAction,
    wellnessAction,
    createSharedAction,
    handleGenerate,
    normalizeCategoryFromView,
    isWorkLifeGroupedActivity,
    isMoneyActivity,
    defaultWorkLifeId,
  });

  const handleCopy = async (text?: string) => {
    const textToCopy = text || output;
    if (!textToCopy) return;
    await safeCopyToClipboard(textToCopy);
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

  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
    <>
      <style jsx global>{GLOBAL_STYLES}</style>

      <div style={styles.container}>
        {/* Ambient Background */}
        <div style={styles.ambientBackground}>
          <div style={styles.ambientGradient} />
        </div>

        {/* Header */}
        <header style={styles.header}>
          <button onClick={handleBack} style={styles.backButton}>
            <OpsIcon type="arrow-left" color={colors.textMuted} />
            <span>Back</span>
          </button>

          <div style={styles.themeButtonContainer}>
            {['light', 'auto', 'dark'].map((theme) => (
              <button
                key={theme}
                onClick={() => setManualTheme(theme as ThemeMode)}
                style={styles.themeButton(manualTheme === theme)}
              >
                {theme}
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <div style={styles.contentArea(isLoaded)}>
          {!activeCategory && !selectedAction && !output && !compareOutputs && (
            <>
              <div style={styles.welcomeContainer}>
                <h1 style={styles.welcomeTitle}>Focus</h1>
                <p style={styles.welcomeSubtitle}>Select a category from the sidebar to get started</p>
              </div>

              <ProviderSelector
                selectedMode={generationMode}
                selectedProvider={selectedProvider}
                onOpenModeSelector={() => setShowModeSelector(true)}
                colors={colors}
                isDark={isDark}
              />
              <div style={styles.cardContainer}>
                <div style={styles.card}>
                  <div style={styles.cardLabel}>
                    FOCUS
                  </div>
                  <div style={styles.buttonGrid}>
                    {focusModes.map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setFocusMode(mode.id)}
                        style={styles.pillButton(focusMode === mode.id)}
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
              <div style={styles.cardContainer}>
                <div style={styles.card}>
                  <div style={styles.cardLabel}>
                    FOCUS
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {focusModes.map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setFocusMode(mode.id)}
                        style={styles.pillButton(focusMode === mode.id)}
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
              <CommunicationOrchestrator
                colors={colors}
                isDark={isDark}
              />
            ) : selectedAction.id === 'worklife-orchestrator' ? (
              <WorkLifeOrchestrator
                colors={colors}
                isDark={isDark}
              />
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
