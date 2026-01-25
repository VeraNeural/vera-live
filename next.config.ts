import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(self), geolocation=(), payment=(self)',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: Self, Clerk auth, Stripe, Google Analytics, Meta Pixel, TikTok Pixel
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.dev https://challenges.cloudflare.com https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://analytics.tiktok.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https: http:",
      // Connect: Self, Clerk, Supabase, Anthropic, Stripe, Analytics
      "connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.dev https://*.supabase.co https://api.anthropic.com wss://*.supabase.co https://api.stripe.com https://www.google-analytics.com https://analytics.google.com https://www.facebook.com https://analytics.tiktok.com",
      // Frames: Clerk, Cloudflare challenges, Stripe checkout
      "frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.dev https://challenges.cloudflare.com https://js.stripe.com https://hooks.stripe.com",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
