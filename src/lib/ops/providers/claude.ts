import Anthropic from '@anthropic-ai/sdk';

let anthropic: Anthropic | null = null;

function getAnthropic(): Anthropic {
  if (!anthropic) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('Missing ANTHROPIC_API_KEY');
    }
    anthropic = new Anthropic({ apiKey });
  }
  return anthropic;
}

/**
 * Generate text using Claude (Anthropic API)
 */
export async function generateWithClaude(
  systemPrompt: string,
  userInput: string
): Promise<string> {
  const client = getAnthropic();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: 'user', content: userInput }],
  });

  const textBlock = response.content.find(block => block.type === 'text');
  return textBlock && 'text' in textBlock ? textBlock.text : 'No response generated.';
}
