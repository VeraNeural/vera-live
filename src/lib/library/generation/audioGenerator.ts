export type NarrateInput = {
  text: string;
  storyId: string;
  chapterId?: string;
};

export type NarrateResult = {
  audioUrl: string;
};

async function parseErrorResponse(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as any;
    if (data && typeof data.error === 'string') return data.error;
    return JSON.stringify(data);
  } catch {
    try {
      return await res.text();
    } catch {
      return 'Request failed';
    }
  }
}

// Client-side helper that calls the server narration route.
// Loading and UI state should be managed by the caller.
export async function generateStoryAudio(
  input: NarrateInput,
  options?: { signal?: AbortSignal }
): Promise<NarrateResult> {
  const text = input.text.trim();
  const storyId = input.storyId.trim();
  const chapterId = input.chapterId?.trim();

  if (!text) {
    throw new Error('Missing narration text');
  }
  if (!storyId) {
    throw new Error('Missing storyId');
  }

  const res = await fetch('/api/narrate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, storyId, chapterId }),
    signal: options?.signal,
  });

  if (!res.ok) {
    const msg = await parseErrorResponse(res);
    throw new Error(msg || `Narration failed (${res.status})`);
  }

  const data = (await res.json()) as any;
  if (!data || typeof data.audioUrl !== 'string' || !data.audioUrl) {
    throw new Error('Narration returned an invalid audioUrl');
  }

  return { audioUrl: data.audioUrl };
}
