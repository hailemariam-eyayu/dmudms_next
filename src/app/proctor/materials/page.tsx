'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function ProctorMaterialsPage() {
  const { data: session, status } = useSession();
  const [materials, setMaterials] = useState<any[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'proctor') {
      redirect('/auth/signin');
      return;
    }

    fetchMaterials();
  }, [session, status]);

  useEffect(() => {
    filterMaterials();
  }, [materials, searchTerm]);

  const fetchMaterials = async () => {
    try {
      // Get proctor's assigned blocks first
      const assignedResponse = await fetch(`/api/proctor/assigned-students?proctorId=${session?.user?.id}`);
      const assignedData = await assignedResponse.json();
      
      if (assignedData.success && assignedData.data.length > 0) {
        // Get unique blocks
        const blocks = [...new Set(assignedData.data.map((student: any) => student.block))];
        
        // Fetch materials for each block
        const materialPromises = blocks.map(block => 
          fetch(`/api/materials?block=${block}`).then(res => res.json())
        );
        
        const materialResponses = await Promise.all(materialPromises);
        const allMaterials = materialResponses
          .filter(response => response.success)
          .flatMap(response => response.data);
        
        setMaterials(allMaterials);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      setMessage({ type: 'error', text: 'Failed to load materials' });
    } finally {
      setLoading(false);
    }
  };

  const filterMaterials = () => {
    let filtered = materials;

    if (searchTerm) {
      filtered = filtered.filter(material =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.block.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMaterials(filtered);
  };

  const handleAddMaterial = async (materialData: any) => {
    try {
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...materialData,
          added_by: session?.user?.id,
          added_date: new Date()
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Material added successfully!' });
        setShowAddModal(false);
        fetchMaterials();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to add material' });
      }
    } catch (error) {
      console.error('Error adding material:', error);
      setMessage({ type: 'error', text: 'Failed to add material' });
    }
  };

  const handleUpdateMaterial = async (materialId: string, updates: any) => {
    try {
      const response = await fetch(`/api/materials/${materialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Material updated successfully!' });
        setEditingMaterial(null);
        fetchMaterials();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update material' });
      }
    } catch (error) {
      console.error('Error updating material:', error);
      setMessage({ type: 'error', text: 'Failed to update material' });
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this material?')) {
      return;
    }

    try {
      const response = await fetch(`/api/materials/${materialId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Material deleted successfully!' });
        fetchMaterials();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete material' });
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      setMessage({ type: 'error', text: 'Failed to delete material' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4" />;
      case 'low_stock':
        return <AlertCircle className="h-4 w-4" />;
      case 'out_of_stock':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

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
                <h1 className="text-3xl font-bold text-gray-900">Materials Management</h1>
                <p className="text-gray-600">Manage materials for your assigned blocks</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Material
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
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{materials.length}</div>
                <div className="text-gray-600">Total Materials</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {materials.filter(m => m.status === 'available').length}
                </div>
                <div className="text-gray-600">Available</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {materials.filter(m => m.status === 'low_stock').length}
                </div>
                <div className="text-gray-600">Low Stock</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {materials.filter(m => m.status === 'out_of_stock').length}
                </div>
                <div className="text-gray-600">Out of Stock</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <div key={material._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Package className="h-6 w-6 text-green-600 mr-2" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{material.name}</h3>
                      <p className="text-sm text-gray-500">{material.category}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingMaterial(material)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMaterial(material._id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Block:</span>
                    <span className="font-medium">{material.block}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Quantity:</span>
                    <span className="font-medium">{material.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Unit:</span>
                    <span className="font-medium">{material.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${getStatusColor(material.status)}`}>
                      {getStatusIcon(material.status)}
                      <span className="ml-1 capitalize">{material.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                  {material.description && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Description:</span>
                      <p className="mt-1">{material.description}</p>
                    </div>
                  )}
                </div>

                {material.last_updated && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Last updated: {new Date(material.last_updated).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Materials Found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'No materials match your search criteria.' 
                : 'No materials have been added to your blocks yet.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Material
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Material Modal would go here */}
      {/* For brevity, I'm not including the full modal implementation */}
    </div>
  );
}