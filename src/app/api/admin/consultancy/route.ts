/**
 * Admin User Consultancy API Route
 * POST /api/admin/consultancy - Add consultancy remark (admin only)
 * GET /api/admin/consultancy/[email] - Get consultancy remarks for user (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/userService';
import { addConsultancyRemarkSchema, validateRequest } from '@/lib/validations/schemas';
import { verifyToken, extractToken, isAdmin } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    
    // Validate request data
    const validation = validateRequest(addConsultancyRemarkSchema, body);
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

    const { userId, remark } = validation.data!;

    // Check if target user exists
    const targetUser = await userService.getUserByUid(userId);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Add consultancy remark
    await userService.addConsultancyRemark(targetUser.email, remark, user.email);

    return NextResponse.json({
      success: true,
      message: 'Consultancy remark added successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Add consultancy remark error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add consultancy remark' },
      { status: 500 }
    );
  }
}
