'use client';

import { useSession } from 'next-auth/react';

export default function DebugSession() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Session Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>
          <div className="space-y-4">
            <div>
              <strong>Status:</strong> {status}
            </div>
            
            {session ? (
              <div className="space-y-2">
                <div><strong>User ID:</strong> {session.user.id}</div>
                <div><strong>Name:</strong> {session.user.name}</div>
                <div><strong>Email:</strong> {session.user.email}</div>
                <div><strong>Role:</strong> {session.user.role}</div>
                <div><strong>User Type:</strong> {session.user.userType}</div>
              </div>
            ) : (
              <div>No session found</div>
            )}
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Raw Session Data</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Access Test</h3>
            <div className="space-y-2">
              <div>
                <strong>Can access /admin/students:</strong>{' '}
                {session && ['admin', 'directorate', 'coordinator'].includes(session.user.role) ? 
                  <span className="text-green-600">✅ Yes</span> : 
                  <span className="text-red-600">❌ No</span>
                }
              </div>
              <div>
                <strong>Should redirect to:</strong>{' '}
                {session ? 
                  session.user.role === 'admin' ? '/admin' :
                  session.user.role === 'directorate' ? '/directorate' :
                  session.user.role === 'coordinator' ? '/coordinator' :
                  session.user.role === 'proctor' ? '/proctor' :
                  session.user.role === 'student' ? '/student' :
                  '/dashboard'
                  : '/auth/signin'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}