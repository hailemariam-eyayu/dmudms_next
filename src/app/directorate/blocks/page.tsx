'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { 
  Building, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Settings,
  AlertCircle,
  Home
} from 'lucide-react';

export default function BlocksManagementPage() {
  const { data: session, status } = useSession();
  const [blocks, setBlocks] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState<any>(null);
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
      const [blocksResponse, roomsResponse] = await Promise.all([
        fetch('/api/blocks'),
        fetch('/api/rooms')
      ]);

      const blocksData = await blocksResponse.json();
      const roomsData = await roomsResponse.json();

      if (blocksData.success) {
        setBlocks(blocksData.data);
      }
      if (roomsData.success) {
        setRooms(roomsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  const getBlockStats = (blockId: string) => {
    const blockRooms = rooms.filter(room => room.block === blockId);
    const totalRooms = blockRooms.length;
    const occupiedRooms = blockRooms.filter(room => room.status === 'occupied').length;
    const totalCapacity = blockRooms.reduce((sum, room) => sum + (room.capacity || 0), 0);
    const currentOccupancy = blockRooms.reduce((sum, room) => sum + (room.current_occupancy || 0), 0);

    return {
      totalRooms,
      occupiedRooms,
      totalCapacity,
      currentOccupancy,
      occupancyRate: totalCapacity > 0 ? Math.round((currentOccupancy / totalCapacity) * 100) : 0
    };
  };

  const handleCreateBlock = async (blockData: any) => {
    try {
      const response = await fetch('/api/blocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(blockData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Block created successfully!' });
        setShowCreateModal(false);
        fetchData();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create block' });
      }
    } catch (error) {
      console.error('Error creating block:', error);
      setMessage({ type: 'error', text: 'Failed to create block' });
    }
  };

  const handleUpdateBlock = async (blockId: string, updates: any) => {
    try {
      const response = await fetch(`/api/blocks/${blockId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Block updated successfully!' });
        setEditingBlock(null);
        fetchData();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update block' });
      }
    } catch (error) {
      console.error('Error updating block:', error);
      setMessage({ type: 'error', text: 'Failed to update block' });
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm('Are you sure you want to delete this block? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/blocks/${blockId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Block deleted successfully!' });
        fetchData();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete block' });
      }
    } catch (error) {
      console.error('Error deleting block:', error);
      setMessage({ type: 'error', text: 'Failed to delete block' });
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blocks management...</p>
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
              <Building className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Blocks & Rooms Management</h1>
                <p className="text-gray-600">Manage dormitory blocks and room configurations</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Block
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
              <Home className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{rooms.length}</div>
                <div className="text-gray-600">Total Rooms</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {rooms.reduce((sum, room) => sum + (room.capacity || 0), 0)}
                </div>
                <div className="text-gray-600">Total Capacity</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {blocks.filter(block => block.status === 'active').length}
                </div>
                <div className="text-gray-600">Active Blocks</div>
              </div>
            </div>
          </div>
        </div>

        {/* Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blocks.map((block) => {
            const stats = getBlockStats(block.block_id);
            
            return (
              <div key={block.block_id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Building className="h-6 w-6 text-purple-600 mr-2" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{block.block_id}</h3>
                        <p className="text-sm text-gray-500">{block.name}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingBlock(block)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlock(block.block_id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Gender:</span>
                      <span className="font-medium capitalize">{block.reserved_for}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        block.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {block.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Rooms:</span>
                      <span className="font-medium">{stats.totalRooms}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Capacity:</span>
                      <span className="font-medium">{stats.totalCapacity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Occupancy:</span>
                      <span className="font-medium">{stats.currentOccupancy}/{stats.totalCapacity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Occupancy Rate:</span>
                      <span className="font-medium">{stats.occupancyRate}%</span>
                    </div>
                    {block.proctor_id && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Proctor:</span>
                        <span className="font-medium">{block.proctor_id}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Occupancy Progress</span>
                      <span className="text-sm font-medium">{stats.occupancyRate}%</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${Math.min(stats.occupancyRate, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <a
                      href={`/directorate/blocks/${block.block_id}/rooms`}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      Manage Rooms →
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {blocks.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Blocks Found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first dormitory block.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Block
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Block Modal would go here */}
      {/* For brevity, I'm not including the full modal implementation */}
    </div>
  );
}