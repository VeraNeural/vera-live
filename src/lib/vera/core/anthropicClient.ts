import Anthropic from '@anthropic-ai/sdk';
import type { IncomingMessageWithImage, RoutingTier } from './types';

/**
 * Result from calling the Anthropic API
 */
export type AnthropicCallResult = {
  content: string;
  tokensUsed: number;
  success: boolean;
  error?: string;
};

/**
 * Resolve model configuration based on routing tier
 * Canonical names must match specs/model_routing_policy.json preferred_models
 */
export function resolveModelByTier(tier: RoutingTier): {
  canonical: string;
  apiModel: string;
  maxTokens: number;
} {
  if (tier === 'free') {
    return { canonical: 'claude-haiku', apiModel: 'claude-3-5-haiku-20241022', maxTokens: 400 };
  }
  if (tier === 'build') {
    return { canonical: 'claude-opus', apiModel: 'claude-3-opus-20240229', maxTokens: 2000 };
  }
  return { canonical: 'claude-sonnet', apiModel: 'claude-sonnet-4-20250514', maxTokens: 900 };
}

/**
 * Convert IncomingMessageWithImage[] to Anthropic's message format
 * Handles image attachments correctly
 */
export function buildMessagesWithImages(
  messages: IncomingMessageWithImage[]
): Array<{
  role: 'user' | 'assistant';
  content: string | Array<{ type: string; source?: unknown; text?: string }>;
}> {
  return messages.map((m) => {
    if (m.role === 'user' && m.image?.base64 && m.image?.mediaType) {
      return {
        role: m.role,
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: m.image.mediaType,
              data: m.image.base64,
            },
          },
          { type: 'text', text: m.content },
        ],
      };
    }

    return {
      role: m.role,
      content: m.content,
    };
  });
}

/**
 * Call the Anthropic API with graceful error handling
 * NO AbortController/signal - that caused the previous 400 error
 */
export async function callAnthropic(input: {
  model: string;
  maxTokens: number;
  system: string;
  messages: IncomingMessageWithImage[];
}): Promise<AnthropicCallResult> {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const anthropicMessages = buildMessagesWithImages(input.messages);

    const result = await client.messages.create({
      model: input.model,
      max_tokens: input.maxTokens,
      system: input.system,
      messages: anthropicMessages as any,
    } as any);

    const outputTokens = (result as any)?.usage?.output_tokens ?? 0;

    const content = result.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();

    return {
      content,
      tokensUsed: outputTokens,
      success: true,
    };
  } catch (err) {
    const error = err as any;
    console.error('[Anthropic API] call failed', err);

    return {
      content: "[[VERA]]I'm having trouble connecting right now. Please try again in a moment.[[/VERA]]",
      tokensUsed: 0,
      success: false,
      error: error?.message || 'Unknown error',
    };
  }
}
