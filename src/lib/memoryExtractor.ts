import Anthropic from "@anthropic-ai/sdk";

let anthropic: Anthropic | null = null;

const MEMORY_EXTRACT_TIMEOUT_MS = 6_000;
const MEMORY_SUMMARY_TIMEOUT_MS = 4_000;

const MAX_RAW_MODEL_CHARS = 12_000;
const MAX_NAME_CHARS = 80;
const MAX_SUMMARY_CHARS = 420;
const MAX_FACTS = 10;
const MAX_FACT_CHARS = 220;
const MAX_TOTAL_MEMORY_BYTES = 2_000;

function stripInjectionLikeContent(input: string): string {
  const text = (input ?? '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const withoutCodeFences = text.replace(/```[\s\S]*?```/g, '').trim();
  const lines = withoutCodeFences
    .split('\n')
    .filter((line) => !/^\s*(system|developer|assistant|tool|function)\s*:/i.test(line))
    .filter((line) => !/^\s*\[\[(?:NEURAL|VERA)\]\]/i.test(line));
  return lines.join('\n').trim();
}

function clampString(input: unknown, maxChars: number): string {
  if (typeof input !== 'string') return '';
  const cleaned = stripInjectionLikeContent(input).trim();
  if (!cleaned) return '';
  return cleaned.length > maxChars ? cleaned.slice(0, maxChars).trim() : cleaned;
}

function bytes(input: string): number {
  try {
    return Buffer.byteLength(input ?? '', 'utf8');
  } catch {
    return (input ?? '').length;
  }
}

function extractFirstTextBlock(response: any): string {
  try {
    const block = response?.content?.find?.((b: any) => b?.type === 'text');
    return typeof block?.text === 'string' ? block.text : '';
  } catch {
    return '';
  }
}

async function anthropicCreateWithTimeout(params: any, timeoutMs: number): Promise<any> {
  if (!anthropic && process.env.ANTHROPIC_API_KEY) {
    anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await anthropic!.messages.create({ ...params, signal: controller.signal } as any);
  } finally {
    clearTimeout(timeout);
  }
}

function validateAndBuildExtractedMemory(input: unknown, existingName: string): ExtractedMemory | null {
  if (!input || typeof input !== 'object') return null;

  const obj = input as Record<string, unknown>;
  const allowedKeys = new Set(['name', 'new_facts', 'summary']);
  for (const key of Object.keys(obj)) {
    if (!allowedKeys.has(key)) return null;
  }

  const summary = clampString(obj.summary, MAX_SUMMARY_CHARS);
  if (!summary) return null;

  const result: ExtractedMemory = { summary };

  const name = clampString(obj.name, MAX_NAME_CHARS);
  if (name && name !== 'null' && existingName === 'unknown') {
    result.name = name;
  }

  const newFactsRaw = obj.new_facts;
  if (Array.isArray(newFactsRaw) && newFactsRaw.length > 0) {
    const cleanedFacts = newFactsRaw
      .slice(0, MAX_FACTS)
      .map((f) => clampString(f, MAX_FACT_CHARS))
      .filter(Boolean);
    if (cleanedFacts.length) {
      result.key_facts = cleanedFacts;
    }
  }

  // Enforce a hard cap on total memory bytes we will ever return/save.
  // If over, trim facts first (summary is the highest value signal).
  let total = bytes(result.summary);
  if (result.name) total += bytes(result.name);
  if (result.key_facts) total += bytes(result.key_facts.join('\n'));

  if (total > MAX_TOTAL_MEMORY_BYTES && result.key_facts && result.key_facts.length) {
    const facts: string[] = [];
    for (const fact of result.key_facts) {
      const nextTotal = total - bytes(result.key_facts.join('\n')) + bytes([...facts, fact].join('\n'));
      if (nextTotal > MAX_TOTAL_MEMORY_BYTES) break;
      facts.push(fact);
    }
    result.key_facts = facts;
  }

  // If still over, drop name.
  total = bytes(result.summary) + (result.name ? bytes(result.name) : 0) + (result.key_facts ? bytes(result.key_facts.join('\n')) : 0);
  if (total > MAX_TOTAL_MEMORY_BYTES) {
    delete result.name;
  }

  return result;
}

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ExtractedMemory = {
  name?: string;
  key_facts?: string[];
  preferences?: {
    tone?: string;
    topics_to_avoid?: string[];
  };
  summary: string;
};

/**
 * Extract memory updates and summary from a conversation
 */
export async function extractMemoryFromConversation(
  messages: Message[],
  existingMemory?: { name?: string; key_facts?: string[] }
): Promise<ExtractedMemory | null> {
  if (messages.length < 2) return null;

  // Non-user-facing control-plane note (no raw content logged).
  console.info('[Memory Extraction] non_user_facing', { messages: messages.length });

  const conversationText = messages
    .map(m => `${m.role === 'user' ? 'User' : 'VERA'}: ${m.content}`)
    .join('\n');

  const existingFacts = existingMemory?.key_facts?.join(', ') || 'none';
  const existingName = existingMemory?.name || 'unknown';

  try {
    const response = await anthropicCreateWithTimeout(
      {
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: `Analyze this conversation and extract information. Be conservative - only extract facts that are clearly stated.

Current known info:
- Name: ${existingName}
- Known facts: ${existingFacts}

Conversation:
${conversationText}

Respond in this exact JSON format (no markdown, just JSON):
{
  "name": "extracted name or null if not mentioned",
  "new_facts": ["array of new facts learned, or empty array"],
  "summary": "1-2 sentence summary of what was discussed and any emotional context"
}

Only include genuinely new information not already in known facts.`
          }
        ],
      },
      MEMORY_EXTRACT_TIMEOUT_MS
    );

    const text = extractFirstTextBlock(response);
    const raw = typeof text === 'string' ? text.trim() : '';
    if (!raw || raw.length > MAX_RAW_MODEL_CHARS) {
      console.warn('[Memory Extraction] invalid_output', { reason: !raw ? 'empty' : 'too_large' });
      return { summary: 'Conversation with user.' };
    }

    // Pre-parse guardrails (avoid surprises / junk outside JSON).
    const trimmed = raw.trim();
    if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
      console.warn('[Memory Extraction] invalid_output', { reason: 'not_json_object' });
      return { summary: 'Conversation with user.' };
    }

    let parsed: unknown = null;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      console.warn('[Memory Extraction] invalid_output', { reason: 'json_parse_failed' });
      return { summary: 'Conversation with user.' };
    }

    const validated = validateAndBuildExtractedMemory(parsed, existingName);
    if (!validated) {
      console.warn('[Memory Extraction] invalid_output', { reason: 'schema_validation_failed' });
      return { summary: 'Conversation with user.' };
    }

    return validated;
  } catch (err) {
    console.error('[Memory Extraction] Error:', err);
    return {
      summary: 'Conversation with user.',
    };
  }
}

/**
 * Generate just a summary (lighter weight)
 */
export async function generateConversationSummary(
  messages: Message[]
): Promise<string> {
  if (messages.length < 2) return 'Brief interaction.';

  const conversationText = messages
    .slice(-10) // Last 10 messages max
    .map(m => `${m.role === 'user' ? 'User' : 'VERA'}: ${m.content}`)
    .join('\n');

  try {
    const response = await anthropicCreateWithTimeout(
      {
        model: "claude-sonnet-4-20250514",
        max_tokens: 100,
        messages: [
          {
            role: "user",
            content: `Summarize this conversation in 1-2 sentences, focusing on the main topic and emotional tone:

${conversationText}

Summary:`
          }
        ],
      },
      MEMORY_SUMMARY_TIMEOUT_MS
    );

    const text = extractFirstTextBlock(response);
    const cleaned = clampString(text, 320);
    return cleaned || 'Conversation with user.';
  } catch (err) {
    console.error('[Summary Generation] Error:', err);
    return 'Conversation with user.';
  }
}