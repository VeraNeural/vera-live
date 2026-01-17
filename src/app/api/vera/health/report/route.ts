import { NextResponse } from 'next/server';
import { assertAdminOrThrow } from '../../_admin';
import { generateDailyReport, generateHealthSummary } from '@/lib/vera/selfHealing/reporter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await assertAdminOrThrow();
    const [summary, dailyReport] = await Promise.all([generateHealthSummary(), generateDailyReport()]);
    return NextResponse.json({ summary, dailyReport });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown_error';
    const code = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : 500;
    return NextResponse.json({ error: msg }, { status: code });
  }
}
