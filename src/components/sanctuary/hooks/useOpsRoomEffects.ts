import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { getTimeOfDay } from '@/lib/ops/theme';
import { opsRoom } from '@/app/sanctuary/ops/consolidatedData';
import { logError } from '../utils/errorHandler';
import type { AccessTier } from '../types/opsRoom.types';
import type { TimeOfDay } from '@/lib/ops/types';

interface UseOpsRoomEffectsParams {
  // State setters
  setAccessTier: Dispatch<SetStateAction<AccessTier | null>>;
  setTimeOfDay: Dispatch<SetStateAction<TimeOfDay>>;
  setIsLoaded: Dispatch<SetStateAction<boolean>>;
  setActiveCategory: Dispatch<SetStateAction<string | null>>;
  setSelectedAction: (action: any) => void;
  setSelectedDropdownOption: (option: any) => void;
  setFormFields: (fields: any) => void;
  setSimpleInput: (input: string) => void;
  setCreateActivityId: (id: string) => void;
  setCreateOptionId: (id: string) => void;
  setWorkLifeMode: (mode: string) => void;
  setMoneyMode: (mode: string) => void;
  
  // Initial props
  initialView?: string;
  initialCategory?: string;
  initialActivity?: string;
  initialOption?: string;
  
  // Current state
  activeCategory: string | null;
  selectedAction: any;
  isGenerating: boolean;
  simpleInput: string;
  respondMode: string;
  output: string | null;
  createActivityId: string;
  
  // Actions
  communicationAction: any;
  thinkingAction: any;
  workLifeAction: any;
  moneyAction: any;
  wellnessAction: any;
  createSharedAction: any;
  handleGenerate: () => void;
  
  // Helper functions
  normalizeCategoryFromView: (view?: string) => { category: string; actionId?: string; languageTab?: 'learn' | 'translate' } | null;
  isWorkLifeGroupedActivity: (id?: string | null) => boolean;
  isMoneyActivity: (id?: string | null) => boolean;
  defaultWorkLifeId: string;
}

export function useOpsRoomEffects({
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
}: UseOpsRoomEffectsParams) {
  
  // Effect 1: Fetch user tier
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
      } catch (error) {
        logError(error, { operation: 'fetchTier' });
        if (!isMounted) setAccessTier(null);
      }
    };
    fetchTier();
    return () => {
      isMounted = false;
    };
  }, [setAccessTier]);

  // Effect 2: Initialize time and theme
  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
    setTimeout(() => setIsLoaded(true), 100);
    const interval = setInterval(() => setTimeOfDay(getTimeOfDay()), 60000);
    return () => clearInterval(interval);
  }, [setTimeOfDay, setIsLoaded]);

  // Effect 3: Handle initialView navigation
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
  }, [initialView, normalizeCategoryFromView, setActiveCategory, setSelectedAction]);

  // Effect 4: Handle direct navigation from sidebar (category + activity + option)
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
  }, [
    initialCategory,
    initialActivity,
    initialOption,
    communicationAction,
    createSharedAction,
    isWorkLifeGroupedActivity,
    isMoneyActivity,
    defaultWorkLifeId,
    setActiveCategory,
    setSelectedAction,
    setSelectedDropdownOption,
    setFormFields,
    setSimpleInput,
    setCreateActivityId,
    setCreateOptionId,
    setWorkLifeMode,
    setMoneyMode,
  ]);

  // Effect 5: Auto-select thinking orchestrator when entering thinking-learning category
  useEffect(() => {
    if (activeCategory !== 'thinking-learning') return;
    const currentId = selectedAction?.id;
    if (currentId === 'thinking-orchestrator') return;
    if (currentId === 'language-learning') return;
    setSelectedAction(thinkingAction);
    setSelectedDropdownOption(null);
    setFormFields({});
    setSimpleInput('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, thinkingAction]);

  // Effect 6: Auto-select work-life orchestrator when entering work-life category
  useEffect(() => {
    if (activeCategory !== 'work-life') return;
    if (selectedAction?.id === 'worklife-orchestrator') return;
    setSelectedAction(workLifeAction);
    setSelectedDropdownOption(null);
    setFormFields({});
    setSimpleInput('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, workLifeAction]);

  // Effect 7: Auto-select money orchestrator when entering money category
  useEffect(() => {
    if (activeCategory !== 'money') return;
    if (selectedAction?.id === 'money-orchestrator') return;
    setSelectedAction(moneyAction);
    setSelectedDropdownOption(null);
    setFormFields({});
    setSimpleInput('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, moneyAction]);

  // Effect 8: Auto-select wellness orchestrator when entering relationships-wellness category
  useEffect(() => {
    if (activeCategory !== 'relationships-wellness') return;
    if (selectedAction?.id === 'wellness-orchestrator') return;
    setSelectedAction(wellnessAction);
    setSelectedDropdownOption(null);
    setFormFields({});
    setSimpleInput('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, wellnessAction]);

  // Effect 9: Auto-select communication orchestrator when entering communication category
  useEffect(() => {
    if (activeCategory !== 'communication') return;
    if (selectedAction?.id === 'communication-orchestrator') return;
    setSelectedAction(communicationAction);
    setSelectedDropdownOption(null);
    setFormFields({});
    setSimpleInput('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, communicationAction]);

  // Effect 10: Handle create category default activity
  useEffect(() => {
    if (activeCategory !== 'create') return;
    const currentId = selectedAction?.id;
    if (currentId === 'create') return;
    if (currentId === 'write-email') return;
    if (currentId === 'social-post') return;
    if (currentId === 'bio-about') return;
    if (currentId === 'creative-writing') return;
    const sharedCreateIds = new Set(['bio-about', 'creative-writing']);
    if (!sharedCreateIds.has(createActivityId)) {
      setCreateActivityId('bio-about');
      setCreateOptionId('');
    }
    setSelectedAction(createSharedAction);
    setSelectedDropdownOption(null);
    setFormFields({});
    setSimpleInput('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, createActivityId, createSharedAction]);

  // Effect 11: Auto-generate on respond mode change
  useEffect(() => {
    if (!selectedAction || selectedAction.id !== 'respond') return;
    if (!simpleInput.trim()) return;
    if (isGenerating) return;
    if (!respondMode) return;
    if (output !== null) {
      handleGenerate();
    }
  }, [respondMode, selectedAction, simpleInput, isGenerating, output, handleGenerate]);
}
