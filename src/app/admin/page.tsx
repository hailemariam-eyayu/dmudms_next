'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Users, UserPlus, Settings, BarChart3, Shield, Database, RefreshCw, AlertCircle } from 'lucide-react';
import ProfileAvatar from '@/components/ProfileAvatar';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reseeding, setReseeding] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      redirect('/auth/signin');
      return;
    }

    fetchStats();
  }, [session, status]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReseedDatabase = async () => {
    if (!confirm('Are you sure you want to reseed the database? This will delete ALL existing data and replace it with fresh sample data. All users will have password: default123')) {
      return;
    }

    setReseeding(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/reseed-database', {
        method: 'POST'
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        // Refresh stats after reseeding
        setTimeout(() => {
          fetchStats();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to reseed database' });
      }
    } catch (error) {
      console.error('Error reseeding database:', error);
      setMessage({ type: 'error', text: 'Failed to reseed database' });
    } finally {
      setReseeding(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <ProfileAvatar 
              name={session?.user?.name} 
              size="xl"
              showBorder={true}
              className="mr-4"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session?.user?.name}! Manage the entire system from here.</p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <AlertCircle className="h-5 w-5 mr-2" />
            {message.text}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <UserPlus className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Create Account</h3>
                <p className="text-gray-600">Register new employees</p>
                <a href="/admin/employees/create" className="text-green-600 hover:text-green-700 font-medium">
                  Create →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage Employees</h3>
                <p className="text-gray-600">View and edit staff</p>
                <a href="/admin/employees" className="text-blue-600 hover:text-blue-700 font-medium">
                  Manage →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage Students</h3>
                <p className="text-gray-600">Student administration</p>
                <a href="/admin/students" className="text-purple-600 hover:text-purple-700 font-medium">
                  Manage →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
                <p className="text-gray-600">Configure system</p>
                <a href="/admin/settings" className="text-orange-600 hover:text-orange-700 font-medium">
                  Configure →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Database Management */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Database Management
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Reseeding will delete ALL existing data and replace it with fresh sample data. 
                    All users will have password: <strong>default123</strong>
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleReseedDatabase}
              disabled={reseeding}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${reseeding ? 'animate-spin' : ''}`} />
              {reseeding ? 'Reseeding Database...' : 'Reseed Database with Sample Data'}
            </button>
          </div>
        </div>

        {/* System Overview */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Statistics Cards */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                System Statistics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.overview.total_students}</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.overview.active_students}</div>
                  <div className="text-sm text-gray-600">Active Students</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.overview.total_rooms}</div>
                  <div className="text-sm text-gray-600">Total Rooms</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{stats.overview.occupancy_rate}%</div>
                  <div className="text-sm text-gray-600">Occupancy Rate</div>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                  <div className="font-medium text-red-800">Reset All Passwords</div>
                  <div className="text-sm text-red-600">Reset all employee passwords to default</div>
                </button>
                <button className="w-full text-left p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                  <div className="font-medium text-yellow-800">Activate All Students</div>
                  <div className="text-sm text-yellow-600">Activate all inactive students</div>
                </button>
                <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <div className="font-medium text-blue-800">System Backup</div>
                  <div className="text-sm text-blue-600">Create system backup</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {stats?.recent_activity && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent System Activity</h2>
            <div className="space-y-3">
              {stats.recent_activity.slice(0, 5).map((activity: any, index: number) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    activity.type === 'emergency' ? 'bg-red-500' : 
                    activity.type === 'request' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{activity.message}</div>
                    <div className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</div>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    activity.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {activity.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}