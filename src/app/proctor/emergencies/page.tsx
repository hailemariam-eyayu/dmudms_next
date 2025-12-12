'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { AlertTriangle, Phone, MapPin, Clock, Plus, Eye } from 'lucide-react';

export default function ProctorEmergenciesPage() {
  const { data: session, status } = useSession();
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReportForm, setShowReportForm] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !['proctor', 'proctor_manager', 'coordinator'].includes(session.user.role)) {
      redirect('/auth/signin');
    } else {
      fetchEmergencies();
    }
  }, [session, status]);

  const fetchEmergencies = async () => {
    try {
      const response = await fetch('/api/proctor/emergencies');
      const data = await response.json();
      
      if (data.success) {
        setEmergencies(data.data);
      }
    } catch (error) {
      console.error('Error fetching emergencies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading emergencies...</p>
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
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Emergency Management</h1>
                <p className="text-gray-600">Monitor and respond to emergency situations</p>
              </div>
            </div>
            <button
              onClick={() => setShowReportForm(true)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Report Emergency
            </button>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Phone className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-red-900">Emergency Hotline</h3>
            </div>
            <p className="text-2xl font-bold text-red-600">991</p>
            <p className="text-sm text-red-700">24/7 Emergency Services</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Phone className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-blue-900">Campus Security</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">+251-58-881-1234</p>
            <p className="text-sm text-blue-700">DMU Campus Security Office</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Phone className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-green-900">Medical Center</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">+251-58-881-5678</p>
            <p className="text-sm text-green-700">DMU Health Center</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{emergencies.length}</div>
                <div className="text-gray-600">Total Reports</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {emergencies.filter(e => e.status === 'reported').length}
                </div>
                <div className="text-gray-600">Active</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {emergencies.filter(e => e.status === 'in_progress').length}
                </div>
                <div className="text-gray-600">In Progress</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {emergencies.filter(e => e.status === 'resolved').length}
                </div>
                <div className="text-gray-600">Resolved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Emergencies */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Emergency Reports</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {emergencies.length > 0 ? (
              emergencies.map((emergency) => (
                <div key={emergency._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          emergency.severity === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : emergency.severity === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {emergency.severity} Priority
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          emergency.status === 'resolved' 
                            ? 'bg-green-100 text-green-800' 
                            : emergency.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {emergency.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{emergency.type}</h3>
                      <p className="text-gray-600 mb-3">{emergency.description}</p>
                      
                      {/* Reporter and Student Info */}
                      {(emergency.reporter_name || emergency.student_name) && (
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                          {emergency.reporter_name && (
                            <div className="text-sm text-gray-700">
                              <span className="font-medium">Reported by:</span> {emergency.reporter_name} ({emergency.reporter_role})
                            </div>
                          )}
                          {emergency.student_name && emergency.student_name !== emergency.reporter_name && (
                            <div className="text-sm text-gray-700">
                              <span className="font-medium">Student:</span> {emergency.student_name}
                              {emergency.block && emergency.room && (
                                <span className="text-gray-500"> - {emergency.block_name || emergency.block}, Room {emergency.room}</span>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {emergency.location || 'Not specified'}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(emergency.reported_date).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-blue-600">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Emergency Reports</h3>
                <p className="text-gray-500">No emergency reports to display.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Emergency Modal */}
      {showReportForm && (
        <ReportEmergencyModal
          onClose={() => setShowReportForm(false)}
          onSubmit={() => {
            setShowReportForm(false);
            fetchEmergencies();
          }}
        />
      )}
    </div>
  );
}

// Report Emergency Modal Component
function ReportEmergencyModal({ onClose, onSubmit }: { onClose: () => void, onSubmit: () => void }) {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    location: '',
    severity: 'medium'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const emergencyTypes = [
    { label: 'Medical Emergency', value: 'medical' },
    { label: 'Fire', value: 'fire' },
    { label: 'Security Threat', value: 'security' },
    { label: 'Natural Disaster', value: 'other' },
    { label: 'Facility Emergency', value: 'other' },
    { label: 'Other', value: 'other' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/emergencies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        onSubmit();
      } else {
        setError(data.error || 'Failed to report emergency');
      }
    } catch (error) {
      console.error('Error reporting emergency:', error);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Report Emergency</h3>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Select emergency type</option>
                {emergencyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Building, room, or area"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Describe the emergency situation..."
                required
              />
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
                disabled={submitting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Reporting...' : 'Report Emergency'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}