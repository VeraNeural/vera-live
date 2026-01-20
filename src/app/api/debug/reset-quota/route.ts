import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthUser } from "@/lib/auth";

// TEMPORARY / DEBUG ONLY:
// Dev-only endpoint to reset free quota for the signed-in user.
// Do not expose in client UI in production.
export async function POST(request: NextRequest) {
  // Only allow admin access to debug routes
  const authUser = await getAuthUser(request);

  if (!authUser?.isAdmin) {
    return NextResponse.json(
      { error: "Unauthorized - Admin access required" },
      { status: 401 }
    );
  }

  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not Found", { status: 404 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin
    .from("user_entitlements")
    .update({
      remaining_messages: 25,
      updated_at: new Date().toISOString(),
    })
    .eq("clerk_user_id", authUser.userId)
    .eq("entitlement", "free");

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
