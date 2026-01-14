import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  
  // Check for OAuth/OTP errors from Supabase
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  
  if (error) {
    console.error("[Auth Callback] Supabase error:", error, errorDescription);
    // Redirect to home, user can try again
    return NextResponse.redirect(`${origin}/?auth_error=${error}`);
  }

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  if (!code) {
    console.error("[Auth Callback] No code provided");
    return NextResponse.redirect(`${origin}/`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("[Auth Callback] Exchange error:", exchangeError.message);
    return NextResponse.redirect(`${origin}/?auth_error=exchange_failed`);
  }

  console.log("[Auth Callback] Success, redirecting to:", safeNext);
  
  // Always redirect to home, not /app
  return NextResponse.redirect(`${origin}/`);
}