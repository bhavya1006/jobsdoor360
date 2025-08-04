# Jobsdoor360 Backend API Testing with PowerShell
# ================================================
# This file contains PowerShell commands to test all API endpoints
# Replace $BASE_URL with your actual base URL (e.g., http://localhost:3000)
# Replace $TOKEN with actual JWT tokens obtained from authentication

# Set base URL
$BASE_URL = "http://localhost:3000"

# Function to make HTTP requests with error handling
function Invoke-ApiTest {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Uri,
        [hashtable]$Headers = @{},
        [object]$Body = $null
    )
    
    Write-Host "`n=== Testing: $Name ===" -ForegroundColor Green
    
    try {
        $params = @{
            Uri = $Uri
            Method = $Method
            Headers = $Headers
        }
        
        if ($Body) {
            $params.Body = $Body | ConvertTo-Json -Depth 10
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "✅ Success: $Name" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 5
    }
    catch {
        Write-Host "❌ Error: $Name" -ForegroundColor Red
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# ===================================================
# AUTHENTICATION ENDPOINTS
# ===================================================

# 1. Register User (Candidate)
Invoke-ApiTest -Name "User Registration (Candidate)" -Method "POST" -Uri "$BASE_URL/api/auth/register" -Body @{
    email = "candidate@test.com"
    password = "password123"
    firstName = "John"
    lastName = "Doe"
    phoneNo = "+1234567890"
    role = "candidate"
}

# 2. Register User (Employer)
Invoke-ApiTest -Name "User Registration (Employer)" -Method "POST" -Uri "$BASE_URL/api/auth/register" -Body @{
    email = "employer@test.com"
    password = "password123"
    firstName = "Jane"
    lastName = "Smith"
    phoneNo = "+1234567891"
    role = "employer"
}

# 3. Login User
$loginResponse = Invoke-ApiTest -Name "User Login" -Method "POST" -Uri "$BASE_URL/api/auth/login" -Body @{
    email = "candidate@test.com"
    password = "password123"
}

# Extract token from login response (update this based on your API response structure)
# $TOKEN = $loginResponse.token

# For testing purposes, use a placeholder token
$TOKEN = "YOUR_JWT_TOKEN_HERE"
$EMPLOYER_TOKEN = "YOUR_EMPLOYER_JWT_TOKEN_HERE"
$ADMIN_TOKEN = "YOUR_ADMIN_JWT_TOKEN_HERE"

# 4. Verify Email
Invoke-ApiTest -Name "Email Verification" -Method "POST" -Uri "$BASE_URL/api/auth/verify" -Body @{
    oobCode = "verification_code_from_email"
}

# 5. Resend Verification Email
Invoke-ApiTest -Name "Resend Verification" -Method "POST" -Uri "$BASE_URL/api/auth/resend-verification" -Headers @{
    Authorization = "Bearer $TOKEN"
}

# 6. Reset Password Request
Invoke-ApiTest -Name "Password Reset Request" -Method "POST" -Uri "$BASE_URL/api/auth/reset-password" -Body @{
    email = "candidate@test.com"
}

# ===================================================
# USER PROFILE ENDPOINTS
# ===================================================

# 7. Get User Profile
Invoke-ApiTest -Name "Get User Profile" -Method "GET" -Uri "$BASE_URL/api/users/profile" -Headers @{
    Authorization = "Bearer $TOKEN"
}

# 8. Update User Profile
Invoke-ApiTest -Name "Update User Profile" -Method "PUT" -Uri "$BASE_URL/api/users/profile" -Headers @{
    Authorization = "Bearer $TOKEN"
} -Body @{
    firstName = "John Updated"
    lastName = "Doe Updated"
    phoneNo = "+1234567892"
    dob = "1990-01-15"
    gender = "male"
}

# ===================================================
# JOB ENDPOINTS
# ===================================================

# 9. Get All Jobs (Public)
Invoke-ApiTest -Name "Get All Jobs" -Method "GET" -Uri "$BASE_URL/api/jobs"

# 10. Get Jobs with Filters
Invoke-ApiTest -Name "Get Jobs with Filters" -Method "GET" -Uri "$BASE_URL/api/jobs?query=developer&location=remote&type=full-time&page=1&limit=5"

# 11. Create Job (Employer only)
Invoke-ApiTest -Name "Create Job" -Method "POST" -Uri "$BASE_URL/api/jobs" -Headers @{
    Authorization = "Bearer $EMPLOYER_TOKEN"
} -Body @{
    title = "Senior Frontend Developer"
    description = "We are looking for a skilled frontend developer with React experience."
    requirements = @("3+ years React experience", "TypeScript knowledge", "UI/UX design skills")
    type = "full-time"
    location = "Remote"
    salaryRange = @{
        min = 80000
        max = 120000
        currency = "USD"
    }
    skills = @("React", "TypeScript", "CSS", "JavaScript")
    experience = "mid"
    company = @{
        name = "Tech Solutions Inc"
        description = "Leading technology company"
        website = "https://techsolutions.com"
    }
    benefits = @("Health Insurance", "Remote Work", "Flexible Hours")
}

# 12. Get Single Job (replace JOB_ID with actual ID)
$JOB_ID = "your_job_id_here"
Invoke-ApiTest -Name "Get Single Job" -Method "GET" -Uri "$BASE_URL/api/jobs/$JOB_ID"

# 13. Update Job (Employer only)
Invoke-ApiTest -Name "Update Job" -Method "PUT" -Uri "$BASE_URL/api/jobs/$JOB_ID" -Headers @{
    Authorization = "Bearer $EMPLOYER_TOKEN"
} -Body @{
    title = "Senior Frontend Developer - Updated"
    description = "Updated job description"
    isActive = $true
}

# ===================================================
# APPLICATION ENDPOINTS
# ===================================================

# 15. Apply for Job
Invoke-ApiTest -Name "Job Application" -Method "POST" -Uri "$BASE_URL/api/applications" -Headers @{
    Authorization = "Bearer $TOKEN"
} -Body @{
    jobId = $JOB_ID
    coverLetter = "I am very interested in this position and believe my skills align perfectly with your requirements."
}

# 16. Get User Applications
Invoke-ApiTest -Name "Get User Applications" -Method "GET" -Uri "$BASE_URL/api/applications" -Headers @{
    Authorization = "Bearer $TOKEN"
}

# ===================================================
# ASSESSMENT ENDPOINTS
# ===================================================

# 19. Get All Assessments
Invoke-ApiTest -Name "Get All Assessments" -Method "GET" -Uri "$BASE_URL/api/assessments" -Headers @{
    Authorization = "Bearer $TOKEN"
}

# 20. Create Assessment (Admin only)
Invoke-ApiTest -Name "Create Assessment" -Method "POST" -Uri "$BASE_URL/api/assessments" -Headers @{
    Authorization = "Bearer $ADMIN_TOKEN"
} -Body @{
    title = "JavaScript Fundamentals"
    description = "Test your basic JavaScript knowledge"
    category = "programming"
    difficulty = "beginner"
    duration = 30
    questions = @(
        @{
            question = "What is the output of console.log(typeof null)?"
            type = "multiple-choice"
            options = @("null", "undefined", "object", "boolean")
            correctAnswer = "object"
            points = 5
        }
    )
}

# ===================================================
# FILE UPLOAD ENDPOINTS (using Invoke-WebRequest for file uploads)
# ===================================================

# 27. Upload Profile Image
function Test-FileUpload {
    param(
        [string]$Name,
        [string]$Uri,
        [string]$FilePath,
        [string]$Token
    )
    
    Write-Host "`n=== Testing: $Name ===" -ForegroundColor Green
    
    try {
        if (Test-Path $FilePath) {
            $response = Invoke-WebRequest -Uri $Uri -Method POST -Headers @{
                Authorization = "Bearer $Token"
            } -InFile $FilePath -ContentType "multipart/form-data"
            
            Write-Host "✅ Success: $Name" -ForegroundColor Green
            $response.Content
        } else {
            Write-Host "❌ File not found: $FilePath" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "❌ Error: $Name" -ForegroundColor Red
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Example file upload tests (update file paths as needed)
# Test-FileUpload -Name "Upload Profile Image" -Uri "$BASE_URL/api/upload/profile-image" -FilePath "C:\path\to\profile.jpg" -Token $TOKEN
# Test-FileUpload -Name "Upload CV" -Uri "$BASE_URL/api/upload/cv" -FilePath "C:\path\to\resume.pdf" -Token $TOKEN

# ===================================================
# ADMIN ENDPOINTS
# ===================================================

# 30. Get Admin Stats
Invoke-ApiTest -Name "Get Admin Stats" -Method "GET" -Uri "$BASE_URL/api/admin/stats" -Headers @{
    Authorization = "Bearer $ADMIN_TOKEN"
}

# 31. Get All Users (Admin only)
Invoke-ApiTest -Name "Get All Users" -Method "GET" -Uri "$BASE_URL/api/admin/users" -Headers @{
    Authorization = "Bearer $ADMIN_TOKEN"
}

# 34. Create Consultancy Request
Invoke-ApiTest -Name "Create Consultancy Request" -Method "POST" -Uri "$BASE_URL/api/admin/consultancy" -Headers @{
    Authorization = "Bearer $TOKEN"
} -Body @{
    type = "career"
    message = "I need help with career planning"
    contactInfo = @{
        email = "user@test.com"
        phone = "+1234567890"
    }
}

# ===================================================
# BATCH TESTING FUNCTION
# ===================================================

function Start-ApiTesting {
    Write-Host "`n🚀 Starting Jobsdoor360 API Testing..." -ForegroundColor Cyan
    
    # Test basic endpoints that don't require authentication
    Write-Host "`n📋 Testing Public Endpoints..." -ForegroundColor Yellow
    Invoke-ApiTest -Name "Get Jobs (Public)" -Method "GET" -Uri "$BASE_URL/api/jobs?limit=5"
    
    # Test authentication
    Write-Host "`n🔐 Testing Authentication..." -ForegroundColor Yellow
    # Add your authentication tests here
    
    # Test protected endpoints
    Write-Host "`n🔒 Testing Protected Endpoints..." -ForegroundColor Yellow
    # Add your protected endpoint tests here
    
    Write-Host "`n✅ API Testing Complete!" -ForegroundColor Green
    Write-Host "Remember to:" -ForegroundColor Yellow
    Write-Host "1. Update BASE_URL with your actual server URL" -ForegroundColor Yellow
    Write-Host "2. Replace token placeholders with actual JWT tokens" -ForegroundColor Yellow
    Write-Host "3. Replace ID placeholders with actual resource IDs" -ForegroundColor Yellow
    Write-Host "4. Update file paths for upload tests" -ForegroundColor Yellow
}

# Uncomment to run all tests
# Start-ApiTesting

Write-Host "`n📝 PowerShell testing script loaded!" -ForegroundColor Green
Write-Host "Run individual tests or call Start-ApiTesting to run all tests" -ForegroundColor Cyan
