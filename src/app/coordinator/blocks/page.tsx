'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  Building, 
  Users, 
  UserCheck, 
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  MapPin,
  Home
} from 'lucide-react';
import ProfileAvatar from '@/components/ProfileAvatar';

interface Block {
  _id: string;
  block_id: string;
  name: string;
  proctor_id?: string;
  capacity: number;
  occupied: number;
  gender: 'male' | 'female';
  status: 'active' | 'inactive' | 'maintenance';
  reserved_for: 'male' | 'female' | 'mixed' | 'disabled';
  floors: number;
  rooms_per_floor: number;
  room_capacity: number;
  location?: string;
}

interface Employee {
  _id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  role: string;
  profile_image?: string;
}

export default function CoordinatorBlocks() {
  const { data: session, status } = useSession();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGender, setFilterGender] = useState('all');

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
      const [blocksRes, employeesRes] = await Promise.all([
        fetch('/api/blocks'),
        fetch('/api/employees')
      ]);

      const [blocksData, employeesData] = await Promise.all([
        blocksRes.json(),
        employeesRes.json()
      ]);

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

  const getProctorName = (proctorId?: string) => {
    if (!proctorId) return 'Unassigned';
    const proctor = employees.find(emp => emp.employee_id === proctorId);
    return proctor ? `${proctor.first_name} ${proctor.last_name}` : 'Unknown Proctor';
  };

  const getProctor = (proctorId?: string) => {
    if (!proctorId) return null;
    return employees.find(emp => emp.employee_id === proctorId);
  };

  const filteredBlocks = blocks.filter(block => {
    const matchesSearch = 
      block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.block_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProctorName(block.proctor_id).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || block.status === filterStatus;
    const matchesGender = filterGender === 'all' || block.gender === filterGender;
    
    return matchesSearch && matchesStatus && matchesGender;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blocks...</p>
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
              <Building className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Blocks & Rooms</h1>
                <p className="text-gray-600">View and manage dormitory blocks</p>
              </div>
            </div>
          </div>
        </div>

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
                  {blocks.filter(b => b.proctor_id).length}
                </div>
                <div className="text-gray-600">Assigned Blocks</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {blocks.reduce((sum, block) => sum + block.occupied, 0)}
                </div>
                <div className="text-gray-600">Total Students</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {blocks.reduce((sum, block) => sum + (block.floors * block.rooms_per_floor), 0)}
                </div>
                <div className="text-gray-600">Total Rooms</div>
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
                  placeholder="Search blocks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlocks.map((block) => {
            const proctor = getProctor(block.proctor_id);
            const occupancyRate = (block.occupied / block.capacity) * 100;
            
            return (
              <div key={block._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Building className="h-6 w-6 text-blue-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">{block.name}</h3>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      block.status === 'active' ? 'bg-green-100 text-green-800' :
                      block.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {block.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Block ID:</span>
                      <span className="font-medium">{block.block_id}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Gender:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        block.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                      }`}>
                        {block.gender}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Capacity:</span>
                      <span className="font-medium">{block.occupied}/{block.capacity}</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          occupancyRate >= 90 ? 'bg-red-500' :
                          occupancyRate >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${occupancyRate}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Floors:</span>
                      <span className="font-medium">{block.floors}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Rooms/Floor:</span>
                      <span className="font-medium">{block.rooms_per_floor}</span>
                    </div>

                    {block.location && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Location:</span>
                        <span className="font-medium">{block.location}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t">
                      <div className="text-sm text-gray-500 mb-2">Assigned Proctor:</div>
                      {proctor ? (
                        <div className="flex items-center">
                          <ProfileAvatar 
                            src={proctor.profile_image} 
                            name={`${proctor.first_name} ${proctor.last_name}`} 
                            size="sm"
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
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-2">
                    <Link
                      href={`/directorate/blocks/${block.block_id}/rooms`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Rooms
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredBlocks.length === 0 && (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No blocks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all' || filterGender !== 'all'
                ? 'Try adjusting your search or filter criteria.' 
                : 'No blocks available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}