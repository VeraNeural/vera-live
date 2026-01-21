type AIProvider = 'claude' | 'gpt4' | 'grok' | 'vera-neural';

export async function generateCompare(
  systemPrompt: string,
  userInput: string,
  generators: {
    generateWithClaude: (systemPrompt: string, userInput: string, activityId?: string) => Promise<string>;
    generateWithGPT4: (systemPrompt: string, userInput: string, activityId?: string) => Promise<string>;
    generateWithGrok: (systemPrompt: string, userInput: string, activityId?: string) => Promise<string>;
  },
  activityId?: string
): Promise<{ responses: { provider: AIProvider; content: string }[] }> {
  // Get all 3 responses in parallel
  const [claudeResponse, gpt4Response, grokResponse] = await Promise.all([
    generators.generateWithClaude(systemPrompt, userInput, activityId),
    generators.generateWithGPT4(systemPrompt, userInput, activityId),
    generators.generateWithGrok(systemPrompt, userInput, activityId),
  ]);

  return {
    responses: [
      { provider: 'claude', content: claudeResponse },
      { provider: 'gpt4', content: gpt4Response },
      { provider: 'grok', content: grokResponse },
    ],
  };
}
