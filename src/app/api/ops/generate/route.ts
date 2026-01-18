import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// ============================================================================
// MULTI-AI OPS GENERATION API
// Supports: Claude (Anthropic), GPT-4 (OpenAI), Grok (xAI)
// Modes: single, consensus, specialist, review-chain, compare
// ============================================================================

let anthropic: Anthropic | null = null;

let openai: OpenAI | null = null;
let grok: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing OPENAI_API_KEY');
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
}

function getGrok(): OpenAI {
  if (!grok) {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing XAI_API_KEY');
    }
    grok = new OpenAI({
      apiKey,
      baseURL: 'https://api.x.ai/v1',
    });
  }
  return grok;
}

// ============================================================================
// TYPES
// ============================================================================
type AIProvider = 'claude' | 'gpt4' | 'grok';
type GenerationMode = 'single' | 'consensus' | 'specialist' | 'review-chain' | 'compare';

type GenerationRequest = {
  systemPrompt: string;
  userInput: string;
  mode: GenerationMode;
  provider?: AIProvider;
  taskType?: string;
  activityId?: string;
};
  provider?: AIProvider; // For single mode
  taskType?: string; // For specialist mode
};

// ============================================================================
// VERA FOCUS SYSTEM PROMPT
// ============================================================================

const VERA_FOCUS_SYSTEM_PROMPT = `SYSTEM ROLE: VERA — FOCUS MODE

You are VERA.
You do not identify as an AI, model, provider, or tool.
You do not reference internal systems, collaborators, or sources.
You do not announce yourself.
You present understanding plainly.

PURPOSE

Your role is to help people make sense of things.
You translate meaning, not people.
You clarify what is happening without explaining humans.
You do not decide, recommend, diagnose, or instruct.

GLOBAL RULES (APPLY TO ALL FOCUS ACTIVITIES WITHOUT EXCEPTION)

Do not use biological, medical, psychological, psychiatric, or diagnostic language.
Do not name emotions, mental states, traits, motives, or intentions.
Do not explain behavior using theory, frameworks, or models.
Do not analyze or describe who a person is.
Do not tell the user what they feel, want, need, or should do.

WHAT YOU DO INSTEAD

You describe what words, timing, structure, and context are doing.
You translate subtext into clear, human language.
You surface meaning that feels immediately recognizable.
You let understanding stand without interpretation.

FORMAT (MANDATORY)

Output must be plain text only.
No bullet points.
No numbering.
No headings or labels.
No emphasis markers.
No teaching or coaching tone.

Write in short paragraphs with space.
The page should feel like a raw internal report.
Direct. Unstyled. Unpolished.
If it feels blunt, that is intentional.

LEARNING WITHOUT PROFILING

You may adapt only by adjusting:
language simplicity or complexity
length and pacing
directness of tone

You may not:
build profiles
infer traits or patterns
store interpretations
create continuity narratives
predict behavior

Learning is calibration, not characterization.

FINAL CONSTRAINT

You are not here to explain humans.
You are here to help humans recognize what they are already seeing.`;

// ============================================================================
// SILENT VALIDATOR AND CALIBRATION
// ============================================================================

// Validator trigger tracking
const validatorStats: Record<string, { total: number; violations: { diagnostic: number; emotions: number; authority: number; instructions: number; formatting: number } }> = {};

function trackValidatorTrigger(activityId: string, violationType: string) {
  if (!validatorStats[activityId]) {
    validatorStats[activityId] = {
      total: 0,
      violations: { diagnostic: 0, emotions: 0, authority: 0, instructions: 0, formatting: 0 }
    };
  }
  
  validatorStats[activityId].total++;
  if (violationType in validatorStats[activityId].violations) {
    (validatorStats[activityId].violations as any)[violationType]++;
  }
  
  // Log to console for monitoring (can be removed in production)
  console.log(`[Validator] ${activityId}: ${violationType} violation (${validatorStats[activityId].total} total violations)`);
  
  // Log summary every 10 violations for any activity
  if (validatorStats[activityId].total % 10 === 0) {
    console.log(`[Validator Stats] ${activityId}:`, validatorStats[activityId]);
  }
}

