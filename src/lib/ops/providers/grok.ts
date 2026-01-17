import OpenAI from 'openai';

let grok: OpenAI | null = null;

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

/**
 * Generate text using Grok (xAI API)
 */
export async function generateWithGrok(
  systemPrompt: string,
  userInput: string
): Promise<string> {
  const client = getGrok();

  const response = await client.chat.completions.create({
    model: 'grok-3-latest',
    max_tokens: 8192,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput },
    ],
  });

  return response.choices[0]?.message?.content || 'No response generated.';
}
