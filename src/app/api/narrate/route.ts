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

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function safePathSegment(input: string): string {
  return input.replace(/[^a-zA-Z0-9._-]/g, '_');
}

async function synthesizeWithHumeTts(input: { text: string }): Promise<{ audio: Buffer; contentType: string }>
{
  const apiKey = getRequiredEnv('HUME_API_KEY');

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
          voice: {
            // Works with Hume Voice Library voices
            name: 'Male English Actor',
            provider: 'HUME_AI',
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
        `Hume TTS failed (${resp.status} ${resp.statusText})${errText ? `: ${errText}` : ''}`
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

    // 1) Synthesize audio with Hume (server-side key)
    const { audio, contentType } = await synthesizeWithHumeTts({ text });

    // 2) Upload to Supabase Storage
    const bucket = 'story-audio';
    const path = `stories/${safePathSegment(storyId)}/${safePathSegment(chapterId || 'full')}.wav`;

    const uploadResult = await supabaseAdmin.storage.from(bucket).upload(path, audio, {
      contentType,
      upsert: true,
    });

    if (uploadResult.error) {
      return NextResponse.json(
        { error: `Storage upload failed: ${uploadResult.error.message}` },
        { status: 500 }
      );
    }

    const publicUrlResult = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
    const audioUrl = publicUrlResult.data.publicUrl;

    // 3) Best-effort: update story record with audioUrl (stored on chapter object in `chapters` JSON)
    // Rest Chamber content isn't necessarily backed by a `stories` row, so we don't hard-fail.
    const { data: storyRow } = await supabaseAdmin
      .from('stories')
      .select('chapters')
      .eq('id', storyId)
      .maybeSingle();

    const chaptersRaw = (storyRow as any)?.chapters;
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
