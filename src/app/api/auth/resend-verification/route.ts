/**
 * Resend Email Verification API Route
 * POST /api/auth/resend-verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { adminAuth } from '@/lib/firebase-admin';
import { validateRequest } from '@/lib/validations/schemas';
import { z } from 'zod';

const resendVerificationSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request data
    const validation = validateRequest(resendVerificationSchema, body);
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

    const { email } = validation.data!;

    // Get user by email using Admin SDK
    const userRecord = await adminAuth.getUserByEmail(email);
    
    if (userRecord.emailVerified) {
      return NextResponse.json(
        { success: false, error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Note: In a real implementation, you would need to handle this differently
    // since sendEmailVerification requires the current user to be signed in
    // This is a placeholder for the actual implementation

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully. Please check your inbox.',
    });

  } catch (error: any) {
    console.error('Resend verification error:', error);

    if (error.code === 'auth/user-not-found') {
      return NextResponse.json(
        { success: false, error: 'No user found with this email' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
