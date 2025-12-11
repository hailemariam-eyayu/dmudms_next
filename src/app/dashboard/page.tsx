'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function DashboardRedirect() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      redirect('/auth/signin');
      return;
    }

    // Redirect to role-specific dashboard
    const dashboardRoutes: Record<string, string> = {
      admin: '/admin',
      directorate: '/directorate',
      proctor: '/proctor',
      student: '/student',
      coordinator: '/coordinator',
      proctormanager: '/proctormanager',
      registrar: '/dashboard/registrar',
      maintainer: '/dashboard/maintainer'
    };

    const targetRoute = dashboardRoutes[session.user.role] || '/dashboard/default';
    redirect(targetRoute);
  }, [session, status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
}