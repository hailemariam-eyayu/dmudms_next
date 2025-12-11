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
    const block = await mongoDataStore.getBlockById(id);
    
    if (!block) {
      return NextResponse.json({ success: false, error: 'Block not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: block
    });
  } catch (error) {
    console.error('Error fetching block:', error);
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
    
    if (!session || !['admin', 'directorate'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const updateData = await request.json();
    const { id } = await params;
    
    const result = await mongoDataStore.updateBlock(id, updateData);
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error updating block:', error);
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
    
    if (!session || !['admin', 'directorate'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await mongoDataStore.deleteBlock(id);
    
    return NextResponse.json({
      success: true,
      message: 'Block deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting block:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}