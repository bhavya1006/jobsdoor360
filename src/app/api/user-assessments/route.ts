import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import { AssessmentService } from '@/lib/services/assessmentService';

export async function POST(request: NextRequest) {
  return withAuth()(request, async (req) => {
    try {
      const user = (req as any).user;
      const body = await req.json();
      const { assessmentId } = body;

      if (!assessmentId) {
        return NextResponse.json(
          { success: false, error: 'Assessment ID is required' },
          { status: 400 }
        );
      }

      const userAssessment = await AssessmentService.startAssessment(assessmentId, user.uid);

      return NextResponse.json({
        success: true,
        data: userAssessment,
      }, { status: 201 });
    } catch (error: any) {
      console.error('Start assessment error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Failed to start assessment' 
        },
        { status: error.statusCode || 500 }
      );
    }
  });
}

export async function GET(request: NextRequest) {
  return withAuth()(request, async (req) => {
    try {
      const user = (req as any).user;
      const { searchParams } = new URL(req.url);
      const status = searchParams.get('status') || undefined;
      const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
      const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

      const result = await AssessmentService.getUserAssessments(user.uid, {
        status,
        limit,
        offset,
      });

      return NextResponse.json({
        success: true,
        data: result.userAssessments,
        pagination: {
          total: result.total,
          limit: limit || result.total,
          offset: offset || 0,
        },
      });
    } catch (error: any) {
      console.error('Get user assessments error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Failed to get user assessments' 
        },
        { status: 500 }
      );
    }
  });
}
