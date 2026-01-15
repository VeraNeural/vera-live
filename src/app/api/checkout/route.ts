import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getStripe(): Stripe {
  const secretKey = getRequiredEnv('STRIPE_SECRET_KEY');
  return new Stripe(secretKey, {
    apiVersion: '2025-12-15.clover',
  });
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'You must be logged in to subscribe' }, { status: 401 });
    }

    const supabase = await createClient();
    const user = await (await clerkClient()).users.getUser(userId);

    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (existingSubscription) {
      return NextResponse.json({ error: 'You already have an active subscription' }, { status: 400 });
    }

    const origin = request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      customer_email: user.emailAddresses?.[0]?.emailAddress ?? undefined,
      client_reference_id: userId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: getRequiredEnv('STRIPE_PRICE_ID'),
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          user_id: userId,
        },
      },
      success_url: `${origin}/sanctuarysuccess=true`,
      cancel_url: `${origin}/sanctuary?canceled=true`,
      metadata: {
        user_id: userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
