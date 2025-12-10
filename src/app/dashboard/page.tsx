'use client';

import { useState, useEffect } from 'react';
import { Users, Building, Bed, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface DashboardData {
  overview: {
    total_students: number;
    total_rooms: number;
    occupied_rooms: number;
    available_rooms: number;
    pending_requests: number;
    active_emergencies: number;
    occupancy_rate: number;
  };
  recent_requests: any[];
  active_notifications: any[];
  recent_activity: any[];
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/stats');
      const result = await response.json();
      
      if (result.success) {
        setDashboardData(result.data);
      } else {
        setError(result.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800">Error: {error}</div>
            <Button onClick={fetchDashboardData} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

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
                <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.total_students}</p>
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
                <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.total_rooms}</p>
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
                <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.occupied_rooms}</p>
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
                <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.available_rooms}</p>
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
                <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.pending_requests}</p>
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
                <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.active_emergencies}</p>
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
                {dashboardData.recent_requests.map((request) => (
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
                {dashboardData.active_notifications.map((notification) => (
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