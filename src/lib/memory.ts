import { createClient } from "@/lib/supabase/server";

export type UserMemory = {
  name?: string;
  preferences?: {
    tone?: string;
    topics_to_avoid?: string[];
  };
  key_facts?: string[];
  last_seen?: string;
};

export type MemoryContext = {
  memory: UserMemory;
  recent_summaries: string[];
};

/**
 * Get user's memory and recent conversation summaries
 */
export async function getUserMemory(userId: string): Promise<MemoryContext | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .rpc('get_user_memory', { p_user_id: userId });

    if (error) {
      console.error('[Memory] Error fetching memory:', error);
      return null;
    }

    return data as MemoryContext;
  } catch (err) {
    console.error('[Memory] Exception:', err);
    return null;
  }
}

/**
 * Update user's memory with new information
 */
export async function updateUserMemory(
  userId: string, 
  updates: Partial<UserMemory>
): Promise<boolean> {
  try {
    const supabase = await createClient();

    // Merge with last_seen
    const memoryUpdate = {
      ...updates,
      last_seen: new Date().toISOString().split('T')[0],
    };

    const { error } = await supabase
      .rpc('update_user_memory', { 
        p_user_id: userId, 
        p_memory: memoryUpdate 
      });

    if (error) {
      console.error('[Memory] Error updating memory:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Memory] Exception:', err);
    return false;
  }
}

/**
 * Save a conversation
 */
export async function saveConversation(
  userId: string,
  messages: Array<{ role: string; content: string }>,
  title?: string,
  summary?: string
): Promise<string | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        title: title || generateTitle(messages),
        messages,
        summary,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[Memory] Error saving conversation:', error);
      return null;
    }

    return data.id;
  } catch (err) {
    console.error('[Memory] Exception:', err);
    return null;
  }
}

/**
 * Update an existing conversation
 */
export async function updateConversation(
  conversationId: string,
  messages: Array<{ role: string; content: string }>,
  summary?: string
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const updateData: Record<string, unknown> = { messages };
    if (summary) {
      updateData.summary = summary;
    }

    const { error } = await supabase
      .from('conversations')
      .update(updateData)
      .eq('id', conversationId);

    if (error) {
      console.error('[Memory] Error updating conversation:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Memory] Exception:', err);
    return false;
  }
}

/**
 * Get recent conversations for a user
 */
export async function getRecentConversations(
  userId: string,
  limit: number = 10
): Promise<Array<{ id: string; title: string; summary: string; updated_at: string }>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('conversations')
      .select('id, title, summary, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[Memory] Error fetching conversations:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('[Memory] Exception:', err);
    return [];
  }
}

/**
 * Generate a title from the first user message
 */
function generateTitle(messages: Array<{ role: string; content: string }>): string {
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (!firstUserMessage) return 'New conversation';
  
  const content = firstUserMessage.content;
  if (content.length <= 50) return content;
  return content.substring(0, 47) + '...';
}

/**
 * Build memory context string for the system prompt
 */
export function buildMemoryPrompt(context: MemoryContext | null): string {
  if (!context) return '';

  const parts: string[] = [];
  const { memory, recent_summaries } = context;

  // Add user info
  if (memory.name) {
    parts.push(`The user's name is ${memory.name}.`);
  }

  // Add key facts
  if (memory.key_facts && memory.key_facts.length > 0) {
    parts.push(`Key facts about them: ${memory.key_facts.join(', ')}.`);
  }

  // Add preferences
  if (memory.preferences?.tone) {
    parts.push(`They prefer a ${memory.preferences.tone} tone.`);
  }
  if (memory.preferences?.topics_to_avoid && memory.preferences.topics_to_avoid.length > 0) {
    parts.push(`Avoid discussing: ${memory.preferences.topics_to_avoid.join(', ')}.`);
  }

  // Add last seen
  if (memory.last_seen) {
    const lastSeen = new Date(memory.last_seen);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - lastSeen.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      parts.push('You spoke with them earlier today.');
    } else if (daysDiff === 1) {
      parts.push('You last spoke with them yesterday.');
    } else if (daysDiff < 7) {
      parts.push(`You last spoke with them ${daysDiff} days ago.`);
    } else if (daysDiff < 30) {
      parts.push(`You last spoke with them about ${Math.floor(daysDiff / 7)} week(s) ago.`);
    }
  }

  // Add recent conversation summaries
  if (recent_summaries && recent_summaries.length > 0) {
    parts.push('\nRecent conversations:');
    recent_summaries.forEach((summary, i) => {
      if (summary) {
        parts.push(`- ${summary}`);
      }
    });
  }

  if (parts.length === 0) return '';

  return `\n<user_memory>\n${parts.join('\n')}\n</user_memory>`;
}