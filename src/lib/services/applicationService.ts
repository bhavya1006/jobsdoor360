/**
 * Application Service - Handles all job application-related database operations
 * Provides abstraction layer for application management with Firestore
 */

import { adminDb } from "@/lib/firebase-admin";
import * as admin from "firebase-admin";
import {
  JobApplication,
  ApplicationStatus,
  CreateApplicationRequest,
} from "@/types";
import { CustomError, generateId } from "@/lib/utils";
import { jobService } from "./jobService";
import { userService } from "./userService";

export class ApplicationService {
  private readonly applicationsCollection = "applications";
  private readonly jobsAppliedCollection = "jobs_applied";

  /**
   * Create a new job application
   */
  async createApplication(
    applicationData: CreateApplicationRequest,
    applicantEmail: string
  ): Promise<JobApplication> {
    try {
      // Check if job exists and is active
      const job = await jobService.getJobById(applicationData.jobId);
      if (!job) {
        throw new CustomError("Job not found", 404);
      }

      if (!job.isActive) {
        throw new CustomError("Job is no longer active", 400);
      }

      // Check if user already applied for this job
      const existingApplication = await this.getApplicationByJobAndUser(
        applicationData.jobId,
        applicantEmail
      );

      if (existingApplication) {
        throw new CustomError("You have already applied for this job", 400);
      }

      // Get user details
      const user = await userService.getUserByEmail(applicantEmail);
      if (!user) {
        throw new CustomError("User not found", 404);
      }

      const applicationId = generateId();
      const now = new Date();

      const application: JobApplication = {
        id: applicationId,
        jobId: applicationData.jobId,
        applicantEmail,
        applicantName: `${user.firstName} ${user.lastName || ""}`.trim(),
        status: "pending",
        appliedAt: now,
        cv: user.cv,
        coverLetter: applicationData.coverLetter,
      };

      // Save application
      await adminDb
        .collection(this.applicationsCollection)
        .doc(applicationId)
        .set(application);

      // Update user's applied jobs
      const userAppliedRef = adminDb
        .collection(this.jobsAppliedCollection)
        .doc(applicantEmail);
      const userAppliedDoc = await userAppliedRef.get();

      const applicationInfo = {
        jobId: applicationData.jobId,
        applicationId,
        timestamp: now,
      };

      if (userAppliedDoc.exists) {
        await userAppliedRef.update({
          appliedJobs: admin.firestore.FieldValue.arrayUnion(applicationInfo),
        });
      } else {
        await userAppliedRef.set({
          appliedJobs: [applicationInfo],
        });
      }

      // Update job applicant count
      await jobService.updateApplicantCount(applicationData.jobId, 1);

      return application;
    } catch (error) {
      console.error("Error creating application:", error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to create application", 500);
    }
  }

  /**
   * Get application by ID
   */
  async getApplicationById(
    applicationId: string
  ): Promise<JobApplication | null> {
    try {
      const applicationDoc = await adminDb
        .collection(this.applicationsCollection)
        .doc(applicationId)
        .get();

      if (!applicationDoc.exists) {
        return null;
      }

      const applicationData = applicationDoc.data();
      return {
        id: applicationDoc.id,
        jobId: applicationData?.jobId || "",
        applicantEmail: applicationData?.applicantEmail || "",
        applicantName: applicationData?.applicantName || "",
        status: applicationData?.status || "pending",
        appliedAt: applicationData?.appliedAt?.toDate() || new Date(),
        cv: applicationData?.cv,
        coverLetter: applicationData?.coverLetter,
        reviewedAt: applicationData?.reviewedAt?.toDate(),
        reviewedBy: applicationData?.reviewedBy,
        notes: applicationData?.notes,
      };
    } catch (error) {
      console.error("Error getting application by ID:", error);
      throw new CustomError("Failed to get application", 500);
    }
  }

  /**
   * Get application by job and user
   */
  async getApplicationByJobAndUser(
    jobId: string,
    applicantEmail: string
  ): Promise<JobApplication | null> {
    try {
      const snapshot = await adminDb
        .collection(this.applicationsCollection)
        .where("jobId", "==", jobId)
        .where("applicantEmail", "==", applicantEmail)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const applicationData = doc.data();

      return {
        id: doc.id,
        jobId: applicationData.jobId || "",
        applicantEmail: applicationData.applicantEmail || "",
        applicantName: applicationData.applicantName || "",
        status: applicationData.status || "pending",
        appliedAt: applicationData.appliedAt?.toDate() || new Date(),
        cv: applicationData.cv,
        coverLetter: applicationData.coverLetter,
        reviewedAt: applicationData.reviewedAt?.toDate(),
        reviewedBy: applicationData.reviewedBy,
        notes: applicationData.notes,
      };
    } catch (error) {
      console.error("Error getting application by job and user:", error);
      throw new CustomError("Failed to get application", 500);
    }
  }

  /**
   * Update application status
   */
  async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
    reviewedBy: string,
    notes?: string
  ): Promise<JobApplication> {
    try {
      const existingApplication = await this.getApplicationById(applicationId);
      if (!existingApplication) {
        throw new CustomError("Application not found", 404);
      }

      const updateData = {
        status,
        reviewedAt: new Date(),
        reviewedBy,
        notes,
      };

      await adminDb
        .collection(this.applicationsCollection)
        .doc(applicationId)
        .update(updateData);

      const updatedApplication = await this.getApplicationById(applicationId);
      if (!updatedApplication) {
        throw new CustomError("Application not found after update", 404);
      }

      return updatedApplication;
    } catch (error) {
      console.error("Error updating application status:", error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to update application status", 500);
    }
  }

  /**
   * Get applications for a job
   */
  async getApplicationsForJob(
    jobId: string,
    status?: ApplicationStatus,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    applications: JobApplication[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      let query = adminDb
        .collection(this.applicationsCollection)
        .where("jobId", "==", jobId) as any;

      if (status) {
        query = query.where("status", "==", status);
      }

      // Get total count
      const totalSnapshot = await query.get();
      const total = totalSnapshot.size;

      // Apply pagination
      const offset = (page - 1) * limit;
      query = query.orderBy("appliedAt", "desc").limit(limit).offset(offset);

      const snapshot = await query.get();
      const applications: JobApplication[] = [];

      snapshot.forEach((doc: any) => {
        const applicationData = doc.data();
        applications.push({
          id: doc.id,
          jobId: applicationData.jobId || "",
          applicantEmail: applicationData.applicantEmail || "",
          applicantName: applicationData.applicantName || "",
          status: applicationData.status || "pending",
          appliedAt: applicationData.appliedAt?.toDate() || new Date(),
          cv: applicationData.cv,
          coverLetter: applicationData.coverLetter,
          reviewedAt: applicationData.reviewedAt?.toDate(),
          reviewedBy: applicationData.reviewedBy,
          notes: applicationData.notes,
        });
      });

      return {
        applications,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Error getting applications for job:", error);
      throw new CustomError("Failed to get job applications", 500);
    }
  }

  /**
   * Get applications by user
   */
  async getApplicationsByUser(
    applicantEmail: string,
    status?: ApplicationStatus,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    applications: JobApplication[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      let query = adminDb
        .collection(this.applicationsCollection)
        .where("applicantEmail", "==", applicantEmail) as any;

      if (status) {
        query = query.where("status", "==", status);
      }

      // Get total count
      const totalSnapshot = await query.get();
      const total = totalSnapshot.size;

      // Apply pagination
      const offset = (page - 1) * limit;
      query = query.orderBy("appliedAt", "desc").limit(limit).offset(offset);

      const snapshot = await query.get();
      const applications: JobApplication[] = [];

      snapshot.forEach((doc: any) => {
        const applicationData = doc.data();
        applications.push({
          id: doc.id,
          jobId: applicationData.jobId || "",
          applicantEmail: applicationData.applicantEmail || "",
          applicantName: applicationData.applicantName || "",
          status: applicationData.status || "pending",
          appliedAt: applicationData.appliedAt?.toDate() || new Date(),
          cv: applicationData.cv,
          coverLetter: applicationData.coverLetter,
          reviewedAt: applicationData.reviewedAt?.toDate(),
          reviewedBy: applicationData.reviewedBy,
          notes: applicationData.notes,
        });
      });

      return {
        applications,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Error getting applications by user:", error);
      throw new CustomError("Failed to get user applications", 500);
    }
  }

  /**
   * Get applications by company
   */
  async getApplicationsByCompany(
    companyEmail: string,
    status?: ApplicationStatus,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    applications: JobApplication[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      // First get all jobs by the company
      const companyJobs = await jobService.getJobsByCompany(companyEmail);
      const jobIds = companyJobs.map((job) => job.id);

      if (jobIds.length === 0) {
        return {
          applications: [],
          total: 0,
          page,
          totalPages: 0,
        };
      }

      // Get applications for these jobs
      let query = adminDb
        .collection(this.applicationsCollection)
        .where("jobId", "in", jobIds) as any;

      if (status) {
        query = query.where("status", "==", status);
      }

      // Get total count
      const totalSnapshot = await query.get();
      const total = totalSnapshot.size;

      // Apply pagination
      const offset = (page - 1) * limit;
      query = query.orderBy("appliedAt", "desc").limit(limit).offset(offset);

      const snapshot = await query.get();
      const applications: JobApplication[] = [];

      snapshot.forEach((doc: any) => {
        const applicationData = doc.data();
        applications.push({
          id: doc.id,
          jobId: applicationData.jobId || "",
          applicantEmail: applicationData.applicantEmail || "",
          applicantName: applicationData.applicantName || "",
          status: applicationData.status || "pending",
          appliedAt: applicationData.appliedAt?.toDate() || new Date(),
          cv: applicationData.cv,
          coverLetter: applicationData.coverLetter,
          reviewedAt: applicationData.reviewedAt?.toDate(),
          reviewedBy: applicationData.reviewedBy,
          notes: applicationData.notes,
        });
      });

      return {
        applications,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Error getting applications by company:", error);
      throw new CustomError("Failed to get company applications", 500);
    }
  }

  /**
   * Delete application
   */
  async deleteApplication(applicationId: string): Promise<void> {
    try {
      const application = await this.getApplicationById(applicationId);
      if (!application) {
        throw new CustomError("Application not found", 404);
      }

      // Delete application document
      await adminDb
        .collection(this.applicationsCollection)
        .doc(applicationId)
        .delete();

      // Remove from user's applied jobs
      const userAppliedRef = adminDb
        .collection(this.jobsAppliedCollection)
        .doc(application.applicantEmail);
      const userAppliedDoc = await userAppliedRef.get();

      if (userAppliedDoc.exists) {
        const data = userAppliedDoc.data();
        const appliedJobs = data?.appliedJobs || [];
        const updatedAppliedJobs = appliedJobs.filter(
          (job: any) => job.applicationId !== applicationId
        );

        await userAppliedRef.update({
          appliedJobs: updatedAppliedJobs,
        });
      }

      // Decrease job applicant count
      await jobService.updateApplicantCount(application.jobId, -1);
    } catch (error) {
      console.error("Error deleting application:", error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to delete application", 500);
    }
  }

  /**
   * Get application statistics
   */
  async getApplicationStats(): Promise<{
    totalApplications: number;
    applicationsByStatus: Record<ApplicationStatus, number>;
    recentApplications: JobApplication[];
  }> {
    try {
      const applicationsSnapshot = await adminDb
        .collection(this.applicationsCollection)
        .get();
      const applications: JobApplication[] = [];

      applicationsSnapshot.forEach((doc: any) => {
        const applicationData = doc.data();
        applications.push({
          id: doc.id,
          jobId: applicationData.jobId || "",
          applicantEmail: applicationData.applicantEmail || "",
          applicantName: applicationData.applicantName || "",
          status: applicationData.status || "pending",
          appliedAt: applicationData.appliedAt?.toDate() || new Date(),
          cv: applicationData.cv,
          coverLetter: applicationData.coverLetter,
          reviewedAt: applicationData.reviewedAt?.toDate(),
          reviewedBy: applicationData.reviewedBy,
          notes: applicationData.notes,
        });
      });

      const totalApplications = applications.length;

      const applicationsByStatus: Record<ApplicationStatus, number> = {
        pending: 0,
        reviewed: 0,
        shortlisted: 0,
        rejected: 0,
        hired: 0,
      };

      applications.forEach((application) => {
        applicationsByStatus[application.status]++;
      });

      const recentApplications = applications
        .sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime())
        .slice(0, 5);

      return {
        totalApplications,
        applicationsByStatus,
        recentApplications,
      };
    } catch (error) {
      console.error("Error getting application stats:", error);
      throw new CustomError("Failed to get application statistics", 500);
    }
  }

  /**
   * Get user's applied jobs (simplified view)
   */
  async getUserAppliedJobs(userEmail: string): Promise<any[]> {
    try {
      const userAppliedDoc = await adminDb
        .collection(this.jobsAppliedCollection)
        .doc(userEmail)
        .get();

      if (!userAppliedDoc.exists) {
        return [];
      }

      const data = userAppliedDoc.data();
      return data?.appliedJobs || [];
    } catch (error) {
      console.error("Error getting user applied jobs:", error);
      throw new CustomError("Failed to get applied jobs", 500);
    }
  }
}

// Export singleton instance
export const applicationService = new ApplicationService();
