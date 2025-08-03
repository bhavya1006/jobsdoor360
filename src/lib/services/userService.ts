/**
 * User Service - Handles all user-related database operations
 * Provides abstraction layer for user management with Firestore
 */

import { adminDb, adminAuth } from "@/lib/firebase-admin";
import * as admin from "firebase-admin";
import {
  User,
  UserRole,
  Lead,
  ConsultancyRemark,
  UserConsultancy,
} from "@/types";
import {
  CustomError,
  getCurrentDateTime,
  removeUndefinedProperties,
} from "@/lib/utils";

export class UserService {
  private readonly usersCollection = "users";
  private readonly leadsCollection = "leads";
  private readonly consultanciesCollection = "user_consultancies";
  private readonly rolesCollection = "login_roles";

  /**
   * Create a new user in Firestore
   */
  async createUser(uid: string, userData: Partial<User>): Promise<User> {
    try {
      const userDoc = {
        uid,
        email: userData.email!,
        firstName: userData.firstName!,
        lastName: userData.lastName,
        phoneNo: userData.phoneNo,
        dob: userData.dob,
        gender: userData.gender,
        image: userData.image,
        cv: userData.cv,
        role: userData.role || "candidate",
        emailVerified: userData.emailVerified || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Create user document
      await adminDb.collection(this.usersCollection).doc(uid).set(userDoc);

      // Create lead document
      const leadDoc: Lead = {
        full_name: `${userData.firstName} ${userData.lastName || ""}`.trim(),
        phonenumber: userData.phoneNo || "",
        email: userData.email!,
        applying_for: [],
        created_by: userData.email!,
        created_datetime: getCurrentDateTime(),
      };

      await adminDb
        .collection(this.leadsCollection)
        .doc(userData.email!)
        .set(leadDoc);

      // Set user role in login_roles collection
      await adminDb
        .collection(this.rolesCollection)
        .doc(userData.email!)
        .set({
          role: userData.role || "candidate",
        });

      // Set custom claims for the user
      await adminAuth.setCustomUserClaims(uid, {
        role: userData.role || "candidate",
        emailVerified: userData.emailVerified || false,
      });

      return userDoc;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new CustomError("Failed to create user", 500);
    }
  }

  /**
   * Get user by UID
   */
  async getUserByUid(uid: string): Promise<User | null> {
    try {
      const userDoc = await adminDb
        .collection(this.usersCollection)
        .doc(uid)
        .get();

      if (!userDoc.exists) {
        return null;
      }

      const userData = userDoc.data();
      return {
        uid,
        email: userData?.email || "",
        firstName: userData?.firstName || "",
        lastName: userData?.lastName,
        phoneNo: userData?.phoneNo,
        dob: userData?.dob,
        gender: userData?.gender,
        image: userData?.image,
        cv: userData?.cv,
        role: userData?.role || "candidate",
        emailVerified: userData?.emailVerified || false,
        createdAt: userData?.createdAt?.toDate() || new Date(),
        updatedAt: userData?.updatedAt?.toDate() || new Date(),
      };
    } catch (error) {
      console.error("Error getting user by UID:", error);
      throw new CustomError("Failed to get user", 500);
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const userRecord = await adminAuth.getUserByEmail(email);
      return this.getUserByUid(userRecord.uid);
    } catch (error) {
      if ((error as any).code === "auth/user-not-found") {
        return null;
      }
      console.error("Error getting user by email:", error);
      throw new CustomError("Failed to get user", 500);
    }
  }

  /**
   * Update user profile
   */
  async updateUser(uid: string, updateData: Partial<User>): Promise<User> {
    try {
      // Remove undefined properties
      const cleanData = removeUndefinedProperties(updateData);
      cleanData.updatedAt = new Date();

      // Update user document
      await adminDb.collection(this.usersCollection).doc(uid).update(cleanData);

      // Update lead document if email is available
      const user = await this.getUserByUid(uid);
      if (
        user?.email &&
        (cleanData.firstName || cleanData.lastName || cleanData.phoneNo)
      ) {
        const leadUpdateData: Partial<Lead> = {};

        if (cleanData.firstName || cleanData.lastName) {
          leadUpdateData.full_name = `${
            cleanData.firstName || user.firstName
          } ${cleanData.lastName || user.lastName || ""}`.trim();
        }

        if (cleanData.phoneNo) {
          leadUpdateData.phonenumber = cleanData.phoneNo;
        }

        await adminDb
          .collection(this.leadsCollection)
          .doc(user.email)
          .update(leadUpdateData);
      }

      // Get updated user
      const updatedUser = await this.getUserByUid(uid);
      if (!updatedUser) {
        throw new CustomError("User not found after update", 404);
      }

      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new CustomError("Failed to update user", 500);
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(uid: string, role: UserRole): Promise<void> {
    try {
      const user = await this.getUserByUid(uid);
      if (!user) {
        throw new CustomError("User not found", 404);
      }

      // Update user document
      await adminDb.collection(this.usersCollection).doc(uid).update({
        role,
        updatedAt: new Date(),
      });

      // Update role document
      await adminDb.collection(this.rolesCollection).doc(user.email).set({
        role,
      });

      // Update custom claims
      await adminAuth.setCustomUserClaims(uid, {
        role,
        emailVerified: user.emailVerified,
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      throw new CustomError("Failed to update user role", 500);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(uid: string): Promise<void> {
    try {
      const user = await this.getUserByUid(uid);
      if (!user) {
        throw new CustomError("User not found", 404);
      }

      // Delete from Firebase Auth
      await adminAuth.deleteUser(uid);

      // Delete user document
      await adminDb.collection(this.usersCollection).doc(uid).delete();

      // Delete lead document
      await adminDb.collection(this.leadsCollection).doc(user.email).delete();

      // Delete role document
      await adminDb.collection(this.rolesCollection).doc(user.email).delete();

      // Delete consultancy document if exists
      const consultancyDoc = await adminDb
        .collection(this.consultanciesCollection)
        .doc(user.email)
        .get();
      if (consultancyDoc.exists) {
        await consultancyDoc.ref.delete();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new CustomError("Failed to delete user", 500);
    }
  }

  /**
   * Check if user exists by email
   */
  async userExists(email: string): Promise<boolean> {
    try {
      const leadDoc = await adminDb
        .collection(this.leadsCollection)
        .doc(email)
        .get();
      return leadDoc.exists;
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  }

  /**
   * Get all users with pagination and filtering
   */
  async getUsers(
    filters: {
      role?: UserRole;
      emailVerified?: boolean;
      createdAfter?: Date;
      createdBefore?: Date;
      page?: number;
      limit?: number;
      query?: string;
    } = {}
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      let query = adminDb.collection(this.usersCollection) as any;

      // Apply filters
      if (filters.role) {
        query = query.where("role", "==", filters.role);
      }

      if (filters.emailVerified !== undefined) {
        query = query.where("emailVerified", "==", filters.emailVerified);
      }

      if (filters.createdAfter) {
        query = query.where("createdAt", ">=", filters.createdAfter);
      }

      if (filters.createdBefore) {
        query = query.where("createdAt", "<=", filters.createdBefore);
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
      const users: User[] = [];

      snapshot.forEach((doc: any) => {
        const userData = doc.data();
        users.push({
          uid: doc.id,
          email: userData.email || "",
          firstName: userData.firstName || "",
          lastName: userData.lastName,
          phoneNo: userData.phoneNo,
          dob: userData.dob,
          gender: userData.gender,
          image: userData.image,
          cv: userData.cv,
          role: userData.role || "candidate",
          emailVerified: userData.emailVerified || false,
          createdAt: userData.createdAt?.toDate() || new Date(),
          updatedAt: userData.updatedAt?.toDate() || new Date(),
        });
      });

      // Apply text search filter if query is provided
      let filteredUsers = users;
      if (filters.query) {
        const searchQuery = filters.query.toLowerCase();
        filteredUsers = users.filter(
          (user) =>
            user.firstName.toLowerCase().includes(searchQuery) ||
            user.lastName?.toLowerCase().includes(searchQuery) ||
            user.email.toLowerCase().includes(searchQuery)
        );
      }

      return {
        users: filteredUsers,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Error getting users:", error);
      throw new CustomError("Failed to get users", 500);
    }
  }

  /**
   * Add consultancy remark for user
   */
  async addConsultancyRemark(
    userEmail: string,
    remark: string,
    addedBy: string
  ): Promise<void> {
    try {
      const remarkData: ConsultancyRemark = {
        remark,
        date: new Date(),
        addedBy,
      };

      const consultancyRef = adminDb
        .collection(this.consultanciesCollection)
        .doc(userEmail);
      const consultancyDoc = await consultancyRef.get();

      if (consultancyDoc.exists) {
        // Add to existing remarks
        await consultancyRef.update({
          remarks: admin.firestore.FieldValue.arrayUnion(remarkData),
        });
      } else {
        // Create new consultancy document
        await consultancyRef.set({
          userId: userEmail,
          remarks: [remarkData],
        });
      }
    } catch (error) {
      console.error("Error adding consultancy remark:", error);
      throw new CustomError("Failed to add consultancy remark", 500);
    }
  }

  /**
   * Get consultancy remarks for user
   */
  async getConsultancyRemarks(userEmail: string): Promise<ConsultancyRemark[]> {
    try {
      const consultancyDoc = await adminDb
        .collection(this.consultanciesCollection)
        .doc(userEmail)
        .get();

      if (!consultancyDoc.exists) {
        return [];
      }

      const data = consultancyDoc.data() as UserConsultancy;
      return data.remarks || [];
    } catch (error) {
      console.error("Error getting consultancy remarks:", error);
      throw new CustomError("Failed to get consultancy remarks", 500);
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{
    totalUsers: number;
    totalCandidates: number;
    totalEmployers: number;
    totalAdmins: number;
    verifiedUsers: number;
    recentUsers: User[];
  }> {
    try {
      const usersSnapshot = await adminDb
        .collection(this.usersCollection)
        .get();
      const users: User[] = [];

      usersSnapshot.forEach((doc: any) => {
        const userData = doc.data();
        users.push({
          uid: doc.id,
          email: userData.email || "",
          firstName: userData.firstName || "",
          lastName: userData.lastName,
          phoneNo: userData.phoneNo,
          dob: userData.dob,
          gender: userData.gender,
          image: userData.image,
          cv: userData.cv,
          role: userData.role || "candidate",
          emailVerified: userData.emailVerified || false,
          createdAt: userData.createdAt?.toDate() || new Date(),
          updatedAt: userData.updatedAt?.toDate() || new Date(),
        });
      });

      const totalUsers = users.length;
      const totalCandidates = users.filter(
        (u) => u.role === "candidate"
      ).length;
      const totalEmployers = users.filter((u) => u.role === "employer").length;
      const totalAdmins = users.filter((u) =>
        ["admin", "master_admin"].includes(u.role)
      ).length;
      const verifiedUsers = users.filter((u) => u.emailVerified).length;
      const recentUsers = users
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5);

      return {
        totalUsers,
        totalCandidates,
        totalEmployers,
        totalAdmins,
        verifiedUsers,
        recentUsers,
      };
    } catch (error) {
      console.error("Error getting user stats:", error);
      throw new CustomError("Failed to get user statistics", 500);
    }
  }
}

// Export singleton instance
export const userService = new UserService();
