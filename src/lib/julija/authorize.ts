// JULIJA - Core Authorization Layer

import { assignRiskBand, type RiskBand } from './riskBand';
import { createJustification, hashMessage } from './justification';
import { evaluateContext, type ContextEvaluation, type SessionMessage } from './context';
import { validateUserTier } from './userTier';

export interface AuthorizeRequest {
  userId: string;
  userTier: string;
  userEmail: string;
  messageContent: string;
  sessionContext: SessionMessage[];
}

export interface AuthorizeResponse {
  authorized: boolean;
  riskBand: RiskBand;
  justification: object;
  reason?: string;
}

/**
 * JULIJA Core Authorization Function
 * First layer in VERA's governance: JULIJA → SIM → IBA
 * Determines if an interaction is authorized and assigns risk level
 */
export async function authorize(request: AuthorizeRequest): Promise<AuthorizeResponse> {
  const { userId, userTier, userEmail, messageContent, sessionContext } = request;

  // Step 1: Validate user tier
  const tierInfo = await validateUserTier(userId, userEmail);

  if (!tierInfo.isValid) {
    const justification = createJustification({
      userId,
      userTier,
      riskBand: 'red',
      authorized: false,
      reason: 'Invalid user tier or authentication',
      sessionId: sessionContext?.[0]?.sessionId || 'unknown',
      messageHash: hashMessage(messageContent),
    });

    return {
      authorized: false,
      riskBand: 'red',
      justification,
      reason: 'User authentication failed',
    };
  }

  // Step 2: Evaluate session context
  const contextEval = evaluateContext(sessionContext);

  // Step 3: Assign risk band based on message + context
  const riskBand = assignRiskBand(messageContent, contextEval);

  // Step 4: Check if user tier allows this risk level
  const authorized = checkTierRiskAccess(tierInfo.tier, riskBand, contextEval);

  // Step 5: Create audit trail
  const justification = createJustification({
    userId,
    userTier: tierInfo.tier,
    riskBand,
    authorized,
    reason: authorized ? 'Access granted' : 'Risk level exceeds tier permissions',
    sessionId: sessionContext?.[0]?.sessionId || 'unknown',
    messageHash: hashMessage(messageContent),
  });

  return {
    authorized,
    riskBand,
    justification,
    reason: authorized ? undefined : 'Interaction requires elevated access',
  };
}

/**
 * Check if user tier has access at given risk level
 */
function checkTierRiskAccess(
  tier: string,
  riskBand: RiskBand,
  context: ContextEvaluation
): boolean {
  // Admins always have access
  if (tier === 'admin') return true;

  // Sanctuary users have full access
  if (tier === 'sanctuary') return true;

  // Free users: green and yellow only
  if (tier === 'free') {
    return riskBand === 'green' || riskBand === 'yellow';
  }

  // Anonymous users: green only, with message limits
  if (tier === 'anonymous') {
    return riskBand === 'green' && (context?.messageCount || 0) < 5;
  }

  return false;
}