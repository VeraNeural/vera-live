import { createClient } from '@/lib/supabase/server';

export type AccessState = 'anonymous' | 'free' | 'sanctuary';

export type UserAccessState = {
  state: AccessState;
  dailyMessageCount?: number;
  entitlement_source?: 'user_entitlements' | 'none';
  period_end?: string | null;
};

function getPeriodEnd(row: Record<string, unknown> | null | undefined): string | null {
  if (!row) return null;
  const raw = (row.current_period_end ?? row.expires_at ?? row.ends_at ?? row.valid_until) as unknown;
  return typeof raw === 'string' && raw.trim() ? raw : null;
}

function isLikelyActiveSanctuaryEntitlement(row: Record<string, unknown> | null | undefined): boolean {
  if (!row) return false;

  const rawEntitlement = (row.entitlement ?? row.tier ?? row.product ?? row.sku ?? row.plan) as unknown;
  const entitlement = typeof rawEntitlement === 'string' ? rawEntitlement.toLowerCase() : '';

  const rawStatus = (row.status ?? row.state) as unknown;
  const status = typeof rawStatus === 'string' ? rawStatus.toLowerCase() : '';

  const rawActive = row.active as unknown;
  const activeFlag = typeof rawActive === 'boolean' ? rawActive : undefined;

  const isSanctuary = entitlement === 'sanctuary' || entitlement.includes('sanctuary');
  if (!isSanctuary) return false;

  const statusOk =
    activeFlag === true ||
    status === '' ||
    status === 'active' ||
    status === 'trialing' ||
    status === 'paid' ||
    status === 'granted';

  if (!statusOk) return false;

  const expiryRaw = (row.expires_at ?? row.ends_at ?? row.current_period_end ?? row.valid_until) as unknown;
  if (typeof expiryRaw === 'string' && expiryRaw.trim()) {
    const expiryMs = Date.parse(expiryRaw);
    if (Number.isFinite(expiryMs) && Date.now() > expiryMs) return false;
  }

  return true;
}

export async function getUserAccessState(userId?: string): Promise<UserAccessState> {
  if (!userId) return { state: 'anonymous', entitlement_source: 'none', period_end: null };

  const supabase = await createClient();

  // Server-authoritative entitlement check.
  // Supabase Auth is not used; identity is Clerk userId.
  const { data, error } = await supabase
    .from('user_entitlements')
    .select('*')
    .eq('clerk_user_id', userId);

  if (error) {
    // Fail closed: if entitlement lookup fails, treat as free (most restrictive authenticated state).
    // The API layer enforces gating based on this state.
    return { state: 'free', entitlement_source: 'none', period_end: null };
  }

  const rows = Array.isArray(data) ? (data as Array<Record<string, unknown>>) : [];
  const sanctuaryRow = rows.find((row) => isLikelyActiveSanctuaryEntitlement(row));

  return {
    state: sanctuaryRow ? 'sanctuary' : 'free',
    entitlement_source: 'user_entitlements',
    period_end: getPeriodEnd(sanctuaryRow),
  };
}
