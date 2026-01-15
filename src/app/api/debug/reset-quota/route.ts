import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// TEMPORARY / DEBUG ONLY:
// Dev-only endpoint to reset free quota for the signed-in user.
// Do not expose in client UI in production.
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not Found", { status: 404 });
  }

  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { error } = await supabaseAdmin
    .from("user_entitlements")
    .update({
      remaining_messages: 25,
      updated_at: new Date().toISOString(),
    })
    .eq("clerk_user_id", userId)
    .eq("entitlement", "free");

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
