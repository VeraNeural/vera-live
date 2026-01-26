import { useEffect, useRef } from 'react';
import { getTimeOfDay } from '@/lib/ops/theme';
import { opsRoom } from '@/app/sanctuary/ops/consolidatedData';
import { logError } from '../utils/errorHandler';
import type { AccessTier } from '../types/opsRoom.types';
import type { TimeOfDay } from '@/lib/ops/types';

interface UseOpsRoomEffectsParams {
  // State setters
  setAccessTier: (tier: AccessTier | null) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  setIsLoaded: (loaded: boolean) => void;
  setActiveCategory: (category: string | null) => void;
  setSelectedAction: (action: any) => void;
  setSelectedDropdownOption: (option: any) => void;
  setFormFields: (fields: any) => void;
  setSimpleInput: (input: string) => void;
  setCreateActivityId: (id: string) => void;
  setCreateOptionId: (id: string) => void;
  setWorkLifeMode: (mode: string) => void;
  setMoneyMode: (mode: string) => void;
  
  // Initial props (from URL/navigation)
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
  
  // Action objects
  communicationAction: any;
  thinkingAction: any;
  workLifeAction: any;
  moneyAction: any;
  wellnessAction: any;
  createSharedAction: any;
  
  // Functions (we'll access via ref to avoid dependency issues)
  handleGenerate: () => void;
  normalizeCategoryFromView: (view?: string) => { category: string; actionId?: string; languageTab?: 'learn' | 'translate' } | null;
  isWorkLifeGroupedActivity: (id?: string | null) => boolean;
  isMoneyActivity: (id?: string | null) => boolean;
  defaultWorkLifeId: string;
}

