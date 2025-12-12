'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { 
  Home, 
  Package, 
  ClipboardList, 
  AlertTriangle, 
  Bell,
  User,
  MapPin,
  Phone
} from 'lucide-react';
import ProfileAvatar from '@/components/ProfileAvatar';

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const [placement, setPlacement] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [materials, setMaterials] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'student') {
      redirect('/auth/signin');
      return;
    }

    fetchStudentData();
  }, [session, status]);

  const fetchStudentData = async () => {
    try {
      const [placementResponse, requestsResponse, materialsResponse, notificationsResponse, profileResponse] = await Promise.all([
        fetch(`/api/students/${session?.user?.id}/placement`),
        fetch(`/api/students/${session?.user?.id}/requests`),
        fetch(`/api/students/${session?.user?.id}/materials`),
        fetch('/api/notifications'),
        fetch(`/api/students/${session?.user?.id}`)
      ]);

      const placementData = await placementResponse.json();
      const requestsData = await requestsResponse.json();
      const materialsData = await materialsResponse.json();
      const notificationsData = await notificationsResponse.json();
      const profileData = await profileResponse.json();

      if (placementData.success) {
        setPlacement(placementData.data);
      }
      if (requestsData.success) {
        setRequests(requestsData.data);
      }
      if (materialsData.success) {
        setMaterials(materialsData.data);
      }
      if (notificationsData.success) {
        setNotifications(notificationsData.data);
      }
      if (profileData.success && profileData.data.profile_image) {
        setProfileImage(profileData.data.profile_image);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading student dashboard...</p>
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
              src={profileImage} 
              name={session?.user?.name} 
              size="xl"
              showBorder={true}
              className="mr-4"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session?.user?.name}! Here's your dormitory information.</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">My Room</h3>
                <p className="text-gray-600">View placement details</p>
                <a href="/student/placement" className="text-blue-600 hover:text-blue-700 font-medium">
                  View →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">My Requests</h3>
                <p className="text-gray-600">Submit and track requests</p>
                <a href="/student/requests" className="text-green-600 hover:text-green-700 font-medium">
                  Manage →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Materials</h3>
                <p className="text-gray-600">View available materials</p>
                <a href="/student/materials" className="text-purple-600 hover:text-purple-700 font-medium">
                  View →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
                <p className="text-gray-600">Manage emergency contacts</p>
                <a href="/student/emergency-contact" className="text-red-600 hover:text-red-700 font-medium">
                  Manage →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Placement Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Placement */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Home className="h-5 w-5 mr-2" />
                My Placement
              </h2>
              {placement ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-500">Block & Room</div>
                        <div className="font-medium">{placement.block} - Room {placement.room}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-500">Proctor</div>
                        <div className="font-medium">{placement.proctor_name || 'Not assigned'}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-500">Emergency Contact</div>
                        <div className="font-medium">{placement.emergency_contact || 'Not provided'}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 mr-2 flex items-center justify-center">
                        <div className={`w-3 h-3 rounded-full ${
                          placement.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="font-medium capitalize">{placement.status}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Placement Yet</h3>
                  <p className="text-gray-500">You haven't been assigned to a room yet. Please contact the administration.</p>
                </div>
              )}
            </div>

            {/* Recent Requests */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ClipboardList className="h-5 w-5 mr-2" />
                My Recent Requests
              </h2>
              <div className="space-y-3">
                {requests.slice(0, 5).map((request: any, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{request.type}</div>
                      <div className="text-xs text-gray-500">{request.description}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(request.created_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'denied' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status}
                    </div>
                  </div>
                ))}
                {requests.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No requests submitted yet
                  </div>
                )}
              </div>
              <div className="mt-4">
                <a href="/student/requests" className="text-blue-600 hover:text-blue-700 font-medium">
                  View All Requests →
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Notifications */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </h2>
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notification: any, index: number) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-900">{notification.title}</div>
                    <div className="text-xs text-blue-700 mt-1">{notification.message}</div>
                    <div className="text-xs text-blue-600 mt-2">
                      {new Date(notification.created_date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No new notifications
                  </div>
                )}
              </div>
            </div>

            {/* Available Materials */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Available Materials
              </h2>
              <div className="space-y-3">
                {materials.slice(0, 5).map((material: any, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{material.name}</div>
                      <div className="text-xs text-gray-500">Qty: {material.quantity}</div>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      material.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {material.status}
                    </div>
                  </div>
                ))}
                {materials.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No materials available
                  </div>
                )}
              </div>
              <div className="mt-4">
                <a href="/student/materials" className="text-purple-600 hover:text-purple-700 font-medium">
                  View All Materials →
                </a>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <div className="font-medium text-green-800">Submit Request</div>
                  <div className="text-sm text-green-600">Request maintenance or services</div>
                </button>
                <a href="/student/emergency-contact" className="block w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                  <div className="font-medium text-red-800">Emergency Contact</div>
                  <div className="text-sm text-red-600">Update emergency contact info</div>
                </a>
                <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <div className="font-medium text-blue-800">Update Profile</div>
                  <div className="text-sm text-blue-600">Update your information</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}