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

  if (!contract) {
    return { valid: false, reasons: ['Missing activity model contract.'] };
  }

  if (!output || !output.trim()) {
    return { valid: false, reasons: ['Empty output.'] };
  }

  const typeValidator = OUTPUT_TYPE_VALIDATORS[contract.outputType];
  if (!typeValidator || !typeValidator(output)) {
    reasons.push('Output type validation failed.');
  }

  const rules = ACTIVITY_VALIDATION_RULES[activityId];
  if (rules?.minLength && output.trim().length < rules.minLength) {
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
