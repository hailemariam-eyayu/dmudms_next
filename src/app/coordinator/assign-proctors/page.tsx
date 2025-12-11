'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { 
  UserPlus, 
  Building, 
  UserCheck, 
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';

interface Proctor {
  _id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  email: string;
  gender: 'male' | 'female';
}

interface Block {
  _id: string;
  block_id: string;
  name: string;
  proctor_id?: string;
  capacity: number;
  occupied: number;
  gender: string;
  status: string;
}

export default function AssignProctors() {
  const { data: session, status } = useSession();
  const [proctors, setProctors] = useState<Proctor[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [assignments, setAssignments] = useState<{[blockId: string]: string}>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [filterAssigned, setFilterAssigned] = useState('all');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'coordinator') {
      redirect('/auth/signin');
    } else {
      fetchData();
    }
  }, [session, status]);

  const fetchData = async () => {
    try {
      const [employeesRes, blocksRes] = await Promise.all([
        fetch('/api/employees'),
        fetch('/api/blocks')
      ]);

      const [employeesData, blocksData] = await Promise.all([
        employeesRes.json(),
        blocksRes.json()
      ]);

      if (employeesData.success) {
        const proctorList = employeesData.data.filter((emp: any) => 
          emp.role === 'proctor' || emp.role === 'proctor_manager'
        ).filter((emp: any) => emp.status === 'active');
        setProctors(proctorList);
      }

      if (blocksData.success) {
        const blockList = blocksData.data;
        setBlocks(blockList);
        
        // Initialize assignments with current proctor assignments
        const currentAssignments: {[blockId: string]: string} = {};
        blockList.forEach((block: Block) => {
          if (block.proctor_id) {
            currentAssignments[block.block_id] = block.proctor_id;
          }
        });
        setAssignments(currentAssignments);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentChange = (blockId: string, proctorId: string) => {
    setAssignments(prev => ({
      ...prev,
      [blockId]: proctorId === '' ? undefined : proctorId
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

      const response = await fetch('/api/blocks/assign-proctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignments: updates }),
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
      setMessage({ type: 'error', text: 'An error occurred while saving assignments' });
    } finally {
      setSaving(false);
    }
  };

  const resetAssignments = () => {
    const currentAssignments: {[blockId: string]: string} = {};
    blocks.forEach((block: Block) => {
      if (block.proctor_id) {
        currentAssignments[block.block_id] = block.proctor_id;
      }
    });
    setAssignments(currentAssignments);
    setMessage(null);
  };

  const getProctorName = (proctorId: string) => {
    const proctor = proctors.find(p => p.employee_id === proctorId);
    return proctor ? `${proctor.first_name} ${proctor.last_name}` : 'Unknown';
  };

  const getProctorAssignmentCount = (proctorId: string) => {
    return Object.values(assignments).filter(id => id === proctorId).length;
  };

  const filteredBlocks = blocks.filter(block => {
    const matchesSearch = 
      block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.block_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = filterGender === 'all' || block.gender === filterGender;
    
    const isAssigned = assignments[block.block_id] || block.proctor_id;
    const matchesAssigned = 
      filterAssigned === 'all' || 
      (filterAssigned === 'assigned' && isAssigned) ||
      (filterAssigned === 'unassigned' && !isAssigned);
    
    return matchesSearch && matchesGender && matchesAssigned;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assignment interface...</p>
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
              <UserPlus className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Assign Proctors</h1>
                <p className="text-gray-600">Assign proctors to dormitory blocks</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={resetAssignments}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </button>
              <button
                onClick={saveAssignments}
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {saving ? 'Saving...' : 'Save Assignments'}
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {message.text}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <div className="text-2xl font-bold text-gray-900">
                  {Object.values(assignments).filter(Boolean).length}
                </div>
                <div className="text-gray-600">Assigned Blocks</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserPlus className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{proctors.length}</div>
                <div className="text-gray-600">Available Proctors</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {blocks.length - Object.values(assignments).filter(Boolean).length}
                </div>
                <div className="text-gray-600">Unassigned Blocks</div>
              </div>
            </div>
          </div>
        </div>

        {/* Proctor Summary */}
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Proctor Assignment Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {proctors.map((proctor) => {
              const assignmentCount = getProctorAssignmentCount(proctor.employee_id);
              return (
                <div key={proctor._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                      <span className="text-xs font-medium text-gray-700">
                        {proctor.first_name.charAt(0)}{proctor.last_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {proctor.first_name} {proctor.last_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {proctor.employee_id} • {proctor.gender}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{assignmentCount}</div>
                    <div className="text-xs text-gray-500">blocks</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search blocks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <select
                value={filterAssigned}
                onChange={(e) => setFilterAssigned(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Blocks</option>
                <option value="assigned">Assigned</option>
                <option value="unassigned">Unassigned</option>
              </select>
            </div>
          </div>
        </div>

        {/* Assignment Interface */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Block Assignments</h2>
              <div className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                ℹ️ Only proctors matching the block's gender are shown
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Block
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Proctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assign Proctor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlocks.map((block) => {
                  const currentAssignment = assignments[block.block_id] || '';
                  const hasChanged = currentAssignment !== (block.proctor_id || '');
                  
                  return (
                    <tr key={block._id} className={`hover:bg-gray-50 ${hasChanged ? 'bg-yellow-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{block.name}</div>
                            <div className="text-sm text-gray-500">{block.block_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                          block.gender === 'male' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-pink-100 text-pink-800'
                        }`}>
                          {block.gender}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {block.occupied}/{block.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {block.proctor_id ? getProctorName(block.proctor_id) : (
                          <span className="text-gray-400">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={currentAssignment}
                          onChange={(e) => handleAssignmentChange(block.block_id, e.target.value)}
                          className={`border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                            hasChanged ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Proctor</option>
                          {proctors
                            .filter(proctor => proctor.gender === block.gender)
                            .map((proctor) => (
                            <option key={proctor._id} value={proctor.employee_id}>
                              {proctor.first_name} {proctor.last_name} ({proctor.employee_id}) - {proctor.gender}
                            </option>
                          ))}
                          {proctors.filter(proctor => proctor.gender === block.gender).length === 0 && (
                            <option disabled>No {block.gender} proctors available</option>
                          )}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredBlocks.length === 0 && (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No blocks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}