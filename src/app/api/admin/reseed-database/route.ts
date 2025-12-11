import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoDataStore from '@/lib/mongoDataStore';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Force reseed with fresh sample data
    await mongoDataStore.forceReseed();
    
    return NextResponse.json({
      success: true,
      message: 'Database reseeded successfully with fresh sample data. All users now have password: default123'
    });
  } catch (error) {
    console.error('Error reseeding database:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}