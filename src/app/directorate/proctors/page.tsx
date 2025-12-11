'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { UserCheck, Building, Users, Save, AlertCircle } from 'lucide-react';

export default function ProctorAssignmentPage() {
  const { data: session, status } = useSession();
  const [blocks, setBlocks] = useState<any[]>([]);
  const [proctors, setProctors] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'directorate') {
      redirect('/auth/signin');
      return;
    }

    fetchData();
  }, [session, status]);

  const fetchData = async () => {
    try {
      const [blocksResponse, employeesResponse] = await Promise.all([
        fetch('/api/blocks'),
        fetch('/api/employees')
      ]);

      const blocksData = await blocksResponse.json();
      const employeesData = await employeesResponse.json();

      if (blocksData.success) {
        setBlocks(blocksData.data);
        
        // Initialize assignments with current proctor assignments
        const currentAssignments: Record<string, string> = {};
        blocksData.data.forEach((block: any) => {
          if (block.proctor_id) {
            currentAssignments[block.block_id] = block.proctor_id;
          }
        });
        setAssignments(currentAssignments);
      }

      if (employeesData.success) {
        // Filter only proctors
        const proctorList = employeesData.data.filter((emp: any) => emp.role === 'proctor');
        setProctors(proctorList);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentChange = (blockId: string, proctorId: string) => {
    setAssignments(prev => ({
      ...prev,
      [blockId]: proctorId
    }));
  };

  const saveAssignments = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const updates = Object.entries(assignments).map(([blockId, proctorId]) => ({
        blockId,
        proctorId: proctorId || null
      }));

      const response = await fetch('/api/directorate/proctor-assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ assignments: updates })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Proctor assignments saved successfully!' });
        fetchData(); // Refresh data
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save assignments' });
      }
    } catch (error) {
      console.error('Error saving assignments:', error);
      setMessage({ type: 'error', text: 'Failed to save assignments' });
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading proctor assignments...</p>
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
              <UserCheck className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Proctor Assignment</h1>
                <p className="text-gray-600">Assign proctors to dormitory blocks</p>
              </div>
            </div>
            <button
              onClick={saveAssignments}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Assignments'}
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <AlertCircle className="h-5 w-5 mr-2" />
            {message.text}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{blocks.length}</div>
                <div className="text-gray-600">Total Blocks</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{proctors.length}</div>
                <div className="text-gray-600">Available Proctors</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {Object.values(assignments).filter(Boolean).length}
                </div>
                <div className="text-gray-600">Assigned Blocks</div>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Block Assignments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Block
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Block Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Proctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assign Proctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blocks.map((block) => {
                  const currentProctor = proctors.find(p => p.employee_id === block.proctor_id);
                  const assignedProctor = proctors.find(p => p.employee_id === assignments[block.block_id]);
                  
                  return (
                    <tr key={block.block_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{block.block_id}</div>
                            <div className="text-sm text-gray-500">{block.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div>Gender: {block.reserved_for}</div>
                          <div>Rooms: {block.total_rooms}</div>
                          <div>Status: {block.status}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {currentProctor ? (
                          <div>
                            <div className="font-medium text-gray-900">
                              {currentProctor.first_name} {currentProctor.last_name}
                            </div>
                            <div className="text-gray-500">{currentProctor.employee_id}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={assignments[block.block_id] || ''}
                          onChange={(e) => handleAssignmentChange(block.block_id, e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        >
                          <option value="">Select Proctor</option>
                          {proctors.map((proctor) => (
                            <option key={proctor.employee_id} value={proctor.employee_id}>
                              {proctor.first_name} {proctor.last_name} ({proctor.employee_id})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          assignments[block.block_id] 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {assignments[block.block_id] ? 'Assigned' : 'Unassigned'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Proctor Overview */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Proctor Overview</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {proctors.map((proctor) => {
                const assignedBlocks = Object.entries(assignments)
                  .filter(([_, proctorId]) => proctorId === proctor.employee_id)
                  .map(([blockId]) => blockId);

                return (
                  <div key={proctor.employee_id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <UserCheck className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {proctor.first_name} {proctor.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{proctor.employee_id}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Status: {proctor.status}</div>
                      <div>Assigned Blocks: {assignedBlocks.length}</div>
                      {assignedBlocks.length > 0 && (
                        <div className="mt-1">
                          <span className="font-medium">Blocks: </span>
                          {assignedBlocks.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}