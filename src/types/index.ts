/**
 * TypeScript definitions for Jobsdoor360 Backend
 * Defines all data models and API interfaces
 */

export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName?: string;
  phoneNo?: string;
  dob?: string;
  gender?: "male" | "female" | "other";
  image?: string;
  cv?: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = "admin" | "employer" | "candidate" | "master_admin";

export interface Lead {
  full_name: string;
  phonenumber: string;
  email: string;
  applying_for?: string[];
  created_by?: string;
  created_datetime?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyEmail: string;
  location: string;
  type: JobType;
  salary?: string;
  stipend?: string;
  description: string;
  requirements: string[];
  benefits?: string[];
  post_date: string;
  last_date?: string;
  minimum_age?: number;
  maximum_age?: number;
  qualification_eligibility: string;
  job_link?: string;
  isActive: boolean;
  applicantCount: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export type JobType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship"
  | "government";

export interface JobApplication {
  id: string;
  jobId: string;
  applicantEmail: string;
  applicantName: string;
  status: ApplicationStatus;
  appliedAt: Date;
  cv?: string;
  coverLetter?: string;
  reviewedAt?: Date;
  reviewedBy?: string;
  notes?: string;
}

export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "rejected"
  | "hired";

export interface Assessment {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  questions: Question[];
  isActive: boolean;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type QuestionType =
  | "multiple_choice"
  | "multiple_select"
  | "true_false"
  | "text";

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface AssessmentQuestion {
  id: string;
  title: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface UserAssessment {
  id: string;
  assessmentId: string;
  userId: string;
  status: "in_progress" | "completed" | "abandoned";
  startedAt: Date;
  completedAt?: Date;
  timeLimit: number;
  answers: {
    questionId: string;
    answer: string | string[];
    answeredAt: Date;
  }[];
  score: number;
  passed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentResult {
  score: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  assessmentId: string;
  completedAt: Date;
}

export interface ConsultancyRemark {
  remark: string;
  date: Date;
  addedBy: string;
}

export interface UserConsultancy {
  userId: string;
  remarks: ConsultancyRemark[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request/Response DTOs
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phoneNo: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface CreateJobRequest {
  title: string;
  company: string;
  location: string;
  type: JobType;
  salary?: string;
  stipend?: string;
  description: string;
  requirements: string[];
  benefits?: string[];
  last_date?: string;
  minimum_age?: number;
  maximum_age?: number;
  qualification_eligibility: string;
  job_link?: string;
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {
  isActive?: boolean;
}

// Assessment DTOs
export interface CreateAssessmentDTO {
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number;
  passingScore: number;
  questions: Omit<Question, "id">[];
  isActive?: boolean;
  tags?: string[];
}

export interface UpdateAssessmentDTO {
  title?: string;
  description?: string;
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
  timeLimit?: number;
  passingScore?: number;
  questions?: Question[];
  isActive?: boolean;
  tags?: string[];
}

export interface CreateApplicationRequest {
  jobId: string;
  coverLetter?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNo?: string;
  dob?: string;
  gender?: "male" | "female" | "other";
}

export interface CreateAssessmentRequest {
  title: string;
  description: string;
  timeLimit: number;
  questions: Omit<AssessmentQuestion, "id">[];
}

export interface SubmitAssessmentRequest {
  assessmentId: string;
  answers: Record<string, number>;
  timeSpent: number;
}

// Firebase Custom Claims
export interface CustomClaims {
  role: UserRole;
  emailVerified: boolean;
}

// Firestore Document References
export interface FirestoreCollections {
  users: "users";
  leads: "leads";
  jobs: "jobs";
  applications: "applications";
  assessments: "assessments";
  assessment_results: "assessment_results";
  user_consultancies: "user_consultancies";
  login_roles: "login_roles";
}

// File Upload Types
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
}

// Admin Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  totalAssessments: number;
  recentUsers: User[];
  recentJobs: Job[];
  recentApplications: JobApplication[];
}

// Search and Filter Types
export interface JobSearchFilters {
  query?: string;
  location?: string;
  type?: JobType;
  company?: string;
  minSalary?: number;
  maxSalary?: number;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface UserSearchFilters {
  query?: string;
  role?: UserRole;
  emailVerified?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

// Middleware Types
export interface AuthenticatedRequest extends Request {
  user: User;
}

export interface RequestWithUser {
  user: User;
}

// Error Types
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// Rate Limiting Types
export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
}
