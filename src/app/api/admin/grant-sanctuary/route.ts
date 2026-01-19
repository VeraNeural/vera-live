import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Admin-only endpoint to grant Sanctuary access
export async function POST(request: NextRequest) {
  try {
    // Security check - only allow in development or with proper auth
    const authHeader = request.headers.get('authorization');
    const isDev = process.env.NODE_ENV !== 'production';
    
    if (!isDev && authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, clerkUserId } = body;

    if (!email && !clerkUserId) {
      return NextResponse.json({ error: 'Email or clerkUserId required' }, { status: 400 });
    }

    let finalClerkUserId = clerkUserId;

    // If email provided, find user by email in Clerk
    if (!finalClerkUserId && email) {
      try {
        const client = await clerkClient();
        const users = await client.users.getUserList({
          emailAddress: [email],
          limit: 1,
        });

        if (users.totalCount === 0) {
          return NextResponse.json({ error: 'User not found in Clerk' }, { status: 404 });
        }

        finalClerkUserId = users.data[0].id;
      } catch (clerkError) {
        console.error('Clerk API error:', clerkError);
        return NextResponse.json({ 
          error: 'Clerk API unavailable. Please provide clerkUserId directly',
          instruction: 'Find the Clerk user ID for krajceva@gmail.com in the Clerk dashboard and use { "clerkUserId": "user_xxx" } instead'
        }, { status: 503 });
      }
    }

    if (!finalClerkUserId) {
      return NextResponse.json({ error: 'Could not resolve Clerk user ID' }, { status: 400 });
    }

    // Grant permanent Sanctuary entitlement
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();
    
    // Set far future expiration date (10 years from now) for permanent access
    const permanentEnd = new Date();
    permanentEnd.setFullYear(permanentEnd.getFullYear() + 10);
    
    const { error } = await supabase
      .from('user_entitlements')
      .upsert(
        {
          clerk_user_id: finalClerkUserId,
          entitlement: 'sanctuary',
          status: 'active',
          current_period_start: now,
          current_period_end: permanentEnd.toISOString(),
          updated_at: now,
        },
        {
          onConflict: 'clerk_user_id,entitlement',
        }
      );

    if (error) {
      throw new Error(`Failed to grant Sanctuary access: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Sanctuary access granted successfully',
      details: {
        email: email || 'provided via clerkUserId',
        clerkUserId: finalClerkUserId,
        entitlement: 'sanctuary',
        status: 'active',
        expires: permanentEnd.toISOString(),
        storage: 'user_entitlements table',
      },
    });
  } catch (error) {
    console.error('Error granting Sanctuary access:', error);
    return NextResponse.json(
      { error: 'Failed to grant access', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check current access
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
    }

    // Find user by email in Clerk
    const client = await clerkClient();
    const users = await client.users.getUserList({
      emailAddress: [email],
      limit: 1,
    });

    if (users.totalCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users.data[0];
    const clerkUserId = user.id;

    // Check current entitlement
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('user_entitlements')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .eq('entitlement', 'sanctuary')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw error;
    }

    return NextResponse.json({
      email,
      clerkUserId,
      hasAccess: !!data,
      entitlement: data || null,
    });
  } catch (error) {
    console.error('Error checking access:', error);
    return NextResponse.json(
      { error: 'Failed to check access', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}