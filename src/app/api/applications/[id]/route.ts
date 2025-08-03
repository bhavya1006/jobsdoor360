/**
 * Individual Application API Route
 * GET /api/applications/[id] - Get application by ID
 * PUT /api/applications/[id] - Update application status (employer/admin only)
 * DELETE /api/applications/[id] - Delete application
 */

import { NextRequest, NextResponse } from 'next/server';
import { applicationService } from '@/lib/services/applicationService';
import { updateApplicationStatusSchema, validateRequest } from '@/lib/validations/schemas';
import { verifyToken, extractToken, isAdmin } from '@/lib/auth/middleware';
import { jobService } from '@/lib/services/jobService';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const applicationId = params.id;

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: 'Application ID is required' },
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

    // Get application
    const application = await applicationService.getApplicationById(applicationId);

    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    // Check if user can access this application
    let canAccess = 
      application.applicantEmail === user.email || // User owns the application
      isAdmin(user.role); // User is admin

    // If user is employer, check if they own the job
    if (user.role === 'employer' && !canAccess) {
      const job = await jobService.getJobById(application.jobId);
      if (job && job.companyEmail === user.email) {
        canAccess = true;
      }
    }

    if (!canAccess) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to view this application' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: application,
    });

  } catch (error) {
    console.error('Get application error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get application' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const applicationId = params.id;

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: 'Application ID is required' },
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

    // Only employers and admins can update application status
    if (user.role !== 'employer' && !isAdmin(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Only employers can update application status' },
        { status: 403 }
      );
    }

    // Get existing application
    const existingApplication = await applicationService.getApplicationById(applicationId);
    if (!existingApplication) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    // Check if employer owns the job (unless admin)
    if (user.role === 'employer') {
      const job = await jobService.getJobById(existingApplication.jobId);
      if (!job || job.companyEmail !== user.email) {
        return NextResponse.json(
          { success: false, error: 'You can only update applications for your own jobs' },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    
    // Validate request data
    const validation = validateRequest(updateApplicationStatusSchema, body);
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

    const { status, notes } = validation.data!;

    // Update application status
    const updatedApplication = await applicationService.updateApplicationStatus(
      applicationId, 
      status, 
      user.uid, 
      notes
    );

    return NextResponse.json({
      success: true,
      message: 'Application status updated successfully',
      data: updatedApplication,
    });

  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const applicationId = params.id;

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: 'Application ID is required' },
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

    // Get existing application
    const existingApplication = await applicationService.getApplicationById(applicationId);
    if (!existingApplication) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    // Check permissions
    const canDelete = 
      existingApplication.applicantEmail === user.email || // User owns the application
      isAdmin(user.role); // User is admin

    if (!canDelete) {
      return NextResponse.json(
        { success: false, error: 'You can only delete your own applications' },
        { status: 403 }
      );
    }

    // Delete application
    await applicationService.deleteApplication(applicationId);

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully',
    });

  } catch (error) {
    console.error('Delete application error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete application' },
      { status: 500 }
    );
  }
}
