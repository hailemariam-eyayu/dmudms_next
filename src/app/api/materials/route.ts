import { NextRequest, NextResponse } from 'next/server';
import unifiedDataStore from '@/lib/unifiedDataStore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const block = searchParams.get('block');
    const search = searchParams.get('search');

    let materials;
    
    if (block) {
      materials = await unifiedDataStore.getMaterialsByBlock(block);
    } else {
      materials = await unifiedDataStore.getMaterials();
    }

    if (search) {
      materials = materials.filter((material: any) => 
        material.room.toString().includes(search) ||
        material.block.toLowerCase().includes(search.toLowerCase()) ||
        material.unlocker.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      data: materials
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const material = await unifiedDataStore.createMaterial(body);
    
    return NextResponse.json({
      success: true,
      data: material
    });
  } catch (error) {
    console.error('Error creating material:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create material' },
      { status: 500 }
    );
  }
}