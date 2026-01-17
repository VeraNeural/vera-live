import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type NarrateRequestBody = {
  text: string;
  storyId: string;
  chapterId?: string;
};

type NarrationProfile = 'default' | 'rest';

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getRequiredEnvAny(names: string[]): { name: string; value: string } {
  for (const name of names) {
    const value = process.env[name];
    if (value) return { name, value };
  }

  throw new Error(
    `Missing required environment variable: set one of ${names.join(', ')}`
  );
}

function safePathSegment(input: string): string {
  return input.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function getAudioBucketCandidates(): string[] {
  const fromEnv = (process.env.SUPABASE_AUDIO_BUCKET || '').trim();
  const candidates = [fromEnv, 'vera-live', 'Vera-live'].filter(Boolean);
  // De-dupe while preserving order
  return Array.from(new Set(candidates));
}

function isRestChamberStoryId(storyId: string): boolean {
  return storyId.toLowerCase().startsWith('rest-');
}

function isRestfulStoryCategory(category: string): boolean {
  const normalized = category.trim().toLowerCase();
  return normalized === 'rest-sleep' || normalized === 'guided-journeys' || normalized === 'meditative-tales';
}

function getHumeVoiceProvider(): string {
  return (process.env.HUME_TTS_VOICE_PROVIDER || 'HUME_AI').trim() || 'HUME_AI';
}

function getVoiceNameForProfile(profile: NarrationProfile): string {
  const envName =
    profile === 'rest'
      ? (process.env.HUME_TTS_VOICE_NAME_REST || '').trim()
      : (process.env.HUME_TTS_VOICE_NAME_DEFAULT || '').trim();

  // Keep the existing hardcoded voice as a safe fallback.
  return envName || 'Male English Actor';
}

function getUtteranceTuning(profile: NarrationProfile): { speed?: number; description?: string } {
  if (profile !== 'rest') return {};

  return {
    speed: 0.85,
    description:
      'Soft, calm, soothing bedtime narration. Warm and gentle tone. Unhurried pace with natural pauses. Low energy, reassuring, intimate. Avoid sharp emphasis.',
  };
}

async function synthesizeWithHumeTts(input: { text: string; profile: NarrationProfile }): Promise<{ audio: Buffer; contentType: string }> {
  const { name: apiKeyEnv, value: apiKey } = getRequiredEnvAny(['HUMEAI_API_KEY', 'HUME_API_KEY']);

  const provider = getHumeVoiceProvider();
  const voiceName = getVoiceNameForProfile(input.profile);
  const tuning = getUtteranceTuning(input.profile);

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
          ...tuning,
          voice: {
            // Works with Hume Voice Library voices
            name: voiceName,
            provider,
          },
        },
      ],
      // Avoid multi-file headers in streamed output.
      strip_headers: true,
      // Keep mapping 1:1 with the provided utterance.
      split_utterances: false,
      instant_mode: true,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    return Promise.reject(
      new Error(
        `Hume TTS failed (${resp.status} ${resp.statusText}) using ${apiKeyEnv}${errText ? `: ${errText}` : ''}`
      )
    );
  }

  const contentType = resp.headers.get('content-type') || 'audio/wav';
  const arrayBuffer = await resp.arrayBuffer();
  return { audio: Buffer.from(arrayBuffer), contentType };
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  let body: NarrateRequestBody;
  try {
    body = (await req.json()) as NarrateRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  const storyId = typeof body.storyId === 'string' ? body.storyId.trim() : '';
  const chapterId = typeof body.chapterId === 'string' ? body.chapterId.trim() : undefined;

  if (!text || !storyId) {
    return NextResponse.json({ error: 'Missing required fields: text, storyId' }, { status: 400 });
  }

  if (text.length > 50_000) {
    return NextResponse.json({ error: 'Text too long' }, { status: 413 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();

    // Best-effort: if this storyId is a DB story (often a UUID), use its category to choose a narration profile.
    // Rest Chamber content may not be backed by a `stories` row, so we do not hard-fail.
    const { data: storyMeta } = await supabaseAdmin
      .from('stories')
      .select('category, chapters')
      .eq('id', storyId)
      .maybeSingle();

    const storyCategory = typeof (storyMeta as any)?.category === 'string' ? ((storyMeta as any).category as string) : '';
    const chaptersRawFromMeta = (storyMeta as any)?.chapters;

    const profile: NarrationProfile =
      isRestChamberStoryId(storyId) || (storyCategory && isRestfulStoryCategory(storyCategory)) ? 'rest' : 'default';

    // 1) Synthesize audio with Hume (server-side key)
    const { audio, contentType } = await synthesizeWithHumeTts({ text, profile });

    // 2) Upload to Supabase Storage
    const bucketCandidates = getAudioBucketCandidates();
    const path = `stories/${safePathSegment(storyId)}/${safePathSegment(chapterId || 'full')}.wav`;

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
        {
          error: `Storage upload failed (buckets tried: ${bucketCandidates.join(', ')}): ${lastUploadError || 'unknown error'}`,
        },
        { status: 500 }
      );
    }

    const publicUrlResult = supabaseAdmin.storage.from(chosenBucket).getPublicUrl(path);
    const audioUrl = publicUrlResult.data.publicUrl;

    // 3) Best-effort: update story record with audioUrl (stored on chapter object in `chapters` JSON)
    // Rest Chamber content isn't necessarily backed by a `stories` row, so we don't hard-fail.
    const chaptersRaw = chaptersRawFromMeta;
    const chapters = Array.isArray(chaptersRaw) ? chaptersRaw : null;

    if (chapters && chapters.length > 0) {
      let targetChapterId = chapterId;
      if (!targetChapterId) {
        if (chapters.length === 1 && typeof chapters[0]?.id === 'string') {
          targetChapterId = chapters[0].id;
        }
      }

      if (targetChapterId) {
        const idx = chapters.findIndex((ch: any) => ch?.id === targetChapterId);
        if (idx !== -1) {
          chapters[idx] = {
            ...chapters[idx],
            audioUrl,
          };

          await supabaseAdmin.from('stories').update({ chapters }).eq('id', storyId);
        }
      }
    }

    return NextResponse.json({ audioUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Narration failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
