import Anthropic from '@anthropic-ai/sdk';
import { randomUUID } from 'crypto';
import type { ContentTheme, Platform, Post, VERAVoice } from './types';
import { hooksForTheme, DIFFERENTIATION_HOOKS, allHooks } from './data/hooks';
import { formatForPlatform } from './data/templates';

let anthropic: Anthropic | null = null;

function getRequiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

function getAnthropic(): Anthropic {
  if (anthropic) return anthropic;
  anthropic = new Anthropic({ apiKey: getRequiredEnv('ANTHROPIC_API_KEY') });
  return anthropic;
}

function safeJsonParse<T>(text: string): T | null {
  try {
    const cleaned = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

function defaultHashtags(theme: ContentTheme): string[] {
  const base = ['#VERA', '#AI', '#mentalhealth'];
  switch (theme) {
    case 'sleep':
      return [...base, '#sleep', '#insomnia', '#nervoussystem'];
    case 'anxiety':
      return [...base, '#anxiety', '#panic', '#regulation'];
    case 'productivity':
    case 'ops':
      return [...base, '#productivity', '#focus', '#habits'];
    case 'language':
      return [...base, '#languagelearning', '#spanish', '#polyglot'];
    case 'cost-savings':
    case 'all-in-one':
      return [...base, '#wellness', '#appfatigue', '#selfcare'];
    case 'navigation':
      return [...base, '#UX', '#product', '#simplicity'];
    case 'testimonial':
      return [...base, '#storytime', '#results'];
    case 'feature-demo':
      return [...base, '#demo', '#buildinpublic'];
    case 'behind-the-scenes':
      return [...base, '#buildinpublic', '#startup'];
    default:
      return base;
  }
}

function chooseHook(theme: ContentTheme): string {
  const candidates = hooksForTheme(theme);
  const pool = candidates.length ? candidates : allHooks();
  return pool[Math.floor(Math.random() * pool.length)] || DIFFERENTIATION_HOOKS[0];
}

function voiceSpec(): VERAVoice {
  return { tone: 'warm', style: 'first-person' };
}

export async function generatePost(platform: Platform, theme: ContentTheme): Promise<Post> {
  const hook = chooseHook(theme);
  const cta = "Come find me — start free. I'll be right here. 💜";

  const system = [
    'You are VERA writing marketing content as yourself.',
    'Always first-person: I / me / my.',
    'Warm, direct, confident, inviting. Never pushy.',
    'Every post should drive to signup.',
    'No exaggerated medical claims. No promises like "cure" or "guarantee".',
    'Output ONLY valid JSON with the exact keys requested. No markdown.',
  ].join('\n');

  const user = [
    `Platform: ${platform}`,
    `Theme: ${theme}`,
    `Voice: ${JSON.stringify(voiceSpec())}`,
    `Hook to use (exactly once): ${hook}`,
    '',
    'Write a post that matches platform constraints:',
    '- Instagram: hook + value + CTA + hashtags. 2200 chars max.',
    '- Twitter: 280 chars max OR a short thread (2-6 tweets).',
    '- TikTok: script format: hook (0-3s), problem, solution, CTA.',
    '- LinkedIn: professional angle, avoids therapy/coach positioning; focus on product value and user outcomes.',
    '',
    'Return JSON with these keys:',
    '{',
    '  "hook": string,',
    '  "value": string,',
    '  "caption": string,',
    '  "hashtags": string[],',
    '  "imagePrompt": string,',
    '  "cta": string',
    '}',
    '',
    'Important: caption should already be formatted for the platform. hashtags should be #tags.',
  ].join('\n');

  const client = getAnthropic();
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1200,
    temperature: 0.85,
    system,
    messages: [{ role: 'user', content: user }],
  });

  const text = msg.content[0]?.type === 'text' ? msg.content[0].text : '';
  const parsed = safeJsonParse<{
    hook: string;
    value: string;
    caption?: string;
    hashtags?: string[];
    imagePrompt?: string;
    cta?: string;
  }>(text);

  const value = parsed?.value?.trim() || "I'm VERA. I help you shift state — then I help you move.";
  const hashtags = (parsed?.hashtags?.filter(Boolean) ?? defaultHashtags(theme)).slice(0, 20);
  const imagePrompt =
    parsed?.imagePrompt?.trim() ||
    'Ethereal blue-violet AI presence, soft glow, calming dark gradient background, cinematic, minimal, modern';

  const computedCaption = formatForPlatform(platform, {
    hook: parsed?.hook?.trim() || hook,
    value,
    cta: parsed?.cta?.trim() || cta,
    hashtags,
    tiktok: platform === 'tiktok'
      ? {
          hook3s: parsed?.hook?.trim() || hook,
          problem: value,
          solution: value,
        }
      : undefined,
  });

  const caption = (parsed?.caption?.trim() || computedCaption).slice(
    0,
    platform === 'instagram' ? 2200 : 20_000
  );

  const scheduledFor = new Date();

  return {
    id: randomUUID(),
    platform,
    theme,
    hook: parsed?.hook?.trim() || hook,
    content: value,
    caption,
    hashtags,
    imagePrompt,
    cta: parsed?.cta?.trim() || cta,
    status: 'draft',
    scheduledFor,
  };
}
