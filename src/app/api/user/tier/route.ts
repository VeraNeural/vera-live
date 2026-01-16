import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserAccessState } from '@/lib/auth/accessState';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ tier: 'anonymous' });
    }
    
    const access = await getUserAccessState(userId);
    
    return NextResponse.json({ 
      tier: access.state,
      userId 
    });
  } catch (error) {
    console.error('Error checking user tier:', error);
    return NextResponse.json({ tier: 'free' });
  }
}
