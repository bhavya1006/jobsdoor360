/**
 * Individual Job API Route
 * GET /api/jobs/[id] - Get job by ID
 * PUT /api/jobs/[id] - Update job (employer/admin only)
 * DELETE /api/jobs/[id] - Delete job (employer/admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { jobService } from '@/lib/services/jobService';
import { updateJobSchema, validateRequest } from '@/lib/validations/schemas';
import { verifyToken, extractToken, isEmployer, isAdmin } from '@/lib/auth/middleware';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const jobId = params.id;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Get job by ID
    const job = await jobService.getJobById(jobId);

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: job,
    });

  } catch (error) {
    console.error('Get job error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get job' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const jobId = params.id;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
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

    // Check if user is employer or admin
    if (!isEmployer(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Only employers can update jobs' },
        { status: 403 }
      );
    }

    // Get existing job to check ownership
    const existingJob = await jobService.getJobById(jobId);
    if (!existingJob) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    // Check if user owns the job or is admin
    if (existingJob.companyEmail !== user.email && !isAdmin(user.role)) {
      return NextResponse.json(
        { success: false, error: 'You can only update your own jobs' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate request data
    const validation = validateRequest(updateJobSchema, body);
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

    const updateData = validation.data!;

    // Update job
    const updatedJob = await jobService.updateJob(jobId, updateData, user.uid);

    return NextResponse.json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob,
    });

  } catch (error) {
    console.error('Update job error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const jobId = params.id;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
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

    // Check if user is employer or admin
    if (!isEmployer(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Only employers can delete jobs' },
        { status: 403 }
      );
    }

    // Get existing job to check ownership
    const existingJob = await jobService.getJobById(jobId);
    if (!existingJob) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    // Check if user owns the job or is admin
    if (existingJob.companyEmail !== user.email && !isAdmin(user.role)) {
      return NextResponse.json(
        { success: false, error: 'You can only delete your own jobs' },
        { status: 403 }
      );
    }

    // Delete job
    await jobService.deleteJob(jobId);

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully',
    });

  } catch (error) {
    console.error('Delete job error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}
