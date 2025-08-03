/**
 * Job Service - Handles all job-related database operations
 * Provides abstraction layer for job management with Firestore
 */

import { adminDb } from "@/lib/firebase-admin";
import * as admin from "firebase-admin";
import {
  Job,
  JobType,
  CreateJobRequest,
  UpdateJobRequest,
  JobSearchFilters,
} from "@/types";
import {
  CustomError,
  generateId,
  removeUndefinedProperties,
} from "@/lib/utils";

export class JobService {
  private readonly jobsCollection = "jobs";
  private readonly companyJobsCollection = "jobs_company_wise";

  /**
   * Create a new job posting
   */
  async createJob(
    jobData: CreateJobRequest,
    createdBy: string,
    companyEmail: string
  ): Promise<Job> {
    try {
      const jobId = generateId();
      const now = new Date();

      const job: Job = {
        id: jobId,
        title: jobData.title,
        company: jobData.company,
        companyEmail,
        location: jobData.location,
        type: jobData.type,
        salary: jobData.salary,
        stipend: jobData.stipend,
        description: jobData.description,
        requirements: jobData.requirements,
        benefits: jobData.benefits || [],
        post_date: now.toISOString().split("T")[0].replace(/-/g, "_"),
        last_date: jobData.last_date,
        minimum_age: jobData.minimum_age,
        maximum_age: jobData.maximum_age,
        qualification_eligibility: jobData.qualification_eligibility,
        job_link: jobData.job_link,
        isActive: true,
        applicantCount: 0,
        createdAt: now,
        updatedAt: now,
        createdBy,
      };

      // Save to jobs collection
      await adminDb.collection(this.jobsCollection).doc(jobId).set(job);

      // Save to company-wise collection
      const companyJobsRef = adminDb
        .collection(this.companyJobsCollection)
        .doc(companyEmail);
      const companyJobsDoc = await companyJobsRef.get();

      if (companyJobsDoc.exists) {
        await companyJobsRef.update({
          [`jobs.${jobId}`]: job,
        });
      } else {
        await companyJobsRef.set({
          jobs: {
            [jobId]: job,
          },
        });
      }

      return job;
    } catch (error) {
      console.error("Error creating job:", error);
      throw new CustomError("Failed to create job", 500);
    }
  }

  /**
   * Get job by ID
   */
  async getJobById(jobId: string): Promise<Job | null> {
    try {
      const jobDoc = await adminDb
        .collection(this.jobsCollection)
        .doc(jobId)
        .get();

      if (!jobDoc.exists) {
        return null;
      }

      const jobData = jobDoc.data();
      return {
        id: jobDoc.id,
        title: jobData?.title || "",
        company: jobData?.company || "",
        companyEmail: jobData?.companyEmail || "",
        location: jobData?.location || "",
        type: jobData?.type || "full-time",
        salary: jobData?.salary,
        stipend: jobData?.stipend,
        description: jobData?.description || "",
        requirements: jobData?.requirements || [],
        benefits: jobData?.benefits || [],
        post_date: jobData?.post_date || "",
        last_date: jobData?.last_date,
        minimum_age: jobData?.minimum_age,
        maximum_age: jobData?.maximum_age,
        qualification_eligibility: jobData?.qualification_eligibility || "",
        job_link: jobData?.job_link,
        isActive: jobData?.isActive !== false,
        applicantCount: jobData?.applicantCount || 0,
        createdAt: jobData?.createdAt?.toDate() || new Date(),
        updatedAt: jobData?.updatedAt?.toDate() || new Date(),
        createdBy: jobData?.createdBy || "",
      };
    } catch (error) {
      console.error("Error getting job by ID:", error);
      throw new CustomError("Failed to get job", 500);
    }
  }

  /**
   * Update job posting
   */
  async updateJob(
    jobId: string,
    updateData: UpdateJobRequest,
    updatedBy: string
  ): Promise<Job> {
    try {
      const existingJob = await this.getJobById(jobId);
      if (!existingJob) {
        throw new CustomError("Job not found", 404);
      }

      // Remove undefined properties and add update timestamp
      const cleanData = removeUndefinedProperties(updateData);
      cleanData.updatedAt = new Date();

      // Update jobs collection
      await adminDb
        .collection(this.jobsCollection)
        .doc(jobId)
        .update(cleanData);

      // Update company-wise collection
      const companyJobsRef = adminDb
        .collection(this.companyJobsCollection)
        .doc(existingJob.companyEmail);
      const updateFields: any = {};

      Object.keys(cleanData).forEach((key) => {
        updateFields[`jobs.${jobId}.${key}`] = (cleanData as any)[key];
      });

      await companyJobsRef.update(updateFields);

      // Get updated job
      const updatedJob = await this.getJobById(jobId);
      if (!updatedJob) {
        throw new CustomError("Job not found after update", 404);
      }

      return updatedJob;
    } catch (error) {
      console.error("Error updating job:", error);
      throw new CustomError("Failed to update job", 500);
    }
  }

