/**
 * Zod Validation Schemas for Jobsdoor360 API
 * Provides type-safe validation for all API endpoints
 */

import { z } from "zod";
import { UserRole, JobType, ApplicationStatus } from "@/types";

// User validation schemas
export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  lastName: z.string().max(50, "Last name too long").optional(),
  phoneNo: z
    .string()
    .regex(/^[+]?[1-9][\d\s\-\(\)]{7,15}$/, "Invalid phone number format"),
  role: z
    .enum(["admin", "employer", "candidate", "master_admin"])
    .optional()
    .default("candidate"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long")
    .optional(),
  lastName: z.string().max(50, "Last name too long").optional(),
  phoneNo: z
    .string()
    .regex(/^[+]?[1-9][\d\s\-\(\)]{7,15}$/, "Invalid phone number format")
    .optional(),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
});

export const passwordResetSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Job validation schemas
export const createJobSchema = z
  .object({
    title: z
      .string()
      .min(1, "Job title is required")
      .max(200, "Title too long"),
    company: z
      .string()
      .min(1, "Company name is required")
      .max(100, "Company name too long"),
    location: z
      .string()
      .min(1, "Location is required")
      .max(100, "Location too long"),
    type: z.enum([
      "full-time",
      "part-time",
      "contract",
      "internship",
      "government",
    ]),
    salary: z.string().max(50, "Salary text too long").optional(),
    stipend: z.string().max(50, "Stipend text too long").optional(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(5000, "Description too long"),
    requirements: z
      .array(z.string().min(1, "Requirement cannot be empty"))
      .min(1, "At least one requirement is needed"),
    benefits: z.array(z.string().min(1, "Benefit cannot be empty")).optional(),
    last_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .optional(),
    minimum_age: z
      .number()
      .min(16, "Minimum age must be at least 16")
      .max(100, "Invalid minimum age")
      .optional(),
    maximum_age: z
      .number()
      .min(16, "Maximum age must be at least 16")
      .max(100, "Invalid maximum age")
      .optional(),
    qualification_eligibility: z
      .string()
      .min(1, "Qualification eligibility is required")
      .max(500, "Text too long"),
    job_link: z.string().url("Invalid URL format").optional(),
  })
  .refine(
    (data) => {
      if (data.minimum_age && data.maximum_age) {
        return data.minimum_age <= data.maximum_age;
      }
      return true;
    },
    {
      message: "Maximum age must be greater than or equal to minimum age",
      path: ["maximum_age"],
    }
  );

export const updateJobSchema = z
  .object({
    title: z
      .string()
      .min(1, "Job title is required")
      .max(200, "Title too long")
      .optional(),
    company: z
      .string()
      .min(1, "Company name is required")
      .max(100, "Company name too long")
      .optional(),
    location: z
      .string()
      .min(1, "Location is required")
      .max(100, "Location too long")
      .optional(),
    type: z
      .enum(["full-time", "part-time", "contract", "internship", "government"])
      .optional(),
    salary: z.string().max(50, "Salary text too long").optional(),
    stipend: z.string().max(50, "Stipend text too long").optional(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(5000, "Description too long")
      .optional(),
    requirements: z
      .array(z.string().min(1, "Requirement cannot be empty"))
      .min(1, "At least one requirement is needed")
      .optional(),
    benefits: z.array(z.string().min(1, "Benefit cannot be empty")).optional(),
    last_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .optional(),
    minimum_age: z
      .number()
      .min(16, "Minimum age must be at least 16")
      .max(100, "Invalid minimum age")
      .optional(),
    maximum_age: z
      .number()
      .min(16, "Maximum age must be at least 16")
      .max(100, "Invalid maximum age")
      .optional(),
    qualification_eligibility: z
      .string()
      .min(1, "Qualification eligibility is required")
      .max(500, "Text too long")
      .optional(),
    job_link: z.string().url("Invalid URL format").optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.minimum_age && data.maximum_age) {
        return data.minimum_age <= data.maximum_age;
      }
      return true;
    },
    {
      message: "Maximum age must be greater than or equal to minimum age",
      path: ["maximum_age"],
    }
  );

export const jobSearchSchema = z
  .object({
    query: z.string().optional(),
    location: z.string().optional(),
    type: z
      .enum(["full-time", "part-time", "contract", "internship", "government"])
      .optional(),
    company: z.string().optional(),
    minSalary: z.number().min(0).optional(),
    maxSalary: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
  })
  .refine(
    (data) => {
      if (data.minSalary && data.maxSalary) {
        return data.minSalary <= data.maxSalary;
      }
      return true;
    },
    {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["maxSalary"],
    }
  );

// Application validation schemas
export const createApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  coverLetter: z.string().max(2000, "Cover letter too long").optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["pending", "reviewed", "shortlisted", "rejected", "hired"]),
  notes: z.string().max(1000, "Notes too long").optional(),
});

