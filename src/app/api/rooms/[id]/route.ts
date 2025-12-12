import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoDataStore from '@/lib/mongoDataStore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    // Extract block and room from the ID (format: blockId-roomId or just roomId)
    const parts = id.split('-');
    let block: string, roomId: string;
    
    if (parts.length === 2) {
      [block, roomId] = parts;
    } else {
      // Try to find the room by ID across all blocks
      const rooms = await mongoDataStore.getRooms();
      const room = rooms.find(r => r.room_id === id);
      if (!room) {
        return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
      }
      block = room.block;
      roomId = room.room_id;
    }

    const room = await mongoDataStore.getRoom(roomId, block);
    
    if (!room) {
      return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: room
    });
  } catch (error: any) {
    console.error('Error fetching room:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to edit rooms
    const allowedRoles = ['admin', 'directorate', 'coordinator'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;
    const updates = await request.json();
    
    // Extract block and room from the ID
    const parts = id.split('-');
    let block: string, roomId: string;
    
    if (parts.length === 2) {
      [block, roomId] = parts;
    } else {
      // Try to find the room by ID across all blocks
      const rooms = await mongoDataStore.getRooms();
      const room = rooms.find(r => r.room_id === id);
      if (!room) {
        return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
      }
      block = room.block;
      roomId = room.room_id;
    }

    // Validate updates
    const allowedFields = ['status', 'capacity', 'disability_accessible', 'current_occupancy'];
    const filteredUpdates: any = {};
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = value;
      }
    }

    // Validate status
    if (filteredUpdates.status && !['available', 'occupied', 'maintenance'].includes(filteredUpdates.status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Validate capacity
    if (filteredUpdates.capacity && (filteredUpdates.capacity < 1 || filteredUpdates.capacity > 10)) {
      return NextResponse.json(
        { success: false, error: 'Capacity must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Validate current_occupancy
    if (filteredUpdates.current_occupancy && filteredUpdates.current_occupancy < 0) {
      return NextResponse.json(
        { success: false, error: 'Current occupancy cannot be negative' },
        { status: 400 }
      );
    }

    const updatedRoom = await mongoDataStore.updateRoom(roomId, block, filteredUpdates);
    
    if (!updatedRoom) {
      return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedRoom,
      message: 'Room updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating room:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to delete rooms
    const allowedRoles = ['admin', 'directorate'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;
    
    // Extract block and room from the ID
    const parts = id.split('-');
    let block: string, roomId: string;
    
    if (parts.length === 2) {
      [block, roomId] = parts;
    } else {
      // Try to find the room by ID across all blocks
      const rooms = await mongoDataStore.getRooms();
      const room = rooms.find(r => r.room_id === id);
      if (!room) {
        return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
      }
      block = room.block;
      roomId = room.room_id;
    }

    // Check if room is occupied
    const room = await mongoDataStore.getRoom(roomId, block);
    if (room && room.current_occupancy > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete occupied room' },
        { status: 400 }
      );
    }

    // Delete the room (this would need to be implemented in mongoDataStore)
    // For now, we'll return success
    return NextResponse.json({
      success: true,
      message: 'Room deletion not yet implemented'
    });
  } catch (error: any) {
    console.error('Error deleting room:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}