import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Sanctuary Price ID - $12/month
const SANCTUARY_PRICE_ID = "price_1SpLiRF8aJ0BDqA3fO5BT4Ca";

function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  return new Stripe(secretKey, {
    apiVersion: "2025-12-15.clover",
  });
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to upgrade" },
        { status: 401 }
      );
    }

    const stripe = getStripe();

    // Check if user already has a Stripe customer ID
    const { data: userData } = await supabase
      .from("users")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = userData?.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      });
      customerId = customer.id;

      // Save customer ID to user record
      await supabase
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // Get the origin for redirect URLs
    const origin =
      request.headers.get("origin") || "https://vera-live-pink.vercel.app";

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: user.id,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: SANCTUARY_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${origin}/?upgraded=true`,
      cancel_url: `${origin}/sanctuary/upgrade?canceled=true`,
      metadata: {
        user_id: user.id,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
