import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { canAccessRoute } from '@/lib/auth';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Allow access to auth pages
    if (pathname.startsWith('/auth/')) {
      return NextResponse.next();
    }

    // Allow access to public pages
    if (pathname === '/' || pathname === '/about') {
      return NextResponse.next();
    }

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Check role-based access
    const userRole = token.role as string;
    if (!canAccessRoute(userRole as any, pathname)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to public routes
        if (pathname === '/' || pathname === '/about' || pathname.startsWith('/auth/')) {
          return true;
        }

        // Require authentication for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};