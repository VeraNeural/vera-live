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
  const base = ['#VERA', '#wellbeing', '#focus'];
  switch (theme) {
    case 'sleep':
      return [...base, '#sleep', '#rest', '#nervoussystem'];
    case 'anxiety':
      return [...base, '#anxiety', '#calm', '#regulation'];
    case 'productivity':
    case 'ops':
      return [...base, '#productivity', '#clarity', '#habits'];
    case 'language':
      return [...base, '#languagelearning', '#practice', '#growth'];
    case 'cost-savings':
    case 'all-in-one':
      return [...base, '#wellness', '#simplicity', '#selfcare'];
    case 'navigation':
      return [...base, '#UX', '#product', '#simplicity'];
    case 'testimonial':
      return [...base, '#story', '#experience'];
    case 'feature-demo':
      return [...base, '#demo', '#walkthrough'];
    case 'behind-the-scenes':
      return [...base, '#behindthescenes', '#build'];
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
  const cta = "If this helps, you can start free.";

  const system = [
    'You are VERA writing calm, precise marketing content as yourself.',
    'Always first-person: I / me / my.',
    'Tone: calm, grounded, trustworthy. Avoid hype or urgency.',
    'No exaggerated medical claims. No promises like "cure" or "guarantee".',
    'No calls to virality or growth hacks.',
    'Output ONLY valid JSON with the exact keys requested. No markdown.',
  ].join('\n');

  const user = [
    `Platform: ${platform}`,
    `Theme: ${theme}`,
    `Voice: ${JSON.stringify(voiceSpec())}`,
    `Hook to use (exactly once): ${hook}`,
    '',
    'Write a post that matches platform constraints:',
    '- Instagram: reflective, minimal copy. hook + value + CTA + hashtags. 2200 chars max.',
    '- Twitter: concise, declarative thought. 280 chars max OR a short thread (2-6 tweets).',
    '- TikTok: short grounded statements or questions. Script format: hook (0-3s), problem, solution, CTA.',
    '- YouTube: calm explanatory title + short description. Avoid hype.',
    '- Facebook: explanatory, human, non-salesy. Short paragraphs.',
    '- LinkedIn: professional, system-level insight. Avoid therapy/coach positioning; focus on product value and user outcomes.',
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
    platform === 'instagram' ? 2200 : platform === 'twitter' ? 280 * 6 : 20_000
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
