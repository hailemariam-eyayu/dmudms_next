'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Users, Edit, Trash2, Plus, Search, UserCheck, UserX, CheckCircle, AlertCircle, Key } from 'lucide-react';

interface Student {
  _id: string;
  student_id: string;
  first_name: string;
  second_name: string;
  last_name: string;
  email: string;
  gender: string;
  batch: string;
  status: 'active' | 'inactive';
  disability_status: string;
}

export default function AdminStudentManagement() {
  const { data: session, status } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [resetPasswordResult, setResetPasswordResult] = useState<{ studentId: string, newPassword: string } | null>(null);

  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    second_name: '',
    last_name: '',
    email: '',
    gender: 'male',
    batch: '',
    status: 'active' as 'active' | 'inactive',
    disability_status: 'none'
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      redirect('/auth/signin');
    } else {
      fetchStudents();
    }
  }, [session, status]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      
      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setMessage({ type: 'error', text: 'Failed to load students' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingStudent ? `/api/students/${editingStudent._id}` : '/api/students';
      const method = editingStudent ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: editingStudent ? 'Student updated successfully!' : 'Student created successfully!' 
        });
        setShowCreateForm(false);
        setEditingStudent(null);
        resetForm();
        fetchStudents();
      } else {
        setMessage({ type: 'error', text: data.error || 'Operation failed' });
      }
    } catch (error) {
      console.error('Error saving student:', error);
      setMessage({ type: 'error', text: 'Failed to save student' });
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      student_id: student.student_id,
      first_name: student.first_name,
      second_name: student.second_name,
      last_name: student.last_name,
      email: student.email,
      gender: student.gender,
      batch: student.batch,
      status: student.status,
      disability_status: student.disability_status
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Student deleted successfully!' });
        fetchStudents();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete student' });
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      setMessage({ type: 'error', text: 'Failed to delete student' });
    }
  };

  const handleResetPassword = async (studentId: string) => {
    if (!confirm('Are you sure you want to reset this student\'s password?')) return;
    
    try {
      const response = await fetch(`/api/students/${studentId}/reset-password`, { 
        method: 'POST' 
      });
      const data = await response.json();
      
      if (data.success) {
        setResetPasswordResult({ studentId, newPassword: data.newPassword });
        setMessage({ 
          type: 'success', 
          text: `Password reset successfully! New password: ${data.newPassword}` 
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Password reset failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Password reset failed' });
    }
  };

  const resetForm = () => {
    setFormData({
      student_id: '',
      first_name: '',
      second_name: '',
      last_name: '',
      email: '',
      gender: 'male',
      batch: '',
      status: 'active',
      disability_status: 'none'
    });
  };

  const filteredStudents = students.filter(student =>
    student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.batch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading students...</p>
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
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
                <p className="text-gray-600">Manage student records and information</p>
              </div>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingStudent(null);
                setShowCreateForm(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Student
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

        {/* Password Reset Result */}
        {resetPasswordResult && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Password Reset Successful</h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-blue-700">New password:</span>
              <code className="bg-white px-3 py-2 rounded border text-lg font-mono text-blue-800">
                {resetPasswordResult.newPassword}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(resetPasswordResult.newPassword);
                  alert('Password copied to clipboard!');
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Copy
              </button>
              <button
                onClick={() => setResetPasswordResult(null)}
                className="px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Dismiss
              </button>
            </div>
            <p className="text-sm text-blue-700 mt-2">
              Please share this password with the student. They should change it on first login.
            </p>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{students.length}</div>
                <div className="text-gray-600">Total Students</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {students.filter(s => s.status === 'active').length}
                </div>
                <div className="text-gray-600">Active Students</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserX className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {students.filter(s => s.status === 'inactive').length}
                </div>
                <div className="text-gray-600">Inactive Students</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name, ID, email, or batch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Students ({filteredStudents.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch
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
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.first_name} {student.second_name} {student.last_name}
                        </div>
                        <div className="text-sm text-gray-500">Batch: {student.batch}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.student_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {student.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.batch}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status === 'active' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <UserX className="h-3 w-3 mr-1" />
                        )}
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit Student"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(student.student_id)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Reset Password"
                        >
                          <Key className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Student"
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

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No students match your search criteria.' : 'No students have been added yet.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => {
                  resetForm();
                  setEditingStudent(null);
                  setShowCreateForm(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Student
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                  <input
                    type="text"
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Second Name</label>
                    <input
                      type="text"
                      value={formData.second_name}
                      onChange={(e) => setFormData({ ...formData, second_name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                  <input
                    type="text"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 2024, Batch-15, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disability Status</label>
                  <select
                    value={formData.disability_status}
                    onChange={(e) => setFormData({ ...formData, disability_status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="none">None</option>
                    <option value="physical">Physical</option>
                    <option value="visual">Visual</option>
                    <option value="hearing">Hearing</option>
                    <option value="cognitive">Cognitive</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingStudent(null);
                      resetForm();
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingStudent ? 'Update Student' : 'Create Student'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
    