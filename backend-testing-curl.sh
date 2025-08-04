# Jobsdoor360 Backend API Testing with cURL Commands
# ===================================================
# This file contains cURL commands to test all API endpoints
# Replace {BASE_URL} with your actual base URL (e.g., http://localhost:3000)
# Replace {TOKEN} with actual JWT tokens obtained from authentication

# Set base URL as environment variable for convenience
export BASE_URL="http://localhost:3000"

# ===================================================
# AUTHENTICATION ENDPOINTS
# ===================================================

# 1. Register User (Candidate)
echo "=== Testing User Registration (Candidate) ==="
curl -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@test.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNo": "+1234567890",
    "role": "candidate"
  }'

# 2. Register User (Employer)
echo -e "\n=== Testing User Registration (Employer) ==="
curl -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employer@test.com",
    "password": "password123",
    "firstName": "Jane",
    "lastName": "Smith",
    "phoneNo": "+1234567891",
    "role": "employer"
  }'

# 3. Login User
echo -e "\n=== Testing User Login ==="
curl -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@test.com",
    "password": "password123"
  }'

# Save the token from login response for subsequent requests
# TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 4. Verify Email
echo -e "\n=== Testing Email Verification ==="
curl -X POST "${BASE_URL}/api/auth/verify" \
  -H "Content-Type: application/json" \
  -d '{
    "oobCode": "verification_code_from_email"
  }'

# 5. Resend Verification Email
echo -e "\n=== Testing Resend Verification ==="
curl -X POST "${BASE_URL}/api/auth/resend-verification" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{}'

# 6. Reset Password Request
echo -e "\n=== Testing Password Reset Request ==="
curl -X POST "${BASE_URL}/api/auth/reset-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@test.com"
  }'

# ===================================================
# USER PROFILE ENDPOINTS
# ===================================================

# 7. Get User Profile
echo -e "\n=== Testing Get User Profile ==="
curl -X GET "${BASE_URL}/api/users/profile" \
  -H "Authorization: Bearer {TOKEN}"

# 8. Update User Profile
echo -e "\n=== Testing Update User Profile ==="
curl -X PUT "${BASE_URL}/api/users/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "firstName": "John Updated",
    "lastName": "Doe Updated",
    "phoneNo": "+1234567892",
    "dob": "1990-01-15",
    "gender": "male"
  }'

# ===================================================
# JOB ENDPOINTS
# ===================================================

# 9. Get All Jobs (Public)
echo -e "\n=== Testing Get All Jobs ==="
curl -X GET "${BASE_URL}/api/jobs"

# 10. Get Jobs with Filters
echo -e "\n=== Testing Get Jobs with Filters ==="
curl -X GET "${BASE_URL}/api/jobs?query=developer&location=remote&type=full-time&page=1&limit=5"

# 11. Create Job (Employer only)
echo -e "\n=== Testing Create Job ==="
curl -X POST "${BASE_URL}/api/jobs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {EMPLOYER_TOKEN}" \
  -d '{
    "title": "Senior Frontend Developer",
    "description": "We are looking for a skilled frontend developer with React experience.",
    "requirements": [
      "3+ years React experience",
      "TypeScript knowledge",
      "UI/UX design skills"
    ],
    "type": "full-time",
    "location": "Remote",
    "salaryRange": {
      "min": 80000,
      "max": 120000,
      "currency": "USD"
    },
    "skills": ["React", "TypeScript", "CSS", "JavaScript"],
    "experience": "mid",
    "company": {
      "name": "Tech Solutions Inc",
      "description": "Leading technology company",
      "website": "https://techsolutions.com"
    },
    "benefits": ["Health Insurance", "Remote Work", "Flexible Hours"]
  }'

# 12. Get Single Job
echo -e "\n=== Testing Get Single Job ==="
curl -X GET "${BASE_URL}/api/jobs/{JOB_ID}"

# 13. Update Job (Employer only)
echo -e "\n=== Testing Update Job ==="
curl -X PUT "${BASE_URL}/api/jobs/{JOB_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {EMPLOYER_TOKEN}" \
  -d '{
    "title": "Senior Frontend Developer - Updated",
    "description": "Updated job description",
    "isActive": true
  }'

