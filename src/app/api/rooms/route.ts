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

    const { searchParams } = new URL(request.url);
    const block = searchParams.get('block');
    
    let rooms;
    if (block) {
      // Get rooms for a specific block
      const allRooms = await mongoDataStore.getRooms();
      rooms = allRooms.filter(room => room.block === block);
    } else {
      // Get all rooms
      rooms = await mongoDataStore.getRooms();
    }

    return NextResponse.json({
      success: true,
      data: rooms
    });
  } catch (error: any) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to create rooms
    const allowedRoles = ['admin', 'directorate', 'coordinator'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    const roomData = await request.json();
    
    // Validate required fields
    if (!roomData.room_id || !roomData.block || !roomData.capacity) {
      return NextResponse.json(
        { success: false, error: 'Room ID, block, and capacity are required' },
        { status: 400 }
      );
    }

    // Set defaults
    const roomWithDefaults = {
      ...roomData,
      status: roomData.status || 'available',
      current_occupancy: roomData.current_occupancy || 0,
      disability_accessible: roomData.floor === 0 || roomData.disability_accessible || false,
      floor: roomData.floor || 0
    };

    const newRoom = await mongoDataStore.createRoom(roomWithDefaults);
    
    return NextResponse.json({
      success: true,
      data: newRoom,
      message: 'Room created successfully'
    });
  } catch (error: any) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}