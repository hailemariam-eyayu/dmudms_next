import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoDataStore from '@/lib/mongoDataStore';

// GET /api/rooms - Get all rooms with optional filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const block = searchParams.get('block');
    const status = searchParams.get('status');
    const available_only = searchParams.get('available_only') === 'true';

    let rooms = await mongoDataStore.getRooms();

    // Apply block filter
    if (block) {
      rooms = rooms.filter(r => r.block === block);
    }

    // Apply status filter
    if (status) {
      rooms = rooms.filter(r => r.status === status);
    }

    // Apply available only filter
    if (available_only) {
      rooms = rooms.filter(r => r.status === 'available');
    }

    // Enrich with placement data
    const placements = await mongoDataStore.getStudentPlacements();
    const enrichedRooms = rooms.map(room => {
      const roomPlacements = placements.filter(p => p.room === room.room_id && p.block === room.block);
      
      return {
        ...room,
        placements: roomPlacements,
        occupancy_rate: room.capacity > 0 ? Math.round(((room.current_occupancy || 0) / room.capacity) * 100) : 0
      };
    });

    return NextResponse.json({
      success: true,
      data: enrichedRooms
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

// PUT /api/rooms - Bulk room operations
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['admin', 'directorate', 'proctor'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, room_id, block, updates } = body;

    if (action === 'update_status') {
      if (!room_id || !block || !updates) {
        return NextResponse.json(
          { success: false, error: 'room_id, block, and updates are required' },
          { status: 400 }
        );
      }

      const updatedRoom = await mongoDataStore.updateRoom(room_id, block, updates);
      
      if (!updatedRoom) {
        return NextResponse.json(
          { success: false, error: 'Room not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: updatedRoom,
        message: 'Room updated successfully'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating room:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update room' },
      { status: 500 }
    );
  }
}

// POST /api/rooms - Create a new room
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['admin', 'directorate'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const roomData = await request.json();
    
    // Validate required fields
    const requiredFields = ['room_id', 'block', 'floor', 'capacity'];
    for (const field of requiredFields) {
      if (roomData[field] === undefined || roomData[field] === null) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Set defaults
    roomData.current_occupancy = roomData.current_occupancy || 0;
    roomData.status = roomData.status || 'available';
    roomData.disability_accessible = roomData.floor === 0; // Ground floor is accessible
    roomData.room_number = roomData.room_number || roomData.room_id.replace(/^[A-Z]+/, '');

    const result = await mongoDataStore.createRoom(roomData);
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}