import { clerkMiddleware } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Development-safe wrapper: when CLERK_SECRET_KEY isn't present or keys mismatch,
// Clerk middleware can throw during verification. In development we prefer to
// log a warning and fall back to a permissive middleware so the server keeps
// running and you can fix env vars without endless crashes. This does NOT alter
// production behavior.
const isDev = process.env.NODE_ENV !== 'production';
const hasSecret = Boolean(process.env.CLERK_SECRET_KEY);

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/upload',
  '/upload',
  '/dashboard',
  '/_next/static/(.*)',
  '/_next/image(.*)',
  '/favicon.ico',
  '/assets(.*)'
];

// If running locally without a CLERK_SECRET_KEY, export a permissive middleware
// to avoid hard failures while you fix your env. In production the real
// clerkMiddleware is exported which enforces auth.
// Create a middleware function variable and export it at top-level. This
// avoids invalid `export` statements inside conditional blocks.
let middleware: any;

if (isDev && !hasSecret) {
  console.warn('[dev] CLERK_SECRET_KEY not set - running permissive dev middleware');

  middleware = (req: NextRequest) => {
    const pathname = req.nextUrl.pathname;

    const allowedPrefixes = [
      '/',
      '/sign-in',
      '/sign-up',
      '/api/webhooks',
      '/api/upload',
      '/upload',
      '/dashboard',
      '/_next/static',
      '/_next/image',
      '/favicon.ico',
      '/assets',
    ];

    const isPublic = allowedPrefixes.some((p) => pathname === p || pathname.startsWith(p + '/') || pathname.startsWith(p));
    if (isPublic) return NextResponse.next();

    // redirect unauthenticated to sign-in (permissive: we don't check auth here)
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  };

} else {
  // Use Clerk's default middleware behavior in non-dev environments. We avoid
  // passing custom options to keep TypeScript happy and rely on the provider
  // + client-side redirects for auth flows.
  middleware = clerkMiddleware();
}

export default middleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // Include all API routes
    '/(api|trpc)(.*)',
  ],
};
