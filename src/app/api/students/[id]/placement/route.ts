import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { mongoDataStore } from '@/lib/mongoDataStore';

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

    // Get student placement
    const placements = await mongoDataStore.getStudentPlacements();
    const placement = placements.find(p => p.student_id === id);

    if (!placement) {
      return NextResponse.json({ 
        success: true, 
        data: null,
        message: 'No room assignment found' 
      });
    }

    // Get room and block details
    const rooms = await mongoDataStore.getRooms();
    const blocks = await mongoDataStore.getBlocks();
    
    const room = rooms.find(r => r.room_id === placement.room);
    const block = blocks.find(b => b.block_id === placement.block);

    const placementWithDetails = {
      ...placement,
      room_details: room ? {
        room_number: room.room_number,
        floor: room.floor,
        capacity: room.capacity,
        current_occupancy: room.current_occupancy,
        disability_accessible: room.disability_accessible
      } : null,
      block_details: block ? {
        name: block.name,
        reserved_for: block.reserved_for,
        location: block.location,
        proctor_id: block.proctor_id
      } : null
    };

    return NextResponse.json({ 
      success: true, 
      data: placementWithDetails 
    });

  } catch (error) {
    console.error('Error fetching student placement:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch placement information' 
    }, { status: 500 });
  }
}