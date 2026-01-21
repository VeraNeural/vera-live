import { generateWithClaudeInternal } from '../providers';
import { SYNTHESIS_PROMPT } from '../prompts';

type AIProvider = 'claude' | 'gpt4' | 'grok' | 'vera-neural';

export async function generateConsensus(
  systemPrompt: string,
  userInput: string,
  generators: {
    generateWithClaude: (systemPrompt: string, userInput: string, activityId?: string) => Promise<string>;
    generateWithGPT4: (systemPrompt: string, userInput: string, activityId?: string) => Promise<string>;
    generateWithGrok: (systemPrompt: string, userInput: string, activityId?: string) => Promise<string>;
  }
): Promise<{ content: string; providers: AIProvider[]; individualResponses: Record<AIProvider, string> }> {
  // Get responses from all 3 AIs in parallel
  const [claudeResponse, gpt4Response, grokResponse] = await Promise.all([
    generators.generateWithClaude(systemPrompt, userInput),
    generators.generateWithGPT4(systemPrompt, userInput),
    generators.generateWithGrok(systemPrompt, userInput),
  ]);

  const individualResponses = {
    claude: claudeResponse,
    gpt4: gpt4Response,
    grok: grokResponse,
    'vera-neural': '',
  };

  // Use Claude to synthesize the best response
  const synthesisPrompt = SYNTHESIS_PROMPT;

  const synthesisInput = `
**Original Request:** ${userInput}

**Response 1 (Claude):**
${claudeResponse}

**Response 2 (GPT-4):**
${gpt4Response}

**Response 3 (Grok):**
${grokResponse}

Please synthesize the best possible response:`;

  const synthesized = await generateWithClaudeInternal(synthesisPrompt, synthesisInput);

  return {
    content: synthesized,
    providers: ['claude', 'gpt4', 'grok'],
    individualResponses,
  };
}
