import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

let anthropic: Anthropic | null = null;

type TranslateBody = {
  text: string;
  from: string;
  to: string;
};

function getClient(): Anthropic {
  if (!anthropic) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('Missing ANTHROPIC_API_KEY');
    anthropic = new Anthropic({ apiKey });
  }
  return anthropic;
}

function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: TranslateBody;
  try {
    body = (await req.json()) as TranslateBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  const from = typeof body.from === 'string' ? body.from.trim() : '';
  const to = typeof body.to === 'string' ? body.to.trim() : '';

  if (!text || !from || !to) {
    return NextResponse.json({ error: 'Missing required fields: text, from, to' }, { status: 400 });
  }

  if (text.length > 5000) {
    return NextResponse.json({ error: 'Text too long' }, { status: 413 });
  }

  try {
    const system = `You are a translation assistant. Translate accurately and naturally.

Return ONLY valid JSON (no markdown) in this exact shape:
{"translatedText":"..."}

Rules:
- Keep meaning, tone, and politeness.
- Do not add explanations.
- Do not include extra keys.
- If input is already in the target language, return it unchanged.`;

    const user = `FROM: ${from}
TO: ${to}
TEXT: ${text}`;

    const response = await getClient().messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system,
      messages: [{ role: 'user', content: user }],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    const raw = textBlock && 'text' in textBlock ? textBlock.text : '';

    const parsed = safeJsonParse<{ translatedText: string }>(raw);
    const translatedText = typeof parsed?.translatedText === 'string' ? parsed.translatedText : '';

    if (!translatedText) {
      return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
    }

    return NextResponse.json({ translatedText });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Translation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
