import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Define route permissions inline to avoid importing crypto-dependent modules
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  '/students': ['admin', 'directorate', 'registrar'],
  '/students/create': ['admin', 'registrar'],
  '/rooms': ['admin', 'directorate', 'coordinator'],
  '/blocks': ['admin', 'directorate', 'coordinator'],
  '/placements': ['admin', 'directorate', 'coordinator'],
  '/requests': ['admin', 'directorate', 'proctor', 'student'],
  '/reports': ['admin', 'directorate'],
  '/employees': ['admin'],
  '/emergency': ['admin', 'directorate', 'proctor', 'student'],
  '/notifications': ['admin', 'directorate', 'registrar']
};

function canAccessRoute(userRole: string, route: string): boolean {
  const requiredRoles = ROUTE_PERMISSIONS[route];
  if (!requiredRoles) return true; // Public route or dashboard
  return requiredRoles.includes(userRole) || userRole === 'admin';
}

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
    if (!canAccessRoute(userRole, pathname)) {
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
  runtime: 'nodejs',
};