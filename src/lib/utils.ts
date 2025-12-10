import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Status badge color utilities
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // General statuses
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'approved': 'bg-blue-100 text-blue-800',
    'rejected': 'bg-red-100 text-red-800',
    'completed': 'bg-green-100 text-green-800',
    
    // Room statuses
    'available': 'bg-green-100 text-green-800',
    'occupied': 'bg-blue-100 text-blue-800',
    'maintenance': 'bg-orange-100 text-orange-800',
    'reserved': 'bg-purple-100 text-purple-800',
    
    // Emergency statuses
    'reported': 'bg-red-100 text-red-800',
    'in_progress': 'bg-yellow-100 text-yellow-800',
    'resolved': 'bg-green-100 text-green-800',
    
    // Student statuses
    'graduated': 'bg-blue-100 text-blue-800',
    'suspended': 'bg-red-100 text-red-800',
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

// Role-based utilities
export function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    'admin': 'Administrator',
    'directorate': 'Directorate',
    'coordinator': 'Coordinator',
    'proctor': 'Proctor',
    'registrar': 'Registrar',
    'maintainer': 'Maintainer',
    'student': 'Student'
  };
  
  return roleNames[role] || role;
}

export function canAccessRoute(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole) || userRole === 'admin';
}

// Data filtering utilities
export function filterBySearch<T>(
  items: T[], 
  searchTerm: string, 
  searchFields: (keyof T)[]
): T[] {
  if (!searchTerm) return items;
  
  const lowercaseSearch = searchTerm.toLowerCase();
  
  return items.filter(item =>
    searchFields.some(field => {
      const value = item[field];
      return value && 
        String(value).toLowerCase().includes(lowercaseSearch);
    })
  );
}

export function sortByField<T>(
  items: T[], 
  field: keyof T, 
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

// Pagination utilities
export function paginateArray<T>(
  items: T[], 
  page: number, 
  limit: number
): { data: T[], total: number, totalPages: number } {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: items.slice(startIndex, endIndex),
    total: items.length,
    totalPages: Math.ceil(items.length / limit)
  };
}

// Room capacity utilities
export function calculateOccupancyRate(occupied: number, capacity: number): number {
  if (capacity === 0) return 0;
  return Math.round((occupied / capacity) * 100);
}

export function getOccupancyColor(rate: number): string {
  if (rate >= 90) return 'text-red-600';
  if (rate >= 70) return 'text-yellow-600';
  return 'text-green-600';
}

// Form validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateStudentId(studentId: string): boolean {
  // Assuming format like DMU001, DMU002, etc.
  const studentIdRegex = /^[A-Z]{2,4}\d{3,6}$/;
  return studentIdRegex.test(studentId);
}

export function validateEmployeeId(employeeId: string): boolean {
  // Assuming format like EMP001, EMP002, etc.
  const employeeIdRegex = /^[A-Z]{3}\d{3,6}$/;
  return employeeIdRegex.test(employeeId);
}

// Statistics utilities
export function calculateStats(data: any[]): Record<string, number> {
  return data.reduce((acc, item) => {
    Object.keys(item).forEach(key => {
      if (typeof item[key] === 'number') {
        acc[key] = (acc[key] || 0) + item[key];
      }
    });
    return acc;
  }, {});
}

// Local storage utilities (for demo purposes)
export function saveToLocalStorage(key: string, data: any): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  }
  return defaultValue;
}