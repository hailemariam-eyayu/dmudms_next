import { NextRequest, NextResponse } from 'next/server';
import dataStore from '@/lib/dataStore';

// GET /api/rooms - Get all rooms with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const block = searchParams.get('block');
    const status = searchParams.get('status');
    const available_only = searchParams.get('available_only') === 'true';

    let rooms = dataStore.getRooms();

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
    const enrichedRooms = rooms.map(room => {
      const placements = dataStore.getStudentPlacements()
        .filter(p => p.room === room.room_id && p.block === room.block);
      
      const students = placements.map(p => dataStore.getStudent(p.student_id)).filter(Boolean);
      
      return {
        ...room,
        placements,
        students,
        occupancy_rate: room.capacity > 0 ? Math.round(((room.current_occupancy || 0) / room.capacity) * 100) : 0
      };
    });

    return NextResponse.json({
      success: true,
      data: enrichedRooms
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

// PUT /api/rooms - Bulk room operations
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, room_id, block, updates } = body;

    if (action === 'update_status') {
      if (!room_id || !block || !updates) {
        return NextResponse.json(
          { success: false, error: 'room_id, block, and updates are required' },
          { status: 400 }
        );
      }

      const updatedRoom = dataStore.updateRoom(room_id, block, updates);
      
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
    return NextResponse.json(
      { success: false, error: 'Failed to update room' },
      { status: 500 }
    );
  }
}