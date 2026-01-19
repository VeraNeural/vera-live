import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import type { ContentTheme, Platform } from '@/lib/vera/marketing/types';
import { generatePost } from '@/lib/vera/marketing/contentGenerator';
import { getPost, listPosts, savePost } from '@/lib/vera/marketing/store';
import { postToPlatform as postToX } from '@/lib/vera/marketing/adapters/x';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GLOBAL_CAP_PER_RUN = 8;
const DAILY_CAPS: Record<Platform, number> = {
  instagram: 3,
  twitter: 4,
  tiktok: 3,
  linkedin: 2,
  youtube: 2,
  facebook: 2,
};

const PLAN_TABLE = (process.env.MARKETING_PLAN_TABLE || 'vera_marketing_plans').trim();

type PlanStatus = 'scheduled' | 'drafting' | 'drafted' | 'ready' | 'posted' | 'failed';

type PlanRow = {
  id: string;
  platform: Platform;
  theme: ContentTheme;
  schedule_at: string;
  status: PlanStatus;
  campaign_id?: string | null;
  drafted_post_id?: string | null;
};

function isAutomationEnabled(): boolean {
  return (process.env.MARKETING_AUTOMATION_ENABLED || '').trim().toLowerCase() === 'true';
}

function getCronSecret(req: NextRequest): string {
  const authHeader = req.headers.get('authorization') || '';
  const bearer = authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7) : '';
  return bearer || (req.headers.get('x-cron-secret') || '').trim();
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function buildDailyCounts(posts: Awaited<ReturnType<typeof listPosts>>, now: Date): Record<Platform, number> {
  const counts: Record<Platform, number> = {
    instagram: 0,
    twitter: 0,
    tiktok: 0,
    linkedin: 0,
    youtube: 0,
    facebook: 0,
  };
  const today = dayKey(now);
  for (const p of posts) {
    if (dayKey(p.scheduledFor) !== today) continue;
    counts[p.platform] = (counts[p.platform] || 0) + 1;
  }
  return counts;
}

