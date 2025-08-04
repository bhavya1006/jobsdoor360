# Jobsdoor360 Backend Documentation

## Overview

Jobsdoor360 appears to be primarily a frontend-heavy web application that uses Firebase as its backend service. The application mainly relies on Firebase services such as Firebase Authentication and Firestore for its backend functionality. There is no traditional server-side API with custom routes/controllers; instead, the application makes direct calls to Firebase services from the client-side JavaScript.

## Backend Architecture

### Technology Stack

- **Firebase** - Used as the primary backend service

  - Firebase Authentication - For user authentication
  - Firestore - For database operations
  - Firebase Storage - For file storage

- **Tools and Build Process**
  - EJS Compiler - For template compilation
  - Node.js - For build processes

## Database Schema

### Collections in Firestore

Based on the code analysis, the following collections exist in the Firestore database:

1. **`user_profile`**

   - Document ID: User's email
   - Fields:
     - `about`: Object containing user information
       - `email`: String
       - `firstName`: String
     - `audit_fields`: Object containing audit information
       - `createdAt`: Timestamp
       - `createdBy`: String (email)
       - `updatedAt`: Timestamp
       - `updatedBy`: String (email)

2. **`lead`**

   - Document ID: User's email
   - Fields:
     - `full_name`: String
     - `phonenumber`: String
     - `email`: String

3. **Other collections**
   - There appear to be assessment-related collections, but the full schema details were not found in the analyzed code.

## Authentication Flow

### Registration Process

1. User submits registration form with email, password, username, and phone number
2. Application checks if user already exists in Firestore
3. If user doesn't exist:
   - Creates a new user with Firebase Authentication
   - Updates the user profile with the username
   - Sends email verification
   - Creates a document in the "lead" collection with user data
4. Redirects user to email verification page

### Login Process

1. User submits login form with email and password
2. Application authenticates with Firebase Authentication
3. Checks if email is verified
4. If verified:
   - Stores user information in localStorage
   - Checks for user profile in Firestore
   - If profile exists, redirects to myaccount page
   - If profile doesn't exist, creates a new profile and redirects to CV upload page

### Password Reset

The application has functionality for password reset via Firebase's sendPasswordResetEmail method.

## Firebase Operations

### User Data Operations

#### Create/Update User Profile

```javascript
// Save user data to Firestore
async function saveUserDataToFirestore(userId, username, email, phoneNumber) {
  const leadDocRef = doc(db, "lead", email);
  await setDoc(leadDocRef, {
    full_name: username,
    phonenumber: phoneNumber || "",
    email: email,
  });
}
```

#### Check User Existence

```javascript
// Check if user already exists
async function checkIfUserExists(email) {
  const docRef = doc(db, "lead", email);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}
```

### Assessment/Test Operations

There are operations for handling assessments and quizzes, though complete implementation details were not found:

```javascript
// Example of storing test results
const existingDoc = await getDoc(userResultsRef);
if (existingDoc.exists()) {
  const existingResults = existingDoc.data().results || [];
  await setDoc(userResultsRef, { results: [...existingResults, newAttempt] });
} else {
  await setDoc(userResultsRef, { results: [newAttempt] });
}
```

## Data Models

### Job Data Model

```javascript
{
  "post_date": "18_02_2025",
  "post_code": "exam___post_name__technical_and_tradesman",
  "job_code": "exam___post_name__technical_and_tradesman_postdate_",
  "recruitment_board": "Recruitment Board...",
  "qualification_eligibility": "Qualification...",
  "last_date": "N/A",
  "brief_info": "...",
  "minimum_age": 18,
  "maximum_age": 25,
  "job_link": "https://www.freejobalert.com/...",
  "job_type": "government",
  "posts_data": {
    "post_id": 1,
    "post_code": "...",
    "post_name": "...",
    "jobtype_masterdata": {...},
    "profile_masterdata": {...}
  }
}
```

### User Profile Model

```javascript
{
  "about": {
    "email": "user@example.com",
    "firstName": "User Name"
  },
  "audit_fields": {
    "createdAt": "2025-08-04T12:00:00.000Z",
    "createdBy": "user@example.com",
    "updatedAt": "",
    "updatedBy": ""
  }
}
```

## Environment & Configuration Requirements

### Firebase Configuration

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDzoJJ_325VL_axuuAFzDf3Bwt_ENzu2rM",
  authDomain: "jobsdoor360-39b87.firebaseapp.com",
  databaseURL: "https://jobsdoor360-39b87-default-rtdb.firebaseio.com",
  projectId: "jobsdoor360-39b87",
  storageBucket: "jobsdoor360-39b87.appspot.com",
  messagingSenderId: "326416618185",
  appId: "1:326416618185:web:de19e90fe4f06006ef3318",
  measurementId: "G-60RHEMJNM6",
};
```

### Required Node.js Packages

```json
{
  "dependencies": {
    "chokidar": "^4.0.3",
    "ejs": "^3.1.10",
    "express": "^4.19.2",
    "firebase": "^10.12.3",
    "mongoose": "^8.2.3"
  }
}
```

## Utilities and Helper Functions

### Firebase Utilities

The application exports Firebase functionality through the dbconfig.js file, making it available globally:

```javascript
// Example of utility exports
Object.assign(obj, {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
});

Object.assign(obj, {
  orderBy,
  arrayUnion,
  Timestamp,
  getFirestore,
  collection,
  getDocs,
  getDoc,
  query,
  writeBatch,
  where,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
});
```

### Error Handling

```javascript
// Parse Firebase error messages
function parseFirebaseError(message) {
  try {
    return message
      .split(" ")[2]
      .split("(")[1]
      .split(")")[0]
      .split("/")[1]
      .replaceAll("-", " ");
  } catch {
    return "An unknown error occurred";
  }
}
```

## Summary

Jobsdoor360 is a web application that primarily relies on Firebase for its backend functionality. It uses:

1. **Firebase Authentication** for user registration, login, and authentication
2. **Firestore** as the database for storing user profiles, job data, and assessment results
3. **Firebase Storage** for file storage (likely for CV uploads)

The application does not have a traditional backend server with custom API endpoints; instead, it interacts directly with Firebase services from the client side. The backend logic is embedded in the frontend JavaScript files, with operations for user authentication, data storage, and retrieval.

This documentation provides an overview of the backend functionality and can be used as a reference for migrating to a new architecture if needed.
