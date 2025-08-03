/**
 * Jobs API Route
 * GET /api/jobs - Get all jobs with filtering
 * POST /api/jobs - Create new job (employer only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { jobService } from '@/lib/services/jobService';
import { createJobSchema, jobSearchSchema, validateRequest } from '@/lib/validations/schemas';
import { verifyToken, extractToken, isEmployer } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const filters = {
      query: searchParams.get('query') || undefined,
      location: searchParams.get('location') || undefined,
      type: searchParams.get('type') as any || undefined,
      company: searchParams.get('company') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
      isActive: true, // Only show active jobs for public endpoint
    };

    // Validate query parameters
    const validation = validateRequest(jobSearchSchema, filters);
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

    // Get jobs
    const result = await jobService.getActiveJobs(validation.data!);

    return NextResponse.json({
      success: true,
      data: result.jobs,
      pagination: {
        page: result.page,
        limit: filters.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get jobs' },
      { status: 500 }
    );
  }
}

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

    // Check if user is employer or admin
    if (!isEmployer(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Only employers can create jobs' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate request data
    const validation = validateRequest(createJobSchema, body);
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

    const jobData = validation.data!;

    // Create job
    const job = await jobService.createJob(jobData, user.uid, user.email);

    return NextResponse.json({
      success: true,
      message: 'Job created successfully',
      data: job,
    }, { status: 201 });

  } catch (error) {
    console.error('Create job error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
