import OpenAI from 'openai';

let openai: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing OPENAI_API_KEY');
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
}

export async function generateWithGPT4Internal(systemPrompt: string, userInput: string): Promise<string> {
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
