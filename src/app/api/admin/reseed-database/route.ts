import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { mongoDataStore } from '@/lib/mongoDataStore';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only allow admin users to reseed
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized - Admin access required' 
      }, { status: 403 });
    }

    console.log(`🔧 ADMIN RESEED: Triggered by ${session.user.name} (${session.user.id})`);
    
    // Force reseed the database
    await mongoDataStore.forceReseed();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database reseeded successfully with sample data',
      timestamp: new Date().toISOString(),
      admin: session.user.name
    });

  } catch (error) {
    console.error('Error reseeding database:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to reseed database' 
    }, { status: 500 });
  }
}