import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/api/webhooks',
  '/health',
  '/favicon.ico',
  '/_next',
];

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => 
    pathname === route || pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for authentication token
  const token = req.cookies.get('authToken')?.value;

  if (!token) {
    // Redirect to sign-in if not authenticated
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // Include all API routes
    '/(api|trpc)(.*)',
  ],
};
