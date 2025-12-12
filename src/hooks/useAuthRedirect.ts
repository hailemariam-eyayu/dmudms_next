'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export function useAuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if still loading
    if (status === 'loading') return;

    // If no session and not on signin page, redirect to signin
    if (!session && pathname !== '/auth/signin' && pathname !== '/' && !pathname.startsWith('/auth')) {
      router.push('/auth/signin');
      return;
    }

    // If session exists, redirect to appropriate dashboard
    if (session) {
      const roleRedirects = {
        admin: '/admin',
        directorate: '/directorate',
        coordinator: '/coordinator',
        proctor: '/proctor',
        registrar: '/dashboard/registrar',
        maintainer: '/dashboard/maintainer',
        student: '/student',
        proctormanager: '/proctormanager'
      };

      const targetDashboard = roleRedirects[session.user.role as keyof typeof roleRedirects] || '/dashboard/default';

      // Immediate redirect if on signin page or root
      if (pathname === '/auth/signin' || pathname === '/') {
        router.replace(targetDashboard);
        return;
      }

      // Check if user is accessing a page they shouldn't have access to
      const allowedPaths = getAllowedPaths(session.user.role);
      const isAllowed = allowedPaths.some(path => pathname.startsWith(path));
      
      if (!isAllowed) {
        router.replace(targetDashboard);
      }
    }
  }, [session, status, router, pathname]);
}

function getAllowedPaths(role: string): string[] {
  const commonPaths = ['/profile', '/terms', '/privacy', '/help'];
  
  switch (role) {
    case 'admin':
      return ['/admin', '/placements', ...commonPaths];
    case 'directorate':
      return ['/directorate', '/admin/students', '/placements', '/requests', '/emergency', ...commonPaths];
    case 'coordinator':
      return ['/coordinator', '/admin/students', '/proctor', ...commonPaths];
    case 'proctor':
    case 'proctor_manager':
      return ['/proctor', ...commonPaths];
    case 'student':
      return ['/student', ...commonPaths];
    case 'registrar':
      return ['/dashboard/registrar', ...commonPaths];
    case 'maintainer':
      return ['/dashboard/maintainer', ...commonPaths];
    case 'proctormanager':
      return ['/proctormanager', ...commonPaths];
    default:
      return ['/dashboard/default', ...commonPaths];
  }
}