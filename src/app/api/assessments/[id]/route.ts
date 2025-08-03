import { NextRequest, NextResponse } from 'next/server';
import { withAuth, isAdmin } from '@/lib/auth/middleware';
import { AssessmentService } from '@/lib/services/assessmentService';
import { updateAssessmentSchema } from '@/lib/validations/schemas';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const assessment = await AssessmentService.getAssessment(params.id);

    if (!assessment) {
      return NextResponse.json(
        { success: false, error: 'Assessment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: assessment,
    });
  } catch (error: any) {
    console.error('Get assessment error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to get assessment' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  return withAuth(['admin', 'master_admin'])(request, async (req) => {
    try {
      const user = (req as any).user;
      const body = await req.json();
      
      const validation = updateAssessmentSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Validation failed',
            details: validation.error.issues 
          },
          { status: 400 }
        );
      }

      const assessment = await AssessmentService.updateAssessment(params.id, validation.data);

      return NextResponse.json({
        success: true,
        data: assessment,
      });
    } catch (error: any) {
      console.error('Update assessment error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Failed to update assessment' 
        },
        { status: error.statusCode || 500 }
      );
    }
  });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  return withAuth(['admin', 'master_admin'])(request, async (req) => {
    try {
      await AssessmentService.deleteAssessment(params.id);

      return NextResponse.json({
        success: true,
        message: 'Assessment deleted successfully',
      });
    } catch (error: any) {
      console.error('Delete assessment error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Failed to delete assessment' 
        },
        { status: error.statusCode || 500 }
      );
    }
  });
}
