'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { 
  Users, 
  Building, 
  UserCheck, 
  ClipboardList, 
  AlertTriangle, 
  BarChart3,
  Settings,
  Shield
} from 'lucide-react';

export default function DirectorateDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'directorate') {
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

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading directorate dashboard...</p>
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
            <Shield className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Directorate Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session?.user?.name}! Manage students and dormitory operations.</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Student Management</h3>
                <p className="text-gray-600">View and manage students</p>
                <a href="/admin/students" className="text-blue-600 hover:text-blue-700 font-medium">
                  Manage →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Proctor Assignment</h3>
                <p className="text-gray-600">Assign proctors to blocks</p>
                <a href="/directorate/proctors" className="text-green-600 hover:text-green-700 font-medium">
                  Assign →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Block & Room Management</h3>
                <p className="text-gray-600">Manage dormitory blocks</p>
                <a href="/directorate/blocks" className="text-purple-600 hover:text-purple-700 font-medium">
                  Manage →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Placement Management</h3>
                <p className="text-gray-600">Manage student placements</p>
                <a href="/placements" className="text-orange-600 hover:text-orange-700 font-medium">
                  Manage →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Key Metrics */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Dormitory Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.overview.total_students}</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.overview.placed_students}</div>
                  <div className="text-sm text-gray-600">Placed Students</div>
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

            {/* Quick Actions Panel */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <div className="font-medium text-blue-800">Auto-Assign Students</div>
                  <div className="text-sm text-blue-600">Automatically assign unplaced students</div>
                </button>
                <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <div className="font-medium text-green-800">Generate Reports</div>
                  <div className="text-sm text-green-600">Create occupancy and placement reports</div>
                </button>
                <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <div className="font-medium text-purple-800">Bulk Operations</div>
                  <div className="text-sm text-purple-600">Perform bulk student operations</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pending Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Requests */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ClipboardList className="h-5 w-5 mr-2" />
              Pending Requests
              {stats?.overview.pending_requests > 0 && (
                <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {stats.overview.pending_requests}
                </span>
              )}
            </h2>
            <div className="space-y-3">
              {stats?.recent_requests?.slice(0, 5).map((request: any, index: number) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{request.type}</div>
                    <div className="text-xs text-gray-500">Student: {request.student_id}</div>
                  </div>
                  <div className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    {request.status}
                  </div>
                </div>
              )) || (
                <div className="text-center py-4 text-gray-500">
                  No pending requests
                </div>
              )}
            </div>
            <div className="mt-4">
              <a href="/requests" className="text-blue-600 hover:text-blue-700 font-medium">
                View All Requests →
              </a>
            </div>
          </div>

          {/* Emergency Alerts */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Emergency Alerts
              {stats?.overview.active_emergencies > 0 && (
                <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {stats.overview.active_emergencies}
                </span>
              )}
            </h2>
            <div className="space-y-3">
              {stats?.recent_emergencies?.slice(0, 5).map((emergency: any, index: number) => (
                <div key={index} className="flex items-center p-3 bg-red-50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{emergency.type}</div>
                    <div className="text-xs text-gray-500">
                      {emergency.block} - {emergency.room}
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    emergency.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {emergency.status}
                  </div>
                </div>
              )) || (
                <div className="text-center py-4 text-gray-500">
                  No active emergencies
                </div>
              )}
            </div>
            <div className="mt-4">
              <a href="/emergency" className="text-red-600 hover:text-red-700 font-medium">
                View All Emergencies →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}