import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import { AssessmentService } from '@/lib/services/assessmentService';
import { submitAnswerSchema } from '@/lib/validations/schemas';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  return withAuth()(request, async (req) => {
    try {
      const user = (req as any).user;
      const userAssessment = await AssessmentService.getUserAssessment(params.id);

      if (!userAssessment) {
        return NextResponse.json(
          { success: false, error: 'User assessment not found' },
          { status: 404 }
        );
      }

      // Users can only view their own assessments
      if (userAssessment.userId !== user.uid) {
        return NextResponse.json(
          { success: false, error: 'Access denied' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        data: userAssessment,
      });
    } catch (error: any) {
      console.error('Get user assessment error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Failed to get user assessment' 
        },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  return withAuth()(request, async (req) => {
    try {
      const user = (req as any).user;
      const body = await req.json();
      const { action } = body;

      if (action === 'submit_answer') {
        const validation = submitAnswerSchema.safeParse(body);
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

        const userAssessment = await AssessmentService.submitAnswer(
          params.id,
          validation.data.questionId,
          validation.data.answer
        );

        return NextResponse.json({
          success: true,
          data: userAssessment,
        });
      } else if (action === 'submit_assessment') {
        const result = await AssessmentService.submitAssessment(params.id);

        return NextResponse.json({
          success: true,
          data: result,
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
      }
    } catch (error: any) {
      console.error('User assessment action error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Failed to process assessment action' 
        },
        { status: error.statusCode || 500 }
      );
    }
  });
}
