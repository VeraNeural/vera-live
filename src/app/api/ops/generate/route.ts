import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT_SKELETON } from '../../../../lib/ops/config/systemPromptSkeleton';
import { ACTIVITY_PROMPT_FRAGMENTS } from '../../../../lib/ops/config/activityPromptFragments';
import { ACTIVITY_MODEL_CONTRACTS } from '../../../../lib/ops/config/activityModelContracts';
import { ACTIVITY_THINKING_MATRIX } from '../../../../lib/ops/config/activityThinkingMatrix';
import { ACTIVITY_DEFAULT_THINKING_MODE } from '../../../../lib/ops/config/activityDefaultThinkingMode';
import { ACTIVITY_THINKING_OVERRIDES } from '../../../../lib/ops/config/activityThinkingOverrides';
import { ACTIVITY_THINKING_SURFACING } from '../../../../lib/ops/config/activityThinkingSurfacing';
import { validateOutput } from '../../../../lib/ops/validation/outputValidation';
import { safetyLayer } from '../../../../lib/ops/safety/safetyLayer';
import { 
  VERA_FOCUS_SYSTEM_PROMPT, 
  SYSTEM_INTEGRITY_RULES,
  SYNTHESIS_PROMPT,
  REVIEW_PROMPT,
  POLISH_PROMPT,
  SIMPLIFY_PROMPT,
  CALIBRATION_BASE_PROMPT,
  getActivityContracts,
  getThinkingModeBlock,
  RESPOND_PROMPT,
  DECODE_MESSAGE_PROMPT
} from './prompts';
import {
  getAnthropic,
  getOpenAI,
  getGrok,
  getVeraNeuralClient,
  generateWithClaudeInternal,
  generateWithGPT4Internal,
  generateWithVeraNeuralInternal
} from './providers';
import { generateSingle, generateConsensus, generateReviewChain, generateCompare } from './modes';
import {
  validateFocusOutput,
  getValidatorStats,
  resetValidatorStats,
  getCalibrationPrompt,
  determineCalibrationLevel,
  type CalibrationLevel
} from './validation';
// ============================================================================
// MULTI-AI OPS GENERATION API
// Supports: Claude (Anthropic), GPT-4 (OpenAI), Grok (xAI), VERA Neural (Local Qwen via LM Studio)
// Modes: single, consensus, specialist, review-chain, compare
// ============================================================================

// ============================================================================
// TYPES
// ============================================================================
type AIProvider = 'claude' | 'gpt4' | 'grok' | 'vera-neural';
type GenerationMode = 'single' | 'consensus' | 'specialist' | 'review-chain' | 'compare';

type GenerationRequest = {
  systemPrompt: string;
  userInput: string;
  mode: GenerationMode;
  provider?: AIProvider;
  taskType?: string;
  activityId?: string;
  thinkingMode?: {
    id: string;
    label: string;
    persona?: string;
  };
};

// ============================================================================
// PROMPTS (imported from ./prompts)
// VALIDATION (imported from ./validation)
// ============================================================================

// Add endpoint to check validator stats (for debugging)
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  if (url.searchParams.get('stats') === 'validator') {
    const validatorStats = getValidatorStats();
    return NextResponse.json({
      stats: validatorStats,
      summary: {
        totalActivities: Object.keys(validatorStats).length,
        totalViolations: Object.values(validatorStats).reduce((sum, stat) => sum + stat.total, 0),
        mostProblematic: Object.entries(validatorStats)
          .sort(([,a], [,b]) => b.total - a.total)
          .slice(0, 5)
          .map(([activity, stat]) => ({ activity, violations: stat.total, breakdown: stat.violations }))
      }
    });
  }
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}

function buildFullSystemPrompt(activityPrompt: string, activityId?: string): string {
  const activityContracts = getActivityContracts(activityId);

  return `${VERA_FOCUS_SYSTEM_PROMPT}

---

ACTIVITY INSTRUCTIONS:
${activityPrompt}${activityContracts}${SYSTEM_INTEGRITY_RULES}`;
}

async function logVeraNeuralShadow(systemPrompt: string, userInput: string, activityId?: string): Promise<void> {
  try {
    const response = await getVeraNeuralClient().chat.completions.create({
      model: 'qwen/qwen3-30b-a3b-2507',
      max_tokens: 8192,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInput },
      ],
    });

    const content = response.choices[0]?.message?.content || 'No response generated.';
    console.info('[VERA Neural Shadow]', {
      activityId: activityId || 'unknown',
      length: content.length,
      preview: content.slice(0, 280),
    });
  } catch (error) {
    console.warn('[VERA Neural Shadow] Failed to fetch shadow response', error);
  }
}

