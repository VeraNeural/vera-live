import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/forge(.*)',
  '/login(.*)',
  '/signup(.*)',
  '/vds',
  '/professionals',
  '/auth/callback(.*)',
  '/api/chat(.*)',
  '/api/stripe/webhook(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()
  
  // Logged in user on home page → redirect to sanctuary
  if (userId && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/sanctuary', request.url))
  }
  
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}