export async function POST(req: NextRequest) {
  const cronSecret = (process.env.CRON_SECRET || '').trim();
  const provided = getCronSecret(req);

  if (!cronSecret || !provided || provided !== cronSecret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  if (!isAutomationEnabled()) {
    return NextResponse.json({ status: 'disabled', processed: 0, drafted: 0, skipped: 0, failed: 0 });
  }

  const supabase = getSupabaseAdmin();
  const now = new Date();
  const summary = {
    processed: 0,
    drafted: 0,
    skipped: 0,
    failed: 0,
    planTable: PLAN_TABLE,
    at: now.toISOString(),
  };

  let dailyCounts: Record<Platform, number>;
  try {
    const posts = await listPosts();
    dailyCounts = buildDailyCounts(posts, now);
  } catch (err) {
    console.error('[marketing-cron] failed to load posts for daily caps', err);
    return NextResponse.json({ error: 'failed_daily_cap_read' }, { status: 500 });
  }

  const { data: scheduled, error: listError } = await supabase
    .from(PLAN_TABLE)
    .select('id,platform,theme,schedule_at,status,campaign_id,drafted_post_id')
    .eq('status', 'scheduled')
    .lte('schedule_at', now.toISOString())
    .order('schedule_at', { ascending: true })
    .limit(GLOBAL_CAP_PER_RUN * 3);

  if (listError) {
    console.error('[marketing-cron] failed to read plan table', listError);
    return NextResponse.json({ error: 'failed_plan_read' }, { status: 500 });
  }

  const queue = (scheduled || []) as PlanRow[];

  for (const item of queue) {
    if (summary.drafted >= GLOBAL_CAP_PER_RUN) break;

    summary.processed += 1;

    const cap = DAILY_CAPS[item.platform] ?? 0;
    if (cap > 0 && dailyCounts[item.platform] >= cap) {
      summary.skipped += 1;
      continue;
    }

    const { data: claimed, error: claimError } = await supabase
      .from(PLAN_TABLE)
      .update({ status: 'drafting' })
      .eq('id', item.id)
      .eq('status', 'scheduled')
      .select('id,platform,theme,schedule_at,status,campaign_id')
      .maybeSingle();

    if (claimError) {
      summary.failed += 1;
      console.error('[marketing-cron] claim failed', { id: item.id, error: claimError.message });
      continue;
    }

    if (!claimed) {
      summary.skipped += 1;
      continue;
    }

    try {
      const post = await generatePost(item.platform, item.theme);
      const saved = await savePost({
        ...post,
        status: 'draft',
        scheduledFor: new Date(item.schedule_at),
        campaignId: item.campaign_id || undefined,
        planId: item.id,
      });

      const { error: updateError } = await supabase
        .from(PLAN_TABLE)
        .update({
          status: 'drafted',
          drafted_post_id: saved.id,
        })
        .eq('id', item.id);

      if (updateError) {
        summary.failed += 1;
        console.error('[marketing-cron] plan update failed', { id: item.id, error: updateError.message });
        continue;
      }

      summary.drafted += 1;
      dailyCounts[item.platform] = (dailyCounts[item.platform] || 0) + 1;
    } catch (err) {
      summary.failed += 1;
      console.error('[marketing-cron] draft generation failed', { id: item.id, error: err });
      const { error: failUpdateError } = await supabase
        .from(PLAN_TABLE)
        .update({ status: 'failed' })
        .eq('id', item.id)
        .eq('status', 'drafting');
      if (failUpdateError) {
        console.error('[marketing-cron] failed to mark plan failed', { id: item.id, error: failUpdateError.message });
      }
    }
  }

  console.info('[marketing-cron]', JSON.stringify(summary));

  // =============================
  // Execution-only posting (X)
  // =============================
  const postSummary = {
    processed: 0,
    posted: 0,
    skipped: 0,
    failed: 0,
    at: new Date().toISOString(),
  };

  const { data: readyPlans, error: readyError } = await supabase
    .from(PLAN_TABLE)
    .select('id,platform,theme,schedule_at,status,campaign_id,drafted_post_id')
    .eq('status', 'ready')
    .lte('schedule_at', now.toISOString())
    .order('schedule_at', { ascending: true })
    .limit(GLOBAL_CAP_PER_RUN * 3);

  if (readyError) {
    console.error('[marketing-cron] failed to read ready plans', readyError);
    return NextResponse.json({ ...summary, postSummary }, { status: 500 });
  }

  for (const plan of (readyPlans || []) as PlanRow[]) {
    if (postSummary.posted >= GLOBAL_CAP_PER_RUN) break;
    postSummary.processed += 1;

    if (!plan.drafted_post_id) {
      postSummary.failed += 1;
      await supabase
        .from(PLAN_TABLE)
        .update({ status: 'failed' })
        .eq('id', plan.id)
        .eq('status', 'ready');
      continue;
    }

    const { data: claimed, error: claimError } = await supabase
      .from(PLAN_TABLE)
      .update({ status: 'drafting' })
      .eq('id', plan.id)
      .eq('status', 'ready')
      .select('id,platform,theme,schedule_at,status,campaign_id,drafted_post_id')
      .maybeSingle();

    if (claimError || !claimed) {
      postSummary.skipped += 1;
      continue;
    }

    try {
      const post = await getPost(plan.drafted_post_id);
      if (post.status === 'posted') {
        await supabase
          .from(PLAN_TABLE)
          .update({ status: 'posted' })
          .eq('id', plan.id)
          .eq('status', 'drafting');
        postSummary.posted += 1;
        continue;
      }

      if (post.status !== 'ready') {
        await supabase
          .from(PLAN_TABLE)
          .update({ status: 'failed' })
          .eq('id', plan.id)
          .eq('status', 'drafting');
        postSummary.failed += 1;
        continue;
      }

      if (plan.platform !== 'twitter') {
        await supabase
          .from(PLAN_TABLE)
          .update({ status: 'failed' })
          .eq('id', plan.id)
          .eq('status', 'drafting');
        postSummary.failed += 1;
        continue;
      }

      const result = await postToX({
        platform: 'twitter',
        post,
        metadata: {
          hashtags: post.hashtags,
        },
      });

      if (!result.success) {
        await supabase
          .from(PLAN_TABLE)
          .update({ status: 'failed' })
          .eq('id', plan.id)
          .eq('status', 'drafting');
        postSummary.failed += 1;
        continue;
      }

      await savePost({
        ...post,
        status: 'posted',
        postedAt: new Date(),
      });

      await supabase
        .from(PLAN_TABLE)
        .update({ status: 'posted' })
        .eq('id', plan.id)
        .eq('status', 'drafting');

      postSummary.posted += 1;
    } catch (err) {
      await supabase
        .from(PLAN_TABLE)
        .update({ status: 'failed' })
        .eq('id', plan.id)
        .eq('status', 'drafting');
      postSummary.failed += 1;
      console.error('[marketing-cron] posting failed', { id: plan.id, error: err });
    }
  }

  console.info('[marketing-cron-post]', JSON.stringify(postSummary));
  return NextResponse.json({ ...summary, postSummary });
}
