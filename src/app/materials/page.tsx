'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface Material {
  _id: string;
  block: string;
  room: string;
  unlocker: 'Original' | 'Copy';
  locker: number;
  chair: number;
  pure_foam: number;
  damaged_foam: number;
  tiras: number;
  tables: number;
  chibud: number;
  created_at: string;
}

export default function MaterialsPage() {
  const { data: session, status } = useSession();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const [formData, setFormData] = useState({
    block: '',
    room: '',
    unlocker: 'Original' as 'Original' | 'Copy',
    locker: 0,
    chair: 0,
    pure_foam: 0,
    damaged_foam: 0,
    tiras: 0,
    tables: 0,
    chibud: 0
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      redirect('/auth/signin');
      return;
    }

    fetchMaterials();
  }, [session, status]);

  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/materials');
      const data = await response.json();
      
      if (data.success) {
        setMaterials(data.data);
      } else {
        setError(data.error || 'Failed to fetch materials');
      }
    } catch (err) {
      setError('Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingMaterial ? `/api/materials/${editingMaterial._id}` : '/api/materials';
      const method = editingMaterial ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchMaterials();
        setShowForm(false);
        setEditingMaterial(null);
        setFormData({
          block: '',
          room: '',
          unlocker: 'Original',
          locker: 0,
          chair: 0,
          pure_foam: 0,
          damaged_foam: 0,
          tiras: 0,
          tables: 0,
          chibud: 0
        });
      } else {
        alert(data.error || 'Failed to save material');
      }
    } catch (err) {
      alert('Failed to save material');
    }
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      block: material.block,
      room: material.room,
      unlocker: material.unlocker,
      locker: material.locker,
      chair: material.chair,
      pure_foam: material.pure_foam,
      damaged_foam: material.damaged_foam,
      tiras: material.tiras,
      tables: material.tables,
      chibud: material.chibud
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this material record?')) {
      return;
    }

    try {
      const response = await fetch(`/api/materials/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchMaterials();
      } else {
        alert(data.error || 'Failed to delete material');
      }
    } catch (err) {
      alert('Failed to delete material');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading materials...</p>
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
            onClick={fetchMaterials}
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
          <h1 className="text-3xl font-bold text-gray-900">Materials Management</h1>
          <p className="mt-2 text-gray-600">Track room materials and inventory</p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => {
              setShowForm(true);
              setEditingMaterial(null);
              setFormData({
                block: '',
                room: '',
                unlocker: 'Original',
                locker: 0,
                chair: 0,
                pure_foam: 0,
                damaged_foam: 0,
                tiras: 0,
                tables: 0,
                chibud: 0
              });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Add Material Record
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-medium mb-4">
              {editingMaterial ? 'Edit Material Record' : 'Add Material Record'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Block</label>
                <input
                  type="text"
                  value={formData.block}
                  onChange={(e) => setFormData({...formData, block: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Room</label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({...formData, room: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unlocker</label>
                <select
                  value={formData.unlocker}
                  onChange={(e) => setFormData({...formData, unlocker: e.target.value as 'Original' | 'Copy'})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Original">Original</option>
                  <option value="Copy">Copy</option>
                </select>
              </div>
              
              {['locker', 'chair', 'pure_foam', 'damaged_foam', 'tiras', 'tables', 'chibud'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field.replace('_', ' ')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={formData[field as keyof typeof formData] as number}
                    onChange={(e) => setFormData({...formData, [field]: parseInt(e.target.value) || 0})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              ))}
              
              <div className="md:col-span-3 flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {editingMaterial ? 'Update' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingMaterial(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Material Records</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unlocker</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locker</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chair</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foam (Pure)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foam (Damaged)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {materials.map((material, index) => (
                  <tr key={material._id || `material-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{material.block}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.room}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.unlocker}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.locker}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.chair}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.pure_foam}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.damaged_foam}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(material)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(material._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
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