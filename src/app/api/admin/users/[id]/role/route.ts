/**
 * Admin User Role Management API Route
 * PUT /api/admin/users/[id]/role - Update user role (master admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/userService';
import { updateUserRoleSchema, validateRequest } from '@/lib/validations/schemas';
import { verifyToken, extractToken } from '@/lib/auth/middleware';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

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

    // Only master admin can update user roles
    if (user.role !== 'master_admin') {
      return NextResponse.json(
        { success: false, error: 'Master admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Add userId to request body for validation
    const requestData = { ...body, userId };

    // Validate request data
    const validation = validateRequest(updateUserRoleSchema, requestData);
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    const { role } = validation.data!;

    // Check if target user exists
    const targetUser = await userService.getUserByUid(userId);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent master admin from demoting themselves
    if (targetUser.uid === user.uid && role !== 'master_admin') {
      return NextResponse.json(
        { success: false, error: 'You cannot change your own role' },
        { status: 400 }
      );
    }

    // Update user role
    await userService.updateUserRole(userId, role);

    // Get updated user data
    const updatedUser = await userService.getUserByUid(userId);

    return NextResponse.json({
      success: true,
      message: 'User role updated successfully',
      data: updatedUser,
    });

  } catch (error) {
    console.error('Update user role error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}
