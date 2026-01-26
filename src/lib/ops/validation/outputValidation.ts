import { ACTIVITY_MODEL_CONTRACTS, OutputType } from '../config/activityModelContracts';

export type ValidationResult = {
  valid: boolean;
  reasons: string[];
};

type ActivityValidationRule = {
  minLength?: number;
  requiredSubstrings?: string[];
  forbiddenSubstrings?: string[];
};

const OUTPUT_TYPE_VALIDATORS: Record<OutputType, (output: string) => boolean> = {
  draft: (output) => output.trim().length > 20,
  script: (output) => output.trim().length > 20,
  plan: (output) => output.trim().length > 20,
  analysis: (output) => output.trim().length > 30,
  summary: (output) => output.trim().length > 20,
  ideas: (output) => output.split('\n').length >= 3 || /\d\./.test(output),
  explanation: (output) => output.trim().length > 30,
  checklist: (output) => output.split('\n').length >= 3 || /-\s/.test(output),
  guide: (output) => output.trim().length > 30,
  quiz: (output) => /\?/.test(output) && /answer/i.test(output),
};

const ACTIVITY_VALIDATION_RULES: Record<string, ActivityValidationRule> = {
  // Minimal deterministic rules; keep empty when no safe markers exist.
  'knowledge-test': { requiredSubstrings: ['answer'], minLength: 50 },
  summarize: { minLength: 30 },
  'book-summary': { minLength: 50 },
  respond: { minLength: 20 },
  'write-email': { minLength: 40 },
};

export function validateOutput(activityId: string, output: string): ValidationResult {
  const reasons: string[] = [];
  const contract = ACTIVITY_MODEL_CONTRACTS[activityId];

  console.log('[validateOutput] activityId:', activityId);
  console.log('[validateOutput] output length:', output?.length);
  console.log('[validateOutput] output trimmed length:', output?.trim().length);
  console.log('[validateOutput] contract:', contract ? { outputType: contract.outputType } : 'MISSING');

  if (!contract) {
    console.log('[validateOutput] FAIL: Missing contract');
    return { valid: false, reasons: ['Missing activity model contract.'] };
  }

  if (!output || !output.trim()) {
    console.log('[validateOutput] FAIL: Empty output');
    return { valid: false, reasons: ['Empty output.'] };
  }

  const typeValidator = OUTPUT_TYPE_VALIDATORS[contract.outputType];
  const typeValidatorResult = typeValidator ? typeValidator(output) : false;
  console.log('[validateOutput] outputType:', contract.outputType);
  console.log('[validateOutput] typeValidator exists:', !!typeValidator);
  console.log('[validateOutput] typeValidator result:', typeValidatorResult);
  
  if (!typeValidator || !typeValidatorResult) {
    console.log('[validateOutput] FAIL: Output type validation failed for type:', contract.outputType);
    reasons.push('Output type validation failed.');
  }

  const rules = ACTIVITY_VALIDATION_RULES[activityId];
  console.log('[validateOutput] activity-specific rules:', rules);
  
  if (rules?.minLength && output.trim().length < rules.minLength) {
    console.log('[validateOutput] FAIL: Output length', output.trim().length, '< minLength', rules.minLength);
    reasons.push('Output length below minimum.');
  }

  if (rules?.requiredSubstrings) {
    const missing = rules.requiredSubstrings.filter((token) => !output.toLowerCase().includes(token.toLowerCase()));
    if (missing.length) {
      reasons.push(`Missing required markers: ${missing.join(', ')}`);
    }
  }

  if (rules?.forbiddenSubstrings) {
    const present = rules.forbiddenSubstrings.filter((token) => output.toLowerCase().includes(token.toLowerCase()));
    if (present.length) {
      reasons.push(`Contains forbidden markers: ${present.join(', ')}`);
    }
  }

  return { valid: reasons.length === 0, reasons };
}
