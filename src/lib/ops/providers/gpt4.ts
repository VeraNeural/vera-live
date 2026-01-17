import OpenAI from 'openai';

let openai: OpenAI | null = null;

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

/**
 * Generate text using GPT-4 (OpenAI API)
 */
export async function generateWithGPT4(
  systemPrompt: string,
  userInput: string
): Promise<string> {
  const client = getOpenAI();

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 8192,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput },
    ],
  });

  return response.choices[0]?.message?.content || 'No response generated.';
}
