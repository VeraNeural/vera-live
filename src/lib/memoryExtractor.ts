import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

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

  const conversationText = messages
    .map(m => `${m.role === 'user' ? 'User' : 'VERA'}: ${m.content}`)
    .join('\n');

  const existingFacts = existingMemory?.key_facts?.join(', ') || 'none';
  const existingName = existingMemory?.name || 'unknown';

  try {
    const response = await anthropic.messages.create({
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
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    
    // Parse JSON response
    const parsed = JSON.parse(text);

    const result: ExtractedMemory = {
      summary: parsed.summary || 'Conversation with user.',
    };

    // Only include name if it's new
    if (parsed.name && parsed.name !== 'null' && existingName === 'unknown') {
      result.name = parsed.name;
    }

    // Only include truly new facts
    if (parsed.new_facts && Array.isArray(parsed.new_facts) && parsed.new_facts.length > 0) {
      result.key_facts = parsed.new_facts;
    }

    return result;
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
    const response = await anthropic.messages.create({
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
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return text.trim() || 'Conversation with user.';
  } catch (err) {
    console.error('[Summary Generation] Error:', err);
    return 'Conversation with user.';
  }
}