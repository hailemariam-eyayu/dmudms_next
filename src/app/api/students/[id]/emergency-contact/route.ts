import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import EmergencyContact from '@/models/mongoose/EmergencyContact';
import connectDB from '@/lib/mongoose';

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
    await connectDB();

    const emergencyContact = await EmergencyContact.findOne({ student_id: id }).lean();
    
    return NextResponse.json({
      success: true,
      data: emergencyContact
    });
  } catch (error) {
    console.error('Error fetching emergency contact:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const contactData = await request.json();
    
    // Validate required fields
    const requiredFields = ['father_name', 'grand_father', 'grand_grand_father', 'mother_name', 'phone', 'region', 'woreda', 'kebele'];
    for (const field of requiredFields) {
      if (!contactData[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    await connectDB();

    // Format phone number to international format if needed
    let formattedPhone = contactData.phone;
    if (formattedPhone.startsWith('09') || formattedPhone.startsWith('07')) {
      formattedPhone = '+251' + formattedPhone.substring(1);
    }

    // Check if emergency contact already exists
    const existingContact = await EmergencyContact.findOne({ student_id: id });
    
    if (existingContact) {
      // Update existing contact
      const updatedContact = await EmergencyContact.findOneAndUpdate(
        { student_id: id },
        { ...contactData, phone: formattedPhone },
        { new: true }
      );
      
      return NextResponse.json({
        success: true,
        data: updatedContact,
        message: 'Emergency contact updated successfully'
      });
    } else {
      // Create new contact
      const newContact = new EmergencyContact({
        student_id: id,
        ...contactData,
        phone: formattedPhone
      });
      
      const savedContact = await newContact.save();
      
      return NextResponse.json({
        success: true,
        data: savedContact,
        message: 'Emergency contact created successfully'
      });
    }
  } catch (error: any) {
    console.error('Error saving emergency contact:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
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
  return POST(request, { params });
}