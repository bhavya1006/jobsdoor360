# Jobsdoor360 Backend Testing Guide

## Overview

This document provides comprehensive testing instructions for the Jobsdoor360 backend API. The backend includes 34+ endpoints covering authentication, user management, job posting, applications, assessments, file uploads, and admin functions.

## Prerequisites

### 1. Environment Setup

- Node.js 18+ installed
- Firebase project configured
- Environment variables set in `.env.local`

### 2. Required Tools

- **cURL** (command line testing)
- **Postman** (GUI testing and collections)
- **PowerShell** (Windows users)
- **Web browser** (for file uploads testing)

### 3. Environment Variables

Ensure your `.env.local` file contains:

```bash
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID=jobsdoor360-39b87
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=jobsdoor360-39b87.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=jobsdoor360-39b87.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=jobsdoor360-39b87
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@jobsdoor360-39b87.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY\n-----END PRIVATE KEY-----"
FIREBASE_STORAGE_BUCKET=jobsdoor360-39b87.appspot.com

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## Quick Start

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test Basic Connectivity

```bash
curl http://localhost:3000/api/jobs
```

### 3. Import Postman Collection

- Import `jobsdoor360.postman_collection.json` into Postman
- Set the `baseUrl` variable to `http://localhost:3000`

## Testing Methods

### Method 1: cURL Commands (Linux/Mac/WSL)

Use the `backend-testing-curl.sh` file:

```bash
chmod +x backend-testing-curl.sh
./backend-testing-curl.sh
```

### Method 2: PowerShell (Windows)

Use the `backend-testing-powershell.ps1` file:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\backend-testing-powershell.ps1
```

### Method 3: Postman Collection

1. Import `jobsdoor360.postman_collection.json`
2. Set environment variables
3. Run individual requests or entire collection

## API Endpoints Overview

### Authentication Endpoints

| Method | Endpoint                        | Description               | Auth Required |
| ------ | ------------------------------- | ------------------------- | ------------- |
| POST   | `/api/auth/register`            | User registration         | No            |
| POST   | `/api/auth/login`               | User login                | No            |
| POST   | `/api/auth/verify`              | Email verification        | No            |
| POST   | `/api/auth/resend-verification` | Resend verification email | Yes           |
| POST   | `/api/auth/reset-password`      | Password reset request    | No            |

### User Profile Endpoints

| Method | Endpoint             | Description         | Auth Required |
| ------ | -------------------- | ------------------- | ------------- |
| GET    | `/api/users/profile` | Get user profile    | Yes           |
| PUT    | `/api/users/profile` | Update user profile | Yes           |

### Job Endpoints

| Method | Endpoint         | Description    | Auth Required  |
| ------ | ---------------- | -------------- | -------------- |
| GET    | `/api/jobs`      | Get all jobs   | No             |
| POST   | `/api/jobs`      | Create job     | Yes (Employer) |
| GET    | `/api/jobs/[id]` | Get single job | No             |
| PUT    | `/api/jobs/[id]` | Update job     | Yes (Employer) |
| DELETE | `/api/jobs/[id]` | Delete job     | Yes (Employer) |

### Application Endpoints

| Method | Endpoint                 | Description               | Auth Required   |
| ------ | ------------------------ | ------------------------- | --------------- |
| POST   | `/api/applications`      | Apply for job             | Yes (Candidate) |
| GET    | `/api/applications`      | Get user applications     | Yes             |
| GET    | `/api/applications/[id]` | Get application details   | Yes             |
| PUT    | `/api/applications/[id]` | Update application status | Yes (Employer)  |

### Assessment Endpoints

| Method | Endpoint                | Description           | Auth Required |
| ------ | ----------------------- | --------------------- | ------------- |
| GET    | `/api/assessments`      | Get all assessments   | Yes           |
| POST   | `/api/assessments`      | Create assessment     | Yes (Admin)   |
| GET    | `/api/assessments/[id]` | Get single assessment | Yes           |
| PUT    | `/api/assessments/[id]` | Update assessment     | Yes (Admin)   |
| DELETE | `/api/assessments/[id]` | Delete assessment     | Yes (Admin)   |

### User Assessment Endpoints

| Method | Endpoint                     | Description            | Auth Required |
| ------ | ---------------------------- | ---------------------- | ------------- |
| POST   | `/api/user-assessments`      | Start assessment       | Yes           |
| PUT    | `/api/user-assessments/[id]` | Submit assessment      | Yes           |
| GET    | `/api/user-assessments/[id]` | Get assessment results | Yes           |

### File Upload Endpoints

| Method | Endpoint                    | Description          | Auth Required  |
| ------ | --------------------------- | -------------------- | -------------- |
| POST   | `/api/upload/profile-image` | Upload profile image | Yes            |
| POST   | `/api/upload/cv`            | Upload CV/resume     | Yes            |
| POST   | `/api/upload/company-logo`  | Upload company logo  | Yes (Employer) |

### Admin Endpoints

| Method | Endpoint                     | Description                | Auth Required |
| ------ | ---------------------------- | -------------------------- | ------------- |
| GET    | `/api/admin/stats`           | Get admin statistics       | Yes (Admin)   |
| GET    | `/api/admin/users`           | Get all users              | Yes (Admin)   |
| PUT    | `/api/admin/users/[id]/role` | Update user role           | Yes (Admin)   |
| GET    | `/api/admin/consultancy`     | Get consultancy requests   | Yes (Admin)   |
| POST   | `/api/admin/consultancy`     | Create consultancy request | Yes           |

## Testing Workflow

### 1. Authentication Flow

```bash
# Step 1: Register a candidate
curl -X POST "http://localhost:3000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@test.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNo": "+1234567890",
    "role": "candidate"
  }'

