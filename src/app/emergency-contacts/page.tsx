'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { 
  Phone, 
  Users, 
  Search, 
  Filter, 
  Eye, 
  AlertTriangle,
  Building,
  X,
  Download
} from 'lucide-react';
import ProfileAvatar from '@/components/ProfileAvatar';

interface Student {
  _id: string;
  student_id: string;
  first_name: string;
  second_name?: string;
  last_name: string;
  email: string;
  gender: 'male' | 'female';
  profile_image?: string;
}

interface EmergencyContact {
  _id: string;
  student_id: string;
  father_name: string;
  grand_father: string;
  grand_grand_father: string;
  mother_name: string;
  phone: string;
  region: string;
  woreda: string;
  kebele?: string;
}

interface Placement {
  student_id: string;
  block: string;
  room: string;
}

export default function EmergencyContactsPage() {
  const { data: session, status } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !['admin', 'directorate', 'coordinator'].includes(session.user.role)) {
      redirect('/auth/signin');
    } else {
      fetchData();
    }
  }, [session, status]);

  const fetchData = async () => {
    try {
      const [studentsRes, emergencyRes, placementsRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/emergencies'),
        fetch('/api/placements')
      ]);

      const [studentsData, emergencyData, placementsData] = await Promise.all([
        studentsRes.json(),
        emergencyRes.json(),
        placementsRes.json()
      ]);

      if (studentsData.success) {
        setStudents(studentsData.data);
      }

      // Fetch emergency contacts separately
      const contactsRes = await fetch('/api/students/emergency-contacts');
      const contactsData = await contactsRes.json();
      if (contactsData.success) {
        setEmergencyContacts(contactsData.data);
      }

      if (placementsData.success) {
        setPlacements(placementsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmergencyContact = (studentId: string) => {
    return emergencyContacts.find(ec => ec.student_id === studentId);
  };

  const getPlacement = (studentId: string) => {
    return placements.find(p => p.student_id === studentId);
  };

  const studentsWithContacts = students.map(student => {
    const emergencyContact = getEmergencyContact(student.student_id);
    const placement = getPlacement(student.student_id);
    
    return {
      ...student,
      emergency_contact: emergencyContact,
      placement: placement
    };
  });

  const filteredStudents = studentsWithContacts.filter(student => {
    const matchesSearch = 
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.emergency_contact?.father_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.emergency_contact?.mother_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.emergency_contact?.phone || '').includes(searchTerm);
    
    const matchesGender = filterGender === 'all' || student.gender === filterGender;
    
    return matchesSearch && matchesGender;
  });

  const exportToCSV = () => {
    const csvData = filteredStudents.map(student => ({
      'Student ID': student.student_id,
      'Student Name': `${student.first_name} ${student.second_name || ''} ${student.last_name}`.trim(),
      'Gender': student.gender,
      'Email': student.email,
      'Block': student.placement?.block || 'N/A',
      'Room': student.placement?.room || 'N/A',
      'Father Name': student.emergency_contact?.father_name || 'N/A',
      'Grand Father': student.emergency_contact?.grand_father || 'N/A',
      'Mother Name': student.emergency_contact?.mother_name || 'N/A',
      'Phone': student.emergency_contact?.phone || 'N/A',
      'Region': student.emergency_contact?.region || 'N/A',
      'Woreda': student.emergency_contact?.woreda || 'N/A'
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emergency-contacts.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading emergency contacts...</p>
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
              <Phone className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Emergency Contacts</h1>
                <p className="text-gray-600">View and manage student emergency contact information</p>
              </div>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <Phone className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {studentsWithContacts.filter(s => s.emergency_contact).length}
                </div>
                <div className="text-gray-600">With Emergency Contacts</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {studentsWithContacts.filter(s => !s.emergency_contact).length}
                </div>
                <div className="text-gray-600">Missing Contacts</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {studentsWithContacts.filter(s => s.placement).length}
                </div>
                <div className="text-gray-600">Placed Students</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search students or contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Filter className="h-4 w-4 text-gray-400 mr-2" />
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emergency Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.student_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ProfileAvatar 
                          src={student.profile_image} 
                          name={`${student.first_name} ${student.last_name}`} 
                          size="sm"
                          className="mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.first_name} {student.second_name} {student.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{student.student_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.placement ? (
                        <div>
                          <div className="text-sm text-gray-900">{student.placement.block} - Room {student.placement.room}</div>
                          <div className="text-sm text-gray-500">Block {student.placement.block}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Not placed</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.emergency_contact ? (
                        <div>
                          <div className="text-sm text-gray-900">
                            {student.emergency_contact.father_name} {student.emergency_contact.grand_father}
                          </div>
                          <div className="text-sm text-gray-500">
                            Mother: {student.emergency_contact.mother_name}
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Missing
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.emergency_contact?.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Phone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Emergency Contacts Found</h3>
            <p className="text-gray-500">
              {searchTerm || filterGender !== 'all' 
                ? 'No students match your current filters.' 
                : 'No emergency contacts available.'}
            </p>
          </div>
        )}
      </div>

      {/* Student Emergency Contact Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Emergency Contact Details</h3>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student</label>
                  <p className="text-sm text-gray-900">
                    {selectedStudent.first_name} {selectedStudent.second_name} {selectedStudent.last_name}
                  </p>
                  <p className="text-sm text-gray-500">{selectedStudent.student_id}</p>
                </div>
                
                {selectedStudent.placement && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Room Assignment</label>
                    <p className="text-sm text-gray-900">
                      {selectedStudent.placement.block} - Room {selectedStudent.placement.room}
                    </p>
                  </div>
                )}

                {selectedStudent.emergency_contact ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Father's Name</label>
                      <p className="text-sm text-gray-900">
                        {selectedStudent.emergency_contact.father_name} {selectedStudent.emergency_contact.grand_father} {selectedStudent.emergency_contact.grand_grand_father}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
                      <p className="text-sm text-gray-900">{selectedStudent.emergency_contact.mother_name}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <p className="text-sm text-gray-900">{selectedStudent.emergency_contact.phone}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <p className="text-sm text-gray-900">
                        {selectedStudent.emergency_contact.region}, {selectedStudent.emergency_contact.woreda}
                        {selectedStudent.emergency_contact.kebele && `, ${selectedStudent.emergency_contact.kebele}`}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No emergency contact information available</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}