'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface Placement {
  _id: string;
  student_id: string;
  room: string;
  block: string;
  year: string;
  status: 'active' | 'inactive' | 'transferred';
  assigned_date: string;
}

export default function PlacementsPage() {
  const { data: session, status } = useSession();
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      redirect('/auth/signin');
      return;
    }

    fetchPlacements();
  }, [session, status]);

  const fetchPlacements = async () => {
    try {
      const response = await fetch('/api/placements');
      const data = await response.json();
      
      if (data.success) {
        setPlacements(data.data);
      } else {
        setError(data.error || 'Failed to fetch placements');
      }
    } catch (err) {
      setError('Failed to fetch placements');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoAssign = async () => {
    try {
      const response = await fetch('/api/placements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'auto_assign' }),
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`Successfully assigned ${data.assigned} students`);
        fetchPlacements();
      } else {
        alert(data.error || 'Failed to auto-assign students');
      }
    } catch (err) {
      alert('Failed to auto-assign students');
    }
  };

  const handleUnassignAll = async () => {
    if (!confirm('Are you sure you want to unassign all students? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/placements', {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`Successfully unassigned ${data.count} students`);
        fetchPlacements();
      } else {
        alert(data.error || 'Failed to unassign students');
      }
    } catch (err) {
      alert('Failed to unassign students');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'transferred': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading placements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchPlacements}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Placements</h1>
          <p className="mt-2 text-gray-600">Manage student room assignments and placements</p>
        </div>

        <div className="mb-6 flex gap-4">
          <button
            onClick={handleAutoAssign}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Auto Assign Students
          </button>
          <button
            onClick={handleUnassignAll}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Unassign All Students
          </button>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Placements</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Block
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {placements.map((placement) => (
                  <tr key={placement._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {placement.student_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {placement.room}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {placement.block}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {placement.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(placement.status)}`}>
                        {placement.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(placement.assigned_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}