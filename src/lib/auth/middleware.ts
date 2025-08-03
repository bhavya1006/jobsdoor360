/**
 * Authentication Middleware for Next.js API Routes
 * Handles Firebase token verification and role-based access control
 */

import { NextRequest, NextResponse } from 'next/server';
import { User, UserRole, CustomClaims } from '@/types';
import { CustomError } from '@/lib/utils';

// Note: Firebase Admin SDK import will be handled in the actual implementation
// For now, we'll create the structure and types

/**
 * Verify Firebase ID token and extract user information
 */
export async function verifyToken(token: string): Promise<User | null> {
  try {
    // Import Firebase Admin dynamically to avoid issues
    const { adminAuth, adminDb } = await import('@/lib/firebase-admin');
    
    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Get user document from Firestore
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      throw new CustomError('User not found', 404);
    }
    
    const userData = userDoc.data();
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      firstName: userData?.firstName || '',
      lastName: userData?.lastName,
      phoneNo: userData?.phoneNo,
      dob: userData?.dob,
      gender: userData?.gender,
      image: userData?.image,
      cv: userData?.cv,
      role: (decodedToken.role as UserRole) || 'candidate',
      emailVerified: decodedToken.email_verified || false,
      createdAt: userData?.createdAt?.toDate() || new Date(),
      updatedAt: userData?.updatedAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Extract Bearer token from Authorization header
 */
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7);
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

/**
 * Check if user is admin (admin or master_admin)
 */
export function isAdmin(userRole: UserRole): boolean {
  return ['admin', 'master_admin'].includes(userRole);
}

/**
 * Check if user is employer
 */
export function isEmployer(userRole: UserRole): boolean {
  return userRole === 'employer' || isAdmin(userRole);
}

/**
 * Authentication middleware factory
 */
export function withAuth(requiredRoles?: UserRole[]) {
  return async (
    request: NextRequest,
    handler: (request: NextRequest & { user: User }) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    try {
      // Extract token from Authorization header
      const token = extractToken(request);
      
      if (!token) {
        return NextResponse.json(
          { success: false, error: 'No authorization token provided' },
          { status: 401 }
        );
      }
      
      // Verify token and get user
      const user = await verifyToken(token);
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
      
      // Check if email is verified (except for admin routes)
      if (!user.emailVerified && !isAdmin(user.role)) {
        return NextResponse.json(
          { success: false, error: 'Email verification required' },
          { status: 403 }
        );
      }
      
      // Check role permissions if required
      if (requiredRoles && !hasRole(user.role, requiredRoles)) {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
      
      // Add user to request object
      (request as any).user = user;
      
      // Call the handler
      return handler(request as NextRequest & { user: User });
    } catch (error) {
      console.error('Authentication middleware error:', error);
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
}

/**
 * Admin-only middleware
 */
export const withAdminAuth = withAuth(['admin', 'master_admin']);

/**
 * Employer-only middleware (includes admin)
 */
export const withEmployerAuth = withAuth(['employer', 'admin', 'master_admin']);

/**
 * Candidate-only middleware
 */
export const withCandidateAuth = withAuth(['candidate']);

/**
 * Master admin-only middleware
 */
export const withMasterAdminAuth = withAuth(['master_admin']);

/**
 * Rate limiting middleware
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
  return async (
    request: NextRequest,
    handler: (request: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean up old entries
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < windowStart) {
        rateLimitMap.delete(key);
      }
    }
    
    // Get current request count for IP
    const current = rateLimitMap.get(ip);
    
    if (current && current.resetTime > windowStart) {
      if (current.count >= maxRequests) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Rate limit exceeded. Please try again later.' 
          },
          { status: 429 }
        );
      }
      current.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    }
    
    return handler(request);
  };
}

/**
 * CORS middleware
 */
export function withCors(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  return handler(request).then((response) => {
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  });
}

/**
 * Error handling middleware
 */
export function withErrorHandling(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request);
    } catch (error) {
      console.error('API Error:', error);
      
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
  };
}

/**
 * Compose multiple middlewares
 */
export function compose(...middlewares: any[]) {
  return (handler: any) => {
    return middlewares.reduceRight((acc, middleware) => {
      return middleware(acc);
    }, handler);
  };
}

/**
 * Common middleware composition for protected routes
 */
export const withProtectedRoute = (requiredRoles?: UserRole[]) =>
  compose(
    withErrorHandling,
    withCors,
    withRateLimit(),
    withAuth(requiredRoles)
  );

/**
 * Common middleware composition for public routes
 */
export const withPublicRoute = compose(
  withErrorHandling,
  withCors,
  withRateLimit()
);
