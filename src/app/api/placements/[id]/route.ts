import { NextRequest, NextResponse } from 'next/server';
import dataStore from '@/lib/dataStore';

// GET /api/placements/[id] - Get placement by student ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const placement = dataStore.getStudentPlacement(params.id);
    
    if (!placement) {
      return NextResponse.json(
        { success: false, error: 'Placement not found' },
        { status: 404 }
      );
    }

    // Enrich with student and room data
    const student = dataStore.getStudent(placement.student_id);
    const room = dataStore.getRoom(placement.room, placement.block);

    return NextResponse.json({
      success: true,
      data: {
        ...placement,
        student,
        room
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch placement' },
      { status: 500 }
    );
  }
}

// PUT /api/placements/[id] - Update placement (room transfer)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { room, block, action } = body;

    const placement = dataStore.getStudentPlacement(params.id);
    if (!placement) {
      return NextResponse.json(
        { success: false, error: 'Placement not found' },
        { status: 404 }
      );
    }

    if (action === 'transfer') {
      if (!room || !block) {
        return NextResponse.json(
          { success: false, error: 'room and block are required for transfer' },
          { status: 400 }
        );
      }

      // Check if new room exists and is available
      const newRoom = dataStore.getRoom(room, block);
      if (!newRoom) {
        return NextResponse.json(
          { success: false, error: 'Target room not found' },
          { status: 404 }
        );
      }

      if (newRoom.status !== 'available') {
        return NextResponse.json(
          { success: false, error: 'Target room is not available' },
          { status: 400 }
        );
      }

      const currentOccupancy = newRoom.current_occupancy || 0;
      if (currentOccupancy >= newRoom.capacity) {
        return NextResponse.json(
          { success: false, error: 'Target room is at full capacity' },
          { status: 400 }
        );
      }

      // Free up old room
      const oldRoom = dataStore.getRoom(placement.room, placement.block);
      if (oldRoom) {
        const oldOccupancy = Math.max((oldRoom.current_occupancy || 1) - 1, 0);
        dataStore.updateRoom(placement.room, placement.block, {
          current_occupancy: oldOccupancy,
          status: oldOccupancy === 0 ? 'available' : 'occupied'
        });
      }

      // Update placement
      const updatedPlacement = dataStore.updateStudentPlacement(placement.id, {
        room,
        block,
        assigned_date: new Date().toISOString().split('T')[0]
      });

      // Update new room
      const newOccupancy = currentOccupancy + 1;
      dataStore.updateRoom(room, block, {
        current_occupancy: newOccupancy,
        status: newOccupancy >= newRoom.capacity ? 'occupied' : 'available'
      });

      return NextResponse.json({
        success: true,
        data: updatedPlacement,
        message: 'Student transferred successfully'
      });
    }

    // Regular update
    const updatedPlacement = dataStore.updateStudentPlacement(placement.id, body);
    
    return NextResponse.json({
      success: true,
      data: updatedPlacement,
      message: 'Placement updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update placement' },
      { status: 500 }
    );
  }
}

// DELETE /api/placements/[id] - Unassign student
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const placement = dataStore.getStudentPlacement(params.id);
    if (!placement) {
      return NextResponse.json(
        { success: false, error: 'Placement not found' },
        { status: 404 }
      );
    }

    // Free up the room
    const room = dataStore.getRoom(placement.room, placement.block);
    if (room) {
      const newOccupancy = Math.max((room.current_occupancy || 1) - 1, 0);
      dataStore.updateRoom(placement.room, placement.block, {
        current_occupancy: newOccupancy,
        status: newOccupancy === 0 ? 'available' : 'occupied'
      });
    }

    // Delete placement
    const deleted = dataStore.deleteStudentPlacement(params.id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete placement' },
        { status: 500 }
      );
    }

    // Update student status back to active
    dataStore.updateStudent(params.id, { status: 'active' });

    return NextResponse.json({
      success: true,
      message: 'Student unassigned successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to unassign student' },
      { status: 500 }
    );
  }
}