# Step 2: Login to get token
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@test.com",
    "password": "password123"
  }'

# Step 3: Use token for authenticated requests
# Save the token from login response
TOKEN="your_jwt_token_here"

# Step 4: Test authenticated endpoint
curl -X GET "http://localhost:3000/api/users/profile" \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Job Management Flow

```bash
# Step 1: Create a job (requires employer token)
curl -X POST "http://localhost:3000/api/jobs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $EMPLOYER_TOKEN" \
  -d '{
    "title": "Frontend Developer",
    "description": "Looking for React developer",
    "type": "full-time",
    "location": "Remote"
  }'

# Step 2: Apply for the job (requires candidate token)
curl -X POST "http://localhost:3000/api/applications" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" \
  -d '{
    "jobId": "job_id_from_previous_request",
    "coverLetter": "I am interested in this position"
  }'
```

### 3. Assessment Flow

```bash
# Step 1: Get available assessments
curl -X GET "http://localhost:3000/api/assessments" \
  -H "Authorization: Bearer $TOKEN"

# Step 2: Start an assessment
curl -X POST "http://localhost:3000/api/user-assessments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "assessmentId": "assessment_id_here"
  }'

# Step 3: Submit assessment answers
curl -X PUT "http://localhost:3000/api/user-assessments/user_assessment_id" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "answers": [
      {
        "questionId": "question_id",
        "answer": "selected_answer"
      }
    ]
  }'
```

## Error Handling

### Common HTTP Status Codes

- **200**: Success
- **201**: Created successfully
- **400**: Bad request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not found
- **500**: Internal server error

### Example Error Response

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## File Upload Testing

### Profile Image Upload

```bash
curl -X POST "http://localhost:3000/api/upload/profile-image" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/image.jpg"
```

### CV Upload

```bash
curl -X POST "http://localhost:3000/api/upload/cv" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/resume.pdf"
```

## Validation Testing

### Test Invalid Data

```bash
# Test invalid email format
curl -X POST "http://localhost:3000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "123",
    "firstName": "",
    "phoneNo": "invalid-phone"
  }'
```

### Test Unauthorized Access

```bash
# Test without token
curl -X GET "http://localhost:3000/api/users/profile"

# Test with invalid token
curl -X GET "http://localhost:3000/api/users/profile" \
  -H "Authorization: Bearer invalid_token"
```

## Performance Testing

### Load Testing with cURL

```bash
# Test multiple concurrent requests
for i in {1..10}; do
  curl -X GET "http://localhost:3000/api/jobs" &
done
wait
```

## Troubleshooting

### Common Issues

1. **Firebase Connection Errors**

   - Check environment variables
   - Verify Firebase project configuration
   - Ensure service account has proper permissions

2. **Authentication Failures**

   - Verify JWT token is correctly formatted
   - Check token expiration
   - Ensure correct Authorization header format

3. **Validation Errors**

   - Check request body format
   - Verify required fields are provided
   - Ensure data types match schema requirements

4. **File Upload Issues**
   - Check file size limits
   - Verify file format is supported
   - Ensure proper multipart/form-data encoding

### Debug Mode

Set environment variable for detailed logging:

```bash
DEBUG=true npm run dev
```

## Security Testing

### Test Rate Limiting

```bash
# Test rapid requests to same endpoint
for i in {1..100}; do
  curl -X POST "http://localhost:3000/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' &
done
```

### Test SQL Injection Protection

```bash
# Test malicious input in search
curl -X GET "http://localhost:3000/api/jobs?query='; DROP TABLE users; --"
```

## Automated Testing

### Using Newman (Postman CLI)

```bash
# Install Newman
npm install -g newman

# Run Postman collection
newman run jobsdoor360.postman_collection.json \
  --environment jobsdoor360.postman_environment.json
```

### Integration with CI/CD

Add to your GitHub Actions or other CI/CD pipeline:

```yaml
- name: Test API Endpoints
  run: |
    npm run dev &
    sleep 10
    newman run jobsdoor360.postman_collection.json
```

## Monitoring and Logging

### Enable Request Logging

Add middleware to log all API requests:

```javascript
// In your Next.js middleware
console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
```

### Performance Monitoring

Track response times and error rates:

```bash
# Add timing to cURL requests
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:3000/api/jobs"
```

## Conclusion

This testing guide provides comprehensive coverage of all Jobsdoor360 backend endpoints. Use the provided scripts and collections to thoroughly test your API before deployment. Regular testing ensures reliability, security, and performance of your application.

For additional support or questions, refer to the API documentation or contact the development team.
