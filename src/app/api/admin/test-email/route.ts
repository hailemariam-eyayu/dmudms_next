import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { emailService } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { testType, email } = await request.json();

    let result = false;
    let message = '';

    switch (testType) {
      case 'welcome':
        result = await emailService.sendWelcomeEmail({
          name: 'Test User',
          email: 'hailemariameyayu2012@gmail.com',
          userId: 'TEST001',
          password: 'test123',
          loginUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
          userType: 'student' as const
        });
        message = 'Welcome email test completed';
        break;

      case 'reset':
        result = await emailService.sendPasswordResetEmail({
          name: 'Test User',
          email: 'hailemariameyayu2012@gmail.com',
          userId: 'TEST001',
          password: 'newpass123',
          loginUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
          userType: 'employee' as const
        });
        message = 'Password reset email test completed';
        break;

      case 'general':
        result = await emailService.testEmailService();
        message = 'General email service test completed';
        break;

      default:
        return NextResponse.json({ error: 'Invalid test type' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      result,
      message,
      emailEnabled: process.env.EMAIL_ENABLED === 'true',
      emailFrom: process.env.EMAIL_FROM || 'Not configured',
      mode: process.env.EMAIL_ENABLED === 'true' ? 'Live' : 'Mock'
    });

  } catch (error) {
    console.error('Email test error:', error);
    return NextResponse.json(
      { error: 'Failed to test email service', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}