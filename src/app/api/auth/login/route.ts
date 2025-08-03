/**
 * User Login API Route
 * POST /api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { userService } from '@/lib/services/userService';
import { loginSchema, validateRequest } from '@/lib/validations/schemas';
import { CustomError } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request data
    const validation = validateRequest(loginSchema, body);
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

    const { email, password } = validation.data!;

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Check if email is verified
    if (!firebaseUser.emailVerified) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please verify your email before logging in',
          emailVerified: false,
        },
        { status: 403 }
      );
    }

    // Get user data from Firestore
    let userData = await userService.getUserByUid(firebaseUser.uid);
    
    // If user doesn't exist in Firestore, create it
    if (!userData) {
      userData = await userService.createUser(firebaseUser.uid, {
        email: firebaseUser.email!,
        firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
        lastName: firebaseUser.displayName?.split(' ').slice(1).join(' '),
        emailVerified: firebaseUser.emailVerified,
        role: 'candidate',
      });
    }

    // Update email verification status if it has changed
    if (userData.emailVerified !== firebaseUser.emailVerified) {
      userData = await userService.updateUser(firebaseUser.uid, {
        emailVerified: firebaseUser.emailVerified,
      });
    }

    // Get fresh ID token
    const idToken = await firebaseUser.getIdToken();

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token: idToken,
      },
    });

  } catch (error: any) {
    console.error('Login error:', error);

    // Handle Firebase Auth errors
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          return NextResponse.json(
            { success: false, error: 'No user found with this email' },
            { status: 404 }
          );
        case 'auth/wrong-password':
          return NextResponse.json(
            { success: false, error: 'Incorrect password' },
            { status: 401 }
          );
        case 'auth/invalid-email':
          return NextResponse.json(
            { success: false, error: 'Invalid email format' },
            { status: 400 }
          );
        case 'auth/user-disabled':
          return NextResponse.json(
            { success: false, error: 'This account has been disabled' },
            { status: 403 }
          );
        case 'auth/too-many-requests':
          return NextResponse.json(
            { success: false, error: 'Too many failed attempts. Please try again later' },
            { status: 429 }
          );
        default:
          return NextResponse.json(
            { success: false, error: 'Login failed' },
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
