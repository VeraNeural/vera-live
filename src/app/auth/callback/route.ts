import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/";

  const next = nextParam.startsWith("/") ? nextParam : "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  try {
    // Create redirect response first so Supabase can attach Set-Cookie headers.
    const response = NextResponse.redirect(`${origin}${next}`);

    // Exchange the code and persist the session via cookies on the response.
    const supabase = await createClient({ request, response });
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[Auth Callback] Exchange error:", error.message);
      return NextResponse.redirect(`${origin}/login?error=exchange_failed`);
    }

    return response;
  } catch (err) {
    console.error("[Auth Callback] Unexpected error:", err);
    return NextResponse.redirect(`${origin}/login?error=unexpected`);
  }
}