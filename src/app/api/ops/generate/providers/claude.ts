import Anthropic from '@anthropic-ai/sdk';

let anthropic: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (!anthropic) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('Missing ANTHROPIC_API_KEY');
    }
    anthropic = new Anthropic({ apiKey });
  }
  return anthropic;
}

export async function generateWithClaudeInternal(systemPrompt: string, userInput: string): Promise<string> {
  const client = getAnthropic();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: 'user', content: userInput }],
  });

  const textBlock = response.content.find(block => block.type === 'text');
  return textBlock ? textBlock.text : 'No response generated.';
}
