import * as admin from "firebase-admin";
import {
  Assessment,
  Question,
  UserAssessment,
  CreateAssessmentDTO,
  UpdateAssessmentDTO,
  AssessmentResult,
  QuestionType,
} from "../../types";

const db = admin.firestore();

export class AssessmentService {
  private static readonly COLLECTION = "assessments";
  private static readonly USER_ASSESSMENTS_COLLECTION = "userAssessments";

  // Assessment CRUD operations
  static async createAssessment(
    data: CreateAssessmentDTO,
    creatorId: string
  ): Promise<Assessment> {
    try {
      const assessmentRef = db.collection(this.COLLECTION).doc();
      const now = new Date();

      const assessment: Assessment = {
        id: assessmentRef.id,
        title: data.title,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        timeLimit: data.timeLimit,
        passingScore: data.passingScore,
        questions: data.questions.map((q) => ({
          ...q,
          id: Math.random().toString(36).substr(2, 9),
        })),
        isActive: data.isActive ?? true,
        tags: data.tags || [],
        createdBy: creatorId,
        createdAt: now,
        updatedAt: now,
      };

      await assessmentRef.set(assessment);
      return assessment;
    } catch (error) {
      console.error("Create assessment error:", error);
      throw new Error("Failed to create assessment");
    }
  }

  static async getAssessment(id: string): Promise<Assessment | null> {
    try {
      const doc = await db.collection(this.COLLECTION).doc(id).get();
      if (!doc.exists) return null;
      return doc.data() as Assessment;
    } catch (error) {
      console.error("Get assessment error:", error);
      throw new Error("Failed to get assessment");
    }
  }

