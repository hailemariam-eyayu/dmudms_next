import { NextRequest, NextResponse } from 'next/server';
import dataStore from '@/lib/dataStore';

// GET /api/placements - Get all placements with optional search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const block = searchParams.get('block');
    const status = searchParams.get('status');

    let placements = dataStore.getStudentPlacements();

    // Apply search filter
    if (search) {
      placements = dataStore.searchPlacements(search);
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
    const enrichedPlacements = placements.map(placement => {
      const student = dataStore.getStudent(placement.student_id);
      const room = dataStore.getRoom(placement.room, placement.block);
      return {
        ...placement,
        student,
        room
      };
    });

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
      const result = dataStore.autoAssignStudents();
      return NextResponse.json({
        success: true,
        data: result,
        message: `Auto-assignment completed. ${result.assigned} students assigned.`
      });
    }

    if (action === 'unassign_all') {
      const count = dataStore.unassignAllStudents();
      return NextResponse.json({
        success: true,
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
    const student = dataStore.getStudent(student_id);
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
    const existingPlacement = dataStore.getStudentPlacement(student_id);
    if (existingPlacement) {
      return NextResponse.json(
        { success: false, error: 'Student already has a placement' },
        { status: 409 }
      );
    }

    // Check if room exists and is available
    const roomData = dataStore.getRoom(room, block);
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
    const placement = dataStore.createStudentPlacement({
      student_id,
      room,
      block,
      year: new Date().getFullYear().toString(),
      status: 'active',
      assigned_date: new Date().toISOString().split('T')[0]
    });

    // Update room occupancy
    const newOccupancy = currentOccupancy + 1;
    dataStore.updateRoom(room, block, {
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