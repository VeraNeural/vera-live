/**
 * AI Provider modules for Ops Room
 * 
 * Exports individual provider functions and routing logic
 */

export { generateWithClaude } from './claude';
export { generateWithGPT4 } from './gpt4';
export { generateWithGrok } from './grok';

export {
  routeToProvider,
  getSpecialistAI,
  generateWithAllProviders,
  generateConsensus,
  generateReviewChain,
} from './router';
