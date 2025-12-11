'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const { data: session, status } = useSession();
  const userRole = session?.user?.role || 'guest';
  const userName = session?.user?.name || 'Guest User';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const getNavigationItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          { label: 'Dashboard', href: '/admin' },
          { label: 'Students', href: '/admin/students' },
          { label: 'Employees', href: '/admin/employees' },
          { label: 'Placements', href: '/placements' },
          { label: 'Reports', href: '/admin/reports' },
          { label: 'Settings', href: '/admin/settings' }
        ];
      
      case 'directorate':
        return [
          { label: 'Dashboard', href: '/directorate' },
          { label: 'Students', href: '/admin/students' },
          { label: 'Proctors', href: '/directorate/proctors' },
          { label: 'Blocks & Rooms', href: '/directorate/blocks' },
          { label: 'Placements', href: '/placements' },
          { label: 'Requests', href: '/requests' },
          { label: 'Emergencies', href: '/emergency' }
        ];
      
      case 'proctor':
        return [
          { label: 'Dashboard', href: '/proctor' },
          { label: 'My Students', href: '/proctor/students' },
          { label: 'Materials', href: '/proctor/materials' },
          { label: 'Requests', href: '/proctor/requests' },
          { label: 'Emergencies', href: '/proctor/emergencies' }
        ];
      
      case 'student':
        return [
          { label: 'Dashboard', href: '/student' },
          { label: 'My Room', href: '/student/placement' },
          { label: 'Requests', href: '/student/requests' },
          { label: 'Materials', href: '/student/materials' },
          { label: 'Emergency', href: '/student/emergency' }
        ];
      
      default:
        return [
          { label: 'Dashboard', href: '/dashboard' }
        ];
    }
  };

  const navigationItems = getNavigationItems();

  const visibleItems = navigationItems;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DM</span>
              </div>
              <span className="text-xl font-semibold text-gray-900 hidden sm:block">
                Dormitory Management
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 p-2 rounded-md"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:block text-sm font-medium">{userName}</span>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">{userName}</div>
                    <div className="text-gray-500 capitalize">{userRole}</div>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile Settings
                  </Link>
                  {session ? (
                    <button
                      onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Sign Out
                    </button>
                  ) : (
                    <Link
                      href="/auth/signin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {visibleItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}