function extractFocusBlock(source: string): string {
  const match = source.match(/\[FOCUS_MODE\][\s\S]*?Focus must never introduce new instructions or content/);
  return match ? `\n\n${match[0]}` : '';
}

function extractToneBlock(source: string): string {
  const match = source.match(/\[TONE_PROFILE\][\s\S]*?If Tone conflicts with Activity intent, ignore Tone/);
  return match ? `\n\n${match[0]}` : '';
}

function isModeAllowed(activityId: string, modeId: string): boolean {
  const allowed = ACTIVITY_THINKING_MATRIX[activityId]?.allowedThinkingModes || [];
  return allowed.includes(modeId);
}

function resolveThinkingMode(activityId: string, thinkingMode?: GenerationRequest['thinkingMode']): string | null {
  const surfacing = ACTIVITY_THINKING_SURFACING[activityId]?.surfacing || 'hidden';
  const overrides = ACTIVITY_THINKING_OVERRIDES[activityId] || { allowOverride: false };
  const defaultMode = ACTIVITY_DEFAULT_THINKING_MODE[activityId];

  if (!defaultMode) return null;

  if (surfacing === 'explicit' && overrides.allowOverride && thinkingMode?.id) {
    const allowedOverrides = overrides.allowedOverrides || [];
    if (allowedOverrides.includes(thinkingMode.id) && isModeAllowed(activityId, thinkingMode.id)) {
      return thinkingMode.id;
    }
  }

  if (surfacing === 'implicit' && overrides.allowOverride) {
    // No implicit override source available in current runtime.
  }

  if (defaultMode !== 'default' && isModeAllowed(activityId, defaultMode)) {
    return defaultMode;
  }

  return defaultMode === 'default' ? null : null;
}

async function generateSinglePass(
  provider: AIProvider,
  systemPrompt: string,
  userInput: string
): Promise<{ content: string; provider: AIProvider }> {
  switch (provider) {
    case 'claude': {
      const anthropic = getAnthropic();
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: 'user', content: userInput }],
      });
      const textBlock = response.content.find((block) => block.type === 'text');
      return { content: textBlock ? textBlock.text : 'No response generated.', provider };
    }
    case 'gpt4': {
      const response = await getOpenAI().chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 8192,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput },
        ],
      });
      return { content: response.choices[0]?.message?.content || 'No response generated.', provider };
    }
    case 'grok': {
      const response = await getGrok().chat.completions.create({
        model: 'grok-3-latest',
        max_tokens: 8192,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput },
        ],
      });
      return { content: response.choices[0]?.message?.content || 'No response generated.', provider };
    }
    case 'vera-neural': {
      const response = await getVeraNeuralClient().chat.completions.create({
        model: 'qwen/qwen3-30b-a3b-2507',
        max_tokens: 8192,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput },
        ],
      });
      return { content: response.choices[0]?.message?.content || 'No response generated.', provider };
    }
    default:
      return generateSinglePass('claude', systemPrompt, userInput);
  }
}

// ============================================================================
// AI GENERATION FUNCTIONS
// ============================================================================

// Internal generation functions imported from ./providers

