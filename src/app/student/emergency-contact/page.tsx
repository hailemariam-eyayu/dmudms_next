'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { 
  Phone, 
  User, 
  MapPin, 
  Save, 
  AlertCircle,
  Users,
  Edit
} from 'lucide-react';

interface EmergencyContact {
  student_id: string;
  father_name: string;
  grand_father: string;
  grand_grand_father: string;
  mother_name: string;
  phone: string;
  region: string;
  woreda: string;
  kebele: string;
}

export default function EmergencyContactPage() {
  const { data: session, status } = useSession();
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    father_name: '',
    grand_father: '',
    grand_grand_father: '',
    mother_name: '',
    phone: '',
    region: '',
    woreda: '',
    kebele: ''
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'student') {
      redirect('/auth/signin');
      return;
    }
    fetchEmergencyContact();
  }, [session, status]);

  const fetchEmergencyContact = async () => {
    try {
      const response = await fetch(`/api/students/${session?.user.id}/emergency-contact`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setEmergencyContact(data.data);
        setFormData(data.data);
      } else {
        // No emergency contact exists, enable editing mode
        setEditing(true);
      }
    } catch (error) {
      console.error('Error fetching emergency contact:', error);
      setMessage({ type: 'error', text: 'Failed to load emergency contact information' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/students/${session?.user.id}/emergency-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setEmergencyContact(data.data);
        setEditing(false);
        setMessage({ type: 'success', text: data.message || 'Emergency contact saved successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save emergency contact' });
      }
    } catch (error) {
      console.error('Error saving emergency contact:', error);
      setMessage({ type: 'error', text: 'Failed to save emergency contact' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setMessage(null);
  };

  const handleCancel = () => {
    if (emergencyContact) {
      setFormData(emergencyContact);
      setEditing(false);
    }
    setMessage(null);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading emergency contact information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Emergency Contact Information</h1>
                <p className="text-gray-600">Manage your emergency contact details for dormitory records</p>
              </div>
            </div>
            {emergencyContact && !editing && (
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Information
              </button>
            )}
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

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Parent Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Parent Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Father's Name *
                    </label>
                    <input
                      type="text"
                      value={formData.father_name}
                      onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grandfather's Name *
                    </label>
                    <input
                      type="text"
                      value={formData.grand_father}
                      onChange={(e) => setFormData({ ...formData, grand_father: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Great Grandfather's Name *
                    </label>
                    <input
                      type="text"
                      value={formData.grand_grand_father}
                      onChange={(e) => setFormData({ ...formData, grand_grand_father: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mother's Name *
                    </label>
                    <input
                      type="text"
                      value={formData.mother_name}
                      onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="09XXXXXXXX or +251XXXXXXXXX"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter Ethiopian phone number (09XXXXXXXX or 07XXXXXXXX)
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Address Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region *
                    </label>
                    <input
                      type="text"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Amhara"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Woreda *
                    </label>
                    <input
                      type="text"
                      value={formData.woreda}
                      onChange={(e) => setFormData({ ...formData, woreda: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Bahir Dar"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kebele *
                    </label>
                    <input
                      type="text"
                      value={formData.kebele}
                      onChange={(e) => setFormData({ ...formData, kebele: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 01"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                {emergencyContact && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Information'}
                </button>
              </div>
            </form>
          ) : emergencyContact ? (
            /* Display Mode */
            <div className="space-y-6">
              {/* Parent Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Parent Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Father's Name</label>
                    <p className="text-gray-900 font-medium">{emergencyContact.father_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Grandfather's Name</label>
                    <p className="text-gray-900 font-medium">{emergencyContact.grand_father}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Great Grandfather's Name</label>
                    <p className="text-gray-900 font-medium">{emergencyContact.grand_grand_father}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Mother's Name</label>
                    <p className="text-gray-900 font-medium">{emergencyContact.mother_name}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Information
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="text-gray-900 font-medium">{emergencyContact.phone}</p>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Address Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Region</label>
                    <p className="text-gray-900 font-medium">{emergencyContact.region}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Woreda</label>
                    <p className="text-gray-900 font-medium">{emergencyContact.woreda}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Kebele</label>
                    <p className="text-gray-900 font-medium">{emergencyContact.kebele}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Emergency Contact Information</h3>
              <p className="text-gray-500 mb-4">You haven't added your emergency contact information yet.</p>
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Emergency Contact
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}