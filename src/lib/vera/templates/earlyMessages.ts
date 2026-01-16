/**
 * Early conversation templates and stage detection.
 * Handles the second (anchor) and third/fourth assistant message stages.
 */

export const SECOND_ASSISTANT_ANCHOR =
  "I'm here with you.\n\nWe can take this one step at a time — whether you want to think something through, build something concrete, or just get things out of your head.\n\nWhat would be most helpful right now?";

/**
 * Checks if the given content matches the second assistant anchor message.
 */
export function isSecondAssistantAnchor(content: string | undefined): boolean {
  return (content ?? '').trim() === SECOND_ASSISTANT_ANCHOR.trim();
}

/**
 * Detects if the conversation is at the third assistant message stage.
 * Stage: 1 user message, 1 assistant message (the anchor).
 */
export function isThirdAssistantMessageStage(messages: { role: string; content: string }[]): boolean {
  const userCount = messages.filter((m) => m.role === 'user').length;
  const assistantCount = messages.filter((m) => m.role === 'assistant').length;
  if (userCount !== 1 || assistantCount !== 1) return false;
  const assistant = messages.find((m) => m.role === 'assistant');
  return isSecondAssistantAnchor(assistant?.content);
}

/**
 * Detects if the conversation is at the fourth assistant message stage.
 * Stage: 2 user messages, 2 assistant messages (anchor + third message template).
 */
export function isFourthAssistantMessageStage(messages: { role: string; content: string }[]): boolean {
  const userCount = messages.filter((m) => m.role === 'user').length;
  const assistantMessages = messages.filter((m) => m.role === 'assistant');
  if (userCount !== 2 || assistantMessages.length !== 2) return false;

  const hasAnchor = assistantMessages.some((m) => isSecondAssistantAnchor(m.content));
  const hasThird = assistantMessages.some((m) =>
    m.content &&
    [
      "Thank you for saying that.\n\nBefore we try to fix or decide anything, let's slow this down just enough so we understand what you're actually carrying.\n\nWhat feels heaviest right now — the situation itself, or how it's affecting you?",
      "Let's get clear before we go deep.\n\nIf you had to name the one thing that feels most unclear or tangled right now, what would it be?",
      "Got it — we can build this together.\n\nTo start cleanly: what are you trying to create, and who is it for?",
      "Happy to explore this with you.\n\nAre you looking to understand this at a high level, or do you want something practical you can use right away?",
      "Decisions get heavy when too many things are competing at once.\n\nWhat feels more urgent here: making the right choice, or avoiding a bad one?",
      "That's okay — we don't need a plan yet.\n\nI'm here. What's been taking up space in your head lately?",
    ].some((t) => (m.content ?? '').trim() === t.trim())
  );

  return hasAnchor && hasThird;
}
