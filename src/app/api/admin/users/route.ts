/**
 * Admin Users Management API Route
 * GET /api/admin/users - Get all users with filtering (admin only)
 * PUT /api/admin/users/[id]/role - Update user role (master admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/userService';
import { userSearchSchema, validateRequest } from '@/lib/validations/schemas';
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

    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const filters = {
      query: searchParams.get('query') || undefined,
      role: searchParams.get('role') as any || undefined,
      emailVerified: searchParams.get('emailVerified') ? 
        searchParams.get('emailVerified') === 'true' : undefined,
      createdAfter: searchParams.get('createdAfter') || undefined,
      createdBefore: searchParams.get('createdBefore') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
    };

    // Validate query parameters
    const validation = validateRequest(userSearchSchema, filters);
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid query parameters', 
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects for the service
    const serviceFilters = {
      ...validation.data!,
      createdAfter: validation.data!.createdAfter ? new Date(validation.data!.createdAfter) : undefined,
      createdBefore: validation.data!.createdBefore ? new Date(validation.data!.createdBefore) : undefined,
    };

    // Get users
    const result = await userService.getUsers(serviceFilters);

    return NextResponse.json({
      success: true,
      data: result.users,
      pagination: {
        page: result.page,
        limit: filters.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get users' },
      { status: 500 }
    );
  }
}
