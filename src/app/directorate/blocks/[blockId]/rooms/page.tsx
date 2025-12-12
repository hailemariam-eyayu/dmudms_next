'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { Building, Plus, Edit, Trash2, Users, ArrowLeft } from 'lucide-react';

export default function BlockRoomsPage({ params }: { params: Promise<{ blockId: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blockId, setBlockId] = useState<string>('');
  const [block, setBlock] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setBlockId(resolvedParams.blockId);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !['admin', 'directorate'].includes(session.user.role)) {
      redirect('/auth/signin');
    } else if (blockId) {
      fetchBlockAndRooms();
    }
  }, [session, status, blockId]);

  const fetchBlockAndRooms = async () => {
    try {
      const [blockRes, roomsRes] = await Promise.all([
        fetch(`/api/blocks/${blockId}`),
        fetch(`/api/rooms?block=${blockId}`)
      ]);

      const [blockData, roomsData] = await Promise.all([
        blockRes.json(),
        roomsRes.json()
      ]);

      if (blockData.success) setBlock(blockData.data);
      if (roomsData.success) setRooms(roomsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoom = (room: any) => {
    setEditingRoom(room);
  };

  const handleDeleteRoom = async (room: any) => {
    if (!confirm(`Are you sure you want to delete room ${room.room_number}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/rooms/${room.room_id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchBlockAndRooms();
      } else {
        alert('Failed to delete room');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Error deleting room');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blocks
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {block?.name || blockId} - Rooms
                </h1>
                <p className="text-gray-600">Manage rooms in this block</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </button>
          </div>
        </div>

        {/* Block Info */}
        {block && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Block Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Block ID</label>
                <p className="text-sm text-gray-900">{block.block_id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-sm text-gray-900">{block.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reserved For</label>
                <p className="text-sm text-gray-900 capitalize">{block.reserved_for}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Rooms</label>
                <p className="text-sm text-gray-900">{rooms.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{rooms.length}</div>
                <div className="text-gray-600">Total Rooms</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {rooms.filter(r => r.status === 'available').length}
                </div>
                <div className="text-gray-600">Available</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {rooms.filter(r => r.status === 'occupied').length}
                </div>
                <div className="text-gray-600">Occupied</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {rooms.filter(r => r.status === 'maintenance').length}
                </div>
                <div className="text-gray-600">Maintenance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms by Floor */}
        <div className="space-y-6">
          {rooms.length > 0 ? (
            // Group rooms by floor
            (Object.entries(
              rooms.reduce((acc, room) => {
                const floor = room.floor || 0;
                if (!acc[floor]) acc[floor] = [];
                acc[floor].push(room);
                return acc;
              }, {} as Record<number, any[]>)
            ) as [string, any[]][])
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([floor, floorRooms]) => (
              <div key={floor} className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {floor === '0' ? 'Ground Floor' : `Floor ${floor}`}
                      {floor === '0' && (
                        <span className="ml-2 text-sm text-blue-600 font-normal">
                          (Disability Accessible)
                        </span>
                      )}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {floorRooms.length} rooms
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {floorRooms
                      .sort((a, b) => a.room_number?.localeCompare(b.room_number) || 0)
                      .map((room) => (
                      <div key={room._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <h3 className="font-medium text-gray-900">
                              Room {room.room_number || room.room_id}
                            </h3>
                            {room.disability_accessible && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                ♿
                              </span>
                            )}
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            room.status === 'available' 
                              ? 'bg-green-100 text-green-800'
                              : room.status === 'occupied'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {room.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>ID: {room.room_id}</div>
                          <div>Capacity: {room.capacity}</div>
                          <div>Occupied: {room.current_occupancy || 0}</div>
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  room.current_occupancy >= room.capacity 
                                    ? 'bg-red-500' 
                                    : room.current_occupancy > 0 
                                    ? 'bg-yellow-500' 
                                    : 'bg-green-500'
                                }`}
                                style={{ 
                                  width: `${Math.min((room.current_occupancy || 0) / room.capacity * 100, 100)}%` 
                                }}
                              ></div>
                            </div>
                            <span className="ml-2 text-xs">
                              {room.capacity > 0 ? Math.round(((room.current_occupancy || 0) / room.capacity) * 100) : 0}%
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end space-x-2">
                          <button 
                            onClick={() => handleEditRoom(room)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                            title="Edit Room"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteRoom(room)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Delete Room"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow">
              <div className="text-center py-12">
                <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Rooms</h3>
                <p className="text-gray-500 mb-4">
                  {block ? 
                    'Rooms will be automatically generated when the block is created with floor and room information.' :
                    'No rooms have been added to this block yet.'
                  }
                </p>
                {!block?.floors && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Room Manually
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateForm && (
        <CreateRoomModal
          blockId={blockId}
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            fetchBlockAndRooms();
          }}
        />
      )}

      {/* Edit Room Modal */}
      {editingRoom && (
        <EditRoomModal
          room={editingRoom}
          onClose={() => setEditingRoom(null)}
          onSuccess={() => {
            setEditingRoom(null);
            fetchBlockAndRooms();
          }}
        />
      )}
    </div>
  );
}

// Create Room Modal Component
function CreateRoomModal({ 
  blockId, 
  onClose, 
  onSuccess 
}: { 
  blockId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    room_id: '',
    room_number: '',
    capacity: 6,
    floor: 0,
    status: 'available'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          block: blockId,
          current_occupancy: 0
        })
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Room</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room ID (Unique)</label>
              <input
                type="text"
                value={formData.room_id}
                onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder={`e.g., ${blockId}001, ${blockId}101`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
              <input
                type="text"
                value={formData.room_number}
                onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 01, 02, 101"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
              <select
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value={0}>Ground Floor (Disability Accessible)</option>
                <option value={1}>Floor 1</option>
                <option value={2}>Floor 2</option>
                <option value={3}>Floor 3</option>
                <option value={4}>Floor 4</option>
                <option value={5}>Floor 5</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="1"
                max="12"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="available">Available</option>
                <option value="maintenance">Maintenance</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>

            {formData.floor === 0 && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  ♿ This room will be marked as disability accessible since it's on the ground floor.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Edit Room Modal Component
function EditRoomModal({ 
  room, 
  onClose, 
  onSuccess 
}: { 
  room: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    status: room.status || 'available',
    capacity: room.capacity || 6,
    current_occupancy: room.current_occupancy || 0,
    disability_accessible: room.disability_accessible || false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/rooms/${room.room_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(`Failed to update room: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Error updating room');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Edit Room {room.room_number || room.room_id}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room ID</label>
              <input
                type="text"
                value={room.room_id}
                disabled
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Room ID cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="1"
                max="12"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Occupancy</label>
              <input
                type="number"
                value={formData.current_occupancy}
                onChange={(e) => setFormData({ ...formData, current_occupancy: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
                max={formData.capacity}
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="disability_accessible"
                checked={formData.disability_accessible}
                onChange={(e) => setFormData({ ...formData, disability_accessible: e.target.checked })}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="disability_accessible" className="ml-2 block text-sm text-gray-900">
                Disability Accessible
              </label>
            </div>

            {room.floor === 0 && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  ♿ Ground floor rooms are typically disability accessible.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Update Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}