// Public functions for user-facing generation (includes VERA system prompt + validation + calibration)
async function generateWithClaude(systemPrompt: string, userInput: string, activityId?: string): Promise<string> {
  const anthropic = getAnthropic();

  const fullPrompt = buildFullSystemPrompt(systemPrompt, activityId);
  void logVeraNeuralShadow(fullPrompt, userInput, activityId);

  // First generation attempt
  let response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: fullPrompt,
    messages: [{ role: 'user', content: userInput }],
  });

  let textBlock = response.content.find(block => block.type === 'text');
  let output = textBlock ? textBlock.text : 'No response generated.';

  // Silent validation and regeneration
  if (!validateFocusOutput(output, activityId)) {
    // Second attempt with stricter constraint
    const stricterPrompt = `${buildFullSystemPrompt(systemPrompt, activityId)}

CRITICAL: Your previous response violated Focus rules. Regenerate with absolute adherence to all constraints. Be more direct and less elaborate.`;

    response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: stricterPrompt,
      messages: [{ role: 'user', content: userInput }],
    });

    textBlock = response.content.find(block => block.type === 'text');
    output = textBlock ? textBlock.text : 'No response generated.';

    // If still invalid, simplify without explanation
    if (!validateFocusOutput(output, activityId)) {
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: buildFullSystemPrompt(SIMPLIFY_PROMPT, activityId),
        messages: [{ role: 'user', content: userInput }],
      });

      textBlock = response.content.find(block => block.type === 'text');
      output = textBlock ? textBlock.text : 'Unable to process this request.';
    }
  }

  // Apply calibration if needed
  if (activityId) {
    const calibrationLevel = determineCalibrationLevel(activityId, output);
    if (calibrationLevel !== 'neutral') {
      const calibrationPrompt = getCalibrationPrompt(calibrationLevel, output);
      
      const calibrationResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        system: buildFullSystemPrompt('Adjust directness while maintaining exact meaning and all Focus rules', activityId),
        messages: [{ role: 'user', content: calibrationPrompt }],
      });

      const calibratedBlock = calibrationResponse.content.find(block => block.type === 'text');
      if (calibratedBlock && validateFocusOutput(calibratedBlock.text, activityId)) {
        output = calibratedBlock.text;
      }
    }
  }

  return output;
}

async function generateWithGPT4(systemPrompt: string, userInput: string, activityId?: string): Promise<string> {
  // First generation attempt
  let response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 8192,
    messages: [
      { role: 'system', content: buildFullSystemPrompt(systemPrompt, activityId) },
      { role: 'user', content: userInput },
    ],
  });

  let output = response.choices[0]?.message?.content || 'No response generated.';

  // Silent validation and regeneration
  if (!validateFocusOutput(output, activityId)) {
    // Second attempt with stricter constraint
    const stricterPrompt = `${buildFullSystemPrompt(systemPrompt, activityId)}

CRITICAL: Your previous response violated Focus rules. Regenerate with absolute adherence to all constraints. Be more direct and less elaborate.`;

    response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 8192,
      messages: [
        { role: 'system', content: stricterPrompt },
        { role: 'user', content: userInput },
      ],
    });

    output = response.choices[0]?.message?.content || 'No response generated.';

    // If still invalid, simplify without explanation
    if (!validateFocusOutput(output, activityId)) {
      response = await getOpenAI().chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 4096,
        messages: [
          { role: 'system', content: buildFullSystemPrompt(SIMPLIFY_PROMPT, activityId) },
          { role: 'user', content: userInput },
        ],
      });

      output = response.choices[0]?.message?.content || 'Unable to process this request.';
    }
  }

  // Apply calibration if needed
  if (activityId) {
    const calibrationLevel = determineCalibrationLevel(activityId, output);
    if (calibrationLevel !== 'neutral') {
      const calibrationPrompt = getCalibrationPrompt(calibrationLevel, output);
      
      const calibrationResponse = await getOpenAI().chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 8192,
        messages: [
          { role: 'system', content: buildFullSystemPrompt('Adjust directness while maintaining exact meaning and all Focus rules', activityId) },
          { role: 'user', content: calibrationPrompt },
        ],
      });

      const calibratedOutput = calibrationResponse.choices[0]?.message?.content;
      if (calibratedOutput && validateFocusOutput(calibratedOutput, activityId)) {
        output = calibratedOutput;
      }
    }
  }

  return output;
}

