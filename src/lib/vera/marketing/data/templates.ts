import type { Platform } from '../types';

function clampHashtags(tags: string[], max: number): string[] {
  const out: string[] = [];
  for (const t of tags) {
    const cleaned = t.trim();
    if (!cleaned) continue;
    if (out.includes(cleaned)) continue;
    out.push(cleaned);
    if (out.length >= max) break;
  }
  return out;
}

export function formatHashtags(tags: string[], max = 12): string {
  const finalTags = clampHashtags(tags, max);
  if (finalTags.length === 0) return '';
  return finalTags.join(' ');
}

export function renderInstagramCaption(input: {
  hook: string;
  value: string;
  cta: string;
  hashtags: string[];
}): string {
  const tags = formatHashtags(input.hashtags, 18);
  const caption = [input.hook, '', input.value, '', input.cta, tags ? '' : '', tags].filter(Boolean).join('\n');
  return caption.slice(0, 2200);
}

export function renderTwitterThread(input: {
  hook: string;
  value: string;
  cta: string;
}): { tweets: string[]; text: string } {
  const base = [input.hook, '', input.value, '', input.cta].filter(Boolean).join('\n');
  const max = 280;

  if (base.length <= max) {
    return { tweets: [base], text: base };
  }

  // Naive thread splitting on paragraph boundaries.
  const parts = base.split(/\n\n+/g).map((p) => p.trim()).filter(Boolean);
  const tweets: string[] = [];
  let current = '';

  for (const p of parts) {
    const candidate = current ? `${current}\n\n${p}` : p;
    if (candidate.length <= max - 6) {
      current = candidate;
      continue;
    }
    if (current) tweets.push(current);
    if (p.length <= max - 6) {
      current = p;
    } else {
      // Hard split long paragraphs.
      for (let i = 0; i < p.length; i += max - 12) {
        tweets.push(p.slice(i, i + (max - 12)));
      }
      current = '';
    }
  }
  if (current) tweets.push(current);

  const numbered = tweets.map((t, idx) => {
    const suffix = ` (${idx + 1}/${tweets.length})`;
    const trimmed = t.length + suffix.length <= max ? t : t.slice(0, max - suffix.length);
    return `${trimmed}${suffix}`;
  });

  return { tweets: numbered, text: numbered.join('\n\n') };
}

export function renderTikTokScript(input: {
  hook3s: string;
  problem: string;
  solution: string;
  cta: string;
}): string {
  return [
    'HOOK (0–3s):',
    input.hook3s,
    '',
    'PROBLEM:',
    input.problem,
    '',
    'SOLUTION:',
    input.solution,
    '',
    'CTA:',
    input.cta,
  ].join('\n');
}

export function renderLinkedInPost(input: {
  hook: string;
  value: string;
  cta: string;
}): string {
  // LinkedIn tends to do well with whitespace + short lines.
  return [
    input.hook,
    '',
    input.value,
    '',
    input.cta,
  ].join('\n');
}

export function formatForPlatform(
  platform: Platform,
  payload: {
    hook: string;
    value: string;
    cta: string;
    hashtags: string[];
    tiktok?: { hook3s: string; problem: string; solution: string };
  }
): string {
  switch (platform) {
    case 'instagram':
      return renderInstagramCaption({
        hook: payload.hook,
        value: payload.value,
        cta: payload.cta,
        hashtags: payload.hashtags,
      });
    case 'twitter':
      return renderTwitterThread({ hook: payload.hook, value: payload.value, cta: payload.cta }).text;
    case 'tiktok':
      return renderTikTokScript({
        hook3s: payload.tiktok?.hook3s ?? payload.hook,
        problem: payload.tiktok?.problem ?? payload.value,
        solution: payload.tiktok?.solution ?? payload.value,
        cta: payload.cta,
      });
    case 'linkedin':
      return renderLinkedInPost({ hook: payload.hook, value: payload.value, cta: payload.cta });
    default:
      return renderInstagramCaption({
        hook: payload.hook,
        value: payload.value,
        cta: payload.cta,
        hashtags: payload.hashtags,
      });
  }
}
