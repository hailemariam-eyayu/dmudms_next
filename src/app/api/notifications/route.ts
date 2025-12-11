import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoDataStore from '@/lib/mongoDataStore';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const userRole = session.user.role;
    const userId = session.user.id;

    // Get all active notifications
    const allNotifications = await mongoDataStore.getNotifications();
    
    // Filter notifications based on user role and target audience
    let filteredNotifications = allNotifications.filter(notification => {
      // If notification has no target_audience, it's for everyone
      if (!notification.target_audience || notification.target_audience.length === 0) {
        return true;
      }
      
      // Check if user's role is in target audience
      if (notification.target_audience.includes(userRole)) {
        return true;
      }
      
      // For students, also check if notification is for their specific block
      if (userRole === 'student' && notification.target_block) {
        // We'd need to get the student's placement to check their block
        // For now, we'll include all student notifications
        return notification.target_audience.includes('student');
      }
      
      return false;
    });

    // Sort by creation date (newest first) and limit
    filteredNotifications = filteredNotifications
      .sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      data: filteredNotifications
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['admin', 'directorate', 'proctor'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      title, 
      message, 
      type = 'info', 
      target_audience = [], 
      target_block = null,
      priority = 'medium'
    } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: 'Title and message are required' },
        { status: 400 }
      );
    }

    const notificationData = {
      title,
      message,
      type,
      target_audience,
      target_block,
      priority,
      created_by: session.user.id,
      created_date: new Date(),
      is_active: true
    };

    const newNotification = await mongoDataStore.createNotification(notificationData);

    return NextResponse.json({
      success: true,
      data: newNotification
    });

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}