  /**
   * Delete job posting
   */
  async deleteJob(jobId: string): Promise<void> {
    try {
      const job = await this.getJobById(jobId);
      if (!job) {
        throw new CustomError("Job not found", 404);
      }

      // Delete from jobs collection
      await adminDb.collection(this.jobsCollection).doc(jobId).delete();

      // Delete from company-wise collection
      const companyJobsRef = adminDb
        .collection(this.companyJobsCollection)
        .doc(job.companyEmail);
      await companyJobsRef.update({
        [`jobs.${jobId}`]: admin.firestore.FieldValue.delete(),
      });
    } catch (error) {
      console.error("Error deleting job:", error);
      throw new CustomError("Failed to delete job", 500);
    }
  }

  /**
   * Get jobs with filtering and pagination
   */
  async getJobs(filters: JobSearchFilters = {}): Promise<{
    jobs: Job[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      let query = adminDb.collection(this.jobsCollection) as any;

      // Apply filters
      if (filters.type) {
        query = query.where("type", "==", filters.type);
      }

      if (filters.company) {
        query = query.where("company", "==", filters.company);
      }

      if (filters.location) {
        query = query.where("location", "==", filters.location);
      }

      if (filters.isActive !== undefined) {
        query = query.where("isActive", "==", filters.isActive);
      }

      // Get total count
      const totalSnapshot = await query.get();
      const total = totalSnapshot.size;

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const offset = (page - 1) * limit;

      query = query.orderBy("createdAt", "desc").limit(limit).offset(offset);

      const snapshot = await query.get();
      const jobs: Job[] = [];

      snapshot.forEach((doc: any) => {
        const jobData = doc.data();
        jobs.push({
          id: doc.id,
          title: jobData.title || "",
          company: jobData.company || "",
          companyEmail: jobData.companyEmail || "",
          location: jobData.location || "",
          type: jobData.type || "full-time",
          salary: jobData.salary,
          stipend: jobData.stipend,
          description: jobData.description || "",
          requirements: jobData.requirements || [],
          benefits: jobData.benefits || [],
          post_date: jobData.post_date || "",
          last_date: jobData.last_date,
          minimum_age: jobData.minimum_age,
          maximum_age: jobData.maximum_age,
          qualification_eligibility: jobData.qualification_eligibility || "",
          job_link: jobData.job_link,
          isActive: jobData.isActive !== false,
          applicantCount: jobData.applicantCount || 0,
          createdAt: jobData.createdAt?.toDate() || new Date(),
          updatedAt: jobData.updatedAt?.toDate() || new Date(),
          createdBy: jobData.createdBy || "",
        });
      });

      // Apply text search filter if query is provided
      let filteredJobs = jobs;
      if (filters.query) {
        const searchQuery = filters.query.toLowerCase();
        filteredJobs = jobs.filter(
          (job) =>
            job.title.toLowerCase().includes(searchQuery) ||
            job.company.toLowerCase().includes(searchQuery) ||
            job.location.toLowerCase().includes(searchQuery) ||
            job.description.toLowerCase().includes(searchQuery)
        );
      }

      return {
        jobs: filteredJobs,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Error getting jobs:", error);
      throw new CustomError("Failed to get jobs", 500);
    }
  }

  /**
   * Get jobs by company email
   */
  async getJobsByCompany(companyEmail: string): Promise<Job[]> {
    try {
      const companyJobsDoc = await adminDb
        .collection(this.companyJobsCollection)
        .doc(companyEmail)
        .get();

      if (!companyJobsDoc.exists) {
        return [];
      }

      const data = companyJobsDoc.data();
      const jobsData = data?.jobs || {};

      return Object.values(jobsData).map((jobData: any) => ({
        id: jobData.id,
        title: jobData.title || "",
        company: jobData.company || "",
        companyEmail: jobData.companyEmail || "",
        location: jobData.location || "",
        type: jobData.type || "full-time",
        salary: jobData.salary,
        stipend: jobData.stipend,
        description: jobData.description || "",
        requirements: jobData.requirements || [],
        benefits: jobData.benefits || [],
        post_date: jobData.post_date || "",
        last_date: jobData.last_date,
        minimum_age: jobData.minimum_age,
        maximum_age: jobData.maximum_age,
        qualification_eligibility: jobData.qualification_eligibility || "",
        job_link: jobData.job_link,
        isActive: jobData.isActive !== false,
        applicantCount: jobData.applicantCount || 0,
        createdAt: jobData.createdAt?.toDate() || new Date(),
        updatedAt: jobData.updatedAt?.toDate() || new Date(),
        createdBy: jobData.createdBy || "",
      }));
    } catch (error) {
      console.error("Error getting jobs by company:", error);
      throw new CustomError("Failed to get company jobs", 500);
    }
  }

  /**
   * Get active jobs (public endpoint)
   */
  async getActiveJobs(
    filters: Omit<JobSearchFilters, "isActive"> = {}
  ): Promise<{
    jobs: Job[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.getJobs({ ...filters, isActive: true });
  }

  /**
   * Update job applicant count
   */
  async updateApplicantCount(
    jobId: string,
    increment: number = 1
  ): Promise<void> {
    try {
      const job = await this.getJobById(jobId);
      if (!job) {
        throw new CustomError("Job not found", 404);
      }

      const newCount = Math.max(0, job.applicantCount + increment);

      // Update jobs collection
      await adminDb.collection(this.jobsCollection).doc(jobId).update({
        applicantCount: newCount,
        updatedAt: new Date(),
      });

      // Update company-wise collection
      await adminDb
        .collection(this.companyJobsCollection)
        .doc(job.companyEmail)
        .update({
          [`jobs.${jobId}.applicantCount`]: newCount,
          [`jobs.${jobId}.updatedAt`]: new Date(),
        });
    } catch (error) {
      console.error("Error updating applicant count:", error);
      throw new CustomError("Failed to update applicant count", 500);
    }
  }

  /**
   * Get job statistics
   */
  async getJobStats(): Promise<{
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    jobsByType: Record<JobType, number>;
    recentJobs: Job[];
  }> {
    try {
      const jobsSnapshot = await adminDb.collection(this.jobsCollection).get();
      const jobs: Job[] = [];

      jobsSnapshot.forEach((doc: any) => {
        const jobData = doc.data();
        jobs.push({
          id: doc.id,
          title: jobData.title || "",
          company: jobData.company || "",
          companyEmail: jobData.companyEmail || "",
          location: jobData.location || "",
          type: jobData.type || "full-time",
          salary: jobData.salary,
          stipend: jobData.stipend,
          description: jobData.description || "",
          requirements: jobData.requirements || [],
          benefits: jobData.benefits || [],
          post_date: jobData.post_date || "",
          last_date: jobData.last_date,
          minimum_age: jobData.minimum_age,
          maximum_age: jobData.maximum_age,
          qualification_eligibility: jobData.qualification_eligibility || "",
          job_link: jobData.job_link,
          isActive: jobData.isActive !== false,
          applicantCount: jobData.applicantCount || 0,
          createdAt: jobData.createdAt?.toDate() || new Date(),
          updatedAt: jobData.updatedAt?.toDate() || new Date(),
          createdBy: jobData.createdBy || "",
        });
      });

      const totalJobs = jobs.length;
      const activeJobs = jobs.filter((j) => j.isActive).length;
      const totalApplications = jobs.reduce(
        (sum, job) => sum + job.applicantCount,
        0
      );

      const jobsByType: Record<JobType, number> = {
        "full-time": 0,
        "part-time": 0,
        contract: 0,
        internship: 0,
        government: 0,
      };

      jobs.forEach((job) => {
        jobsByType[job.type]++;
      });

      const recentJobs = jobs
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5);

      return {
        totalJobs,
        activeJobs,
        totalApplications,
        jobsByType,
        recentJobs,
      };
    } catch (error) {
      console.error("Error getting job stats:", error);
      throw new CustomError("Failed to get job statistics", 500);
    }
  }
}

// Export singleton instance
export const jobService = new JobService();