export function useOpsRoomEffects(params: UseOpsRoomEffectsParams) {
  // Store all params in a ref to access latest values without causing re-renders
  const paramsRef = useRef(params);
  paramsRef.current = params;

  // Track if initial navigation has been handled
  const initialNavigationDone = useRef(false);

  // Effect 1: Fetch user tier (runs once on mount)
  useEffect(() => {
    let isMounted = true;
    const fetchTier = async () => {
      try {
        const res = await fetch('/api/user/tier');
        const data = await res.json();
        const tier = typeof data?.tier === 'string' ? data.tier.toLowerCase() : 'free';
        if (!isMounted) return;
        if (tier === 'anonymous' || tier === 'free' || tier === 'forge' || tier === 'sanctuary') {
          paramsRef.current.setAccessTier(tier as AccessTier);
        } else {
          paramsRef.current.setAccessTier('free');
        }
      } catch (error) {
        logError(error, { operation: 'fetchTier' });
        if (isMounted) paramsRef.current.setAccessTier(null);
      }
    };
    fetchTier();
    return () => { isMounted = false; };
  }, []);

  // Effect 2: Initialize time and theme (runs once on mount)
  useEffect(() => {
    paramsRef.current.setTimeOfDay(getTimeOfDay());
    setTimeout(() => paramsRef.current.setIsLoaded(true), 100);
    const interval = setInterval(() => {
      paramsRef.current.setTimeOfDay(getTimeOfDay());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Effect 3: Handle initial navigation from URL or sidebar (runs once on mount)
  useEffect(() => {
    if (initialNavigationDone.current) return;
    initialNavigationDone.current = true;

    const { 
      initialView, initialCategory, initialActivity, initialOption,
      setActiveCategory, setSelectedAction, setSelectedDropdownOption,
      setFormFields, setSimpleInput, setCreateActivityId, setCreateOptionId,
      setWorkLifeMode, setMoneyMode, 
      communicationAction, thinkingAction, workLifeAction, 
      moneyAction, wellnessAction, createSharedAction, defaultWorkLifeId
    } = paramsRef.current;

    // Handle initialView (from URL path like /ops/communication)
    if (initialView) {
      const v = initialView.toLowerCase().trim();
      if (v) {
        // Direct category IDs
        const category = opsRoom.categories.find((c) => c.id === v);
        if (category) {
          setActiveCategory(v);
          // Auto-select orchestrator for certain categories
          const orchestratorMap: Record<string, any> = {
            'communication': communicationAction,
            'thinking-learning': thinkingAction,
            'work-life': workLifeAction,
            'money': moneyAction,
            'relationships-wellness': wellnessAction,
            'create': createSharedAction,
          };
          const orchestrator = orchestratorMap[v];
          if (orchestrator) {
            setSelectedAction(orchestrator);
            setSelectedDropdownOption(null);
            setFormFields({});
            setSimpleInput('');
            if (v === 'create') setCreateActivityId('bio-about');
          }
          return;
        }
        
        // Map old names to new
        const categoryMap: Record<string, string> = {
          'communication': 'communication',
          'work-career': 'work-life',
          'work': 'work-life',
          'get-unstuck': 'work-life',
          'money-finance': 'money',
          'money': 'money',
          'planning-goals': 'work-life',
          'planning': 'work-life',
          'learning-growth': 'thinking-learning',
          'learning': 'thinking-learning',
          'reflect-connect': 'relationships-wellness',
          'relationships': 'relationships-wellness',
          'creativity': 'create',
          'content': 'create',
        };
        
        if (categoryMap[v]) {
          setActiveCategory(categoryMap[v]);
        }
      }
      return;
    }

    // Handle initialCategory/Activity/Option (from sidebar deep linking)
    if (initialCategory) {
      const category = opsRoom.categories.find(c => c.id === initialCategory);
      if (!category) return;
      
      setActiveCategory(initialCategory);
      
      // Communication always uses orchestrator
      if (initialCategory === 'communication') {
        setSelectedAction(communicationAction);
        setSelectedDropdownOption(null);
        setFormFields({});
        setSimpleInput('');
        return;
      }
      
      if (!initialActivity) {
        // No specific activity, auto-select orchestrator
        const orchestratorMap: Record<string, any> = {
          'thinking-learning': thinkingAction,
          'work-life': workLifeAction,
          'money': moneyAction,
          'relationships-wellness': wellnessAction,
          'create': createSharedAction,
        };
        const orchestrator = orchestratorMap[initialCategory];
        if (orchestrator) {
          setSelectedAction(orchestrator);
          setSelectedDropdownOption(null);
          setFormFields({});
          setSimpleInput('');
          if (initialCategory === 'create') setCreateActivityId('bio-about');
        }
        return;
      }
      
      const activity = category.activities.find(a => a.id === initialActivity);
      if (!activity) return;
      
      // Handle Create category specially
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
      
      // Handle Work-Life category
      if (initialCategory === 'work-life' && activity.id !== 'career') {
        const workLifeGrouped = ['stress-overwhelm', 'resume-cover', 'task-breakdown', 'decision-helper', 'get-unstuck'];
        const nextId = workLifeGrouped.includes(activity.id) ? activity.id : defaultWorkLifeId;
        setWorkLifeMode(nextId);
        setSelectedAction(workLifeAction);
        setSelectedDropdownOption(null);
        setFormFields({});
        setSimpleInput('');
        return;
      }
      
      // Handle Money category
      if (initialCategory === 'money') {
        const moneyActivities = ['budget-check', 'savings-goal', 'decision-helper', 'money-conversations'];
        if (moneyActivities.includes(activity.id)) {
          setMoneyMode(activity.id);
          setSelectedAction(moneyAction);
          setSelectedDropdownOption(null);
          setFormFields({});
          setSimpleInput('');
          return;
        }
      }
      
      // Default: select the activity directly
      setSelectedAction(activity);
      
      if (activity.type === 'dropdown' && initialOption && activity.dropdownOptions) {
        const option = activity.dropdownOptions.find(o => o.id === initialOption);
        if (option) {
          setSelectedDropdownOption(option);
        }
      }
    }
  }, []);

  // Effect 4: Auto-select orchestrator when category changes (but not on initial load)
  useEffect(() => {
    // Skip on initial render - handled by Effect 3
    if (!initialNavigationDone.current) return;
    
    const { 
      activeCategory, setSelectedAction, setSelectedDropdownOption, 
      setFormFields, setSimpleInput, setCreateActivityId,
      communicationAction, thinkingAction, workLifeAction, 
      moneyAction, wellnessAction, createSharedAction
    } = paramsRef.current;
    
    if (!activeCategory) return;
    
    const orchestratorMap: Record<string, any> = {
      'communication': communicationAction,
      'thinking-learning': thinkingAction,
      'work-life': workLifeAction,
      'money': moneyAction,
      'relationships-wellness': wellnessAction,
      'create': createSharedAction,
    };
    
    const orchestrator = orchestratorMap[activeCategory];
    if (orchestrator) {
      setSelectedAction(orchestrator);
      setSelectedDropdownOption(null);
      setFormFields({});
      setSimpleInput('');
      
      if (activeCategory === 'create') {
        setCreateActivityId('bio-about');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.activeCategory]);
}
