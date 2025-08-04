# Jobsdoor360 Backend Extraction

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Backend Stack](#backend-stack)
3. [Database Schema](#database-schema)
4. [Authentication System](#authentication-system)
5. [File Storage System](#file-storage-system)
6. [Business Logic](#business-logic)
7. [Data Models](#data-models)
8. [API Endpoints/Operations](#api-endpointsoperations)
9. [Security Mechanisms](#security-mechanisms)
10. [Utility Functions](#utility-functions)
11. [Environment Variables](#environment-variables)
12. [External Dependencies](#external-dependencies)
13. [Dependency Flow Diagram](#dependency-flow-diagram)

## Architecture Overview

Jobsdoor360 is built primarily as a client-side web application that interacts directly with Firebase services. There is no dedicated backend server with traditional API routes and controllers. Instead, the backend functionality is embedded within the frontend JavaScript files through direct calls to Firebase services.

The application follows a serverless architecture pattern where:
- Authentication is handled by Firebase Authentication
- Data storage is managed through Firestore
- File storage is handled by Firebase Storage
- The business logic is implemented directly in the client-side JavaScript

## Backend Stack

### Core Technologies
- **Firebase** (version: 10.1.0)
  - Firebase Authentication
  - Firestore Database
  - Firebase Storage
  - Firebase Realtime Database (configured but usage is limited)

### Build Tools
- **Node.js**
- **EJS** (Embedded JavaScript templates) - Used for template compilation
- **Chokidar** - Used for watching file changes during development

### Package Dependencies
```json
{
  "dependencies": {
    "chokidar": "^4.0.3",
    "ejs": "^3.1.10",
    "express": "^4.19.2",
    "firebase": "^10.12.3",
    "mongoose": "^8.2.3"
  },
  "devDependencies": {
    "xml-js": "^1.6.11"
  }
}
```

## Database Schema

Jobsdoor360 uses Firebase Firestore as its primary database. Below is the complete schema of collections and their fields:

### Collections

#### `user_profile`
Document ID: User's email address
- **about**: Object
  - **email**: String
  - **firstName**: String
  - **lastName**: String (optional)
  - **phoneNo**: String (optional)
  - **dob**: String (Date format) (optional)
  - **gender**: String (optional)
  - **image**: String (URL) (optional)
  - **cv**: String (URL) (optional)
- **audit_fields**: Object
  - **createdAt**: Timestamp
  - **createdBy**: String (email)
  - **updatedAt**: Timestamp (optional)
  - **updatedBy**: String (email) (optional)

#### `lead`
Document ID: User's email address
- **full_name**: String
- **phonenumber**: String
- **email**: String
- **applying_for**: Array of Strings (optional)
- **created_by**: String (email) (optional)
- **created_datetime**: String (ISO Date) (optional)

#### `jobs_applied`
Document ID: User's email address
- **appliedJobs**: Array of Objects
  - **jobId**: String
  - **timestamp**: Timestamp (optional)

#### `jobs_company_wise`
Document ID: Company name or ID
- **jobs**: Map<String, Object>
  - **jobId**: String
  - **title**: String
  - **company**: String
  - **location**: String
  - **type**: String
  - **salary**: String (optional)
  - **stipend**: String (optional)
  - **description**: String
  - **timestamp**: Timestamp
  - **applicants**: Array of Objects (optional)
    - **email**: String

#### `login_roles`
Document ID: User's email address
- **role**: String ("master_admin", "admin", "user", etc.)

#### `user_consultancies`
Document ID: User's email address
- **remarks**: Array of Objects
  - **remark**: String
  - **date**: Timestamp
  - **addedBy**: String (email) (optional)

#### `quizzes`
Collection of assessment quizzes
- **questions**: Array of Objects
  - **title**: String
  - **options**: Array of Strings
  - **answer**: Number (index of correct option)

#### `user_results`
Document ID: Quiz ID + User ID
- **results**: Array of Objects
  - **score**: Number
  - **percentage**: Number
  - **timestamp**: Timestamp
  - **answers**: Map<String, Number> (question ID to selected answer index)

## Authentication System

The authentication system is implemented using Firebase Authentication with email/password and Google sign-in methods.

### Authentication Flow

#### Registration (Email/Password)
1. User enters name, email, password, and phone number
2. System checks if user exists in the `lead` collection
3. If user doesn't exist:
   - Creates new user in Firebase Authentication
   - Updates user profile with display name
   - Sends email verification
   - Creates document in `lead` collection
4. Redirects to email verification page

```javascript
// Signup implementation
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const phoneNumber = document.getElementById("phoneNo").value;

  try {
    signupButton.innerHTML = "Signing up...";
    signupButton.disabled = true;

    const userExists = await checkIfUserExists(email);
    if (userExists) {
      alert("User already registered. Redirecting to login page.");
      window.location.href = "/login";
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: username });
    await sendEmailVerification(userCredential.user);
    await saveUserDataToFirestore(userCredential.user.uid, username, email, phoneNumber);

    signupForm.reset();
    window.location.href = "/resend_email_verification/";
  } catch (error) {
    alert("Error signing up: " + error.message);
  } finally {
    signupButton.innerHTML = "Sign Up";
    signupButton.disabled = false;
  }
});
```

#### Google Sign-In
1. User clicks Google sign-in button
2. Firebase Authentication handles OAuth flow
3. On successful authentication:
   - System checks if user exists in `lead` collection
   - If user doesn't exist, creates entry in `lead` collection
   - Saves user info to localStorage
4. Redirects to appropriate page

```javascript
googleSignUpButton.addEventListener("click", async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userExists = await checkIfUserExists(user.email);
    if (!userExists) {
      await saveUserDataToFirestore(user.uid, user.displayName || "", user.email, user.phoneNumber || "");
      await sendEmailVerification(user); // optional
    }

    // Save to localStorage
    localStorage.setItem("uid", user.uid);
    localStorage.setItem("email", user.email);
    localStorage.setItem("phonenumber", user.phoneNumber || "");

    // Redirect
    const redirectUrl = localStorage.getItem("redirect_url");
    localStorage.removeItem("redirect_url");
    window.location.href = redirectUrl || "/";
  } catch (error) {
    console.error("Google sign up error:", error.message);
    alert("Google signup failed: " + error.message);
  }
});
```

#### Login
1. User enters email and password
2. System authenticates with Firebase
3. Checks if email is verified
4. If verified:
   - Stores user information in localStorage
   - Checks for user profile in Firestore
   - If profile exists, redirects to account page
   - If profile doesn't exist, creates profile and redirects to CV upload page

```javascript
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      alert("Email is not verified");
      throw new Error("Email is not verified");
    }

    localStorage.setItem("uid", user.uid);
    localStorage.setItem("email", user.email);

    const docRef = doc(db, "user_profile", email);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      let formData = { ...docSnap.data() };
      var currentDate = window.getCurrentDateTime();

      if (!formData.audit_fields) {
        formData.audit_fields = {
          createdAt: currentDate,
          createdBy: email,
          updatedAt: "",
          updatedBy: "",
        };
      }

      await setDoc(docRef, formData);
      localStorage.setItem("profile", true);
      window.location.href = "/myaccount/";
    } else {
      // If user profile doesn't exist, create one
      const leadDocRef = doc(db, "lead", email);
      const leadDocSnap = await getDoc(leadDocRef);
      let formData = { about: { email, firstName: user.displayName } };
      var currentDate = window.getCurrentDateTime();
      
      if (leadDocSnap.exists()) {
        formData.about = { ...formData.about, ...leadDocSnap.data() };
      }

      formData.audit_fields = {
        createdAt: currentDate,
        createdBy: email,
        updatedAt: "",
        updatedBy: "",
      };

      await setDoc(docRef, formData);
      localStorage.setItem("profile", true);

      const redirectUrl = localStorage.getItem("redirect_url");
      window.location.href = redirectUrl || "/myaccount/cv_upload/";
    }
  } catch (error) {
    console.error("Error:", error.message);
    showToast(parseFirebaseError(error.message));
  }
}
```

#### Password Reset
1. User enters email address
2. System sends password reset email through Firebase
3. User receives email with reset link

```javascript
const passwordResetEmail = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent successfully");
    Toastify({
      text: "Email sent successfully",
      duration: 3000,
      // ... style config ...
    }).showToast();
  } catch (error) {
    console.error("Error sending password reset email:", error);
    Toastify({
      text: "Something went wrong",
      duration: 3000,
      // ... style config ...
    }).showToast();
  }
};
```

#### Authentication State Management
The application uses Firebase's `onAuthStateChanged` listener to manage authentication state:

```javascript
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await user.reload();
    if (user.emailVerified) {
      // User is signed in and email is verified
      // Perform actions for authenticated user
    }
  } else {
    // User is not signed in
    // Redirect to login page or show appropriate UI
  }
});
```

### Role-Based Access Control
The application implements role-based access control using the `login_roles` collection:

```javascript
async function isUser() {
  try {
    const docRef = doc(db, "login_roles", email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const userRole = userData.role;

      if (userRole === "master_admin") {
        // Allow access to admin features
        await mainData();
      } else {
        // Redirect non-admin users
        window.location.href = "/";
      }
    } else {
      // No role defined
      window.location.href = "/login/";
    }
  } catch (error) {
    console.error("Error getting user data from Firestore:", error);
    window.location.href = "/";
  }
}
```

## File Storage System

The application uses Firebase Storage for file storage, particularly for CV uploads.

### File Upload Implementation

#### CV Upload
1. User selects PDF file through file input
2. System uploads file to Firebase Storage under `user_cv/[email]_[filename]`
3. Retrieves download URL from Firebase Storage
4. Stores URL in user's profile document in Firestore

```javascript
async function uploadCV(file) {
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
  const storageRef = window.ref(window.storage, `user_cv/${userEmail}_${sanitizedFileName}`);
  await window.uploadBytes(storageRef, file);
  return await window.getDownloadURL(storageRef);
}

async function saveCVToDatabase() {
  const uploadButton = document.getElementById("btn");
  const fileInput = document.getElementById("cv");
  const file = fileInput.files[0];

  if (!file) {
    Toastify({
      text: "Please select a file",
      duration: 3000,
      style: { background: "red" }
    }).showToast();
    return;
  }

  uploadButton.disabled = true;
  uploadButton.innerText = "Uploading...";

  try {
    const cvUrl = await uploadCV(file);
    const userRef = window.doc(window.db, "user_profile", userEmail);
    const userSnap = await window.getDoc(userRef);

    if (!userSnap.exists()) {
      await window.setDoc(userRef, { about: {} });
    }

    await window.updateDoc(userRef, {
      "about.cv": cvUrl
    });

    // Show success message and redirect
    Toastify({
      text: "CV Successfully Submitted",
      duration: 2000,
      // ... style config ...
    }).showToast();

    setTimeout(() => {
      window.location.href = "/myaccount/";
    }, 2000);
  } catch (err) {
    console.error("Upload failed:", err);
    Toastify({
      text: "Upload failed",
      duration: 3000,
      style: { background: "red" }
    }).showToast();
  }

  uploadButton.disabled = false;
  uploadButton.innerText = "UPLOAD RESUME";
}
```

#### Profile Image Upload
Similar to CV upload, but stores the URL in the user's profile document under `about.image`.

## Business Logic

### User Management

#### User Profile Management
- Create/update user profile in Firestore
- Fetch user data from `user_profile` and `lead` collections
- Update personal information (name, email, phone, DoB, gender)
- Upload and manage profile images and CVs

```javascript
async function isUser() {
  try {
    const docRef = doc(db, "user_profile", email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var userData = docSnap.data();
      userPhoneNumber = userData.about.phoneNo;
      populateForm(userData);
    } else {
      await fetchFromLeadCollection();
    }
  } catch (error) {
    console.error("Error getting user data from user_profile:", error);
  }
}

async function fetchFromLeadCollection() {
  const leadRef = doc(db, "lead", email);
  try {
    const leadSnapshot = await getDoc(leadRef);
    if (!leadSnapshot.empty) {
      const leadData = leadSnapshot.data();
      userPhoneNumber = leadData.phonenumber;
      populateForm(leadData);
    } else {
      console.log("No data found in lead collection either.");
    }
  } catch (error) {
    console.error("Error getting data from lead collection:", error);
  }
}
```

#### User Tracking and Analytics
- Track user activities such as test scores, job applications
- Store analytics data in relevant collections

### Job Management

#### Job Posting
- Create job postings with details (title, company, location, etc.)
- Update and delete job postings
- View job applications

```javascript
async function createJob(jobData) {
  try {
    const companyEmail = auth.currentUser.email;
    const companyRef = doc(db, "jobs_company_wise", companyEmail);
    
    const newJob = {
      ...jobData,
      timestamp: Timestamp.now(),
      applicants: []
    };
    
    const companyDoc = await getDoc(companyRef);
    
    if (companyDoc.exists()) {
      // Company already has jobs, update the document
      const companyData = companyDoc.data();
      const jobs = companyData.jobs || {};
      const jobId = generateJobId();
      jobs[jobId] = { ...newJob, jobId };
      
      await updateDoc(companyRef, { jobs });
      return jobId;
    } else {
      // Create new company document with this job
      const jobId = generateJobId();
      await setDoc(companyRef, {
        jobs: {
          [jobId]: { ...newJob, jobId }
        }
      });
      return jobId;
    }
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
}
```

#### Job Application
- Apply for jobs (submit user information and CV)
- Track job application status
- View applied jobs

```javascript
async function applyForJob(jobId) {
  if (!currentUser) {
    alert("Please log in to apply for jobs");
    window.location.href = `/login/?redirect_url=${encodeURIComponent(window.location.href)}`;
    return;
  }
  
  try {
    const userEmail = currentUser.email;
    
    // Update user's applied jobs
    const userJobsRef = doc(db, "jobs_applied", userEmail);
    const userJobsSnap = await getDoc(userJobsRef);
    
    if (userJobsSnap.exists()) {
      const data = userJobsSnap.data();
      const appliedJobs = data.appliedJobs || [];
      
      // Check if already applied
      if (appliedJobs.some(job => job.jobId === jobId)) {
        alert("You have already applied to this job");
        return;
      }
      
      // Add to applied jobs
      appliedJobs.push({
        jobId,
        timestamp: Timestamp.now()
      });
      
      await updateDoc(userJobsRef, { appliedJobs });
    } else {
      // First application
      await setDoc(userJobsRef, {
        appliedJobs: [{
          jobId,
          timestamp: Timestamp.now()
        }]
      });
    }
    
    // Update job's applicants
    // Find which company posted the job
    const jobsSnapshot = await getDocs(collection(db, "jobs_company_wise"));
    let companyId = null;
    let jobData = null;
    
    jobsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.jobs && data.jobs[jobId]) {
        companyId = doc.id;
        jobData = data.jobs[jobId];
        return;
      }
    });
    
    if (companyId && jobData) {
      const companyRef = doc(db, "jobs_company_wise", companyId);
      const applicants = jobData.applicants || [];
      
      applicants.push({
        email: userEmail,
        timestamp: Timestamp.now()
      });
      
      await updateDoc(companyRef, {
        [`jobs.${jobId}.applicants`]: applicants
      });
      
      alert("Application submitted successfully");
    } else {
      console.error("Job not found");
    }
  } catch (error) {
    console.error("Error applying for job:", error);
    alert("Failed to apply for job");
  }
}
```

#### Job Searching
- Filter jobs by location, job type, and other criteria
- Display job listings based on user preferences

```javascript
// Filtering jobs by location
function filterJobsByLocation(location) {
  if (!location) {
    displayJobs(jobsToShow);
    return;
  }
  
  const filteredJobs = jobsToShow.filter(job => {
    return job.location.toLowerCase().includes(location.toLowerCase());
  });
  
  displayJobs(filteredJobs);
}
```

### Assessment System

#### Quiz Management
- Create and manage assessment quizzes
- Track quiz results and user performance
- Display quiz statistics

```javascript
async function startQuiz() {
  const TIME_LIMIT = 30 * 60; // 30 minutes in seconds

  let currentSubject = null;
  let currentQuestionIndex = 0;
  let unansweredCount = 0;
  let score = 0;
  let timeLeft = TIME_LIMIT;
  let timerInterval = null;
  let quizWindowFocus = true;
  let tabSwitchAlertPending = false;
  let selectedAnswers = {}; // Store the selected answers

  // ... quiz setup code ...

  async function loadQuizData() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const quizCode = urlParams.get("test_code");
      if (!quizCode) {
        console.error("No quiz code provided");
        return;
      }

      const docRef = doc(db, "quizzes", quizCode);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        quizData = docSnap.data();
        currentQuestions = quizData.questions;
        // ... process quiz data ...
        displayQuestion();
      } else {
        console.error("No quiz found with that code");
      }
    } catch (error) {
      console.error("Error loading quiz:", error);
    }
  }

  // ... question display and answer handling ...

  async function submitQuiz() {
    clearInterval(timerInterval);
    
    // Calculate score
    let totalScore = 0;
    let correctCount = 0;
    
    currentQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        correctCount++;
      }
    });
    
    totalScore = correctCount;
    const percentage = (correctCount / currentQuestions.length) * 100;
    
    // Display results
    scoreDisplay.textContent = `${correctCount}/${currentQuestions.length}`;
    percentageDisplay.textContent = `${percentage.toFixed(2)}%`;
    
    questionContainer.style.display = "none";
    resultContainer.style.display = "block";
    
    // Save results to Firestore
    try {
      const user = auth.currentUser;
      if (!user) return;
      
      const urlParams = new URLSearchParams(window.location.search);
      const quizCode = urlParams.get("test_code");
      
      const userResultsRef = doc(db, "user_results", `${quizCode}_${user.uid}`);
      
      const newAttempt = {
        score: totalScore,
        percentage: percentage,
        timestamp: Timestamp.now(),
        answers: selectedAnswers
      };
      
      const existingDoc = await getDoc(userResultsRef);
      
      if (existingDoc.exists()) {
        const existingResults = existingDoc.data().results || [];
        await setDoc(
          userResultsRef,
          { results: [...existingResults, newAttempt] }
        );
      } else {
        await setDoc(userResultsRef, { results: [newAttempt] });
      }
    } catch (error) {
      console.error("Error saving quiz results:", error);
    }
  }

  // ... timer and focus monitoring ...

  await loadQuizData();
}
```

### Admin Management

#### User Administration
- View and manage user records
- Add consultancy remarks for users
- Filter and search users by different criteria

```javascript
async function addConsultancyRemark(email, remark, date) {
  if (!email || !remark || !date) {
    alert("Please enter a remark and select a valid date.");
    return;
  }

  try {
    const userRef = doc(db, "user_consultancies", email);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Update existing document: push new remark to array
      const userData = userDoc.data();
      const remarks = userData.remarks || [];
      remarks.push({
        remark,
        date: Timestamp.fromDate(new Date(date)),
        addedBy: auth.currentUser?.email || "unknown"
      });
      
      await updateDoc(userRef, { remarks });
    } else {
      // Create new document with first remark
      await setDoc(userRef, {
        remarks: [{
          remark,
          date: Timestamp.fromDate(new Date(date)),
          addedBy: auth.currentUser?.email || "unknown"
        }]
      });
    }
    
    alert("Remark added successfully");
  } catch (error) {
    console.error("Error adding remark:", error);
    alert("Failed to add remark");
  }
}
```

## Data Models

### User Model
```javascript
// User Profile Model
{
  "about": {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNo": "1234567890",
    "dob": "1990-01-01",
    "gender": "Male",
    "image": "https://firebasestorage.googleapis.com/...",
    "cv": "https://firebasestorage.googleapis.com/..."
  },
  "audit_fields": {
    "createdAt": "2023-01-01T12:00:00.000Z",
    "createdBy": "user@example.com",
    "updatedAt": "2023-01-02T12:00:00.000Z",
    "updatedBy": "user@example.com"
  }
}
```

### Job Model
```javascript
// Job Model
{
  "jobId": "job123",
  "title": "Software Developer",
  "company": "Tech Company",
  "location": "Remote",
  "type": "Full-time",
  "salary": "$80,000 - $100,000",
  "description": "We are looking for a skilled software developer...",
  "timestamp": "2023-01-01T12:00:00.000Z",
  "applicants": [
    {
      "email": "applicant1@example.com",
      "timestamp": "2023-01-02T12:00:00.000Z"
    }
  ]
}
```

### Assessment Model
```javascript
// Quiz Model
{
  "title": "JavaScript Assessment",
  "description": "Test your JavaScript knowledge",
  "timeLimit": 1800, // in seconds
  "questions": [
    {
      "title": "What is JavaScript?",
      "options": [
        "A programming language",
        "A markup language",
        "A database system",
        "A design tool"
      ],
      "answer": 0 // index of correct option
    }
  ]
}

// Quiz Result Model
{
  "results": [
    {
      "score": 8,
      "percentage": 80,
      "timestamp": "2023-01-01T12:00:00.000Z",
      "answers": {
        "0": 0,
        "1": 2,
        "2": 1
      }
    }
  ]
}
```

### Lead Model
```javascript
// Lead Model
{
  "full_name": "John Doe",
  "phonenumber": "1234567890",
  "email": "john@example.com",
  "applying_for": ["job", "internship"],
  "created_by": "admin@example.com",
  "created_datetime": "2023-01-01T12:00:00.000Z"
}
```

### Consultancy Remark Model
```javascript
// Consultancy Remark Model
{
  "remarks": [
    {
      "remark": "Candidate showed good communication skills",
      "date": "2023-01-01T12:00:00.000Z",
      "addedBy": "admin@example.com"
    }
  ]
}
```

## API Endpoints/Operations

Since the application doesn't have traditional API endpoints with server-side routes, here's a mapping of Firebase operations that effectively serve as the API endpoints:

### Authentication Operations

#### User Registration
```javascript
// Register user with email/password
createUserWithEmailAndPassword(auth, email, password)

// Update user profile
updateProfile(userCredential.user, { displayName: username })

// Send email verification
sendEmailVerification(userCredential.user)

// Save user data to Firestore
setDoc(doc(db, "lead", email), userData)
```

#### User Login
```javascript
// Login user with email/password
signInWithEmailAndPassword(auth, email, password)

// Login user with Google
signInWithPopup(auth, provider)
```

#### Password Reset
```javascript
// Send password reset email
sendPasswordResetEmail(auth, email)
```

### User Profile Operations

#### Get User Profile
```javascript
// Get user profile from Firestore
getDoc(doc(db, "user_profile", email))

// Get user data from lead collection
getDoc(doc(db, "lead", email))
```

#### Update User Profile
```javascript
// Update user profile
updateDoc(doc(db, "user_profile", email), updatedData)
```

### Job Operations

#### Create Job
```javascript
// Create job in company's document
setDoc(doc(db, "jobs_company_wise", companyEmail), {
  jobs: {
    [jobId]: jobData
  }
})
```

#### Update Job
```javascript
// Update job
updateDoc(doc(db, "jobs_company_wise", companyEmail), {
  [`jobs.${jobId}`]: updatedJobData
})
```

#### Delete Job
```javascript
// Delete job
updateDoc(doc(db, "jobs_company_wise", companyEmail), {
  [`jobs.${jobId}`]: deleteField()
})
```

#### Get Jobs
```javascript
// Get all jobs
getDocs(collection(db, "jobs_company_wise"))

// Get specific company's jobs
getDoc(doc(db, "jobs_company_wise", companyEmail))
```

#### Apply for Job
```javascript
// Add job to user's applied jobs
updateDoc(doc(db, "jobs_applied", userEmail), {
  appliedJobs: arrayUnion({ jobId, timestamp: Timestamp.now() })
})

// Add user to job's applicants
updateDoc(doc(db, "jobs_company_wise", companyEmail), {
  [`jobs.${jobId}.applicants`]: arrayUnion({ email: userEmail, timestamp: Timestamp.now() })
})
```

#### Get Applied Jobs
```javascript
// Get user's applied jobs
getDoc(doc(db, "jobs_applied", userEmail))
```

### Assessment Operations

#### Get Quiz
```javascript
// Get quiz by code
getDoc(doc(db, "quizzes", quizCode))
```

#### Submit Quiz Results
```javascript
// Save quiz results
setDoc(doc(db, "user_results", `${quizCode}_${userId}`), {
  results: arrayUnion(resultData)
})
```

#### Get Quiz Results
```javascript
// Get user's quiz results
getDoc(doc(db, "user_results", `${quizCode}_${userId}`))
```

### Admin Operations

#### Get User Records
```javascript
// Get all users from lead collection
getDocs(collection(db, "lead"))
```

#### Add Consultancy Remarks
```javascript
// Add remark to user's consultancy document
updateDoc(doc(db, "user_consultancies", email), {
  remarks: arrayUnion(remarkData)
})
```

## Security Mechanisms

### Authentication Security
- Email verification required before login
- Password reset functionality
- Error handling for authentication failures

### Access Control
- Role-based access control for admin features
- User document access restricted to authenticated users
- Client-side redirects for unauthorized access attempts

### Data Validation
- Input validation before submission
- Form data sanitization
- Error handling for data operations

### Session Management
- Authentication state monitoring with `onAuthStateChanged`
- localStorage used for maintaining user state
- Session timeout handling (implicit through Firebase)

## Utility Functions

### Firebase Configuration Utility
```javascript
// Centralized Firebase configuration in dbconfig.js
// Initialize Firebase app
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

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
auth.languageCode = "en";
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const storageRef = ref(storage);
```

### Error Handling Utility
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

### Date Utility
```javascript
// Get current date and time in formatted string
window.getCurrentDateTime = function() {
  const now = new Date();
  return now.toISOString();
}
```

### Toast Notification Utility
```javascript
// Display toast notifications
function showToast(message) {
  Toastify({
    text: message,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #0d6efd, #586ba6)",
      borderRadius: "10px",
    },
  }).showToast();
}
```

### Time Formatting Utility
```javascript
// Format timestamp as "time ago"
function timeAgo(date) {
  if (!date || typeof date.toDate !== 'function') return "unknown time";
  const seconds = Math.floor((new Date() - date.toDate()) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 }
  ];
  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count >= 1) return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
}
```

## Environment Variables

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

### Testing Firebase Configuration
```javascript
const testFirebaseConfig = {
  apiKey: "AIzaSyB50M8vFXcbkJ_SGNncFzzK0RHMLQpNIzU",
  authDomain: "jd360-testing.firebaseapp.com",
  databaseURL: "https://jd360-testing-default-rtdb.firebaseio.com",
  projectId: "jd360-testing",
  storageBucket: "jd360-testing.firebasestorage.app",
  messagingSenderId: "576496756828",
  appId: "1:576496756828:web:4482903b8db23a66285e99",
  measurementId: "G-GN8843MVDG"
};
```

## External Dependencies

### Firebase SDK Dependencies
- Firebase App: `https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js`
- Firebase Auth: `https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js`
- Firebase Firestore: `https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js`
- Firebase Storage: `https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js`

### NPM Dependencies
- chokidar: ^4.0.3 (File watching)
- ejs: ^3.1.10 (Template rendering)
- express: ^4.19.2 (Web server, potentially used for local development)
- firebase: ^10.12.3 (Firebase SDK)
- mongoose: ^8.2.3 (MongoDB ODM, configured but usage is minimal)

### UI Dependencies
- Toastify: For toast notifications
- Bootstrap: For UI components and styling

## Dependency Flow Diagram

```
┌────────────────┐         ┌────────────────┐
│                │         │                │
│  Client Side   │         │  Firebase      │
│  JavaScript    │         │  Services      │
│                │         │                │
└───────┬────────┘         └────────┬───────┘
        │                           │
        │                           │
        │                           │
        │                           │
┌───────▼────────┐         ┌────────▼───────┐
│                │         │                │
│  Firebase      │         │  Firebase      │
│  Auth          ├─────────►  Firestore     │
│                │         │                │
└───────┬────────┘         └────────┬───────┘
        │                           │
        │                           │
        │                           │
        │                           │
┌───────▼────────┐         ┌────────▼───────┐
│                │         │                │
│  User          │         │  Data          │
│  Session       │         │  Collections   │
│  (localStorage)│         │                │
│                │         │                │
└────────────────┘         └────────────────┘


┌────────────────┐         ┌────────────────┐
│                │         │                │
│  User          │         │  Firebase      │
│  Actions       │         │  Storage       │
│  (CV Upload)   ├─────────►  (Files)       │
│                │         │                │
└────────────────┘         └────────────────┘


                  AUTHENTICATION FLOW
                  
┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐
│        │     │        │     │        │     │        │
│ Signup ├────►│ Email  ├────►│ User   ├────►│ Profile│
│ Form   │     │ Verify │     │ Login  │     │ Create │
│        │     │        │     │        │     │        │
└────────┘     └────────┘     └────────┘     └────────┘
```

This detailed extraction provides a comprehensive view of the backend functionality in the Jobsdoor360 application. Although the application uses a serverless architecture with Firebase services rather than a traditional backend server, the document captures all the essential backend operations, data models, authentication flows, and business logic required for rebuilding the system in a new stack.
