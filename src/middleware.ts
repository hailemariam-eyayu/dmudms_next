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
      admin: ['/admin', '/directorate', '/proctor', '/student'],
      directorate: ['/directorate', '/admin/students', '/placements', '/requests', '/emergency'],
      proctor: ['/proctor'],
      student: ['/student'],
      coordinator: ['/coordinator'],
      registrar: ['/registrar'],
      maintainer: ['/maintainer']
    };

    // Check if user has access to the requested route
    const allowedRoutes = roleRoutes[userRole] || [];
    const hasAccess = allowedRoutes.some(route => pathname.startsWith(route));

    // Allow access to common routes
    const commonRoutes = ['/dashboard', '/profile', '/api', '/auth'];
    const isCommonRoute = commonRoutes.some(route => pathname.startsWith(route));

    if (!hasAccess && !isCommonRoute) {
      // Redirect to appropriate dashboard based on role
      const dashboardRoutes: Record<string, string> = {
        admin: '/admin',
        directorate: '/directorate',
        proctor: '/proctor',
        student: '/student',
        coordinator: '/dashboard',
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
    '/proctor/:path*',
    '/student/:path*',
    '/dashboard/:path*',
    '/placements/:path*',
    '/requests/:path*',
    '/emergency/:path*'
  ]
};