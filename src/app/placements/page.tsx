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
  disability_status: 'none' | 'physical' | 'visual' | 'hearing' | 'other';
  status: 'active' | 'inactive';
}

// Component to show unassigned students
function UnassignedStudents({ onRefresh }: { onRefresh: () => void }) {
  const [unassignedStudents, setUnassignedStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManualAssign, setShowManualAssign] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    fetchUnassignedStudents();
    fetchBlocksAndRooms();
  }, []);

  const fetchBlocksAndRooms = async () => {
    try {
      const [blocksResponse, roomsResponse] = await Promise.all([
        fetch('/api/blocks'),
        fetch('/api/rooms')
      ]);
      
      const blocksData = await blocksResponse.json();
      const roomsData = await roomsResponse.json();
      
      if (blocksData.success) setBlocks(blocksData.data);
      if (roomsData.success) setRooms(roomsData.data);
    } catch (error) {
      console.error('Error fetching blocks and rooms:', error);
    }
  };

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
      const response = await fetch('/api/placements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'auto_assign', student_id: studentId }),
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

  const handleManualAssign = async (studentId: string, blockId: string, roomId: string) => {
    try {
      const response = await fetch('/api/placements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'manual_assign',
          student_id: studentId,
          block_id: blockId,
          room_id: roomId
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Student assigned successfully!');
        setShowManualAssign(null);
        fetchUnassignedStudents();
        onRefresh();
      } else {
        alert(data.error || 'Failed to assign student');
      }
    } catch (error) {
      alert('Failed to assign student');
    }
  };

  const getAvailableRoomsForStudent = (student: Student) => {
    return rooms.filter(room => {
      const block = blocks.find(b => b.block_id === room.block);
      if (!block) return false;
      
      // Gender matching
      if (block.reserved_for !== student.gender) return false;
      
      // Room availability
      if (room.status !== 'available' || room.current_occupancy >= room.capacity) return false;
      
      // Disability accessibility logic
      if (student.disability_status !== 'none') {
        // Students with disabilities need accessible rooms (ground floor)
        return room.disability_accessible;
      } else {
        // Normal students can use any available room
        // Including non-ground floors in disability blocks
        return true;
      }
    });
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disability Status</th>
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
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    student.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                  }`}>
                    {student.gender}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    student.disability_status === 'none' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {student.disability_status === 'none' ? 'None' : student.disability_status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.batch}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAssignStudent(student.student_id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Auto Assign
                    </button>
                    <button
                      onClick={() => setShowManualAssign(student.student_id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Manual Assign
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manual Assignment Modal */}
      {showManualAssign && (
        <ManualAssignmentModal
          student={unassignedStudents.find(s => s.student_id === showManualAssign)!}
          availableRooms={getAvailableRoomsForStudent(unassignedStudents.find(s => s.student_id === showManualAssign)!)}
          blocks={blocks}
          onClose={() => setShowManualAssign(null)}
          onAssign={handleManualAssign}
        />
      )}
    </div>
  );
}

// Manual Assignment Modal Component
function ManualAssignmentModal({ 
  student, 
  availableRooms, 
  blocks, 
  onClose, 
  onAssign 
}: { 
  student: Student;
  availableRooms: any[];
  blocks: any[];
  onClose: () => void;
  onAssign: (studentId: string, blockId: string, roomId: string) => void;
}) {
  const [selectedBlock, setSelectedBlock] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');

  const availableBlocks = blocks.filter(block => 
    block.reserved_for === student.gender && 
    availableRooms.some(room => room.block === block.block_id)
  );

  const roomsInSelectedBlock = availableRooms.filter(room => room.block === selectedBlock);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBlock && selectedRoom) {
      onAssign(student.student_id, selectedBlock, selectedRoom);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Manual Room Assignment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Student Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Student Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Student ID:</span>
              <span className="ml-2 font-medium">{student.student_id}</span>
            </div>
            <div>
              <span className="text-gray-600">Name:</span>
              <span className="ml-2 font-medium">
                {`${student.first_name} ${student.second_name || ''} ${student.last_name}`.trim()}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Gender:</span>
              <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                student.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
              }`}>
                {student.gender}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Disability Status:</span>
              <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                student.disability_status === 'none' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
              }`}>
                {student.disability_status === 'none' ? 'None' : student.disability_status}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Batch:</span>
              <span className="ml-2 font-medium">{student.batch}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Block Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Block
            </label>
            <select
              value={selectedBlock}
              onChange={(e) => {
                setSelectedBlock(e.target.value);
                setSelectedRoom(''); // Reset room selection
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a block...</option>
              {availableBlocks.map((block) => (
                <option key={block.block_id} value={block.block_id}>
                  {block.block_id} - {block.name} ({block.reserved_for})
                  {block.disable_group && ' - Disability Accessible'}
                </option>
              ))}
            </select>
          </div>

          {/* Room Selection */}
          {selectedBlock && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Room
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a room...</option>
                {roomsInSelectedBlock.map((room) => (
                  <option key={room.room_id} value={room.room_id}>
                    {room.room_number} (Floor {room.floor}) - 
                    {room.current_occupancy}/{room.capacity} occupied
                    {room.disability_accessible && ' - Accessible'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Assignment Rules Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Assignment Rules</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Students can only be assigned to blocks matching their gender</li>
              <li>• Students with disabilities require accessible rooms (ground floor)</li>
              <li>• Normal students can use any available room, including upper floors in disability blocks</li>
              <li>• Room capacity must not be exceeded</li>
            </ul>
          </div>

          {availableRooms.length === 0 && (
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-800 text-sm">
                No available rooms found for this student. Please check room availability or create new blocks.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedBlock || !selectedRoom}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Assign Room
            </button>
          </div>
        </form>
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