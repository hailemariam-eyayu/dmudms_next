'use client';

import { useAuthRedirect } from '@/hooks/useAuthRedirect';

export default function AuthRedirect() {
  useAuthRedirect();
  return null; // This component doesn't render anything
}