// Assessment validation schemas
export const createAssessmentSchema = z.object({
  title: z
    .string()
    .min(1, "Assessment title is required")
    .max(200, "Title too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description too long"),
  category: z.string().min(1, "Category is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  timeLimit: z
    .number()
    .min(1, "Time limit must be at least 1 minute")
    .max(300, "Time limit cannot exceed 5 hours"),
  passingScore: z
    .number()
    .min(1, "Passing score must be at least 1%")
    .max(100, "Passing score cannot exceed 100%"),
  questions: z
    .array(
      z.object({
        type: z.enum([
          "multiple_choice",
          "multiple_select",
          "true_false",
          "text",
        ]),
        question: z
          .string()
          .min(1, "Question is required")
          .max(500, "Question too long"),
        options: z
          .array(z.string().min(1, "Option cannot be empty"))
          .optional(),
        correctAnswer: z.union([z.string(), z.array(z.string())]),
        explanation: z.string().optional(),
        points: z.number().min(1, "Points must be at least 1").default(1),
      })
    )
    .min(1, "At least one question is required"),
  isActive: z.boolean().optional().default(true),
  tags: z.array(z.string()).optional().default([]),
});

export const updateAssessmentSchema = z.object({
  title: z
    .string()
    .min(1, "Assessment title is required")
    .max(200, "Title too long")
    .optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description too long")
    .optional(),
  category: z.string().min(1, "Category is required").optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  timeLimit: z
    .number()
    .min(1, "Time limit must be at least 1 minute")
    .max(300, "Time limit cannot exceed 5 hours")
    .optional(),
  passingScore: z
    .number()
    .min(1, "Passing score must be at least 1%")
    .max(100, "Passing score cannot exceed 100%")
    .optional(),
  questions: z
    .array(
      z.object({
        id: z.string(), // Include id for updates
        type: z.enum([
          "multiple_choice",
          "multiple_select",
          "true_false",
          "text",
        ]),
        question: z
          .string()
          .min(1, "Question is required")
          .max(500, "Question too long"),
        options: z
          .array(z.string().min(1, "Option cannot be empty"))
          .optional(),
        correctAnswer: z.union([z.string(), z.array(z.string())]),
        explanation: z.string().optional(),
        points: z.number().min(1, "Points must be at least 1").default(1),
      })
    )
    .optional(),
  isActive: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export const submitAssessmentSchema = z.object({
  assessmentId: z.string().min(1, "Assessment ID is required"),
  answers: z.record(z.string(), z.number().min(0)),
  timeSpent: z.number().min(0, "Time spent cannot be negative"),
});

export const submitAnswerSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
  answer: z.union([z.string(), z.array(z.string())]),
});

// Admin validation schemas
export const userSearchSchema = z.object({
  query: z.string().optional(),
  role: z.enum(["admin", "employer", "candidate", "master_admin"]).optional(),
  emailVerified: z.boolean().optional(),
  createdAfter: z.string().datetime().optional(),
  createdBefore: z.string().datetime().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export const addConsultancyRemarkSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  remark: z.string().min(1, "Remark is required").max(1000, "Remark too long"),
});

export const updateUserRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["admin", "employer", "candidate", "master_admin"]),
});

// File upload validation schemas
export const fileUploadSchema = z.object({
  fileType: z.enum(["cv", "profile-image", "company-logo"]),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB default
});

// Common validation schemas
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export const idParamSchema = z.object({
  id: z.string().min(1, "ID parameter is required"),
});

export const emailParamSchema = z.object({
  email: z.string().email("Invalid email format"),
});

// Query parameter validation
export const queryParamsSchema = z
  .object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10)),
    sort: z.string().optional(),
    order: z.enum(["asc", "desc"]).default("desc"),
  })
  .refine(
    (data) => {
      return data.page >= 1 && data.limit >= 1 && data.limit <= 100;
    },
    {
      message: "Invalid pagination parameters",
    }
  );

// Validation helper function
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      return { success: false, errors };
    }
    return { success: false, errors: ["Validation failed"] };
  }
}

// Type exports for better IntelliSense
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type JobSearchInput = z.infer<typeof jobSearchSchema>;
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<
  typeof updateApplicationStatusSchema
>;
export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;
export type SubmitAssessmentInput = z.infer<typeof submitAssessmentSchema>;
export type UserSearchInput = z.infer<typeof userSearchSchema>;
export type AddConsultancyRemarkInput = z.infer<
  typeof addConsultancyRemarkSchema
>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
