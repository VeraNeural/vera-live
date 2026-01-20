import { AIProvider } from '../types';
import { generateWithClaude } from './claude';
import { generateWithGPT4 } from './gpt4';
import { generateWithGrok } from './grok';
import { generateWithVeraNeural } from './vera-neural';

/**
 * Specialist mapping: which AI is best for each task type
 */
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
  'job-application-kit': 'claude',

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
  'ai-nervous-system': 'vera-neural',
};

/**
 * Get the specialist AI provider for a given task type
 */
export function getSpecialistAI(taskType: string): AIProvider {
  return SPECIALIST_MAPPING[taskType] || 'claude';
}

/**
 * Route to the correct AI provider based on provider selection
 */
export async function routeToProvider(
  provider: AIProvider,
  systemPrompt: string,
  userInput: string
): Promise<string> {
  switch (provider) {
    case 'claude':
      return generateWithClaude(systemPrompt, userInput);
    case 'gpt4':
      return generateWithGPT4(systemPrompt, userInput);
    case 'grok':
      return generateWithGrok(systemPrompt, userInput);
    case 'vera-neural':
      return generateWithVeraNeural(systemPrompt, userInput);
    default:
      return generateWithClaude(systemPrompt, userInput);
  }
}

/**
 * Generate using all three providers in parallel (for compare mode)
 */
export async function generateWithAllProviders(
  systemPrompt: string,
  userInput: string
): Promise<{ provider: AIProvider; content: string }[]> {
  const [claudeResponse, gpt4Response, grokResponse, veraNeuralResponse] = await Promise.all([
    generateWithClaude(systemPrompt, userInput),
    generateWithGPT4(systemPrompt, userInput),
    generateWithGrok(systemPrompt, userInput),
    generateWithVeraNeural(systemPrompt, userInput),
  ]);

  return [
    { provider: 'claude', content: claudeResponse },
    { provider: 'gpt4', content: gpt4Response },
    { provider: 'grok', content: grokResponse },
    { provider: 'vera-neural', content: veraNeuralResponse },
  ];
}

/**
 * Generate consensus response by getting all three and synthesizing with Claude
 */
export async function generateConsensus(
  systemPrompt: string,
  userInput: string
): Promise<{
  content: string;
  providers: AIProvider[];
  individualResponses: Record<AIProvider, string>;
}> {
  // Get responses from all 3 AIs in parallel
  const [claudeResponse, gpt4Response, grokResponse, veraNeuralResponse] = await Promise.all([
    generateWithClaude(systemPrompt, userInput),
    generateWithGPT4(systemPrompt, userInput),
    generateWithGrok(systemPrompt, userInput),
    generateWithVeraNeural(systemPrompt, userInput),
  ]);

  const individualResponses = {
    claude: claudeResponse,
    gpt4: gpt4Response,
    grok: grokResponse,
    'vera-neural': veraNeuralResponse,
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

**Response 4 (Vera Neural):**
${veraNeuralResponse}

Please synthesize the best possible response:`;

  const synthesized = await generateWithClaude(synthesisPrompt, synthesisInput);

  return {
    content: synthesized,
    providers: ['claude', 'gpt4', 'grok', 'vera-neural'],
    individualResponses,
  };
}

/**
 * Generate using review chain: Grok draft → GPT-4 review → Claude polish
 */
export async function generateReviewChain(
  systemPrompt: string,
  userInput: string
): Promise<{
  content: string;
  chain: { step: string; provider: AIProvider; content: string }[];
}> {
  const chain: { step: string; provider: AIProvider; content: string }[] = [];

  // Step 1: Grok generates initial creative draft
  const draft = await generateWithGrok(systemPrompt, userInput);
  chain.push({ step: 'Initial Draft', provider: 'grok', content: draft });

  // Step 2: GPT-4 reviews and improves structure/accuracy
  const reviewPrompt = `You are an editor. Review and improve this draft. 
Fix any issues with structure, clarity, or accuracy. Keep the good parts. 
Output ONLY the improved version, no commentary.`;
  const reviewed = await generateWithGPT4(
    reviewPrompt,
    `Original request: ${userInput}\n\nDraft to improve:\n${draft}`
  );
  chain.push({ step: 'Reviewed & Improved', provider: 'gpt4', content: reviewed });

  // Step 3: Claude polishes for tone and emotional intelligence
  const polishPrompt = `You are a final editor specializing in tone and emotional intelligence.
Polish this text for the perfect tone - not too formal, not too casual. 
Ensure it sounds human and empathetic. Output ONLY the final version.`;
  const polished = await generateWithClaude(
    polishPrompt,
    `Original request: ${userInput}\n\nText to polish:\n${reviewed}`
  );
  chain.push({ step: 'Final Polish', provider: 'claude', content: polished });

  return {
    content: polished,
    chain,
  };
}
