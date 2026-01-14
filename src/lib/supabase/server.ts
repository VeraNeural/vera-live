import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { NextRequest, NextResponse } from 'next/server'

export async function createClient(opts?: {
  request?: NextRequest
  response?: NextResponse
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Route handler / middleware path: write cookies onto the outgoing response.
  if (opts?.request && opts?.response) {
    const { request, response } = opts
    return createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Keep request cookie store in sync for the remainder of this handler.
            request.cookies.set(name, value)
            // Ensure the browser receives the session.
            response.cookies.set(name, value, options)
          })
        },
      },
    })
  }

  // Server component path: uses Next.js cookies() store.
  const cookieStore = await cookies()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Called from a Server Component render path; can't set cookies there.
          // This is OK if session refresh is handled by middleware.
        }
      },
    },
  })
}