import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json(
    {
      error: "supabase_auth_removed",
      message: "Supabase Auth has been removed. Use Clerk authentication instead.",
    },
    { status: 410 }
  );
}