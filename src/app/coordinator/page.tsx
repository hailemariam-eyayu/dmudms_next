'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Settings, Users, Building, ClipboardList, UserCheck, BarChart3 } from 'lucide-react';

export default function CoordinatorDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<any>({});
  const [proctors, setProctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'coordinator') {
      redirect('/auth/signin');
    } else {
      fetchDashboardData();
    }
  }, [session, status]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, employeesRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/employees')
      ]);

      const [statsData, employeesData] = await Promise.all([
        statsRes.json(),
        employeesRes.json()
      ]);

      if (statsData.success) setStats(statsData.data);
      if (employeesData.success) {
        const proctorList = employeesData.data.filter((emp: any) => 
          emp.role === 'proctor'
        );
        setProctors(proctorList);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center">
            <Settings className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Coordinator Dashboard</h1>
              <p className="text-gray-600">Coordinate dormitory operations and manage proctors</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{proctors.length}</div>
                <div className="text-gray-600">Total Proctors</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {proctors.filter(p => p.status === 'active').length}
                </div>
                <div className="text-gray-600">Active Proctors</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.total_rooms || 0}</div>
                <div className="text-gray-600">Total Rooms</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.pending_requests || 0}</div>
                <div className="text-gray-600">Pending Requests</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Proctor Overview</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {proctors.slice(0, 5).map((proctor) => (
                  <div key={proctor._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <UserCheck className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {proctor.first_name} {proctor.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {proctor.employee_id}
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      proctor.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {proctor.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                  <Users className="h-6 w-6 text-purple-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Manage Proctors</div>
                    <div className="text-sm text-gray-500">View and manage proctor assignments</div>
                  </div>
                </button>

                <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                  <Building className="h-6 w-6 text-purple-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Block Assignments</div>
                    <div className="text-sm text-gray-500">Assign proctors to blocks</div>
                  </div>
                </button>

                <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                  <BarChart3 className="h-6 w-6 text-purple-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Performance Reports</div>
                    <div className="text-sm text-gray-500">View coordination reports</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}