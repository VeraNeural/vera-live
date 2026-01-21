import OpenAI from 'openai';

let grok: OpenAI | null = null;

export function getGrok(): OpenAI {
  if (!grok) {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing XAI_API_KEY');
    }
    grok = new OpenAI({
      apiKey,
      baseURL: 'https://api.x.ai/v1',
    });
  }
  return grok;
}
