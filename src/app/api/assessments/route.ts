import { NextRequest, NextResponse } from 'next/server';
import { withAuth, isAdmin } from '@/lib/auth/middleware';
import { AssessmentService } from '@/lib/services/assessmentService';
import { createAssessmentSchema } from '@/lib/validations/schemas';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const difficulty = searchParams.get('difficulty') || undefined;
    const isActive = searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined;
    const createdBy = searchParams.get('createdBy') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    const result = await AssessmentService.getAssessments({
      category,
      difficulty,
      isActive,
      createdBy,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: result.assessments,
      pagination: {
        total: result.total,
        limit: limit || result.total,
        offset: offset || 0,
      },
    });
  } catch (error: any) {
    console.error('Get assessments error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to get assessments' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return withAuth(['admin', 'master_admin'])(request, async (req) => {
    try {
      const user = (req as any).user;
      const body = await req.json();
      
      const validation = createAssessmentSchema.safeParse(body);
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

      const assessment = await AssessmentService.createAssessment(validation.data, user.uid);

      return NextResponse.json({
        success: true,
        data: assessment,
      }, { status: 201 });
    } catch (error: any) {
      console.error('Create assessment error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Failed to create assessment' 
        },
        { status: error.statusCode || 500 }
      );
    }
  });
}
