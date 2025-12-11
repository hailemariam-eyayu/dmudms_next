import { NextRequest, NextResponse } from 'next/server';
import unifiedDataStore from '@/lib/unifiedDataStore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const material = await unifiedDataStore.getMaterial(id);
    
    if (!material) {
      return NextResponse.json(
        { success: false, error: 'Material not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: material
    });
  } catch (error) {
    console.error('Error fetching material:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch material' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const material = await unifiedDataStore.updateMaterial(id, body);
    
    if (!material) {
      return NextResponse.json(
        { success: false, error: 'Material not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: material
    });
  } catch (error) {
    console.error('Error updating material:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update material' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await unifiedDataStore.deleteMaterial(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Material not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Material deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting material:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete material' },
      { status: 500 }
    );
  }
}