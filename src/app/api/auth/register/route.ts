/**
 * User Registration API Route
 * POST /api/auth/register
 */

import { NextRequest, NextResponse } from 'next/server';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { adminAuth } from '@/lib/firebase-admin';
import { userService } from '@/lib/services/userService';
import { registerSchema, validateRequest } from '@/lib/validations/schemas';
import { CustomError } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request data
    const validation = validateRequest(registerSchema, body);
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

    const { email, password, firstName, lastName, phoneNo, role } = validation.data!;

    // Check if user already exists
    const existingUser = await userService.userExists(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: `${firstName} ${lastName || ''}`.trim(),
    });

    // Send email verification
    await sendEmailVerification(user);

    // Create user document in Firestore
    await userService.createUser(user.uid, {
      email,
      firstName,
      lastName,
      phoneNo,
      role: role || 'candidate',
      emailVerified: false,
    });

    // Get ID token for the response
    const idToken = await user.getIdToken();

    // Get created user data
    const userData = await userService.getUserByUid(user.uid);

    return NextResponse.json({
      success: true,
      message: 'User registered successfully. Please verify your email.',
      data: {
        user: userData,
        token: idToken,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);

    // Handle Firebase Auth errors
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          return NextResponse.json(
            { success: false, error: 'Email is already registered' },
            { status: 409 }
          );
        case 'auth/weak-password':
          return NextResponse.json(
            { success: false, error: 'Password is too weak' },
            { status: 400 }
          );
        case 'auth/invalid-email':
          return NextResponse.json(
            { success: false, error: 'Invalid email format' },
            { status: 400 }
          );
        default:
          return NextResponse.json(
            { success: false, error: 'Registration failed' },
            { status: 500 }
          );
      }
    }

    if (error instanceof CustomError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