# 14. Delete Job (Employer only)
echo -e "\n=== Testing Delete Job ==="
curl -X DELETE "${BASE_URL}/api/jobs/{JOB_ID}" \
  -H "Authorization: Bearer {EMPLOYER_TOKEN}"

# ===================================================
# APPLICATION ENDPOINTS
# ===================================================

# 15. Apply for Job
echo -e "\n=== Testing Job Application ==="
curl -X POST "${BASE_URL}/api/applications" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {CANDIDATE_TOKEN}" \
  -d '{
    "jobId": "{JOB_ID}",
    "coverLetter": "I am very interested in this position and believe my skills align perfectly with your requirements."
  }'

# 16. Get User Applications
echo -e "\n=== Testing Get User Applications ==="
curl -X GET "${BASE_URL}/api/applications" \
  -H "Authorization: Bearer {CANDIDATE_TOKEN}"

# 17. Get Application by ID
echo -e "\n=== Testing Get Application by ID ==="
curl -X GET "${BASE_URL}/api/applications/{APPLICATION_ID}" \
  -H "Authorization: Bearer {TOKEN}"

# 18. Update Application Status (Employer only)
echo -e "\n=== Testing Update Application Status ==="
curl -X PUT "${BASE_URL}/api/applications/{APPLICATION_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {EMPLOYER_TOKEN}" \
  -d '{
    "status": "interview",
    "notes": "Candidate looks promising, scheduling interview"
  }'

# ===================================================
# ASSESSMENT ENDPOINTS
# ===================================================

# 19. Get All Assessments
echo -e "\n=== Testing Get All Assessments ==="
curl -X GET "${BASE_URL}/api/assessments" \
  -H "Authorization: Bearer {TOKEN}"

# 20. Create Assessment (Admin only)
echo -e "\n=== Testing Create Assessment ==="
curl -X POST "${BASE_URL}/api/assessments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {ADMIN_TOKEN}" \
  -d '{
    "title": "JavaScript Fundamentals",
    "description": "Test your basic JavaScript knowledge",
    "category": "programming",
    "difficulty": "beginner",
    "duration": 30,
    "questions": [
      {
        "question": "What is the output of console.log(typeof null)?",
        "type": "multiple-choice",
        "options": ["null", "undefined", "object", "boolean"],
        "correctAnswer": "object",
        "points": 5
      }
    ]
  }'

# 21. Get Single Assessment
echo -e "\n=== Testing Get Single Assessment ==="
curl -X GET "${BASE_URL}/api/assessments/{ASSESSMENT_ID}" \
  -H "Authorization: Bearer {TOKEN}"

# 22. Update Assessment (Admin only)
echo -e "\n=== Testing Update Assessment ==="
curl -X PUT "${BASE_URL}/api/assessments/{ASSESSMENT_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {ADMIN_TOKEN}" \
  -d '{
    "title": "JavaScript Fundamentals - Updated",
    "isActive": true
  }'

# 23. Delete Assessment (Admin only)
echo -e "\n=== Testing Delete Assessment ==="
curl -X DELETE "${BASE_URL}/api/assessments/{ASSESSMENT_ID}" \
  -H "Authorization: Bearer {ADMIN_TOKEN}"

# ===================================================
# USER ASSESSMENT ENDPOINTS
# ===================================================

# 24. Start Assessment
echo -e "\n=== Testing Start Assessment ==="
curl -X POST "${BASE_URL}/api/user-assessments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {CANDIDATE_TOKEN}" \
  -d '{
    "assessmentId": "{ASSESSMENT_ID}"
  }'

# 25. Submit Assessment
echo -e "\n=== Testing Submit Assessment ==="
curl -X PUT "${BASE_URL}/api/user-assessments/{USER_ASSESSMENT_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {CANDIDATE_TOKEN}" \
  -d '{
    "answers": [
      {
        "questionId": "{QUESTION_ID}",
        "answer": "object"
      }
    ]
  }'

