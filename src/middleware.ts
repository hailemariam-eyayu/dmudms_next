import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // If no token, redirect to signin (handled by withAuth)
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    const userRole = token.role as string;

    // Define role-based route permissions
    const roleRoutes: Record<string, string[]> = {
      admin: ['/admin', '/directorate', '/proctor', '/student', '/coordinator', '/security-guard', '/profile'],
      directorate: ['/directorate', '/admin/students', '/admin/employees', '/placements', '/requests', '/emergency', '/profile'],
      proctor: ['/proctor', '/profile'],
      student: ['/student'],
      coordinator: ['/coordinator', '/admin/students', '/placements', '/requests', '/profile'],
      security_guard: ['/security-guard', '/profile'],
      registrar: ['/registrar', '/profile'],
      maintainer: ['/maintainer', '/profile']
    };

    // Check if user has access to the requested route
    const allowedRoutes = roleRoutes[userRole] || [];
    
    // Allow access to common routes first
    const commonRoutes = ['/dashboard', '/profile', '/api', '/auth'];
    const isCommonRoute = commonRoutes.some(route => pathname.startsWith(route));
    
    if (isCommonRoute) {
      return NextResponse.next();
    }
    
    // Check specific route access - sort by length (longest first) to match most specific routes first
    const sortedRoutes = allowedRoutes.sort((a, b) => b.length - a.length);
    const hasAccess = sortedRoutes.some(route => pathname.startsWith(route));
    
    // Debug logging removed - middleware working correctly

    if (!hasAccess) {
      // Redirect to appropriate dashboard based on role
      const dashboardRoutes: Record<string, string> = {
        admin: '/admin',
        directorate: '/directorate',
        proctor: '/proctor',
        student: '/student',
        coordinator: '/coordinator',
        security_guard: '/security-guard',
        registrar: '/dashboard',
        maintainer: '/dashboard'
      };

      const redirectUrl = dashboardRoutes[userRole] || '/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/directorate/:path*',
    '/coordinator/:path*',
    '/proctor/:path*',
    '/student/:path*',
    '/security-guard/:path*',
    '/dashboard/:path*',
    '/placements/:path*',
    '/requests/:path*',
    '/emergency/:path*',
    '/profile/:path*'
  ]
};