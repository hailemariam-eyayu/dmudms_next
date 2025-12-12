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

    // Get student placement to find their room
    const placements = await mongoDataStore.getStudentPlacements();
    const placement = placements.find(p => p.student_id === id);

    if (!placement) {
      return NextResponse.json({ 
        success: true, 
        data: [],
        message: 'No room assignment found - no materials registered' 
      });
    }

    // For now, return sample materials data since we don't have a materials collection yet
    // In a real system, this would query a materials database
    const sampleMaterials = [
      {
        _id: '1',
        student_id: id,
        room: placement.room,
        block: placement.block,
        item_name: 'Bed',
        quantity: 1,
        condition: 'good' as const,
        registered_date: placement.assigned_date || new Date().toISOString()
      },
      {
        _id: '2',
        student_id: id,
        room: placement.room,
        block: placement.block,
        item_name: 'Study Desk',
        quantity: 1,
        condition: 'good' as const,
        registered_date: placement.assigned_date || new Date().toISOString()
      },
      {
        _id: '3',
        student_id: id,
        room: placement.room,
        block: placement.block,
        item_name: 'Chair',
        quantity: 1,
        condition: 'fair' as const,
        registered_date: placement.assigned_date || new Date().toISOString()
      },
      {
        _id: '4',
        student_id: id,
        room: placement.room,
        block: placement.block,
        item_name: 'Wardrobe',
        quantity: 1,
        condition: 'good' as const,
        registered_date: placement.assigned_date || new Date().toISOString()
      },
      {
        _id: '5',
        student_id: id,
        room: placement.room,
        block: placement.block,
        item_name: 'Mattress',
        quantity: 1,
        condition: 'good' as const,
        registered_date: placement.assigned_date || new Date().toISOString()
      }
    ];

    return NextResponse.json({ 
      success: true, 
      data: sampleMaterials 
    });

  } catch (error) {
    console.error('Error fetching student materials:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch materials information' 
    }, { status: 500 });
  }
}