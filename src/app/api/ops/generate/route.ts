import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// ============================================================================
// MULTI-AI OPS GENERATION API
// Supports: Claude (Anthropic), GPT-4 (OpenAI), Grok (xAI)
// Modes: single, consensus, specialist, review-chain, compare
// ============================================================================

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const grok = new OpenAI({
  apiKey: process.env.XAI_API_KEY!,
  baseURL: 'https://api.x.ai/v1',
});

// ============================================================================
// TYPES
// ============================================================================
type AIProvider = 'claude' | 'gpt4' | 'grok';
type GenerationMode = 'single' | 'consensus' | 'specialist' | 'review-chain' | 'compare';

type GenerationRequest = {
  systemPrompt: string;
  userInput: string;
  mode: GenerationMode;
  provider?: AIProvider; // For single mode
  taskType?: string; // For specialist mode
};

// ============================================================================
// AI GENERATION FUNCTIONS
// ============================================================================

async function generateWithClaude(systemPrompt: string, userInput: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: 'user', content: userInput }],
  });

  const textBlock = response.content.find(block => block.type === 'text');
  return textBlock ? textBlock.text : 'No response generated.';
}

async function generateWithGPT4(systemPrompt: string, userInput: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 8192,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput },
    ],
  });

  return response.choices[0]?.message?.content || 'No response generated.';
}

async function generateWithGrok(systemPrompt: string, userInput: string): Promise<string> {
  const response = await grok.chat.completions.create({
    model: 'grok-3-latest',
    max_tokens: 8192,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput },
    ],
  });

  return response.choices[0]?.message?.content || 'No response generated.';
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
  provider: AIProvider
): Promise<{ content: string; provider: AIProvider }> {
  let content: string;

  switch (provider) {
    case 'claude':
      content = await generateWithClaude(systemPrompt, userInput);
      break;
    case 'gpt4':
      content = await generateWithGPT4(systemPrompt, userInput);
      break;
    case 'grok':
      content = await generateWithGrok(systemPrompt, userInput);
      break;
    default:
      content = await generateWithClaude(systemPrompt, userInput);
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

  const synthesized = await generateWithClaude(synthesisPrompt, synthesisInput);

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
  const reviewed = await generateWithGPT4(reviewPrompt, `Original request: ${userInput}\n\nDraft to improve:\n${draft}`);
  chain.push({ step: 'Reviewed & Improved', provider: 'gpt4', content: reviewed });

  // Step 3: Claude polishes for tone and emotional intelligence
  const polishPrompt = `You are a final editor specializing in tone and emotional intelligence.
Polish this text for the perfect tone - not too formal, not too casual. 
Ensure it sounds human and empathetic. Output ONLY the final version.`;
  const polished = await generateWithClaude(polishPrompt, `Original request: ${userInput}\n\nText to polish:\n${reviewed}`);
  chain.push({ step: 'Final Polish', provider: 'claude', content: polished });

  return {
    content: polished,
    chain,
  };
}

async function generateCompare(
  systemPrompt: string,
  userInput: string
): Promise<{ responses: { provider: AIProvider; content: string }[] }> {
  // Get all 3 responses in parallel
  const [claudeResponse, gpt4Response, grokResponse] = await Promise.all([
    generateWithClaude(systemPrompt, userInput),
    generateWithGPT4(systemPrompt, userInput),
    generateWithGrok(systemPrompt, userInput),
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
    const { systemPrompt, userInput, mode, provider, taskType } = body;

    if (!systemPrompt || !userInput) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let result: any;

    switch (mode) {
      case 'single':
        result = await generateSingle(systemPrompt, userInput, provider || 'claude');
        break;

      case 'specialist':
        const specialistAI = getSpecialistAI(taskType || '');
        result = await generateSingle(systemPrompt, userInput, specialistAI);
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
        result = await generateCompare(systemPrompt, userInput);
        break;

      default:
        result = await generateSingle(systemPrompt, userInput, 'claude');
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