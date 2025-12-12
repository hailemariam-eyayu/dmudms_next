'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Home, MapPin, Users, Calendar, AlertCircle, Building, User } from 'lucide-react';

interface PlacementData {
  student_id: string;
  room: string;
  block: string;
  year: string;
  status: string;
  assigned_date: string;
  room_details?: {
    room_number: string;
    floor: number;
    capacity: number;
    current_occupancy: number;
    disability_accessible: boolean;
  };
  block_details?: {
    name: string;
    reserved_for: string;
    location: string;
    proctor_id: string;
  };
}

export default function StudentPlacementPage() {
  const { data: session, status } = useSession();
  const [placement, setPlacement] = useState<PlacementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'student') {
      redirect('/auth/signin');
      return;
    }

    fetchPlacement();
  }, [session, status]);

  const fetchPlacement = async () => {
    try {
      const response = await fetch(`/api/students/${session?.user.id}/placement`);
      const data = await response.json();
      
      if (data.success) {
        setPlacement(data.data);
      } else {
        setError(data.error || 'Failed to fetch placement information');
      }
    } catch (err) {
      setError('Failed to fetch placement information');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading placement information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <Home className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Room Assignment</h1>
              <p className="text-gray-600">View your dormitory placement information</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        )}

        {!placement ? (
          /* Not Assigned */
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Room Assignment</h2>
            <p className="text-gray-600 mb-6">
              You have not been assigned to a dormitory room yet. Please contact the administration office for assistance.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">What to do next:</h3>
              <ul className="text-sm text-blue-800 space-y-1 text-left">
                <li>• Contact the dormitory administration office</li>
                <li>• Ensure your student status is active</li>
                <li>• Check if there are available rooms in your preferred block</li>
                <li>• Submit any required accommodation requests</li>
              </ul>
            </div>
          </div>
        ) : (
          /* Placement Information */
          <div className="space-y-6">
            {/* Assignment Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Assignment Status</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  placement.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {placement.status === 'active' ? 'Active' : placement.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Assigned Date</p>
                    <p className="font-medium">{new Date(placement.assigned_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Academic Year</p>
                    <p className="font-medium">{placement.year}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Room Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Room Number</p>
                  <p className="text-2xl font-bold text-blue-600">{placement.room}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Floor</p>
                  <p className="text-lg font-medium">
                    {placement.room_details?.floor === 0 ? 'Ground Floor' : `Floor ${placement.room_details?.floor}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Room Capacity</p>
                  <p className="text-lg font-medium">{placement.room_details?.capacity} students</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Occupancy</p>
                  <p className="text-lg font-medium">
                    {placement.room_details?.current_occupancy}/{placement.room_details?.capacity} occupied
                  </p>
                </div>
              </div>

              {placement.room_details?.disability_accessible && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    This room is disability accessible
                  </p>
                </div>
              )}
            </div>

            {/* Block Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Block Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Block</p>
                  <p className="text-2xl font-bold text-purple-600">{placement.block}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Block Name</p>
                  <p className="text-lg font-medium">{placement.block_details?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reserved For</p>
                  <p className="text-lg font-medium capitalize">{placement.block_details?.reserved_for}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-lg font-medium">{placement.block_details?.location || 'N/A'}</p>
                </div>
              </div>

              {placement.block_details?.proctor_id && (
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Block Proctor:</strong> {placement.block_details.proctor_id}
                  </p>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">For room-related issues:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Contact your block proctor: {placement.block_details?.proctor_id || 'Contact administration'}</li>
                  <li>• Submit a maintenance request through the system</li>
                  <li>• Visit the dormitory administration office</li>
                  <li>• Call the emergency hotline for urgent issues</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}