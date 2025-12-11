import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    DEMO_MODE: process.env.DEMO_MODE,
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI_EXISTS: !!process.env.MONGODB_URI,
    MONGODB_URI_PREFIX: process.env.MONGODB_URI?.substring(0, 20) + '...',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  });
}