async function generateWithGrok(systemPrompt: string, userInput: string, activityId?: string): Promise<string> {
  // First generation attempt
  let response = await getGrok().chat.completions.create({
    model: 'grok-3-latest',
    max_tokens: 8192,
    messages: [
      { role: 'system', content: buildFullSystemPrompt(systemPrompt, activityId) },
      { role: 'user', content: userInput },
    ],
  });

  let output = response.choices[0]?.message?.content || 'No response generated.';

  // Silent validation and regeneration
  if (!validateFocusOutput(output, activityId)) {
    // Second attempt with stricter constraint
    const stricterPrompt = `${buildFullSystemPrompt(systemPrompt, activityId)}

CRITICAL: Your previous response violated Focus rules. Regenerate with absolute adherence to all constraints. Be more direct and less elaborate.`;

    response = await getGrok().chat.completions.create({
      model: 'grok-3-latest',
      max_tokens: 8192,
      messages: [
        { role: 'system', content: stricterPrompt },
        { role: 'user', content: userInput },
      ],
    });

    output = response.choices[0]?.message?.content || 'No response generated.';

    // If still invalid, simplify without explanation
    if (!validateFocusOutput(output, activityId)) {
      response = await getGrok().chat.completions.create({
        model: 'grok-3-latest',
        max_tokens: 4096,
        messages: [
          { role: 'system', content: buildFullSystemPrompt(SIMPLIFY_PROMPT, activityId) },
          { role: 'user', content: userInput },
        ],
      });

      output = response.choices[0]?.message?.content || 'Unable to process this request.';
    }
  }

  // Apply calibration if needed
  if (activityId) {
    const calibrationLevel = determineCalibrationLevel(activityId, output);
    if (calibrationLevel !== 'neutral') {
      const calibrationPrompt = getCalibrationPrompt(calibrationLevel, output);
      
      const calibrationResponse = await getGrok().chat.completions.create({
        model: 'grok-3-latest',
        max_tokens: 8192,
        messages: [
          { role: 'system', content: buildFullSystemPrompt('Adjust directness while maintaining exact meaning and all Focus rules', activityId) },
          { role: 'user', content: calibrationPrompt },
        ],
      });

      const calibratedOutput = calibrationResponse.choices[0]?.message?.content;
      if (calibratedOutput && validateFocusOutput(calibratedOutput, activityId)) {
        output = calibratedOutput;
      }
    }
  }

  return output;
}

// ============================================================================
// SPECIALIST MODE - TASK TO AI MAPPING
// ============================================================================
const SPECIALIST_MAPPING: Record<string, AIProvider> = {
  // Communication - Claude excels at nuance and emotional intelligence
  'decode-message': 'claude',
  'quick-reply': 'claude',
  'say-no': 'claude',
  'follow-up': 'claude',
  'apology': 'claude',
  'boundary-script': 'claude',
  'tough-conversation': 'claude',
  'explain-simply': 'gpt4',

  // Work & Career - GPT-4 for structured, professional content
  'meeting-prep': 'gpt4',
  'interview-prep': 'gpt4',
  'salary-negotiation': 'claude',
  'one-on-one': 'gpt4',
  'performance-review': 'gpt4',
  'resume-bullets': 'gpt4',
  'cover-letter': 'claude',
  'job-application-kit': 'claude', // Claude for comprehensive kit

  // Life Admin - Mixed based on task
  'complaint-letter': 'gpt4',
  'dispute': 'gpt4',
  'reference-request': 'claude',
  'thank-you': 'claude',
  'gift-ideas': 'grok',
  'excuse': 'claude',

  // Content - Grok for creative, edgy content
  'linkedin-post': 'claude',
  'tweet-thread': 'grok',
  'caption': 'grok',
  'headline': 'grok',
  'bio': 'claude',

  // Thinking Tools - Claude for deep analysis
  'pros-cons': 'gpt4',
  'devil-advocate': 'grok',
  'brainstorm': 'grok',
  'reframe': 'claude',
  'persona': 'claude',
  'decision-helper': 'claude',

  // Health & Wellness - GPT-4 for accuracy
  'meal-plan': 'gpt4',
  'workout': 'gpt4',
  'habit-builder': 'claude',
  'sleep-routine': 'claude',
  'stress-relief': 'claude',
  'motivation-boost': 'grok',

  // Money & Finance - GPT-4 for precision
  'budget-help': 'gpt4',
  'negotiate-bill': 'claude',
  'investment-basics': 'gpt4',
  'expense-review': 'gpt4',
  'savings-plan': 'gpt4',
  'money-mindset': 'claude',

  // Learning & Growth - Mixed
  'study-plan': 'gpt4',
  'explain-concept': 'gpt4',
  'skill-roadmap': 'gpt4',
  'book-summary': 'claude',
  'learning-hack': 'grok',
  'knowledge-test': 'gpt4',

  // Relationships - Claude for emotional intelligence
  'dating-profile': 'grok',
  'conflict-resolution': 'claude',
  'family-dynamics': 'claude',
  'friendship-advice': 'claude',
  'boundary-setting': 'claude',
  'conversation-starter': 'grok',

  // Creativity - Grok for unconventional ideas
  'story-idea': 'grok',
  'naming': 'grok',
  'creative-prompt': 'grok',
  'metaphor-maker': 'claude',
  'plot-twist': 'grok',
  'character-builder': 'claude',

  // Planning & Goals - GPT-4 for structure
  'goal-setting': 'gpt4',
  'project-plan': 'gpt4',
  'habit-tracker': 'gpt4',
  'weekly-review': 'claude',
  'vision-board': 'grok',
  'accountability': 'claude',
};

