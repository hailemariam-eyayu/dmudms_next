import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ExitPaper from '@/models/mongoose/ExitPaper';
import mongoDataStore from '@/lib/mongoDataStore';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await mongoDataStore.init();

    let exitPapers;

    if (session.user.role === 'student') {
      // Students can only see their own exit papers
      exitPapers = await ExitPaper.find({ student_id: session.user.id })
        .sort({ created_at: -1 })
        .lean();
    } else if (['proctor', 'coordinator', 'admin', 'directorate'].includes(session.user.role)) {
      // Proctors and above can see all exit papers
      exitPapers = await ExitPaper.find({})
        .sort({ created_at: -1 })
        .lean();
    } else if (session.user.role === 'security_guard') {
      // Security guards can only see approved exit papers
      exitPapers = await ExitPaper.find({ status: 'approved' })
        .sort({ created_at: -1 })
        .lean();
    } else {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: exitPapers
    });
  } catch (error) {
    console.error('Error fetching exit papers:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'student') {
      return NextResponse.json({ success: false, error: 'Only students can create exit papers' }, { status: 401 });
    }

    const { items } = await request.json();

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one item is required' },
        { status: 400 }
      );
    }

    // Validate each item
    for (const item of items) {
      if (!item.type_of_cloth || !item.number_of_items || !item.color) {
        return NextResponse.json(
          { success: false, error: 'Each item must have type of cloth, number of items, and color' },
          { status: 400 }
        );
      }
      if (item.number_of_items < 1) {
        return NextResponse.json(
          { success: false, error: 'Number of items must be at least 1' },
          { status: 400 }
        );
      }
    }

    await mongoDataStore.init();

    const exitPaper = new ExitPaper({
      student_id: session.user.id,
      student_name: session.user.name,
      items: items.map(item => ({
        type_of_cloth: item.type_of_cloth.trim(),
        number_of_items: parseInt(item.number_of_items),
        color: item.color.trim()
      })),
      status: 'pending'
    });

    await exitPaper.save();

    return NextResponse.json({
      success: true,
      data: exitPaper,
      message: 'Exit paper submitted successfully'
    });
  } catch (error) {
    console.error('Error creating exit paper:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}