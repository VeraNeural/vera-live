const VERA_NEURAL_CONFIG = {
  endpoint: 'http://192.168.1.200:1234/v1/chat/completions',
  model: 'qwen/qwen3-30b-a3b-2507',
};

export async function generateWithVeraNeural(prompt: string, systemPrompt?: string): Promise<string> {
  const response = await fetch(VERA_NEURAL_CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: VERA_NEURAL_CONFIG.model,
      messages: [
        { role: 'system', content: systemPrompt || 'You are VERA, a supportive AI assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}
