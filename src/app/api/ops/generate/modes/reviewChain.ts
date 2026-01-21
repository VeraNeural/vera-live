import { generateWithClaudeInternal, generateWithGPT4Internal } from '../providers';
import { REVIEW_PROMPT, POLISH_PROMPT } from '../prompts';

type AIProvider = 'claude' | 'gpt4' | 'grok' | 'vera-neural';

export async function generateReviewChain(
  systemPrompt: string,
  userInput: string,
  generators: {
    generateWithGrok: (systemPrompt: string, userInput: string, activityId?: string) => Promise<string>;
  }
): Promise<{ content: string; chain: { step: string; provider: AIProvider; content: string }[] }> {
  const chain: { step: string; provider: AIProvider; content: string }[] = [];

  // Step 1: Grok generates initial creative draft
  const draft = await generators.generateWithGrok(systemPrompt, userInput);
  chain.push({ step: 'Initial Draft', provider: 'grok', content: draft });

  // Step 2: GPT-4 reviews and improves structure/accuracy
  const reviewed = await generateWithGPT4Internal(REVIEW_PROMPT, `Original request: ${userInput}\n\nDraft to improve:\n${draft}`);
  chain.push({ step: 'Reviewed & Improved', provider: 'gpt4', content: reviewed });

  // Step 3: Claude polishes for tone and emotional intelligence
  const polished = await generateWithClaudeInternal(POLISH_PROMPT, `Original request: ${userInput}\n\nText to polish:\n${reviewed}`);
  chain.push({ step: 'Final Polish', provider: 'claude', content: polished });

  return {
    content: polished,
    chain,
  };
}
