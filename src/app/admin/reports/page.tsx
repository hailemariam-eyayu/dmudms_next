'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { 
  BarChart3, 
  Download, 
  Calendar,
  Users,
  Building,
  UserCheck,
  TrendingUp,
  PieChart,
  FileText,
  Filter
} from 'lucide-react';

export default function AdminReports() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      redirect('/auth/signin');
    } else {
      fetchReportData();
    }
  }, [session, status]);

  const fetchReportData = async () => {
    try {
      const [statsRes, employeesRes, blocksRes, studentsRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/employees'),
        fetch('/api/blocks'),
        fetch('/api/students')
      ]);

      const [statsData, employeesData, blocksData, studentsData] = await Promise.all([
        statsRes.json(),
        employeesRes.json(),
        blocksRes.json(),
        studentsRes.json()
      ]);

      const reportStats = {
        totalStudents: studentsData.success ? studentsData.data.length : 0,
        activeStudents: studentsData.success ? studentsData.data.filter((s: any) => s.status === 'active').length : 0,
        totalEmployees: employeesData.success ? employeesData.data.length : 0,
        totalProctors: employeesData.success ? employeesData.data.filter((emp: any) => 
          emp.role === 'proctor' || emp.role === 'proctor_manager'
        ).length : 0,
        totalBlocks: blocksData.success ? blocksData.data.length : 0,
        occupancyRate: statsData.success ? statsData.data.occupancy_rate : 0,
        maleStudents: studentsData.success ? studentsData.data.filter((s: any) => s.gender === 'male').length : 0,
        femaleStudents: studentsData.success ? studentsData.data.filter((s: any) => s.gender === 'female').length : 0,
      };

      setStats(reportStats);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = (type: string) => {
    // This would typically generate and download a report
    console.log(`Generating ${type} report...`);
    alert(`${type} report generation would be implemented here`);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
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
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">System Reports</h1>
                <p className="text-gray-600">Comprehensive reports and analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Generated on {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.totalStudents}</div>
                <div className="text-gray-600">Total Students</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</div>
                <div className="text-gray-600">Total Employees</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.totalBlocks}</div>
                <div className="text-gray-600">Total Blocks</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.occupancyRate}%</div>
                <div className="text-gray-600">Occupancy Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Student Reports */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Student Reports</h2>
              </div>
              <button
                onClick={() => generateReport('Student Summary')}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Students:</span>
                <span className="font-medium">{stats.totalStudents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Students:</span>
                <span className="font-medium">{stats.activeStudents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Male Students:</span>
                <span className="font-medium">{stats.maleStudents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Female Students:</span>
                <span className="font-medium">{stats.femaleStudents}</span>
              </div>
            </div>
          </div>

          {/* Employee Reports */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <UserCheck className="h-6 w-6 text-green-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Employee Reports</h2>
              </div>
              <button
                onClick={() => generateReport('Employee Summary')}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Employees:</span>
                <span className="font-medium">{stats.totalEmployees}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Proctors:</span>
                <span className="font-medium">{stats.totalProctors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Admin Staff:</span>
                <span className="font-medium">{stats.totalEmployees - stats.totalProctors}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Reports */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Available Reports</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Student Reports */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center mb-3">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Student Enrollment</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Complete student enrollment report with demographics
                </p>
                <button
                  onClick={() => generateReport('Student Enrollment')}
                  className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Generate Report
                </button>
              </div>

              {/* Room Occupancy */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center mb-3">
                  <Building className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Room Occupancy</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Detailed room occupancy and utilization report
                </p>
                <button
                  onClick={() => generateReport('Room Occupancy')}
                  className="w-full bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Generate Report
                </button>
              </div>

              {/* Staff Performance */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center mb-3">
                  <UserCheck className="h-5 w-5 text-purple-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Staff Performance</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Employee performance and assignment metrics
                </p>
                <button
                  onClick={() => generateReport('Staff Performance')}
                  className="w-full bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Generate Report
                </button>
              </div>

              {/* Financial Report */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center mb-3">
                  <TrendingUp className="h-5 w-5 text-orange-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Financial Summary</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Financial overview and budget utilization
                </p>
                <button
                  onClick={() => generateReport('Financial Summary')}
                  className="w-full bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700 flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Generate Report
                </button>
              </div>

              {/* Gender Distribution */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center mb-3">
                  <PieChart className="h-5 w-5 text-pink-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Gender Distribution</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Gender-wise distribution across all categories
                </p>
                <button
                  onClick={() => generateReport('Gender Distribution')}
                  className="w-full bg-pink-600 text-white px-3 py-2 rounded text-sm hover:bg-pink-700 flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Generate Report
                </button>
              </div>

              {/* Custom Report */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center mb-3">
                  <FileText className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Custom Report</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Generate custom reports with specific parameters
                </p>
                <button
                  onClick={() => generateReport('Custom')}
                  className="w-full bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Create Custom
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}