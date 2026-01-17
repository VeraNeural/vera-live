// Local sanity-check helper (not required at runtime).
// Prints available Supabase Storage buckets and verifies the narration audio bucket exists.
// Default expected bucket is `vera-live` (case-sensitive in Supabase).

import fs from 'node:fs';
import path from 'node:path';

function tryLoadDotEnvLocal() {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) return;

    const raw = fs.readFileSync(envPath, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;

      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();

      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // best-effort only
  }
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  tryLoadDotEnvLocal();
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL (and could not load from .env.local)');
  process.exit(1);
}
if (!key) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY (and could not load from .env.local)');
  process.exit(1);
}

const endpoint = `${url.replace(/\/$/, '')}/storage/v1/bucket`;

try {
  const resp = await fetch(endpoint, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });

  const data = await resp.json().catch(() => null);

  if (!resp.ok) {
    console.error(`Storage bucket list failed: ${resp.status} ${resp.statusText}`);
    console.error(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    process.exit(1);
  }

  const buckets = Array.isArray(data) ? data : [];
  const names = buckets.map((b) => b?.name).filter(Boolean);

  console.log('Buckets:', names.join(', ') || '(none)');

  const expected = (process.env.SUPABASE_AUDIO_BUCKET || 'vera-live').trim();
  const ok = names.includes(expected) || names.includes('vera-live') || names.includes('Vera-live');

  if (ok) {
    console.log(`OK: narration bucket exists (expected: ${expected})`);
  } else {
    console.log(`MISSING: narration bucket not found (expected: ${expected}). If you used a different name, set SUPABASE_AUDIO_BUCKET in .env.local.`);
    process.exitCode = 2;
  }
} catch (err) {
  console.error('Error checking buckets:', err?.message || err);
  process.exit(1);
}
