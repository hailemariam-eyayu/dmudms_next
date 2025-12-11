'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Building, 
  UserCheck, 
  Package, 
  ClipboardList, 
  AlertTriangle, 
  Settings,
  Bell,
  Shield,
  BarChart3
} from 'lucide-react';

export default function RoleBasedNavigation() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  const getNavigationItems = () => {
    const role = session.user.role;
    
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', href: '/admin', icon: Home },
          { name: 'Students', href: '/admin/students', icon: Users },
          { name: 'Employees', href: '/admin/employees', icon: UserCheck },
          { name: 'Placements', href: '/placements', icon: Building },
          { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
          { name: 'Settings', href: '/admin/settings', icon: Settings }
        ];
      
      case 'directorate':
        return [
          { name: 'Dashboard', href: '/directorate', icon: Home },
          { name: 'Students', href: '/admin/students', icon: Users },
          { name: 'Proctor Assignment', href: '/directorate/proctors', icon: UserCheck },
          { name: 'Blocks & Rooms', href: '/directorate/blocks', icon: Building },
          { name: 'Placements', href: '/placements', icon: ClipboardList },
          { name: 'Requests', href: '/requests', icon: ClipboardList },
          { name: 'Emergencies', href: '/emergency', icon: AlertTriangle }
        ];
      
      case 'coordinator':
        return [
          { name: 'Dashboard', href: '/coordinator', icon: Home },
          { name: 'Manage Proctors', href: '/coordinator/proctors', icon: UserCheck },
          { name: 'View Blocks', href: '/coordinator/blocks', icon: Building },
          { name: 'View Assignments', href: '/coordinator/assignments', icon: ClipboardList },
          { name: 'Assign Proctors', href: '/coordinator/assign-proctors', icon: Settings },
          { name: 'Reports', href: '/coordinator/reports', icon: BarChart3 },
          { name: 'All Students', href: '/admin/students', icon: Users }
        ];

      case 'proctor':
        return [
          { name: 'Dashboard', href: '/proctor', icon: Home },
          { name: 'My Students', href: '/proctor/students', icon: Users },
          { name: 'Materials', href: '/proctor/materials', icon: Package },
          { name: 'Requests', href: '/proctor/requests', icon: ClipboardList },
          { name: 'Emergencies', href: '/proctor/emergencies', icon: AlertTriangle }
        ];
      
      case 'student':
        return [
          { name: 'Dashboard', href: '/student', icon: Home },
          { name: 'My Room', href: '/student/placement', icon: Building },
          { name: 'Emergency Contact', href: '/student/emergency-contact', icon: Users },
          { name: 'Requests', href: '/student/requests', icon: ClipboardList },
          { name: 'Materials', href: '/student/materials', icon: Package },
          { name: 'Emergency', href: '/student/emergency', icon: AlertTriangle }
        ];
      
      default:
        return [
          { name: 'Dashboard', href: '/dashboard', icon: Home }
        ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">DMUDMS</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {/* Notifications */}
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Bell className="h-6 w-6" />
            </button>

            {/* User info */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {session.user.name?.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">{session.user.name}</div>
                <div className="text-xs text-gray-500 capitalize">{session.user.role}</div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}