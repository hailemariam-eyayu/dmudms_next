'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { 
  Users, 
  Package, 
  ClipboardCheck, 
  AlertTriangle, 
  Building,
  UserCheck,
  Settings,
  Shield
} from 'lucide-react';
import ProfileAvatar from '@/components/ProfileAvatar';

export default function ProctorDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [assignedStudents, setAssignedStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'proctor') {
      redirect('/auth/signin');
      return;
    }

    fetchDashboardData();
  }, [session, status]);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, studentsResponse] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch(`/api/proctor/assigned-students?proctorId=${session?.user?.id}`)
      ]);

      const statsData = await statsResponse.json();
      const studentsData = await studentsResponse.json();

      if (statsData.success) {
        setStats(statsData.data);
      }
      if (studentsData.success) {
        setAssignedStudents(studentsData.data);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading proctor dashboard...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Proctor Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session?.user?.name}! Manage your assigned students and blocks.</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">My Students</h3>
                <p className="text-gray-600">View assigned students</p>
                <a href="/proctor/students" className="text-blue-600 hover:text-blue-700 font-medium">
                  View →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Materials</h3>
                <p className="text-gray-600">Manage block materials</p>
                <a href="/proctor/materials" className="text-purple-600 hover:text-purple-700 font-medium">
                  Manage →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <ClipboardCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Requests</h3>
                <p className="text-gray-600">Review student requests</p>
                <a href="/proctor/requests" className="text-green-600 hover:text-green-700 font-medium">
                  Review →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Emergencies</h3>
                <p className="text-gray-600">Handle emergencies</p>
                <a href="/proctor/emergencies" className="text-red-600 hover:text-red-700 font-medium">
                  Handle →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Block Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Block Statistics */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2" />
              My Block Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{assignedStudents.length}</div>
                <div className="text-sm text-gray-600">Assigned Students</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {assignedStudents.filter(s => s.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Active Students</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {stats?.proctor_stats?.pending_requests || 0}
                </div>
                <div className="text-sm text-gray-600">Pending Requests</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {stats?.proctor_stats?.materials_count || 0}
                </div>
                <div className="text-sm text-gray-600">Materials</div>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div className="font-medium text-blue-800">Check Attendance</div>
                <div className="text-sm text-blue-600">Mark student attendance</div>
              </button>
              <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="font-medium text-green-800">Add Material</div>
                <div className="text-sm text-green-600">Add new material to inventory</div>
              </button>
              <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <div className="font-medium text-purple-800">Send Notification</div>
                <div className="text-sm text-purple-600">Notify students in your block</div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Student Requests */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ClipboardCheck className="h-5 w-5 mr-2" />
              Recent Requests
              {stats?.proctor_stats?.pending_requests > 0 && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {stats.proctor_stats.pending_requests}
                </span>
              )}
            </h2>
            <div className="space-y-3">
              {stats?.recent_requests?.slice(0, 5).map((request: any, index: number) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{request.type}</div>
                    <div className="text-xs text-gray-500">
                      {request.student_id} - {request.description}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200">
                      Approve
                    </button>
                    <button className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200">
                      Deny
                    </button>
                  </div>
                </div>
              )) || (
                <div className="text-center py-4 text-gray-500">
                  No recent requests
                </div>
              )}
            </div>
          </div>

          {/* My Students */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              My Students
            </h2>
            <div className="space-y-3">
              {assignedStudents.slice(0, 5).map((student: any, index: number) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {student.first_name} {student.last_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {student.student_id} - Room {student.room}
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {student.status}
                  </div>
                </div>
              ))}
              {assignedStudents.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No students assigned yet
                </div>
              )}
            </div>
            <div className="mt-4">
              <a href="/proctor/students" className="text-blue-600 hover:text-blue-700 font-medium">
                View All Students →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}