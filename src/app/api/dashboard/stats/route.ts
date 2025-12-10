import { NextRequest, NextResponse } from 'next/server';
import unifiedDataStore from '@/lib/unifiedDataStore';

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const stats = await unifiedDataStore.getStatistics();
    
    // Get additional statistics
    const blocks = await unifiedDataStore.getBlocks();
    const notifications = await unifiedDataStore.getNotifications();
    const requests = await unifiedDataStore.getRequests();
    const recentRequests = requests
      .filter(r => r.status === 'pending')
      .slice(0, 5);
    
    const emergencies = await unifiedDataStore.getEmergencies();
    const activeEmergencies = emergencies.filter(e => e.status !== 'resolved');

    // Block-wise statistics
    const rooms = await unifiedDataStore.getRooms();
    const placements = await unifiedDataStore.getStudentPlacements();
    
    const blockStats = blocks.map(block => {
      const blockRooms = rooms.filter(r => r.block === block.block_id);
      const blockPlacements = placements.filter(p => p.block === block.block_id);
      
      const totalCapacity = blockRooms.reduce((sum, room) => sum + room.capacity, 0);
      const currentOccupancy = blockRooms.reduce((sum, room) => sum + (room.current_occupancy || 0), 0);
      
      return {
        block_id: block.block_id,
        reserved_for: block.reserved_for,
        total_rooms: blockRooms.length,
        occupied_rooms: blockRooms.filter(r => r.status === 'occupied').length,
        available_rooms: blockRooms.filter(r => r.status === 'available').length,
        total_capacity: totalCapacity,
        current_occupancy: currentOccupancy,
        occupancy_rate: totalCapacity > 0 ? Math.round((currentOccupancy / totalCapacity) * 100) : 0,
        students_count: blockPlacements.length
      };
    });

    // Recent activity
    const recentActivity = [
      ...recentRequests.map(r => ({
        type: 'request',
        message: `New ${r.type} request from ${r.student_id}`,
        date: r.created_date,
        status: r.status
      })),
      ...activeEmergencies.slice(0, 3).map(e => ({
        type: 'emergency',
        message: `${e.type} emergency reported by ${e.student_id}`,
        date: e.reported_date,
        status: e.status
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        overview: stats,
        blocks: blockStats,
        recent_requests: recentRequests,
        active_notifications: notifications,
        active_emergencies: activeEmergencies,
        recent_activity: recentActivity
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}