import { NextRequest, NextResponse } from 'next/server';
import dataStore from '@/lib/dataStore';

// GET /api/blocks/[id] - Get a specific block
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const block = dataStore.getBlock(id);
    
    if (!block) {
      return NextResponse.json(
        { success: false, error: 'Block not found' },
        { status: 404 }
      );
    }

    // Get rooms in this block
    const rooms = dataStore.getRooms().filter(r => r.block === id);
    
    // Get placements in this block
    const placements = dataStore.getStudentPlacements().filter(p => p.block === id);
    
    // Calculate statistics
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
    const availableRooms = rooms.filter(r => r.status === 'available').length;
    const totalStudents = placements.length;
    
    const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
    const currentOccupancy = rooms.reduce((sum, room) => sum + (room.current_occupancy || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        ...block,
        rooms,
        placements,
        statistics: {
          total_rooms: totalRooms,
          occupied_rooms: occupiedRooms,
          available_rooms: availableRooms,
          total_students: totalStudents,
          total_capacity: totalCapacity,
          current_occupancy: currentOccupancy,
          occupancy_rate: totalCapacity > 0 ? Math.round((currentOccupancy / totalCapacity) * 100) : 0
        }
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch block' },
      { status: 500 }
    );
  }
}

// PUT /api/blocks/[id] - Update a specific block
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    
    const updatedBlock = dataStore.updateBlock(id, body);
    
    if (!updatedBlock) {
      return NextResponse.json(
        { success: false, error: 'Block not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedBlock,
      message: 'Block updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update block' },
      { status: 500 }
    );
  }
}

// DELETE /api/blocks/[id] - Delete a specific block
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Check if block has any placements
    const placements = dataStore.getStudentPlacements().filter(p => p.block === id);
    if (placements.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete block with active placements' },
        { status: 400 }
      );
    }

    const deleted = dataStore.deleteBlock(id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Block not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Block deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete block' },
      { status: 500 }
    );
  }
}