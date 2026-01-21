import { generateWithVeraNeuralInternal } from '../providers';

type AIProvider = 'claude' | 'gpt4' | 'grok' | 'vera-neural';

// Import the public generation functions (these need to be passed in or imported)
// Since they're in route.ts, we'll need to pass them as parameters or re-export them

export async function generateSingle(
  systemPrompt: string,
  userInput: string,
  provider: AIProvider,
  generators: {
    generateWithClaude: (systemPrompt: string, userInput: string, activityId?: string) => Promise<string>;
    generateWithGPT4: (systemPrompt: string, userInput: string, activityId?: string) => Promise<string>;
    generateWithGrok: (systemPrompt: string, userInput: string, activityId?: string) => Promise<string>;
  },
  activityId?: string
): Promise<{ content: string; provider: AIProvider }> {
  let content: string;

  switch (provider) {
    case 'claude':
      content = await generators.generateWithClaude(systemPrompt, userInput, activityId);
      break;
    case 'gpt4':
      content = await generators.generateWithGPT4(systemPrompt, userInput, activityId);
      break;
    case 'grok':
      content = await generators.generateWithGrok(systemPrompt, userInput, activityId);
      break;
    case 'vera-neural':
      content = await generateWithVeraNeuralInternal(systemPrompt, userInput);
      break;
    default:
      content = await generators.generateWithClaude(systemPrompt, userInput, activityId);
  }

  return { content, provider };
}
