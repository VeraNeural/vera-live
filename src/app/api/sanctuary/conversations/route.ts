// ============================================================================
// CONVERSATION API ROUTES
// Save to: src/app/api/sanctuary/conversations/route.ts
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

let supabase: any = null;

function getSupabase(): any {
  if (supabase) {
    return supabase;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }

  supabase = createClient(url, serviceRoleKey) as any;
  return supabase;
}

// ============================================================================
// GET - Load user's conversations or check consent
// ============================================================================
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Check consent status
    if (action === 'consent') {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('memory_consent, memory_consent_date')
        .eq('clerk_user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
        throw error;
      }

      return NextResponse.json({
        hasConsented: data?.memory_consent ?? null, // null = never asked
        consentDate: data?.memory_consent_date ?? null,
      });
    }

    // Load recent conversations (for VERA context)
    if (action === 'recent') {
      const limit = parseInt(searchParams.get('limit') || '5');
      
      const { data: conversations, error } = await supabase
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
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return NextResponse.json({ conversations });
    }

    // Load specific conversation
    const conversationId = searchParams.get('id');
    if (conversationId) {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          title,
          created_at,
          messages (
            id,
            role,
            content,
            created_at
          )
        `)
        .eq('id', conversationId)
        .eq('clerk_user_id', userId)
        .single();

      if (error) throw error;

      return NextResponse.json({ conversation: data });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Conversation GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// ============================================================================
// POST - Save consent, create conversation, or add message
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    // Save consent preference
    if (action === 'consent') {
      const { consent } = body;
      
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          clerk_user_id: userId,
          memory_consent: consent,
          memory_consent_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'clerk_user_id',
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ 
        success: true, 
        consent: data.memory_consent 
      });
    }

    // Create new conversation
    if (action === 'create') {
      const { title, firstMessage } = body;

      // First check if user has consented
      const { data: prefs } = await supabase
        .from('user_preferences')
        .select('memory_consent')
        .eq('clerk_user_id', userId)
        .single();

      if (!prefs?.memory_consent) {
        return NextResponse.json({ error: 'Memory consent required' }, { status: 403 });
      }

      // Create conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          clerk_user_id: userId,
          title: title || generateTitle(firstMessage),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (convError) throw convError;

      return NextResponse.json({ 
        success: true, 
        conversation 
      });
    }

    // Add message to conversation
    if (action === 'message') {
      const { conversationId, role, content } = body;

      // Verify ownership
      const { data: conv } = await supabase
        .from('conversations')
        .select('id')
        .eq('id', conversationId)
        .eq('clerk_user_id', userId)
        .single();

      if (!conv) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }

      // Add message
      const { data: message, error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          role,
          content,
        })
        .select()
        .single();

      if (msgError) throw msgError;

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return NextResponse.json({ 
        success: true, 
        message 
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Conversation POST error:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

// ============================================================================
// DELETE - Remove conversations or all data
// ============================================================================
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const conversationId = searchParams.get('id');

    // Delete specific conversation
    if (conversationId) {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId)
        .eq('clerk_user_id', userId);

      if (error) throw error;

      return NextResponse.json({ success: true });
    }

    // Delete all conversations
    if (action === 'all') {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('clerk_user_id', userId);

      if (error) throw error;

      // Also reset consent
      await supabase
        .from('user_preferences')
        .update({ 
          memory_consent: false,
          updated_at: new Date().toISOString(),
        })
        .eq('clerk_user_id', userId);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Conversation DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

// ============================================================================
// HELPER: Generate title from first message
// ============================================================================
function generateTitle(message: string): string {
  if (!message) return 'New conversation';
  
  // Take first 50 chars, cut at last word
  const truncated = message.slice(0, 50);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 20) {
    return truncated.slice(0, lastSpace) + '...';
  }
  
  return truncated + (message.length > 50 ? '...' : '');
}