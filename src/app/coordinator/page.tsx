'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { 
  Users, 
  Building, 
  UserCheck, 
  ClipboardList,
  BarChart3,
  Settings,
  Eye,
  UserPlus,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  Activity
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  assigned_to?: string;
}

interface SessionInfo {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  expires: string;
}

export default function CoordinatorDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<any>({});
  const [proctors, setProctors] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
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
      const [statsRes, employeesRes, blocksRes, placementsRes, sessionRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/employees'),
        fetch('/api/blocks'),
        fetch('/api/placements'),
        fetch('/api/debug/session')
      ]);

      const [statsData, employeesData, blocksData, placementsData, sessionData] = await Promise.all([
        statsRes.json(),
        employeesRes.json(),
        blocksRes.json(),
        placementsRes.json(),
        sessionRes.json()
      ]);

      if (statsData.success) setStats(statsData.data);
      if (employeesData.success) {
        const proctorList = employeesData.data.filter((emp: any) => 
          emp.role === 'proctor' || emp.role === 'proctor_manager'
        );
        setProctors(proctorList);
      }
      if (blocksData.success) setBlocks(blocksData.data);
      if (placementsData.success) setAssignments(placementsData.data);
      if (sessionData.success) setSessionInfo(sessionData.session);

      // Sample tasks for coordinator
      const sampleTasks: Task[] = [
        {
          id: '1',
          title: 'Review Proctor Assignments',
          description: 'Review and approve pending proctor assignments for new blocks',
          priority: 'high',
          status: 'pending',
          due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_to: session?.user.id
        },
        {
          id: '2',
          title: 'Monthly Block Inspection',
          description: 'Coordinate monthly inspection of all dormitory blocks',
          priority: 'medium',
          status: 'in_progress',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_to: session?.user.id
        },
        {
          id: '3',
          title: 'Update Proctor Training Materials',
          description: 'Update training materials for new proctor orientation',
          priority: 'low',
          status: 'pending',
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_to: session?.user.id
        },
        {
          id: '4',
          title: 'Student Complaint Resolution',
          description: 'Address pending student complaints about room conditions',
          priority: 'high',
          status: 'in_progress',
          due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_to: session?.user.id
        }
      ];
      setTasks(sampleTasks);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading coordinator dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Coordinator Dashboard</h1>
                <p className="text-gray-600">Manage proctor assignments and dormitory operations</p>
              </div>
            </div>
            {sessionInfo && (
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{sessionInfo.user.name}</div>
                    <div className="text-xs text-gray-500">Session expires: {new Date(sessionInfo.expires).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
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
              <Building className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{blocks.length}</div>
                <div className="text-gray-600">Dormitory Blocks</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {blocks.filter(b => b.proctor_id).length}
                </div>
                <div className="text-gray-600">Assigned Blocks</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{assignments.length}</div>
                <div className="text-gray-600">Student Assignments</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions and Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href="/coordinator/proctors"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <UserCheck className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Manage Proctors</div>
                  <div className="text-sm text-gray-500">Assign and manage proctor assignments</div>
                </div>
              </a>

              <a
                href="/coordinator/blocks"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Building className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">View Blocks</div>
                  <div className="text-sm text-gray-500">View dormitory blocks and their status</div>
                </div>
              </a>

              <a
                href="/coordinator/assignments"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ClipboardList className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">View Assignments</div>
                  <div className="text-sm text-gray-500">View student room assignments</div>
                </div>
              </a>

              <a
                href="/coordinator/assign-proctors"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <UserPlus className="h-6 w-6 text-orange-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Assign Proctors</div>
                  <div className="text-sm text-gray-500">Assign proctors to dormitory blocks</div>
                </div>
              </a>
            </div>
          </div>

          {/* Tasks Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">My Tasks</h2>
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-blue-600 mr-1" />
                <span className="text-sm text-gray-600">{tasks.filter(t => t.status !== 'completed').length} active</span>
              </div>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {tasks.slice(0, 6).map((task) => (
                <div key={task.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      {getStatusIcon(task.status)}
                      <span className="ml-2 text-sm font-medium text-gray-900">{task.title}</span>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Proctor Assignments */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Proctor Assignments</h2>
              <button className="text-green-600 hover:text-green-800">
                <Eye className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {blocks.slice(0, 5).map((block) => {
                const assignedProctor = proctors.find(p => p.employee_id === block.proctor_id);
                return (
                  <div key={block.block_id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{block.name}</div>
                        <div className="text-sm text-gray-500">{block.block_id}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {assignedProctor ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {assignedProctor.first_name} {assignedProctor.last_name}
                          </div>
                          <div className="text-xs text-gray-500">{assignedProctor.employee_id}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-red-600">Unassigned</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignment Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round((blocks.filter(b => b.proctor_id).length / blocks.length) * 100) || 0}%
              </div>
              <div className="text-gray-600">Blocks Assigned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {proctors.filter(p => p.status === 'active').length}
              </div>
              <div className="text-gray-600">Active Proctors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {stats.occupancy_rate || 0}%
              </div>
              <div className="text-gray-600">Room Occupancy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}