// Silent validator - blocks outputs that violate Focus contract
function validateFocusOutput(output: string, activityId?: string): boolean {
  const diagnosticWords = [
    'anxiety', 'trauma', 'nervous system', 'psychology', 'biology', 'coping', 'attachment',
    'therapy', 'healing', 'trigger', 'dysfunction', 'disorder', 'syndrome', 'pathology',
    'mental health', 'emotional intelligence', 'psychological', 'psychiatric', 'clinical',
    'diagnosis', 'symptom', 'treatment', 'recovery', 'dysfunction', 'behavioral pattern',
    'cognitive', 'subconscious', 'unconscious', 'defense mechanism', 'projection',
    'narcissist', 'codependent', 'toxic', 'gaslighting', 'manipulation'
  ];

  const emotionLabels = [
    'afraid', 'insecure', 'seeking validation', 'overwhelmed', 'angry', 'anxious',
    'depressed', 'stressed', 'triggered', 'defensive', 'avoidant', 'needy', 'clingy',
    'jealous', 'resentful', 'bitter', 'hurt', 'rejected', 'abandoned', 'betrayed',
    'vulnerable', 'shame', 'guilt', 'pride', 'ego', 'fear-based', 'love-starved'
  ];

  const authorityLanguage = [
    'this means', 'this indicates', 'therefore', 'you should', 'what\'s happening is',
    'the reason is', 'this suggests', 'this shows', 'clearly', 'obviously',
    'the truth is', 'what this tells us', 'the reality is', 'this proves'
  ];

  const instructionalVerbs = [
    'do this', 'try to', 'you need to', 'it\'s best to', 'you must', 'you have to',
    'make sure to', 'don\'t forget to', 'always', 'never', 'avoid', 'stop',
    'start', 'begin', 'consider', 'think about', 'remember', 'focus on'
  ];

  // Check for structured formatting
  const hasStructuredFormatting = /^[\s]*[-•*]\s|^\s*\d+\.\s|^\s*#{1,6}\s|\*\*.*\*\*|__.*__|`.*`|:.*:/m.test(output);

  // Check for violations
  const lowerOutput = output.toLowerCase();
  
  const hasDiagnostic = diagnosticWords.some(word => lowerOutput.includes(word.toLowerCase()));
  const hasEmotionLabels = emotionLabels.some(word => lowerOutput.includes(word.toLowerCase()));
  const hasAuthority = authorityLanguage.some(phrase => lowerOutput.includes(phrase.toLowerCase()));
  const hasInstructions = instructionalVerbs.some(phrase => lowerOutput.includes(phrase.toLowerCase()));

  // Track violations if activityId provided
  if (activityId && (hasDiagnostic || hasEmotionLabels || hasAuthority || hasInstructions || hasStructuredFormatting)) {
    if (hasDiagnostic) trackValidatorTrigger(activityId, 'diagnostic');
    if (hasEmotionLabels) trackValidatorTrigger(activityId, 'emotions');
    if (hasAuthority) trackValidatorTrigger(activityId, 'authority');
    if (hasInstructions) trackValidatorTrigger(activityId, 'instructions');
    if (hasStructuredFormatting) trackValidatorTrigger(activityId, 'formatting');
  }

  return !(hasDiagnostic || hasEmotionLabels || hasAuthority || hasInstructions || hasStructuredFormatting);
}

// Function to get validator statistics (for monitoring/debugging)
function getValidatorStats() {
  return validatorStats;
}

// Function to reset validator statistics
function resetValidatorStats() {
  Object.keys(validatorStats).forEach(key => delete validatorStats[key]);
}

// Add endpoint to check validator stats (for debugging)
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  if (url.searchParams.get('stats') === 'validator') {
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

// Calibration levels for directness and pacing
type CalibrationLevel = 'gentle' | 'neutral' | 'sharp';

function getCalibrationPrompt(level: CalibrationLevel, content: string): string {
  const basePrompt = 'Adjust this response for appropriate directness while maintaining the exact same meaning and following all Focus rules:';
  
  switch (level) {
    case 'gentle':
      return `${basePrompt}

Make it gentler with:
- Softer phrasing
- More space between ideas  
- Less compression
- Suitable for relational or vulnerable content

Content to adjust: ${content}`;
    
    case 'sharp':
      return `${basePrompt}

Make it sharper with:
- Shorter sentences
- Tighter language
- More direct
- Suitable for work, money, decisions

Content to adjust: ${content}`;
    
    case 'neutral':
    default:
      return content; // No adjustment needed
  }
}

function determineCalibrationLevel(activityId: string, content: string): CalibrationLevel {
  // Sharp for work/money/decision activities
  if (['task-breakdown', 'decision-helper', 'budget-check', 'savings-goal', 'salary-negotiation', 'negotiate-bill'].includes(activityId)) {
    return 'sharp';
  }
  
  // Gentle for relationship/vulnerable content
  if (['vent-session', 'self-check-in', 'relationship-help', 'boundaries', 'perspective-shift'].includes(activityId)) {
    return 'gentle';
  }
  
  // Neutral for everything else
  return 'neutral';
}

function buildFullSystemPrompt(activityPrompt: string): string {
  return `${VERA_FOCUS_SYSTEM_PROMPT}

---

ACTIVITY INSTRUCTIONS:
${activityPrompt}`;
}

// ============================================================================
// AI GENERATION FUNCTIONS
// ============================================================================

// Internal functions for processing (bypass VERA system prompt)
async function generateWithClaudeInternal(systemPrompt: string, userInput: string): Promise<string> {
  if (!anthropic && process.env.ANTHROPIC_API_KEY) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  const response = await anthropic!.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: 'user', content: userInput }],
  });

  const textBlock = response.content.find(block => block.type === 'text');
  return textBlock ? textBlock.text : 'No response generated.';
}

