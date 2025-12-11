import { NextRequest, NextResponse } from 'next/server';
import unifiedDataStore from '@/lib/unifiedDataStore';

// GET /api/placements - Get all placements with optional search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const block = searchParams.get('block');
    const status = searchParams.get('status');

    let placements = await unifiedDataStore.getStudentPlacements();

    // Apply search filter
    if (search) {
      placements = await unifiedDataStore.searchPlacements(search);
    }

    // Apply block filter
    if (block) {
      placements = placements.filter(p => p.block === block);
    }

    // Apply status filter
    if (status) {
      placements = placements.filter(p => p.status === status);
    }

    // Enrich with student data
    const enrichedPlacements = await Promise.all(placements.map(async (placement) => {
      const student = await unifiedDataStore.getStudent(placement.student_id);
      const room = await unifiedDataStore.getRoom(placement.room, placement.block);
      return {
        ...placement,
        student_name: student ? `${student.first_name} ${student.last_name}` : 'Unknown',
        student_email: student?.email || '',
        room_capacity: room?.capacity || 0,
        room_status: room?.status || 'unknown'
      };
    }));

    return NextResponse.json({
      success: true,
      data: enrichedPlacements
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch placements' },
      { status: 500 }
    );
  }
}

// POST /api/placements - Create a new placement or bulk operations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Handle bulk operations
    if (action === 'auto_assign') {
      const result = await unifiedDataStore.autoAssignStudents();
      return NextResponse.json({
        success: true,
        data: result,
        message: `Auto-assignment completed. ${result.assigned} students assigned.`
      });
    }

    if (action === 'unassign_all') {
      const count = await unifiedDataStore.unassignAllStudents();
      return NextResponse.json({
        success: true,
        count,
        message: `${count} students unassigned successfully`
      });
    }

    // Handle individual placement creation
    const { student_id, room, block } = body;

    if (!student_id || !room || !block) {
      return NextResponse.json(
        { success: false, error: 'student_id, room, and block are required' },
        { status: 400 }
      );
    }

    // Check if student exists and is available
    const student = await unifiedDataStore.getStudent(student_id);
    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    if (student.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Only active students can be assigned' },
        { status: 400 }
      );
    }

    // Check if student already has a placement
    const existingPlacement = await unifiedDataStore.getStudentPlacement(student_id);
    if (existingPlacement) {
      return NextResponse.json(
        { success: false, error: 'Student already has a placement' },
        { status: 409 }
      );
    }

    // Check if room exists and is available
    const roomData = await unifiedDataStore.getRoom(room, block);
    if (!roomData) {
      return NextResponse.json(
        { success: false, error: 'Room not found' },
        { status: 404 }
      );
    }

    if (roomData.status !== 'available') {
      return NextResponse.json(
        { success: false, error: 'Room is not available' },
        { status: 400 }
      );
    }

    // Check room capacity
    const currentOccupancy = roomData.current_occupancy || 0;
    if (currentOccupancy >= roomData.capacity) {
      return NextResponse.json(
        { success: false, error: 'Room is at full capacity' },
        { status: 400 }
      );
    }

    // Create placement
    const placement = await unifiedDataStore.createStudentPlacement({
      student_id,
      room,
      block,
      year: new Date().getFullYear().toString(),
      status: 'active',
      assigned_date: new Date().toISOString().split('T')[0]
    });

    // Update room occupancy
    const newOccupancy = currentOccupancy + 1;
    await unifiedDataStore.updateRoom(room, block, {
      current_occupancy: newOccupancy,
      status: newOccupancy >= roomData.capacity ? 'occupied' : 'available'
    });

    return NextResponse.json({
      success: true,
      data: placement,
      message: 'Student assigned successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create placement' },
      { status: 500 }
    );
  }
}