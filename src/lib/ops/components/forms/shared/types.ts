import { ActionItem } from '../../../types';

// Make DynamicForm accept activities with either field structure
export type FlexibleAction = Omit<ActionItem, 'fields'> & {
  fields?: Array<{
    id?: string;
    name?: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'number';
    placeholder?: string;
    options?: { value: string; label: string }[];
    required?: boolean;
  }>;
  dropdownOptions?: Array<{
    id: string;
    label: string;
    description: string;
    icon: string;
    placeholder?: string;
  }>;
  disclaimer?: string;
};

export interface DynamicFormProps {
  action: FlexibleAction;
  activeOptionId?: string;
  output?: string | null;
  simpleInput: string;
  formFields: Record<string, string>;
  onSimpleInputChange: (value: string) => void;
  onFormFieldChange: (fieldId: string, value: string) => void;
  onGenerate: (payload?: { thinkingMode?: { id: string; label: string; persona?: string } }) => void;
  isGenerating: boolean;
  isValid: boolean;
  colors: {
    text: string;
    textMuted: string;
    accent: string;
    cardBg: string;
    cardBorder: string;
  };
  isDark: boolean;
  onDecodeEntryChange?: (entryId: string) => void;
  respondMode?: string;
  onRespondModeChange?: (modeId: string) => void;
  boundaryMode?: string;
  onBoundaryModeChange?: (modeId: string) => void;
  boundaryTone?: string;
  onBoundaryToneChange?: (toneId: string) => void;
  boundaryDelivery?: string;
  onBoundaryDeliveryChange?: (deliveryId: string) => void;
  workLifeMode?: string;
  onWorkLifeModeChange?: (modeId: string) => void;
  workLifeActivities?: Array<{ id: string; title: string; label?: string }>;
  moneyActivities?: Array<{ id: string; title: string; label?: string }>;
  workLifeTone?: string;
  onWorkLifeToneChange?: (toneId: string) => void;
  workLifeContext?: string;
  onWorkLifeContextChange?: (contextId: string) => void;
  workLifeSecondaryMode?: string;
  onWorkLifeSecondaryModeChange?: (modeId: string) => void;
  thinkingMode?: string;
  onThinkingModeChange?: (modeId: string) => void;
  thinkingStyle?: string;
  onThinkingStyleChange?: (styleId: string) => void;
  thinkingDepth?: string;
  onThinkingDepthChange?: (depthId: string) => void;
  thinkingSecondaryMode?: string;
  onThinkingSecondaryModeChange?: (modeId: string) => void;
  moneyMode?: string;
  onMoneyModeChange?: (modeId: string) => void;
  moneyPerspective?: string;
  onMoneyPerspectiveChange?: (perspectiveId: string) => void;
  moneyScope?: string;
  onMoneyScopeChange?: (scopeId: string) => void;
  moneyContext?: string;
  onMoneyContextChange?: (contextId: string) => void;
  moneySecondaryMode?: string;
  onMoneySecondaryModeChange?: (modeId: string) => void;
  relationshipMode?: string;
  onRelationshipModeChange?: (modeId: string) => void;
  relationshipTone?: string;
  onRelationshipToneChange?: (toneId: string) => void;
  relationshipDepth?: string;
  onRelationshipDepthChange?: (depthId: string) => void;
  focusMode?: string;
  onFocusModeChange?: (modeId: string) => void;
  createActivities?: Array<{ id: string; title: string; description: string; dropdownOptions?: Array<{ id: string; label: string; description: string; icon: string }> }>;
  createActivityId?: string;
  onCreateActivityChange?: (activityId: string) => void;
  createOptionId?: string;
  onCreateOptionChange?: (optionId: string) => void;
  careerTone?: string;
  onCareerToneChange?: (toneId: string) => void;
  onSelectDropdownOption?: (option: { id: string; label: string; description: string; icon: string; placeholder: string; systemPrompt: string; fields?: any[] }) => void;
}
