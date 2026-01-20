// JULIJA - Authorization Layer
// Part of VERA's 3-layer governance: JULIJA → SIM → IBA

export { authorize } from './authorize';
export { assignRiskBand, type RiskBand } from './riskBand';
export { createJustification, type JustificationRecord } from './justification';
export { evaluateContext, type ContextEvaluation } from './context';
export { validateUserTier, checkFeatureAccess, type UserTierInfo } from './userTier';