function getSpecialistAI(taskType: string): AIProvider {
  return SPECIALIST_MAPPING[taskType] || 'claude';
}

// ============================================================================
// GENERATION MODES
// ============================================================================
// Mode functions are imported from ./modes/

// ============================================================================
// API ROUTE HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();
    const { systemPrompt, userInput, mode, provider, taskType, activityId, thinkingMode } = body;

    if (!userInput || !userInput.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!activityId) {
      return NextResponse.json(
        { error: 'Missing activityId' },
        { status: 400 }
      );
    }

    if (!ACTIVITY_MODEL_CONTRACTS[activityId]) {
      return NextResponse.json(
        { error: 'Missing activity model contract' },
        { status: 400 }
      );
    }

    const fragment = ACTIVITY_PROMPT_FRAGMENTS[activityId];
    if (!fragment) {
      return NextResponse.json(
        { error: 'Missing activity prompt fragment' },
        { status: 400 }
      );
    }

    const resolvedMode = resolveThinkingMode(activityId, thinkingMode);
    if (ACTIVITY_DEFAULT_THINKING_MODE[activityId] === undefined) {
      return NextResponse.json(
        { error: 'Missing activity default thinking mode' },
        { status: 400 }
      );
    }

    let activeThinkingModeBlock = '';
    if (resolvedMode === 'devil-advocate') {
      activeThinkingModeBlock = getThinkingModeBlock('devil-advocate');
    } else if (resolvedMode === 'pros-cons') {
      activeThinkingModeBlock = getThinkingModeBlock('pros-cons');
    } else if (resolvedMode === 'reframe') {
      activeThinkingModeBlock = getThinkingModeBlock('reframe');
    } else if (resolvedMode === 'persona') {
      const personaValue = thinkingMode?.persona?.trim();
      if (!personaValue) {
        return NextResponse.json(
          { error: 'Missing persona input' },
          { status: 400 }
        );
      }
      activeThinkingModeBlock = getThinkingModeBlock('persona', personaValue);
    }

    const focusBlock = systemPrompt ? extractFocusBlock(systemPrompt) : '';
    const toneBlock = systemPrompt ? extractToneBlock(systemPrompt) : '';
    let assembledSystemPrompt: string;
    if (activityId === 'respond') {
      assembledSystemPrompt = RESPOND_PROMPT;
    } else if (activityId === 'worklife-analysis' || activityId === 'worklife-action' || activityId === 'worklife-clarify' || activityId === 'worklife-sorted' || activityId === 'money-analysis' || activityId === 'money-action' || activityId === 'thinking-detect' || activityId === 'thinking-analysis' || activityId === 'thinking-action') {
      // Use the passed systemPrompt directly for Work & Life, Money, and Thinking unified flows
      assembledSystemPrompt = systemPrompt;
    } else if (activityId === 'decode-message') {
      assembledSystemPrompt = DECODE_MESSAGE_PROMPT;
    } else {
      assembledSystemPrompt = [
        SYSTEM_PROMPT_SKELETON,
        fragment,
        activeThinkingModeBlock,
        focusBlock,
        toneBlock,
      ]
        .filter(Boolean)
        .join('\n');
    }
    const selectedProvider = provider || 'claude';
    const result = await generateSinglePass(selectedProvider, assembledSystemPrompt, userInput);

    const validation = validateOutput(activityId, result.content);
    if (!validation.valid) {
      console.error('[OPS Generate] Output validation failed:', { activityId, reasons: validation.reasons, contentLength: result.content?.length });
      return NextResponse.json(
        { error: 'Output validation failed', details: validation.reasons },
        { status: 400 }
      );
    }

    const safetyResult = safetyLayer(userInput, result.content);
    if (safetyResult.outcome !== 'allow') {
      console.error('[OPS Generate] Safety layer blocked:', { outcome: safetyResult.outcome, message: safetyResult.message });
      return NextResponse.json(
        { error: safetyResult.message || 'Request blocked' },
        { status: 400 }
      );
    }

    return NextResponse.json({ content: result.content, provider: result.provider });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[OPS Generate] Error:', errorMessage, error);
    return NextResponse.json(
      { error: 'Failed to generate response', details: errorMessage },
      { status: 500 }
    );
  }
}
