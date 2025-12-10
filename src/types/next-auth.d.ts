import NextAuth from 'next-auth';
import { UserRole } from '@/lib/auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      userType: 'employee' | 'student';
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    userType: 'employee' | 'student';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
    userType: 'employee' | 'student';
  }
}