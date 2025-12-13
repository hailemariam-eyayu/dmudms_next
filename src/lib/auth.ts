import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { Employee, Student } from '@/types';
import unifiedDataStore from './unifiedDataStore';

// Define user roles
export type UserRole = 'admin' | 'directorate' | 'coordinator' | 'proctor' | 'security_guard' | 'registrar' | 'maintainer' | 'student';

// Extended user type for NextAuth
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  userType: 'employee' | 'student';
}

// Role hierarchy for permissions
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 7,
  directorate: 6,
  coordinator: 5,
  registrar: 4,
  proctor: 3,
  security_guard: 2,
  maintainer: 2,
  student: 1
};

// Route permissions
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/dashboard': ['admin', 'directorate', 'coordinator', 'proctor', 'registrar', 'student'],
  '/students': ['admin', 'directorate', 'coordinator', 'registrar'],
  '/students/create': ['admin', 'directorate', 'registrar'],
  '/rooms': ['admin', 'directorate', 'coordinator'],
  '/blocks': ['admin', 'directorate', 'coordinator'],
  '/placements': ['admin', 'directorate', 'coordinator'],
  '/requests': ['admin', 'directorate', 'coordinator', 'proctor', 'student'],
  '/reports': ['admin', 'directorate', 'coordinator'],
  '/employees': ['admin'],
  '/emergency': ['admin', 'directorate', 'coordinator', 'proctor', 'student'],
  '/notifications': ['admin', 'directorate', 'coordinator', 'registrar']
};

// Authentication helper functions
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword);
}

export function hasPermission(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole) || userRole === 'admin';
}

export function canAccessRoute(userRole: UserRole, route: string): boolean {
  const requiredRoles = ROUTE_PERMISSIONS[route];
  if (!requiredRoles) return true; // Public route
  return hasPermission(userRole, requiredRoles);
}

// Authenticate user function
export async function authenticateUser(
  identifier: string, // student_id or employee_id
  password: string
): Promise<AuthUser | null> {
  try {
    // Try to find as employee first
    const employee = await unifiedDataStore.getEmployee(identifier);
    if (employee && employee.password) {
      const isValid = verifyPassword(password, employee.password);
      if (isValid && employee.status === 'active') {
        return {
          id: employee.employee_id,
          name: `${employee.first_name} ${employee.last_name}`,
          email: employee.email,
          role: employee.role,
          userType: 'employee'
        };
      }
    }

    // Try to find as student
    const student = await unifiedDataStore.getStudent(identifier);
    if (student && student.password) {
      const isValid = verifyPassword(password, student.password);
      if (isValid && student.status === 'active') {
        return {
          id: student.student_id,
          name: `${student.first_name} ${student.second_name} ${student.last_name}`.trim(),
          email: student.email,
          role: 'student',
          userType: 'student'
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// NextAuth configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        identifier: { 
          label: 'ID (Student ID or Employee ID)', 
          type: 'text',
          placeholder: 'DMU001 or EMP001'
        },
        password: { 
          label: 'Password', 
          type: 'password' 
        }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        try {
          const user = await authenticateUser(
            credentials.identifier,
            credentials.password
          );

          if (user) {
            console.log('Authentication successful for:', credentials.identifier);
            return user;
          } else {
            console.log('Authentication failed for:', credentials.identifier);
            return null;
          }
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as AuthUser).role;
        token.userType = (user as AuthUser).userType;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as UserRole;
        session.user.userType = token.userType as 'employee' | 'student';
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
};

// Middleware helper for API routes
export function requireAuth(allowedRoles?: UserRole[]) {
  return async (req: any, context: any) => {
    // This would be implemented with the actual session check
    // For now, we'll simulate it
    const userRole = req.headers['x-user-role'] as UserRole;
    
    if (!userRole) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication required' }),
        { status: 401 }
      );
    }

    if (allowedRoles && !hasPermission(userRole, allowedRoles)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Insufficient permissions' }),
        { status: 403 }
      );
    }

    return null; // Continue to the actual handler
  };
}