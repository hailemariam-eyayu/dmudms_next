import { NextRequest, NextResponse } from 'next/server';
import dataStore from '@/lib/dataStore';

// GET /api/blocks - Get all blocks with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const reserved_for = searchParams.get('reserved_for');

    let blocks = dataStore.getBlocks();

    // Apply status filter
    if (status) {
      blocks = blocks.filter(b => b.status === status);
    }

    // Apply reserved_for filter
    if (reserved_for) {
      blocks = blocks.filter(b => b.reserved_for === reserved_for);
    }

    // Enrich with room and placement data
    const enrichedBlocks = blocks.map(block => {
      const rooms = dataStore.getRooms().filter(r => r.block === block.block_id);
      const placements = dataStore.getStudentPlacements().filter(p => p.block === block.block_id);
      
      const totalRooms = rooms.length;
      const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
      const availableRooms = rooms.filter(r => r.status === 'available').length;
      const totalStudents = placements.length;
      
      const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
      const currentOccupancy = rooms.reduce((sum, room) => sum + (room.current_occupancy || 0), 0);
      
      return {
        ...block,
        rooms,
        statistics: {
          total_rooms: totalRooms,
          occupied_rooms: occupiedRooms,
          available_rooms: availableRooms,
          total_students: totalStudents,
          total_capacity: totalCapacity,
          current_occupancy: currentOccupancy,
          occupancy_rate: totalCapacity > 0 ? Math.round((currentOccupancy / totalCapacity) * 100) : 0
        }
      };
    });

    return NextResponse.json({
      success: true,
      data: enrichedBlocks
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blocks' },
      { status: 500 }
    );
  }
}

// POST /api/blocks - Create a new block
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['block_id', 'capacity', 'reserved_for'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check if block ID already exists
    const existingBlock = dataStore.getBlock(body.block_id);
    if (existingBlock) {
      return NextResponse.json(
        { success: false, error: 'Block ID already exists' },
        { status: 409 }
      );
    }

    const blockData = {
      block_id: body.block_id,
      disable_group: body.disable_group || false,
      status: body.status || 'active',
      capacity: body.capacity,
      reserved_for: body.reserved_for
    };

    const newBlock = dataStore.createBlock(blockData);

    return NextResponse.json({
      success: true,
      data: newBlock,
      message: 'Block created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create block' },
      { status: 500 }
    );
  }
}