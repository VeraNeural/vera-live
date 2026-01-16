import { callAnthropic, buildMessagesWithImages, resolveModelByTier } from './anthropicClient';
import type { ChatContext, IncomingMessageWithImage } from './types';
import {
  hasCrisisMarkers,
  isCrisisIntent,
  CRISIS_RESPONSE,
  computeEmotionalDensity,
  hasDependencyMarkers,
  hasUpgradePressure,
} from '../governance/crisisHandler';
import { isThirdAssistantMessageStage } from '../templates/earlyMessages';
import { routeTurn } from '../router';
import { composeSystemPrompt } from '../promptComposer';
import { unifyVeraResponse } from '../unifyVoice';
import { enforceNoDrift } from '../noDrift';
import { finalizeResponse } from '../finalizeResponse';
import { evaluateSignalIntegrity } from '@/lib/sim/evaluateSignalIntegrity';
import { buildThirdAssistantMessage, classifyUserIntent } from '../thirdAssistantMessage';
import { extractTopics, getRelevantKnowledge } from '../knowledge/veraKnowledge';

const UNAVAILABLE = 'VERA is temporarily unavailable. Please try again.';

export type ChatResult = {
  content: string;
  gate?: string;
};

export async function handleMessage(
  messages: IncomingMessageWithImage[],
  context: ChatContext
): Promise<ChatResult> {
  const { tier } = context;

  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const userText = lastUser?.content ?? '';

  if (hasCrisisMarkers(userText)) {
    return { content: CRISIS_RESPONSE };
  }

  const decision = routeTurn({ userText, convo: messages, tier });

  if (isCrisisIntent(decision.intent)) {
    return { content: CRISIS_RESPONSE };
  }

  if (isThirdAssistantMessageStage(messages)) {
    const classification = classifyUserIntent(userText);
    const third = buildThirdAssistantMessage({ intent: classification.intent });
    return { content: third.text };
  }

  const simDecision = evaluateSignalIntegrity({
    tier,
    recent_messages: messages.length,
    emotional_density: computeEmotionalDensity(userText),
    dependency_markers: hasDependencyMarkers(userText),
    crisis_markers: hasCrisisMarkers(userText),
    upgrade_pressure: hasUpgradePressure(userText),
    current_sim_state: 'stable',
  });

  // Extract topics and get relevant knowledge
  const topics = extractTopics(userText);
  const relevantKnowledge = getRelevantKnowledge(topics);

  const system = composeSystemPrompt(decision, {
    projectState: context.projectState ?? null,
    sanctuaryState: context.sanctuaryState ?? null,
    extraSystem: relevantKnowledge,
  });

  const model = resolveModelByTier(tier);

  const response = await callAnthropic({
    model: model.apiModel,
    maxTokens: model.maxTokens,
    system,
    messages,
  });

  if (!response.success) {
    return { content: UNAVAILABLE };
  }

  const unified = unifyVeraResponse({
    draftText: response.content,
    decision,
  });

  const noDrift = enforceNoDrift({
    decision,
    selection: { model: 'anthropic', reason: 'tier_default', safety_fallback: false },
    veraText: unified.text,
  });

  const finalized = finalizeResponse({
    text: noDrift.vera,
    iba_active: false,
    sim_state: simDecision.next_sim_state,
  });

  return { content: finalized.text };
}