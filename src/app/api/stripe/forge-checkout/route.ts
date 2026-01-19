import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getStripe(): Stripe {
  const secretKey = getRequiredEnv("STRIPE_SECRET_KEY");
  return new Stripe(secretKey, {
    apiVersion: "2025-12-15.clover",
  });
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in to upgrade" },
        { status: 401 }
      );
    }

    const stripe = getStripe();
    const priceId = getRequiredEnv("STRIPE_FORGE_PRICE_ID");

    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      request.headers.get("origin") ||
      request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      client_reference_id: userId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/forge/room?upgraded=true`,
      cancel_url: `${origin}/forge?canceled=true`,
      metadata: {
        clerk_user_id: userId,
        entitlement: "forge",
      },
      subscription_data: {
        metadata: {
          clerk_user_id: userId,
          entitlement: "forge",
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Forge checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