  static async getAssessments(filters?: {
    category?: string;
    difficulty?: string;
    isActive?: boolean;
    createdBy?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ assessments: Assessment[]; total: number }> {
    try {
      let query = db.collection(this.COLLECTION) as any;

      // Apply filters
      if (filters?.category) {
        query = query.where("category", "==", filters.category);
      }
      if (filters?.difficulty) {
        query = query.where("difficulty", "==", filters.difficulty);
      }
      if (filters?.isActive !== undefined) {
        query = query.where("isActive", "==", filters.isActive);
      }
      if (filters?.createdBy) {
        query = query.where("createdBy", "==", filters.createdBy);
      }

      // Get total count
      const countSnapshot = await query.get();
      const total = countSnapshot.size;

      // Apply pagination
      query = query.orderBy("createdAt", "desc");
      if (filters?.offset) {
        query = query.offset(filters.offset);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const snapshot = await query.get();
      const assessments = snapshot.docs.map(
        (doc: any) => doc.data() as Assessment
      );

      return { assessments, total };
    } catch (error) {
      console.error("Get assessments error:", error);
      throw new Error("Failed to get assessments");
    }
  }

  static async updateAssessment(
    id: string,
    data: UpdateAssessmentDTO
  ): Promise<Assessment> {
    try {
      const assessmentRef = db.collection(this.COLLECTION).doc(id);
      const doc = await assessmentRef.get();

      if (!doc.exists) {
        throw new Error("Assessment not found");
      }

      const updateData = {
        ...data,
        updatedAt: new Date(),
      };

      await assessmentRef.update(updateData);

      const updatedDoc = await assessmentRef.get();
      return updatedDoc.data() as Assessment;
    } catch (error) {
      console.error("Update assessment error:", error);
      throw new Error("Failed to update assessment");
    }
  }

  static async deleteAssessment(id: string): Promise<void> {
    try {
      await db.collection(this.COLLECTION).doc(id).delete();
    } catch (error) {
      console.error("Delete assessment error:", error);
      throw new Error("Failed to delete assessment");
    }
  }

  // User Assessment operations
  static async startAssessment(
    assessmentId: string,
    userId: string
  ): Promise<UserAssessment> {
    try {
      const assessment = await this.getAssessment(assessmentId);
      if (!assessment) {
        throw new Error("Assessment not found");
      }

      if (!assessment.isActive) {
        throw new Error("Assessment is not active");
      }

      const userAssessmentRef = db
        .collection(this.USER_ASSESSMENTS_COLLECTION)
        .doc();
      const now = new Date();

      const userAssessment: UserAssessment = {
        id: userAssessmentRef.id,
        assessmentId,
        userId,
        status: "in_progress",
        startedAt: now,
        timeLimit: assessment.timeLimit,
        answers: [],
        score: 0,
        passed: false,
        createdAt: now,
        updatedAt: now,
      };

      await userAssessmentRef.set(userAssessment);
      return userAssessment;
    } catch (error) {
      console.error("Start assessment error:", error);
      throw new Error("Failed to start assessment");
    }
  }

  static async submitAnswer(
    userAssessmentId: string,
    questionId: string,
    answer: string | string[]
  ): Promise<UserAssessment> {
    try {
      const userAssessmentRef = db
        .collection(this.USER_ASSESSMENTS_COLLECTION)
        .doc(userAssessmentId);
      const doc = await userAssessmentRef.get();

      if (!doc.exists) {
        throw new Error("User assessment not found");
      }

      const userAssessment = doc.data() as UserAssessment;

      if (userAssessment.status !== "in_progress") {
        throw new Error("Assessment is not in progress");
      }

      // Check time limit
      const now = Date.now();
      const startedAt = userAssessment.startedAt.getTime();
      const timeLimit = userAssessment.timeLimit * 60 * 1000; // Convert to milliseconds

      if (now - startedAt > timeLimit) {
        throw new Error("Time limit exceeded");
      }

      // Update or add answer
      const existingAnswerIndex = userAssessment.answers.findIndex(
        (a: any) => a.questionId === questionId
      );
      const newAnswer = {
        questionId,
        answer,
        answeredAt: new Date(),
      };

      if (existingAnswerIndex >= 0) {
        userAssessment.answers[existingAnswerIndex] = newAnswer;
      } else {
        userAssessment.answers.push(newAnswer);
      }

      await userAssessmentRef.update({
        answers: userAssessment.answers,
        updatedAt: new Date(),
      });

      return userAssessment;
    } catch (error) {
      console.error("Submit answer error:", error);
      throw new Error("Failed to submit answer");
    }
  }

  static async submitAssessment(
    userAssessmentId: string
  ): Promise<AssessmentResult> {
    try {
      const userAssessmentRef = db
        .collection(this.USER_ASSESSMENTS_COLLECTION)
        .doc(userAssessmentId);
      const doc = await userAssessmentRef.get();

      if (!doc.exists) {
        throw new Error("User assessment not found");
      }

      const userAssessment = doc.data() as UserAssessment;

      if (userAssessment.status !== "in_progress") {
        throw new Error("Assessment is not in progress");
      }

      // Get assessment details
      const assessment = await this.getAssessment(userAssessment.assessmentId);
      if (!assessment) {
        throw new Error("Assessment not found");
      }

      // Calculate score
      const result = this.calculateScore(assessment, userAssessment.answers);
      const now = new Date();

      // Update user assessment
      await userAssessmentRef.update({
        status: "completed",
        score: result.score,
        passed: result.passed,
        completedAt: now,
        updatedAt: now,
      });

      return {
        ...result,
        assessmentId: userAssessment.assessmentId,
        completedAt: now,
      };
    } catch (error) {
      console.error("Submit assessment error:", error);
      throw new Error("Failed to submit assessment");
    }
  }

  static async getUserAssessments(
    userId: string,
    filters?: { status?: string; limit?: number; offset?: number }
  ): Promise<{ userAssessments: UserAssessment[]; total: number }> {
    try {
      let query = db
        .collection(this.USER_ASSESSMENTS_COLLECTION)
        .where("userId", "==", userId) as any;

      if (filters?.status) {
        query = query.where("status", "==", filters.status);
      }

      // Get total count
      const countSnapshot = await query.get();
      const total = countSnapshot.size;

      // Apply pagination
      query = query.orderBy("createdAt", "desc");
      if (filters?.offset) {
        query = query.offset(filters.offset);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const snapshot = await query.get();
      const userAssessments = snapshot.docs.map(
        (doc: any) => doc.data() as UserAssessment
      );

      return { userAssessments, total };
    } catch (error) {
      console.error("Get user assessments error:", error);
      throw new Error("Failed to get user assessments");
    }
  }

  static async getUserAssessment(id: string): Promise<UserAssessment | null> {
    try {
      const doc = await db
        .collection(this.USER_ASSESSMENTS_COLLECTION)
        .doc(id)
        .get();
      if (!doc.exists) return null;
      return doc.data() as UserAssessment;
    } catch (error) {
      console.error("Get user assessment error:", error);
      throw new Error("Failed to get user assessment");
    }
  }

  // Helper methods
  private static calculateScore(
    assessment: Assessment,
    answers: UserAssessment["answers"]
  ): {
    score: number;
    passed: boolean;
    correctAnswers: number;
    totalQuestions: number;
  } {
    let correctAnswers = 0;
    const totalQuestions = assessment.questions.length;

    assessment.questions.forEach((question: Question) => {
      const userAnswer = answers.find((a: any) => a.questionId === question.id);
      if (userAnswer && this.isAnswerCorrect(question, userAnswer.answer)) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= assessment.passingScore;

    return { score, passed, correctAnswers, totalQuestions };
  }

  private static isAnswerCorrect(
    question: Question,
    answer: string | string[]
  ): boolean {
    switch (question.type) {
      case "multiple_choice":
      case "true_false":
        return question.correctAnswer === answer;
      case "multiple_select":
        if (!Array.isArray(answer) || !Array.isArray(question.correctAnswer)) {
          return false;
        }
        return (
          JSON.stringify(answer.sort()) ===
          JSON.stringify(question.correctAnswer.sort())
        );
      default:
        return false;
    }
  }
}
