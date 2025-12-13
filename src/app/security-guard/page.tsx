'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FileText, CheckCircle, Eye, Search, Calendar } from 'lucide-react';

interface ExitPaperItem {
  type_of_cloth: string;
  number_of_items: number;
  color: string;
}

interface ExitPaper {
  _id: string;
  student_id: string;
  student_name: string;
  items: ExitPaperItem[];
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_by_name?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export default function SecurityGuardDashboard() {
  const { data: session } = useSession();
  const [exitPapers, setExitPapers] = useState<ExitPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<ExitPaper | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchExitPapers();
  }, []);

  const fetchExitPapers = async () => {
    try {
      const response = await fetch('/api/exit-papers');
      const data = await response.json();

      if (data.success) {
        // Security guards only see approved exit papers
        setExitPapers(data.data.filter((paper: ExitPaper) => paper.status === 'approved'));
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      console.error('Error fetching exit papers:', error);
      setMessage({ type: 'error', text: 'Failed to fetch exit papers' });
    } finally {
      setLoading(false);
    }
  };

  const filteredPapers = exitPapers.filter(paper => {
    const matchesSearch = 
      paper.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.items.some(item => 
        item.type_of_cloth.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.color.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesDate = !dateFilter || 
      new Date(paper.approved_at || paper.created_at).toISOString().split('T')[0] === dateFilter;

    return matchesSearch && matchesDate;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Guard Dashboard</h1>
          <p className="text-gray-600 mt-2">Approved Exit Papers</p>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Approved</p>
              <p className="text-3xl font-bold text-green-600">{exitPapers.length}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Approvals</p>
              <p className="text-3xl font-bold text-blue-600">
                {exitPapers.filter(p => {
                  const approvedDate = new Date(p.approved_at || p.created_at);
                  const today = new Date();
                  return approvedDate.toDateString() === today.toDateString();
                }).length}
              </p>
            </div>
            <Calendar className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-3xl font-bold text-purple-600">
                {exitPapers.reduce((total, paper) => 
                  total + paper.items.reduce((itemTotal, item) => itemTotal + item.number_of_items, 0), 0
                )}
              </p>
            </div>
            <FileText className="h-10 w-10 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name, ID, or item details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <Calendar className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Exit Papers List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredPapers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>
              {exitPapers.length === 0 
                ? 'No approved exit papers found.' 
                : 'No exit papers match your search criteria.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approved Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approved By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPapers.map((paper) => (
                  <tr key={paper._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{paper.student_name}</div>
                        <div className="text-sm text-gray-500">{paper.student_id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(paper.approved_at || paper.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {paper.items.length} type{paper.items.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-sm text-gray-500">
                        {paper.items.reduce((total, item) => total + item.number_of_items, 0)} total items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {paper.approved_by_name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedPaper(paper)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Exit Paper Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Exit Paper Details</h2>
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              {/* Approval Badge */}
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-green-800 font-semibold">APPROVED EXIT PAPER</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-700">Student Information</h3>
                  <p className="text-gray-900 text-lg">{selectedPaper.student_name}</p>
                  <p className="text-gray-600">{selectedPaper.student_id}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700">Approval Information</h3>
                  <p className="text-gray-900">{selectedPaper.approved_by_name}</p>
                  {selectedPaper.approved_at && (
                    <p className="text-gray-600">
                      {new Date(selectedPaper.approved_at).toLocaleString()}
                    </p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700">Date Submitted</h3>
                  <p className="text-gray-900">{new Date(selectedPaper.created_at).toLocaleString()}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700">Total Items</h3>
                  <p className="text-gray-900">
                    {selectedPaper.items.reduce((total, item) => total + item.number_of_items, 0)} items
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-4">Items Being Taken Out</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type of Cloth
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Number of Items
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Color
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPaper.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.type_of_cloth}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.number_of_items}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.color}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> This exit paper has been approved by {selectedPaper.approved_by_name}. 
                  The student is authorized to take these items out of the dormitory.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}