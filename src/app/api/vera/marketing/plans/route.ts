import { NextRequest, NextResponse } from 'next/server';
import { assertAdminOrThrow } from '../_admin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import type { ContentTheme, Platform } from '@/lib/vera/marketing/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

export async function GET() {
  try {
    await assertAdminOrThrow();

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from(PLAN_TABLE)
      .select('id,platform,theme,schedule_at,status,campaign_id,drafted_post_id')
      .order('schedule_at', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ plans: (data || []) as PlanRow[] });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'failed';
    const status = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await assertAdminOrThrow();

    const body = (await req.json().catch(() => null)) as {
      id?: string;
      scheduleAt?: string;
    } | null;

    const id = (body?.id || '').trim();
    const scheduleAt = (body?.scheduleAt || '').trim();

    if (!id || !scheduleAt) {
      return NextResponse.json({ error: 'Missing id or scheduleAt' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: updated, error } = await supabase
      .from(PLAN_TABLE)
      .update({ schedule_at: scheduleAt, status: 'scheduled' })
      .eq('id', id)
      .eq('status', 'scheduled')
      .select('id,platform,theme,schedule_at,status,campaign_id,drafted_post_id')
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!updated) return NextResponse.json({ error: 'Plan not schedulable' }, { status: 409 });

    return NextResponse.json({ plan: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'failed';
    const status = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await assertAdminOrThrow();
    const id = (req.nextUrl.searchParams.get('id') || '').trim();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from(PLAN_TABLE).delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'failed';
    const status = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
