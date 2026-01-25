import { NextResponse, type NextRequest } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Rate limit: 1 export per hour per user
const RATE_LIMIT_MS = 60 * 60 * 1000; // 1 hour
const exportTimestamps = new Map<string, number>();

function checkRateLimit(userId: string): { allowed: boolean; retryAfter?: number } {
  const lastExport = exportTimestamps.get(userId);
  const now = Date.now();
  
  if (lastExport && now - lastExport < RATE_LIMIT_MS) {
    const retryAfter = Math.ceil((RATE_LIMIT_MS - (now - lastExport)) / 1000);
    return { allowed: false, retryAfter };
  }
  
  return { allowed: true };
}

function sanitizeForExport<T extends Record<string, unknown>>(
  data: T,
  allowedFields: string[]
): Partial<T> {
  const sanitized: Partial<T> = {};
  for (const field of allowedFields) {
    if (field in data) {
      sanitized[field as keyof T] = data[field as keyof T];
    }
  }
  return sanitized;
}

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Check rate limit
    const rateCheck = checkRateLimit(userId);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. You can request a data export once per hour.',
          retryAfter: rateCheck.retryAfter,
        },
        { status: 429 }
      );
    }

    // 3. Get user info from Clerk
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress ?? 
                  user?.emailAddresses?.[0]?.emailAddress ?? null;

    // 4. Collect data from database
    const supabase = getSupabaseAdmin();
    const exportData: Record<string, unknown> = {
      export_date: new Date().toISOString(),
      export_version: '1.0',
    };

    // User profile
    exportData.user = {
      id: userId,
      email: email,
      created_at: user?.createdAt ? new Date(user.createdAt).toISOString() : null,
      first_name: user?.firstName ?? null,
      last_name: user?.lastName ?? null,
    };

    // User preferences
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('memory_consent, memory_consent_date, created_at, updated_at')
      .eq('clerk_user_id', userId)
      .single();

    exportData.preferences = preferences ? sanitizeForExport(preferences, [
      'memory_consent',
      'memory_consent_date',
      'created_at',
      'updated_at',
    ]) : null;

    // User entitlements (subscription info - non-sensitive)
    const { data: entitlements } = await supabase
      .from('user_entitlements')
      .select('state, remaining_messages, lifetime_messages, created_at, updated_at')
      .eq('clerk_user_id', userId)
      .single();

    exportData.subscription = entitlements ? sanitizeForExport(entitlements, [
      'state',
      'remaining_messages',
      'lifetime_messages',
      'created_at',
      'updated_at',
    ]) : null;

    // Conversations and messages (user-facing content only)
    const { data: conversations } = await supabase
      .from('conversations')
      .select(`
        id,
        title,
        created_at,
        updated_at,
        messages (
          id,
          role,
          content,
          created_at
        )
      `)
      .eq('clerk_user_id', userId)
      .order('created_at', { ascending: false });

    exportData.conversations = (conversations ?? []).map((conv: Record<string, unknown>) => ({
      id: conv.id,
      title: conv.title,
      created_at: conv.created_at,
      updated_at: conv.updated_at,
      messages: ((conv.messages as Array<Record<string, unknown>>) ?? [])
        .filter((msg: Record<string, unknown>) => 
          msg.role === 'user' || msg.role === 'assistant'
        )
        .map((msg: Record<string, unknown>) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          created_at: msg.created_at,
        })),
    }));

    // User memories (if stored)
    const { data: memories } = await supabase
      .from('user_memories')
      .select('id, summary, topics, created_at, updated_at')
      .eq('clerk_user_id', userId);

    exportData.memories = (memories ?? []).map((mem: Record<string, unknown>) => 
      sanitizeForExport(mem, ['id', 'summary', 'topics', 'created_at', 'updated_at'])
    );

    // 5. Record rate limit timestamp
    exportTimestamps.set(userId, Date.now());

    // 6. Log export request for audit (without logging the data)
    console.log('[DATA_EXPORT] User data exported', {
      userId,
      timestamp: new Date().toISOString(),
      conversationCount: (exportData.conversations as unknown[])?.length ?? 0,
      memoryCount: (exportData.memories as unknown[])?.length ?? 0,
    });

    // 7. Return as downloadable JSON
    const filename = `vera-data-export-${new Date().toISOString().split('T')[0]}.json`;
    
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });

  } catch (err) {
    console.error('[DATA_EXPORT] Export failed', err);
    return NextResponse.json(
      { error: 'Failed to export data. Please try again later.' },
      { status: 500 }
    );
  }
}