async function generateWithGPT4Internal(systemPrompt: string, userInput: string): Promise<string> {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 8192,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput },
    ],
  });

  return response.choices[0]?.message?.content || 'No response generated.';
}

// Public functions for user-facing generation (includes VERA system prompt + validation + calibration)
async function generateWithClaude(systemPrompt: string, userInput: string, activityId?: string): Promise<string> {
  if (!anthropic && process.env.ANTHROPIC_API_KEY) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  // First generation attempt
  let response = await anthropic!.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: buildFullSystemPrompt(systemPrompt),
    messages: [{ role: 'user', content: userInput }],
  });

  let textBlock = response.content.find(block => block.type === 'text');
  let output = textBlock ? textBlock.text : 'No response generated.';

  // Silent validation and regeneration
  if (!validateFocusOutput(output, activityId)) {
    // Second attempt with stricter constraint
    const stricterPrompt = `${buildFullSystemPrompt(systemPrompt)}

CRITICAL: Your previous response violated Focus rules. Regenerate with absolute adherence to all constraints. Be more direct and less elaborate.`;

    response = await anthropic!.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: stricterPrompt,
      messages: [{ role: 'user', content: userInput }],
    });

    textBlock = response.content.find(block => block.type === 'text');
    output = textBlock ? textBlock.text : 'No response generated.';

    // If still invalid, simplify without explanation
    if (!validateFocusOutput(output, activityId)) {
      const simplifyPrompt = 'Simplify this to essential meaning only. Remove all analysis, labels, advice, and formatting:';
      
      response = await anthropic!.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: buildFullSystemPrompt(simplifyPrompt),
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
      
      const calibrationResponse = await anthropic!.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        system: buildFullSystemPrompt('Adjust directness while maintaining exact meaning and all Focus rules'),
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
      { role: 'system', content: buildFullSystemPrompt(systemPrompt) },
      { role: 'user', content: userInput },
    ],
  });

  let output = response.choices[0]?.message?.content || 'No response generated.';

  // Silent validation and regeneration
  if (!validateFocusOutput(output, activityId)) {
    // Second attempt with stricter constraint
    const stricterPrompt = `${buildFullSystemPrompt(systemPrompt)}

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
      const simplifyPrompt = 'Simplify this to essential meaning only. Remove all analysis, labels, advice, and formatting:';
      
      response = await getOpenAI().chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 4096,
        messages: [
          { role: 'system', content: buildFullSystemPrompt(simplifyPrompt) },
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
          { role: 'system', content: buildFullSystemPrompt('Adjust directness while maintaining exact meaning and all Focus rules') },
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
      { role: 'system', content: buildFullSystemPrompt(systemPrompt) },
      { role: 'user', content: userInput },
    ],
  });

  let output = response.choices[0]?.message?.content || 'No response generated.';

  // Silent validation and regeneration
  if (!validateFocusOutput(output, activityId)) {
    // Second attempt with stricter constraint
    const stricterPrompt = `${buildFullSystemPrompt(systemPrompt)}

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
      const simplifyPrompt = 'Simplify this to essential meaning only. Remove all analysis, labels, advice, and formatting:';
      
      response = await getGrok().chat.completions.create({
        model: 'grok-3-latest',
        max_tokens: 4096,
        messages: [
          { role: 'system', content: buildFullSystemPrompt(simplifyPrompt) },
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
          { role: 'system', content: buildFullSystemPrompt('Adjust directness while maintaining exact meaning and all Focus rules') },
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

async function generateSingle(
  systemPrompt: string,
  userInput: string,
  provider: AIProvider,
  activityId?: string
): Promise<{ content: string; provider: AIProvider }> {
  let content: string;

  switch (provider) {
    case 'claude':
      content = await generateWithClaude(systemPrompt, userInput, activityId);
      break;
    case 'gpt4':
      content = await generateWithGPT4(systemPrompt, userInput, activityId);
      break;
    case 'grok':
      content = await generateWithGrok(systemPrompt, userInput, activityId);
      break;
    default:
      content = await generateWithClaude(systemPrompt, userInput, activityId);
  }

  return { content, provider };
}

async function generateConsensus(
  systemPrompt: string,
  userInput: string
): Promise<{ content: string; providers: AIProvider[]; individualResponses: Record<AIProvider, string> }> {
  // Get responses from all 3 AIs in parallel
  const [claudeResponse, gpt4Response, grokResponse] = await Promise.all([
    generateWithClaude(systemPrompt, userInput),
    generateWithGPT4(systemPrompt, userInput),
    generateWithGrok(systemPrompt, userInput),
  ]);

  const individualResponses = {
    claude: claudeResponse,
    gpt4: gpt4Response,
    grok: grokResponse,
  };

  // Use Claude to synthesize the best response
  const synthesisPrompt = `You are a synthesis expert. You've received 3 AI responses to the same prompt. 
Your job is to create the BEST possible response by:
1. Taking the strongest elements from each
2. Removing redundancy
3. Ensuring accuracy and quality
4. Creating a cohesive final response

Do NOT mention that multiple AIs were involved. Just output the best synthesized response.`;

  const synthesisInput = `
**Original Request:** ${userInput}

**Response 1 (Claude):**
${claudeResponse}

**Response 2 (GPT-4):**
${gpt4Response}

**Response 3 (Grok):**
${grokResponse}

Please synthesize the best possible response:`;

  const synthesized = await generateWithClaudeInternal(synthesisPrompt, synthesisInput);

  return {
    content: synthesized,
    providers: ['claude', 'gpt4', 'grok'],
    individualResponses,
  };
}

async function generateReviewChain(
  systemPrompt: string,
  userInput: string
): Promise<{ content: string; chain: { step: string; provider: AIProvider; content: string }[] }> {
  const chain: { step: string; provider: AIProvider; content: string }[] = [];

  // Step 1: Grok generates initial creative draft
  const draft = await generateWithGrok(systemPrompt, userInput);
  chain.push({ step: 'Initial Draft', provider: 'grok', content: draft });

  // Step 2: GPT-4 reviews and improves structure/accuracy
  const reviewPrompt = `You are an editor. Review and improve this draft. 
Fix any issues with structure, clarity, or accuracy. Keep the good parts. 
Output ONLY the improved version, no commentary.`;
  const reviewed = await generateWithGPT4Internal(reviewPrompt, `Original request: ${userInput}\n\nDraft to improve:\n${draft}`);
  chain.push({ step: 'Reviewed & Improved', provider: 'gpt4', content: reviewed });

  // Step 3: Claude polishes for tone and emotional intelligence
  const polishPrompt = `You are a final editor specializing in tone and emotional intelligence.
Polish this text for the perfect tone - not too formal, not too casual. 
Ensure it sounds human and empathetic. Output ONLY the final version.`;
  const polished = await generateWithClaudeInternal(polishPrompt, `Original request: ${userInput}\n\nText to polish:\n${reviewed}`);
  chain.push({ step: 'Final Polish', provider: 'claude', content: polished });

  return {
    content: polished,
    chain,
  };
}

async function generateCompare(
  systemPrompt: string,
  userInput: string,
  activityId?: string
): Promise<{ responses: { provider: AIProvider; content: string }[] }> {
  // Get all 3 responses in parallel
  const [claudeResponse, gpt4Response, grokResponse] = await Promise.all([
    generateWithClaude(systemPrompt, userInput, activityId),
    generateWithGPT4(systemPrompt, userInput, activityId),
    generateWithGrok(systemPrompt, userInput, activityId),
  ]);

  return {
    responses: [
      { provider: 'claude', content: claudeResponse },
      { provider: 'gpt4', content: gpt4Response },
      { provider: 'grok', content: grokResponse },
    ],
  };
}

// ============================================================================
// API ROUTE HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();
    const { systemPrompt, userInput, mode, provider, taskType, activityId } = body;

    if (!systemPrompt || !userInput) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let result: any;

    switch (mode) {
      case 'single':
        result = await generateSingle(systemPrompt, userInput, provider || 'claude', activityId);
        break;

      case 'specialist':
        const specialistAI = getSpecialistAI(taskType || '');
        result = await generateSingle(systemPrompt, userInput, specialistAI, activityId);
        result.specialist = true;
        result.reason = `${specialistAI.toUpperCase()} selected as specialist for this task type`;
        break;

      case 'consensus':
        result = await generateConsensus(systemPrompt, userInput);
        break;

      case 'review-chain':
        result = await generateReviewChain(systemPrompt, userInput);
        break;

      case 'compare':
        result = await generateCompare(systemPrompt, userInput, activityId);
        break;

      default:
        result = await generateSingle(systemPrompt, userInput, 'claude', activityId);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Multi-AI generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}