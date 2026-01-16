import { NextResponse } from 'next/server'

// INCIDENT ISOLATION PATCH (reversible): disable all middleware logic.
// This prevents startup failures in middleware/auth layers from killing dev.
// Restore by removing this early return and uncommenting the original code below.
export default function middleware() {
  return NextResponse.next()
}

/*
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/signup(.*)',
  '/vds',
  '/professionals',
  '/auth/callback(.*)',
  '/api/chat(.*)',
  '/api/stripe/webhook(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})
*/

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}