# 26. Get User Assessment Results
echo -e "\n=== Testing Get User Assessment Results ==="
curl -X GET "${BASE_URL}/api/user-assessments/{USER_ASSESSMENT_ID}" \
  -H "Authorization: Bearer {TOKEN}"

# ===================================================
# FILE UPLOAD ENDPOINTS
# ===================================================

# 27. Upload Profile Image
echo -e "\n=== Testing Upload Profile Image ==="
curl -X POST "${BASE_URL}/api/upload/profile-image" \
  -H "Authorization: Bearer {TOKEN}" \
  -F "file=@/path/to/profile-image.jpg"

# 28. Upload CV/Resume
echo -e "\n=== Testing Upload CV ==="
curl -X POST "${BASE_URL}/api/upload/cv" \
  -H "Authorization: Bearer {CANDIDATE_TOKEN}" \
  -F "file=@/path/to/resume.pdf"

# 29. Upload Company Logo
echo -e "\n=== Testing Upload Company Logo ==="
curl -X POST "${BASE_URL}/api/upload/company-logo" \
  -H "Authorization: Bearer {EMPLOYER_TOKEN}" \
  -F "file=@/path/to/company-logo.png"

# ===================================================
# ADMIN ENDPOINTS
# ===================================================

# 30. Get Admin Stats
echo -e "\n=== Testing Get Admin Stats ==="
curl -X GET "${BASE_URL}/api/admin/stats" \
  -H "Authorization: Bearer {ADMIN_TOKEN}"

# 31. Get All Users (Admin only)
echo -e "\n=== Testing Get All Users ==="
curl -X GET "${BASE_URL}/api/admin/users" \
  -H "Authorization: Bearer {ADMIN_TOKEN}"

# 32. Update User Role (Admin only)
echo -e "\n=== Testing Update User Role ==="
curl -X PUT "${BASE_URL}/api/admin/users/{USER_ID}/role" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {ADMIN_TOKEN}" \
  -d '{
    "role": "employer"
  }'

# 33. Get Consultancy Requests (Admin only)
echo -e "\n=== Testing Get Consultancy Requests ==="
curl -X GET "${BASE_URL}/api/admin/consultancy" \
  -H "Authorization: Bearer {ADMIN_TOKEN}"

# 34. Create Consultancy Request
echo -e "\n=== Testing Create Consultancy Request ==="
curl -X POST "${BASE_URL}/api/admin/consultancy" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "type": "career",
    "message": "I need help with career planning",
    "contactInfo": {
      "email": "user@test.com",
      "phone": "+1234567890"
    }
  }'

# ===================================================
# BATCH TESTING SCRIPT
# ===================================================

echo -e "\n=== Running Batch Tests ==="

# Function to test endpoint and show response
test_endpoint() {
  local name="$1"
  local method="$2"
  local url="$3"
  local headers="$4"
  local data="$5"
  
  echo -e "\n--- Testing: $name ---"
  if [ -n "$data" ]; then
    curl -X "$method" "$url" $headers -d "$data" -w "\nStatus: %{http_code}\nTime: %{time_total}s\n"
  else
    curl -X "$method" "$url" $headers -w "\nStatus: %{http_code}\nTime: %{time_total}s\n"
  fi
}

# Health check endpoints
test_endpoint "Health Check" "GET" "${BASE_URL}/api/health" "" ""
test_endpoint "Get Jobs (Public)" "GET" "${BASE_URL}/api/jobs?limit=5" "" ""

# Authentication tests (replace with valid credentials)
test_endpoint "Login Test" "POST" "${BASE_URL}/api/auth/login" \
  "-H 'Content-Type: application/json'" \
  '{"email": "test@example.com", "password": "password123"}'

echo -e "\n=== Testing Complete ==="
echo "Remember to:"
echo "1. Replace {BASE_URL} with your actual server URL"
echo "2. Replace {TOKEN} placeholders with actual JWT tokens"
echo "3. Replace {ID} placeholders with actual resource IDs"
echo "4. Update file paths for upload tests"
echo "5. Use valid credentials for authentication tests"
