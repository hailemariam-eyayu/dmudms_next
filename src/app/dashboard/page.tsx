'use client';

import { useState, useEffect } from 'react';
import { Users, Building, Bed, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { 
  sampleStudents, 
  sampleRooms, 
  sampleBlocks, 
  sampleRequests, 
  sampleEmergencies,
  sampleNotifications 
} from '@/data/sampleData';
import { DashboardStats } from '@/types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total_students: 0,
    total_rooms: 0,
    occupied_rooms: 0,
    available_rooms: 0,
    pending_requests: 0,
    active_emergencies: 0,
  });

  useEffect(() => {
    // Calculate dashboard statistics
    const occupiedRooms = sampleRooms.filter(room => room.status === 'occupied').length;
    const availableRooms = sampleRooms.filter(room => room.status === 'available').length;
    const pendingRequests = sampleRequests.filter(req => req.status === 'pending').length;
    const activeEmergencies = sampleEmergencies.filter(em => em.status !== 'resolved').length;

    setStats({
      total_students: sampleStudents.length,
      total_rooms: sampleRooms.length,
      occupied_rooms: occupiedRooms,
      available_rooms: availableRooms,
      pending_requests: pendingRequests,
      active_emergencies: activeEmergencies,
    });
  }, []);

  const recentRequests = sampleRequests.slice(0, 5);
  const activeNotifications = sampleNotifications.filter(n => n.is_active).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome to the Dormitory Management System. Here's an overview of your campus housing.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_students}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center">
              <div className="flex-shrink-0">
                <Building className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Rooms</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_rooms}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center">
              <div className="flex-shrink-0">
                <Bed className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Occupied Rooms</p>
                <p className="text-2xl font-bold text-gray-900">{stats.occupied_rooms}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Available Rooms</p>
                <p className="text-2xl font-bold text-gray-900">{stats.available_rooms}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending_requests}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Emergencies</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active_emergencies}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Requests */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Recent Requests</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {request.student_id}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {request.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {request.created_date}
                      </p>
                    </div>
                    <div className="ml-4">
                      <Badge 
                        variant={
                          request.status === 'pending' ? 'warning' :
                          request.status === 'approved' ? 'success' :
                          request.status === 'rejected' ? 'error' : 'info'
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    View All Requests
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Notifications */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Active Notifications</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeNotifications.map((notification) => (
                  <div key={notification.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {notification.created_date}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          notification.type === 'warning' ? 'warning' :
                          notification.type === 'success' ? 'success' :
                          notification.type === 'error' ? 'error' : 'info'
                        }
                        size="sm"
                      >
                        {notification.type}
                      </Badge>
                    </div>
                  </div>
                ))}
                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center">
                <Users className="h-6 w-6 mb-2" />
                <span>Add Student</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Building className="h-6 w-6 mb-2" />
                <span>Manage Rooms</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Bed className="h-6 w-6 mb-2" />
                <span>Room Assignment</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <AlertTriangle className="h-6 w-6 mb-2" />
                <span>Emergency Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}