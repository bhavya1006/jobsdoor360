/**
 * Password Reset API Route
 * POST /api/auth/reset-password
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { passwordResetSchema, validateRequest } from '@/lib/validations/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request data
    const validation = validateRequest(passwordResetSchema, body);
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

    // Send password reset email
    await sendPasswordResetEmail(auth, email);

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent successfully. Please check your inbox.',
    });

  } catch (error: any) {
    console.error('Password reset error:', error);

    // Handle Firebase Auth errors
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          // Don't reveal that user doesn't exist for security
          return NextResponse.json({
            success: true,
            message: 'If an account with this email exists, a password reset email has been sent.',
          });
        case 'auth/invalid-email':
          return NextResponse.json(
            { success: false, error: 'Invalid email format' },
            { status: 400 }
          );
        case 'auth/too-many-requests':
          return NextResponse.json(
            { success: false, error: 'Too many requests. Please try again later' },
            { status: 429 }
          );
        default:
          return NextResponse.json(
            { success: false, error: 'Failed to send reset email' },
            { status: 500 }
          );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
