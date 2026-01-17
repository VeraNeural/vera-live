import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createHash } from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type SpeakBody = {
  text: string;
  languageCode?: string;
};

function getRequiredEnvAny(names: string[]): { name: string; value: string } {
  for (const name of names) {
    const value = process.env[name];
    if (value) return { name, value };
  }

  throw new Error(`Missing required environment variable: set one of ${names.join(', ')}`);
}

function safePathSegment(input: string): string {
  return input.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function getAudioBucketCandidates(): string[] {
  const fromEnv = (process.env.SUPABASE_AUDIO_BUCKET || '').trim();
  const candidates = [fromEnv, 'vera-live', 'Vera-live'].filter(Boolean);
  return Array.from(new Set(candidates));
}

async function synthesizeWithHumeTts(input: { text: string; languageCode?: string }): Promise<{ audio: Buffer; contentType: string }> {
  const { name: apiKeyEnv, value: apiKey } = getRequiredEnvAny(['HUMEAI_API_KEY', 'HUME_API_KEY']);

  const resp = await fetch('https://api.hume.ai/v0/tts/stream/file', {
    method: 'POST',
    headers: {
      'X-Hume-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      utterances: [
        {
          text: input.text,
          // Best-effort hint to TTS engines (ignored if unsupported)
          language: input.languageCode,
          voice: {
            name: 'Male English Actor',
            provider: 'HUME_AI',
          },
        },
      ],
      strip_headers: true,
      split_utterances: false,
      instant_mode: true,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(
      `Hume TTS failed (${resp.status} ${resp.statusText}) using ${apiKeyEnv}${errText ? `: ${errText}` : ''}`
    );
  }

  const contentType = resp.headers.get('content-type') || 'audio/wav';
  const arrayBuffer = await resp.arrayBuffer();
  return { audio: Buffer.from(arrayBuffer), contentType };
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: SpeakBody;
  try {
    body = (await req.json()) as SpeakBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  const languageCode = typeof body.languageCode === 'string' ? body.languageCode.trim() : undefined;

  if (!text) {
    return NextResponse.json({ error: 'Missing required field: text' }, { status: 400 });
  }

  if (text.length > 5000) {
    return NextResponse.json({ error: 'Text too long' }, { status: 413 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { audio, contentType } = await synthesizeWithHumeTts({ text, languageCode });

    const bucketCandidates = getAudioBucketCandidates();
    const hash = createHash('sha1').update(`${languageCode || 'und'}:${text}`).digest('hex').slice(0, 16);
    const path = `tts/phrases/${safePathSegment(languageCode || 'und')}/${Date.now()}_${hash}.wav`;

    let chosenBucket: string | null = null;
    let lastUploadError: string | null = null;

    for (const bucket of bucketCandidates) {
      const uploadResult = await supabaseAdmin.storage.from(bucket).upload(path, audio, {
        contentType,
        upsert: true,
      });

      if (!uploadResult.error) {
        chosenBucket = bucket;
        break;
      }

      lastUploadError = uploadResult.error.message;
    }

    if (!chosenBucket) {
      return NextResponse.json(
        { error: `Storage upload failed (buckets tried: ${bucketCandidates.join(', ')}): ${lastUploadError || 'unknown error'}` },
        { status: 500 }
      );
    }

    const publicUrlResult = supabaseAdmin.storage.from(chosenBucket).getPublicUrl(path);
    const audioUrl = publicUrlResult.data.publicUrl;

    return NextResponse.json({ audioUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Speak failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
