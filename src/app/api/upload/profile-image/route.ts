import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import mongoDataStore from '@/lib/mongoDataStore';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine folder and get current user data
    const userType = session.user.userType;
    const userId = session.user.id;
    const folder = userType === 'student' ? 'students' : 'employees';
    
    // Get current user to check for existing profile image
    let currentUser;
    if (userType === 'student') {
      currentUser = await mongoDataStore.getStudent(userId);
    } else {
      currentUser = await mongoDataStore.getEmployee(userId);
    }

    // Delete existing profile image if it exists
    if (currentUser?.profile_image_public_id) {
      await deleteImage(currentUser.profile_image_public_id);
    }

    // Upload new image
    const uploadResult = await uploadImage(buffer, folder, `${userId}_profile`);
    
    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, error: uploadResult.error },
        { status: 500 }
      );
    }

    // Update user record with new profile image
    const updateData = {
      profile_image: uploadResult.url,
      profile_image_public_id: uploadResult.publicId
    };

    let updatedUser;
    if (userType === 'student') {
      updatedUser = await mongoDataStore.updateStudent(userId, updateData);
    } else {
      updatedUser = await mongoDataStore.updateEmployee(userId, updateData);
    }

    if (!updatedUser) {
      // If user update failed, clean up uploaded image
      await deleteImage(uploadResult.publicId!);
      return NextResponse.json(
        { success: false, error: 'Failed to update user profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        profile_image: uploadResult.url,
        profile_image_public_id: uploadResult.publicId
      },
      message: 'Profile image uploaded successfully'
    });

  } catch (error: any) {
    console.error('Profile image upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userType = session.user.userType;
    const userId = session.user.id;
    
    // Get current user to get profile image info
    let currentUser;
    if (userType === 'student') {
      currentUser = await mongoDataStore.getStudent(userId);
    } else {
      currentUser = await mongoDataStore.getEmployee(userId);
    }

    if (!currentUser?.profile_image_public_id) {
      return NextResponse.json(
        { success: false, error: 'No profile image to delete' },
        { status: 400 }
      );
    }

    // Delete image from Cloudinary
    const deleteResult = await deleteImage(currentUser.profile_image_public_id);
    
    if (!deleteResult.success) {
      return NextResponse.json(
        { success: false, error: deleteResult.error },
        { status: 500 }
      );
    }

    // Update user record to remove profile image
    const updateData = {
      profile_image: null,
      profile_image_public_id: null
    };

    let updatedUser;
    if (userType === 'student') {
      updatedUser = await mongoDataStore.updateStudent(userId, updateData);
    } else {
      updatedUser = await mongoDataStore.updateEmployee(userId, updateData);
    }

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'Failed to update user profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile image deleted successfully'
    });

  } catch (error: any) {
    console.error('Profile image delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}