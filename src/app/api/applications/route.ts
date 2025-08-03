/**
 * Job Applications API Route
 * POST /api/applications - Apply for a job
 * GET /api/applications - Get user's applications
 */

import { NextRequest, NextResponse } from 'next/server';
import { applicationService } from '@/lib/services/applicationService';
import { createApplicationSchema, validateRequest } from '@/lib/validations/schemas';
import { verifyToken, extractToken } from '@/lib/auth/middleware';

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

    // Only candidates can apply for jobs
    if (user.role !== 'candidate') {
      return NextResponse.json(
        { success: false, error: 'Only candidates can apply for jobs' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate request data
    const validation = validateRequest(createApplicationSchema, body);
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

    const applicationData = validation.data!;

    // Create application
    const application = await applicationService.createApplication(applicationData, user.email);

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create application error:', error);
    
    if (error.statusCode) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as any;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

    let result;

    if (user.role === 'candidate') {
      // Get applications by user
      result = await applicationService.getApplicationsByUser(user.email, status, page, limit);
    } else if (user.role === 'employer') {
      // Get applications for employer's jobs
      result = await applicationService.getApplicationsByCompany(user.email, status, page, limit);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid user role for this endpoint' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.applications,
      pagination: {
        page: result.page,
        limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });

  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get applications' },
      { status: 500 }
    );
  }
}
