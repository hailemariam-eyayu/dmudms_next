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

interface Student {
  _id: string;
  student_id: string;
  first_name: string;
  second_name?: string;
  last_name: string;
  email: string;
  gender: 'male' | 'female';
  batch: string;
  status: 'active' | 'inactive';
}

// Component to show unassigned students
function UnassignedStudents({ onRefresh }: { onRefresh: () => void }) {
  const [unassignedStudents, setUnassignedStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnassignedStudents();
  }, []);

  const fetchUnassignedStudents = async () => {
    try {
      setLoading(true);
      // Get all students
      const studentsResponse = await fetch('/api/students');
      const studentsData = await studentsResponse.json();
      
      // Get all placements
      const placementsResponse = await fetch('/api/placements');
      const placementsData = await placementsResponse.json();
      
      if (studentsData.success && placementsData.success) {
        const allStudents = studentsData.data;
        const assignedStudentIds = placementsData.data.map((p: Placement) => p.student_id);
        
        const unassigned = allStudents.filter((student: Student) => 
          student.status === 'active' && !assignedStudentIds.includes(student.student_id)
        );
        
        setUnassignedStudents(unassigned);
      }
    } catch (error) {
      console.error('Error fetching unassigned students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignStudent = async (studentId: string) => {
    try {
      // For now, just trigger auto-assignment for this specific student
      // In a full implementation, you'd show a room selection dialog
      const response = await fetch('/api/placements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'auto_assign' }),
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Student assigned successfully!');
        fetchUnassignedStudents();
        onRefresh();
      } else {
        alert(data.error || 'Failed to assign student');
      }
    } catch (error) {
      alert('Failed to assign student');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading unassigned students...</div>;
  }

  if (unassignedStudents.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-green-600 text-lg font-medium">✅ All students are assigned!</div>
        <p className="text-gray-600 mt-2">No students need room assignments at this time.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <span className="text-orange-600 font-medium">
          {unassignedStudents.length} student(s) need room assignments
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {unassignedStudents.map((student, index) => (
              <tr key={student._id || `unassigned-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.student_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {`${student.first_name} ${student.second_name || ''} ${student.last_name}`.trim()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.gender}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.batch}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleAssignStudent(student.student_id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Auto Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
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
    if (!confirm('This will automatically assign all unassigned students to available rooms. Continue?')) {
      return;
    }

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
        alert(`Successfully assigned ${data.assigned} students. ${data.errors?.length || 0} errors occurred.`);
        if (data.errors && data.errors.length > 0) {
          console.log('Assignment errors:', data.errors);
        }
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

        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-4">
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
            <button
              onClick={fetchPlacements}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Refresh Data
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by Student ID, Room, or Block..."
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                // Add search functionality here if needed
              }}
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Unassigned Students Section */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Unassigned Students</h2>
            <p className="text-sm text-gray-600">Students who need room assignments</p>
          </div>
          <div className="p-6">
            <UnassignedStudents onRefresh={fetchPlacements} />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Placements ({placements.length})</h2>
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
                {placements.map((placement, index) => (
                  <tr key={placement._id || `placement-${index}`} className="hover:bg-gray-50">
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