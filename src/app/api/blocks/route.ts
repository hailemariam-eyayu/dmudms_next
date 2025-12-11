import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoDataStore from '@/lib/mongoDataStore';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const blocks = await mongoDataStore.getBlocks();
    
    return NextResponse.json({
      success: true,
      data: blocks
    });
  } catch (error) {
    console.error('Error fetching blocks:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['admin', 'directorate'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const blockData = await request.json();
    
    // Validate required fields
    const requiredFields = ['block_id', 'name', 'gender', 'floors', 'rooms_per_floor'];
    for (const field of requiredFields) {
      if (!blockData[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Set defaults
    blockData.reserved_for = blockData.gender;
    blockData.room_capacity = blockData.room_capacity || 6;
    blockData.disable_group = blockData.disable_group || false;

    const result = await mongoDataStore.createBlock(blockData);
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error creating block:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}