import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Sanctuary Price ID - $12/month
const SANCTUARY_PRICE_ID = 'price_1SpLiRF8aJ0BDqA3fO5BT4Ca';

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

function getSupabaseAdmin() {
  const url = getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL');
  const serviceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');

  return createClient(url, serviceRoleKey);
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
    const supabase = getSupabaseAdmin();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id || session.metadata?.user_id;
        const subscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id ?? null;

        if (userId && subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const { currentPeriodStart, currentPeriodEnd } = getBillingPeriodFromSubscription(subscription);

          // Update subscriptions table
          await supabase.from('subscriptions').upsert({
            user_id: userId,
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: session.customer as string,
            status: subscription.status,
            price_id: SANCTUARY_PRICE_ID,
            current_period_start: currentPeriodStart,
            current_period_end: currentPeriodEnd,
            trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

          // ✅ UPDATE USER TIER TO SANCTUARY
          await supabase
            .from('users')
            .update({ 
              tier: 'sanctuary', 
              updated_at: new Date().toISOString() 
            })
            .eq('id', userId);

          console.log(`Subscription created for user ${userId} - upgraded to sanctuary`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id;

        if (userId) {
          const { currentPeriodStart, currentPeriodEnd } = getBillingPeriodFromSubscription(subscription);
          
          await supabase
            .from('subscriptions')
            .update({
              status: subscription.status,
              current_period_start: currentPeriodStart,
              current_period_end: currentPeriodEnd,
              trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id);

          // ✅ UPDATE TIER BASED ON SUBSCRIPTION STATUS
          if (subscription.status === 'active') {
            await supabase
              .from('users')
              .update({ tier: 'sanctuary', updated_at: new Date().toISOString() })
              .eq('id', userId);
          } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
            await supabase
              .from('users')
              .update({ tier: 'free', updated_at: new Date().toISOString() })
              .eq('id', userId);
          }

          console.log(`Subscription updated for user ${userId} - status: ${subscription.status}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        // Update subscription status
        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        // ✅ GET USER ID AND DOWNGRADE TO FREE
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (sub?.user_id) {
          await supabase
            .from('users')
            .update({ 
              tier: 'free', 
              updated_at: new Date().toISOString() 
            })
            .eq('id', sub.user_id);

          console.log(`Subscription canceled - user ${sub.user_id} downgraded to free`);
        } else {
          console.log(`Subscription canceled: ${subscription.id} (no user found)`);
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
          await supabase
            .from('subscriptions')
            .update({
              status: 'active',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscriptionId);

          // ✅ ENSURE USER IS SANCTUARY ON SUCCESSFUL PAYMENT
          const { data: sub } = await supabase
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_subscription_id', subscriptionId)
            .single();

          if (sub?.user_id) {
            await supabase
              .from('users')
              .update({ tier: 'sanctuary', updated_at: new Date().toISOString() })
              .eq('id', sub.user_id);
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
          await supabase
            .from('subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscriptionId);

          // Note: We don't immediately downgrade on payment failure
          // Stripe will retry and eventually delete the subscription if all retries fail
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