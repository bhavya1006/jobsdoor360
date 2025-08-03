/**
 * Admin Dashboard Stats API Route
 * GET /api/admin/stats - Get dashboard statistics (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/userService';
import { jobService } from '@/lib/services/jobService';
import { applicationService } from '@/lib/services/applicationService';
import { verifyToken, extractToken, isAdmin } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No authorization token provided' },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (!isAdmin(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get statistics from all services
    const [userStats, jobStats, applicationStats] = await Promise.all([
      userService.getUserStats(),
      jobService.getJobStats(),
      applicationService.getApplicationStats(),
    ]);

    const dashboardStats = {
      // User statistics
      totalUsers: userStats.totalUsers,
      totalCandidates: userStats.totalCandidates,
      totalEmployers: userStats.totalEmployers,
      totalAdmins: userStats.totalAdmins,
      verifiedUsers: userStats.verifiedUsers,
      recentUsers: userStats.recentUsers,

      // Job statistics
      totalJobs: jobStats.totalJobs,
      activeJobs: jobStats.activeJobs,
      jobsByType: jobStats.jobsByType,
      recentJobs: jobStats.recentJobs,

      // Application statistics
      totalApplications: applicationStats.totalApplications,
      applicationsByStatus: applicationStats.applicationsByStatus,
      recentApplications: applicationStats.recentApplications,

      // Additional metrics
      averageApplicationsPerJob: jobStats.totalJobs > 0 ? 
        Math.round((applicationStats.totalApplications / jobStats.totalJobs) * 100) / 100 : 0,
      
      userGrowthRate: calculateGrowthRate(userStats.recentUsers),
      jobPostingRate: calculateGrowthRate(jobStats.recentJobs),
    };

    return NextResponse.json({
      success: true,
      data: dashboardStats,
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get dashboard statistics' },
      { status: 500 }
    );
  }
}

/**
 * Calculate growth rate based on recent items
 */
function calculateGrowthRate(recentItems: any[]): number {
  if (recentItems.length < 2) return 0;

  const now = new Date();
  const last7Days = recentItems.filter(item => {
    const itemDate = item.createdAt || item.appliedAt || new Date();
    const daysDiff = (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  }).length;

  const previous7Days = recentItems.filter(item => {
    const itemDate = item.createdAt || item.appliedAt || new Date();
    const daysDiff = (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff > 7 && daysDiff <= 14;
  }).length;

  if (previous7Days === 0) return last7Days > 0 ? 100 : 0;
  
  return Math.round(((last7Days - previous7Days) / previous7Days) * 100);
}
