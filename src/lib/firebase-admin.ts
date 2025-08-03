/**
 * Firebase Admin SDK Configuration for Server-Side Operations
 * Used for server-side authentication, Firestore operations, and custom claims
 */

import admin from "firebase-admin";

// Firebase Admin configuration with fallbacks
const firebaseAdminConfig = {
  projectId:
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "demo-project",
  clientEmail:
    process.env.FIREBASE_CLIENT_EMAIL ||
    "demo@demo-project.iam.gserviceaccount.com",
  privateKey:
    process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") ||
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAo\n-----END PRIVATE KEY-----\n",
};

// Initialize Firebase Admin (only if not already initialized)
let adminApp: admin.app.App;

try {
  if (!admin.apps.length) {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(firebaseAdminConfig),
      projectId: firebaseAdminConfig.projectId,
      storageBucket: `${firebaseAdminConfig.projectId}.appspot.com`,
    });
  } else {
    adminApp = admin.apps[0] as admin.app.App;
  }
} catch (error) {
  console.warn("Firebase Admin initialization failed, using fallback:", error);
  // Fallback for build or development
  try {
    adminApp = admin.initializeApp({
      projectId: "demo-project",
      storageBucket: "demo-project.appspot.com",
    });
  } catch (fallbackError) {
    // If even fallback fails, create a dummy app reference
    adminApp = admin.apps[0] as admin.app.App;
  }
}

// Initialize Firebase Admin services with error handling
export const adminAuth = (() => {
  try {
    return admin.auth(adminApp);
  } catch (error) {
    console.warn("Firebase Auth initialization failed:", error);
    return {} as admin.auth.Auth;
  }
})();

export const adminDb = (() => {
  try {
    const db = admin.firestore(adminApp);
    db.settings({
      ignoreUndefinedProperties: true,
    });
    return db;
  } catch (error) {
    console.warn("Firebase Firestore initialization failed:", error);
    return {} as admin.firestore.Firestore;
  }
})();

export const adminStorage = (() => {
  try {
    return admin.storage(adminApp);
  } catch (error) {
    console.warn("Firebase Storage initialization failed:", error);
    return {} as admin.storage.Storage;
  }
})();

export default adminApp;
