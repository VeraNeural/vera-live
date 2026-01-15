import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

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

async function upsertSanctuaryEntitlement(
  supabase: typeof supabaseAdmin,
  input: {
    clerkUserId: string;
    status: string;
    currentPeriodStart?: string | null;
    currentPeriodEnd?: string | null;
  }
): Promise<void> {
  const now = new Date().toISOString();

  const { error } = await supabase
    .from('user_entitlements')
    .upsert(
      {
        clerk_user_id: input.clerkUserId,
        entitlement: 'sanctuary',
        status: input.status,
        current_period_start: input.currentPeriodStart ?? null,
        current_period_end: input.currentPeriodEnd ?? null,
        updated_at: now,
      },
      {
        // Expected unique key: one row per user+entitlement.
        onConflict: 'clerk_user_id,entitlement',
      }
    );

  if (error) {
    throw new Error(`Failed to upsert user_entitlements: ${error.message}`);
  }
}

function getBillingPeriodFromSubscription(subscription: Stripe.Subscription): {
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
} {
  const items = subscription.items?.data ?? [];
  if (items.length === 0) {
    return { currentPeriodStart: null, currentPeriodEnd: null };
  }

  const maxStart = Math.max(...items.map((item) => item.current_period_start));
  const maxEnd = Math.max(...items.map((item) => item.current_period_end));

  return {
    currentPeriodStart: new Date(maxStart * 1000).toISOString(),
    currentPeriodEnd: new Date(maxEnd * 1000).toISOString(),
  };
}

export async function POST(request: NextRequest) {
  let body: string;
  try {
    body = await request.text();
  } catch {
    return NextResponse.json({ error: 'Unable to read request body' }, { status: 400 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    const webhookSecret = getRequiredEnv('STRIPE_WEBHOOK_SECRET');

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const supabase = supabaseAdmin;

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const clerkUserId = session.metadata?.clerk_user_id || session.client_reference_id || null;
        const subscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id ?? null;

        if (clerkUserId && subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const { currentPeriodStart, currentPeriodEnd } = getBillingPeriodFromSubscription(subscription);

          // ✅ AUTHORITATIVE ENTITLEMENT WRITE (Clerk-only identity)
          await upsertSanctuaryEntitlement(supabase, {
            clerkUserId,
            status: subscription.status,
            currentPeriodStart,
            currentPeriodEnd,
          });

          console.log(`Entitlement updated: sanctuary active for ${clerkUserId}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const clerkUserId = subscription.metadata?.clerk_user_id;

        if (clerkUserId) {
          const { currentPeriodStart, currentPeriodEnd } = getBillingPeriodFromSubscription(subscription);

          await upsertSanctuaryEntitlement(supabase, {
            clerkUserId,
            status: subscription.status,
            currentPeriodStart,
            currentPeriodEnd,
          });

          console.log(`Entitlement updated: sanctuary status=${subscription.status} for ${clerkUserId}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        const clerkUserId = subscription.metadata?.clerk_user_id;
        if (clerkUserId) {
          await upsertSanctuaryEntitlement(supabase, {
            clerkUserId,
            status: 'canceled',
            currentPeriodStart: null,
            currentPeriodEnd: null,
          });
          console.log(`Entitlement updated: sanctuary canceled for ${clerkUserId}`);
        } else {
          console.log(`Subscription deleted: ${subscription.id} (no clerk_user_id in metadata)`);
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.parent?.subscription_details
          ? typeof invoice.parent.subscription_details.subscription === 'string'
            ? invoice.parent.subscription_details.subscription
            : invoice.parent.subscription_details.subscription.id
          : null;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const clerkUserId = subscription.metadata?.clerk_user_id;
          if (clerkUserId) {
            const { currentPeriodStart, currentPeriodEnd } = getBillingPeriodFromSubscription(subscription);
            await upsertSanctuaryEntitlement(supabase, {
              clerkUserId,
              status: subscription.status,
              currentPeriodStart,
              currentPeriodEnd,
            });
          }
          console.log(`Invoice paid for subscription: ${subscriptionId}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.parent?.subscription_details
          ? typeof invoice.parent.subscription_details.subscription === 'string'
            ? invoice.parent.subscription_details.subscription
            : invoice.parent.subscription_details.subscription.id
          : null;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const clerkUserId = subscription.metadata?.clerk_user_id;
          if (clerkUserId) {
            const { currentPeriodStart, currentPeriodEnd } = getBillingPeriodFromSubscription(subscription);
            await upsertSanctuaryEntitlement(supabase, {
              clerkUserId,
              status: subscription.status,
              currentPeriodStart,
              currentPeriodEnd,
            });
          }
          console.log(`Payment failed for subscription: ${subscriptionId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}