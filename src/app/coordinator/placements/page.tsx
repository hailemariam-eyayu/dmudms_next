'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { 
  MapPin, 
  Users, 
  Building, 
  Search,
  Filter,
  Eye,
  Edit,
  UserCheck,
  Home
} from 'lucide-react';
import ProfileAvatar from '@/components/ProfileAvatar';

interface Placement {
  _id: string;
  student_id: string;
  block: string;
  room: string;
  status: 'active' | 'inactive' | 'pending';
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
  profile_image?: string;
}

interface Block {
  _id: string;
  block_id: string;
  name: string;
  proctor_id?: string;
  gender: 'male' | 'female';
}

interface Employee {
  _id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  profile_image?: string;
}

export default function CoordinatorPlacements() {
  const { data: session, status } = useSession();
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBlock, setFilterBlock] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

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
      const [placementsRes, studentsRes, blocksRes, employeesRes] = await Promise.all([
        fetch('/api/placements'),
        fetch('/api/students'),
        fetch('/api/blocks'),
        fetch('/api/employees')
      ]);

      const [placementsData, studentsData, blocksData, employeesData] = await Promise.all([
        placementsRes.json(),
        studentsRes.json(),
        blocksRes.json(),
        employeesRes.json()
      ]);

      if (placementsData.success) {
        setPlacements(placementsData.data);
      }

      if (studentsData.success) {
        setStudents(studentsData.data);
      }

      if (blocksData.success) {
        setBlocks(blocksData.data);
      }

      if (employeesData.success) {
        setEmployees(employeesData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStudent = (studentId: string) => {
    return students.find(s => s.student_id === studentId);
  };

  const getBlock = (blockId: string) => {
    return blocks.find(b => b.block_id === blockId);
  };

  const getProctor = (proctorId?: string) => {
    if (!proctorId) return null;
    return employees.find(emp => emp.employee_id === proctorId);
  };

  const filteredPlacements = placements.filter(placement => {
    const student = getStudent(placement.student_id);
    const block = getBlock(placement.block);
    
    const matchesSearch = student && (
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      placement.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
      placement.room.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesBlock = filterBlock === 'all' || placement.block === filterBlock;
    const matchesStatus = filterStatus === 'all' || placement.status === filterStatus;
    
    return matchesSearch && matchesBlock && matchesStatus;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading placements...</p>
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
              <MapPin className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Placements</h1>
                <p className="text-gray-600">View and manage student room assignments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{placements.length}</div>
                <div className="text-gray-600">Total Placements</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {placements.filter(p => p.status === 'active').length}
                </div>
                <div className="text-gray-600">Active Placements</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {new Set(placements.map(p => p.block)).size}
                </div>
                <div className="text-gray-600">Occupied Blocks</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {new Set(placements.map(p => `${p.block}-${p.room}`)).size}
                </div>
                <div className="text-gray-600">Occupied Rooms</div>
              </div>
            </div>
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
                  placeholder="Search students or rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterBlock}
                onChange={(e) => setFilterBlock(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Blocks</option>
                {blocks.map(block => (
                  <option key={block._id} value={block.block_id}>
                    {block.name}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Placements Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Student Placements</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Block Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlacements.map((placement) => {
                  const student = getStudent(placement.student_id);
                  const block = getBlock(placement.block);
                  const proctor = getProctor(block?.proctor_id);
                  
                  if (!student) return null;
                  
                  return (
                    <tr key={placement._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ProfileAvatar 
                            src={student.profile_image} 
                            name={`${student.first_name} ${student.last_name}`} 
                            size="sm"
                            className="mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student.first_name} {student.second_name} {student.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{student.student_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{placement.block} - Room {placement.room}</div>
                        <div className="text-sm text-gray-500">
                          Assigned: {new Date(placement.assigned_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{block?.name || placement.block}</div>
                        <div className="flex items-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            block?.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                          }`}>
                            {block?.gender || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {proctor ? (
                          <div className="flex items-center">
                            <ProfileAvatar 
                              src={proctor.profile_image} 
                              name={`${proctor.first_name} ${proctor.last_name}`} 
                              size="xs"
                              className="mr-2"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {proctor.first_name} {proctor.last_name}
                              </div>
                              <div className="text-xs text-gray-500">{proctor.employee_id}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          placement.status === 'active' ? 'bg-green-100 text-green-800' :
                          placement.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {placement.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredPlacements.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No placements found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterBlock !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.' 
                : 'No student placements available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}