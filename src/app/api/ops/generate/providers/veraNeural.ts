import OpenAI from 'openai';

let veraNeuralClient: OpenAI | null = null;

export function getVeraNeuralClient(): OpenAI {
  if (!veraNeuralClient) {
    // LM Studio bridge accepts requests without an API key
    veraNeuralClient = new OpenAI({
      apiKey: 'not-needed',
      baseURL: 'http://localhost:3000/api/ai/lm-studio',
    });
  }
  return veraNeuralClient;
}

export async function generateWithVeraNeuralInternal(systemPrompt: string, userInput: string): Promise<string> {
  const response = await getVeraNeuralClient().chat.completions.create({
    model: 'qwen/qwen3-30b-a3b-2507',
    max_tokens: 8192,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput },
    ],
  });

  return response.choices[0]?.message?.content || 'No response generated.';
}
