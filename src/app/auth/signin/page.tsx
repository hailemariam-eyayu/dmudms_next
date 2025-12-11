'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Building, User, Lock, AlertCircle } from 'lucide-react';

export default function SignIn() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        identifier,
        password,
        redirect: false
      });

      if (result?.error) {
        setError('Invalid credentials. Please check your ID and password.');
      } else {
        // Get the session to determine redirect
        const session = await getSession();
        if (session?.user?.role) {
          // Redirect based on role
          const roleRedirects = {
            admin: '/dashboard',
            directorate: '/dashboard',
            coordinator: '/dashboard',
            proctor: '/dashboard',
            registrar: '/dashboard',
            maintainer: '/dashboard',
            student: '/dashboard'
          };
          router.push(roleRedirects[session.user.role as keyof typeof roleRedirects] || '/dashboard');
        }
      }
    } catch (error) {
      setError('An error occurred during sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Building className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Dormitory Management System
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Sign In Form */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 text-center">
              Welcome Back
            </h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                  Student ID or Employee ID
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="DMU001 or EMP001"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials (All passwords: default123):</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div><strong>Admin:</strong> EMP001 / default123</div>
                <div><strong>Directorate:</strong> EMP002 / default123</div>
                <div><strong>Coordinator:</strong> EMP003 / default123</div>
                <div><strong>Proctor (Block A):</strong> EMP004 / default123</div>
                <div><strong>Registrar:</strong> EMP005 / default123</div>
                <div><strong>Proctor (Block B):</strong> EMP006 / default123</div>
                <div><strong>Proctor (Block C):</strong> EMP007 / default123</div>
                <div><strong>Coordinator 2:</strong> EMP0010 / default123</div>
                <div><strong>Student:</strong> DMU001 / default123</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2024 Dormitory Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}