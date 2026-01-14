import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  
  // Check for OAuth/OTP errors from Supabase
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  
  if (error) {
    console.error("[Auth Callback] Supabase error:", error, errorDescription);
    return NextResponse.redirect(`${origin}/?auth_error=${error}`);
  }

  const code = searchParams.get("code");

  if (!code) {
    console.error("[Auth Callback] No code provided");
    return NextResponse.redirect(`${origin}/`);
  }

  const supabase = await createClient();

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("[Auth Callback] Exchange error:", exchangeError.message);
    return NextResponse.redirect(`${origin}/?auth_error=exchange_failed`);
  }

  console.log("[Auth Callback] Success, redirecting to /");
  
  return NextResponse.redirect(`${origin}/`);
}