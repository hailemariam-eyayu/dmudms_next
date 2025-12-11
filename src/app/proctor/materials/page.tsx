'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Package, Plus, Edit, Trash2, Search, Building, AlertCircle } from 'lucide-react';

export default function ProctorMaterialsPage() {
  const { data: session, status } = useSession();
  const [materials, setMaterials] = useState<any[]>([]);
  const [assignedBlocks, setAssignedBlocks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !['proctor', 'proctor_manager'].includes(session.user.role)) {
      redirect('/auth/signin');
    } else {
      fetchMaterials();
    }
  }, [session, status]);

  const fetchMaterials = async () => {
    try {
      // Get proctor's assigned blocks first
      const assignedResponse = await fetch('/api/proctor/assigned-students');
      const assignedData = await assignedResponse.json();
      
      if (assignedData.success && assignedData.data.length > 0) {
        const blocks = [...new Set(assignedData.data.map((s: any) => s.block))];
        setAssignedBlocks(blocks);
        
        // Fetch materials for assigned blocks
        const materialsPromises = blocks.map(block => 
          fetch(`/api/materials?block=${block}`).then(res => res.json())
        );
        
        const materialsResults = await Promise.all(materialsPromises);
        const allMaterials = materialsResults
          .filter(result => result.success)
          .flatMap(result => result.data);
        
        setMaterials(allMaterials);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      setMessage({ type: 'error', text: 'Failed to load materials' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMaterial = async (materialData: any) => {
    try {
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(materialData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Material registration created successfully!' });
        setShowCreateForm(false);
        fetchMaterials();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create material registration' });
      }
    } catch (error) {
      console.error('Error creating material:', error);
      setMessage({ type: 'error', text: 'Failed to create material registration' });
    }
  };

  const handleUpdateMaterial = async (materialId: string, materialData: any) => {
    try {
      const response = await fetch(`/api/materials/${materialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(materialData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Material registration updated successfully!' });
        setEditingMaterial(null);
        fetchMaterials();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update material registration' });
      }
    } catch (error) {
      console.error('Error updating material:', error);
      setMessage({ type: 'error', text: 'Failed to update material registration' });
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this material registration?')) return;

    try {
      const response = await fetch(`/api/materials/${materialId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Material registration deleted successfully!' });
        fetchMaterials();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete material registration' });
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      setMessage({ type: 'error', text: 'Failed to delete material registration' });
    }
  };

  const filteredMaterials = materials.filter(material =>
    material.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading materials...</p>
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
              <Package className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Room Materials</h1>
                <p className="text-gray-600">Register and manage room materials inventory</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Register Materials
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

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by block or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{materials.length}</div>
                <div className="text-gray-600">Registered Rooms</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{assignedBlocks.length}</div>
                <div className="text-gray-600">Assigned Blocks</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {materials.reduce((sum, m) => sum + m.chair + m.tables + m.locker, 0)}
                </div>
                <div className="text-gray-600">Total Items</div>
              </div>
            </div>
          </div>
        </div>

        {/* Materials Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Material Registrations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unlocker
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Furniture
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bedding
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Other
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMaterials.map((material) => (
                  <tr key={material._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {material.block} - {material.room}
                        </div>
                        <div className="text-sm text-gray-500">
                          Registered: {new Date(material.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.unlocker}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>Chairs: {material.chair}</div>
                        <div>Tables: {material.tables}</div>
                        <div>Lockers: {material.locker}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>Pure Foam: {material.pure_foam}</div>
                        <div>Damaged Foam: {material.damaged_foam}</div>
                        <div>Tiras: {material.tiras}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>Chibud: {material.chibud}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingMaterial(material)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMaterial(material._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Material Registrations</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No materials match your search criteria.' : 'No room materials have been registered yet.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Register First Room
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Material Modal */}
      {(showCreateForm || editingMaterial) && (
        <MaterialFormModal
          material={editingMaterial}
          assignedBlocks={assignedBlocks}
          onClose={() => {
            setShowCreateForm(false);
            setEditingMaterial(null);
          }}
          onSubmit={(data) => {
            if (editingMaterial) {
              handleUpdateMaterial(editingMaterial._id, data);
            } else {
              handleCreateMaterial(data);
            }
          }}
        />
      )}
    </div>
  );
}

// Material Form Modal Component
function MaterialFormModal({ 
  material, 
  assignedBlocks, 
  onClose, 
  onSubmit 
}: { 
  material?: any;
  assignedBlocks: string[];
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    block: material?.block || (assignedBlocks[0] || ''),
    room: material?.room || '',
    unlocker: material?.unlocker || 'Original',
    locker: material?.locker || 0,
    chair: material?.chair || 0,
    pure_foam: material?.pure_foam || 0,
    damaged_foam: material?.damaged_foam || 0,
    tiras: material?.tiras || 0,
    tables: material?.tables || 0,
    chibud: material?.chibud || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {material ? 'Edit Material Registration' : 'Register Room Materials'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Block</label>
                <select
                  value={formData.block}
                  onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  {assignedBlocks.map(block => (
                    <option key={block} value={block}>{block}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 101, 102A"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unlocker Type</label>
              <select
                value={formData.unlocker}
                onChange={(e) => setFormData({ ...formData, unlocker: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Original">Original</option>
                <option value="Copy">Copy</option>
              </select>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Furniture Items</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chairs</label>
                  <input
                    type="number"
                    value={formData.chair}
                    onChange={(e) => setFormData({ ...formData, chair: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    max="6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tables</label>
                  <input
                    type="number"
                    value={formData.tables}
                    onChange={(e) => setFormData({ ...formData, tables: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    max="6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lockers</label>
                  <input
                    type="number"
                    value={formData.locker}
                    onChange={(e) => setFormData({ ...formData, locker: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    max="6"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Bedding Items</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pure Foam</label>
                  <input
                    type="number"
                    value={formData.pure_foam}
                    onChange={(e) => setFormData({ ...formData, pure_foam: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    max="6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Damaged Foam</label>
                  <input
                    type="number"
                    value={formData.damaged_foam}
                    onChange={(e) => setFormData({ ...formData, damaged_foam: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    max="6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiras</label>
                  <input
                    type="number"
                    value={formData.tiras}
                    onChange={(e) => setFormData({ ...formData, tiras: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    max="6"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Other Items</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chibud</label>
                <input
                  type="number"
                  value={formData.chibud}
                  onChange={(e) => setFormData({ ...formData, chibud: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  max="6"
                />
              </div>
            </div>

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
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {material ? 'Update Registration' : 'Register Materials'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}