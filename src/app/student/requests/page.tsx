'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { 
  ClipboardList, 
  Plus, 
  Eye, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function StudentRequestsPage() {
  const { data: session, status } = useSession();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'student') {
      redirect('/auth/signin');
    } else {
      fetchRequests();
    }
  }, [session, status]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/students/${session?.user?.id}/requests`);
      const data = await response.json();

      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      setMessage({ type: 'error', text: 'Failed to load requests' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (requestData: any) => {
    try {
      const response = await fetch(`/api/students/${session?.user?.id}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Request submitted successfully!' });
        setShowCreateModal(false);
        fetchRequests();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit request' });
      }
    } catch (error) {
      console.error('Error creating request:', error);
      setMessage({ type: 'error', text: 'Failed to submit request' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'denied':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'denied':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your requests...</p>
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
              <ClipboardList className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
                <p className="text-gray-600">Submit and track your dormitory requests</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Request
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
              <ClipboardList className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{requests.length}</div>
                <div className="text-gray-600">Total Requests</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {requests.filter(r => r.status === 'pending').length}
                </div>
                <div className="text-gray-600">Pending</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {requests.filter(r => r.status === 'approved').length}
                </div>
                <div className="text-gray-600">Approved</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {requests.filter(r => r.status === 'denied').length}
                </div>
                <div className="text-gray-600">Denied</div>
              </div>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Request History</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {requests.map((request) => (
              <div key={request._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">{request.type}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status}</span>
                      </span>
                      <span className={`text-xs font-medium uppercase ${getPriorityColor(request.priority)}`}>
                        {request.priority} Priority
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600">{request.description}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Submitted: {new Date(request.created_date).toLocaleDateString()}</span>
                      {request.updated_date && request.updated_date !== request.created_date && (
                        <span>Updated: {new Date(request.updated_date).toLocaleDateString()}</span>
                      )}
                      {request.block && request.room && (
                        <span>Room: {request.block} - {request.room}</span>
                      )}
                    </div>
                    {request.response && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-900">Response:</div>
                        <div className="text-sm text-gray-600 mt-1">{request.response}</div>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="p-2 text-gray-400 hover:text-blue-600"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {requests.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Requests Yet</h3>
            <p className="text-gray-500 mb-4">You haven't submitted any requests yet.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Submit Your First Request
            </button>
          </div>
        )}
      </div>

      {/* Create Request Modal */}
      {showCreateModal && (
        <CreateRequestModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateRequest}
        />
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
}

// Create Request Modal Component
function CreateRequestModal({ onClose, onSubmit }: { onClose: () => void, onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    priority: 'medium'
  });

  const requestTypes = [
    'Maintenance Request',
    'Room Change Request',
    'Facility Issue',
    'Cleaning Request',
    'Equipment Request',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.description) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Submit New Request</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Request Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select request type</option>
                {requestTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please describe your request in detail..."
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Request Detail Modal Component
function RequestDetailModal({ request, onClose }: { request: any, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Request Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <p className="text-sm text-gray-900">{request.type}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <p className="text-sm text-gray-900 capitalize">{request.status}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <p className="text-sm text-gray-900 capitalize">{request.priority}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <p className="text-sm text-gray-900">{request.description}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Submitted</label>
              <p className="text-sm text-gray-900">{new Date(request.created_date).toLocaleString()}</p>
            </div>
            {request.response && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Response</label>
                <p className="text-sm text-gray-900">{request.response}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}