import admin from "../firebase-admin";
import { z } from "zod";

const storage = admin.storage();

class CustomError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = "CustomError";
  }
}

const fileValidationSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string(),
  size: z.number().max(10 * 1024 * 1024), // 10MB limit
});

export interface FileUploadOptions {
  bucket?: string;
  folder: string;
  allowedTypes?: string[];
  maxSize?: number;
}

export interface UploadedFile {
  url: string;
  path: string;
  filename: string;
  size: number;
  contentType: string;
  uploadedAt: Date;
}

export class FileService {
  private static readonly DEFAULT_BUCKET =
    process.env.FIREBASE_STORAGE_BUCKET || "jobsdoor360.appspot.com";

  private static readonly ALLOWED_TYPES = {
    images: ["image/jpeg", "image/png", "image/webp"],
    documents: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    all: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  };

  static async uploadFile(
    file: File | Buffer,
    options: FileUploadOptions,
    metadata?: { userId?: string; originalName?: string }
  ): Promise<UploadedFile> {
    try {
      // Validate file metadata
      const validation = fileValidationSchema.safeParse({
        filename: metadata?.originalName || "file",
        contentType:
          file instanceof File ? file.type : "application/octet-stream",
        size: file instanceof File ? file.size : file.length,
      });

      if (!validation.success) {
        throw new CustomError(
          "VALIDATION_ERROR",
          "Invalid file metadata",
          400,
          validation.error.issues
        );
      }

      const { filename, contentType, size } = validation.data;

      // Check file type
      if (options.allowedTypes && !options.allowedTypes.includes(contentType)) {
        throw new CustomError(
          "VALIDATION_ERROR",
          `File type ${contentType} not allowed`,
          400
        );
      }

      // Check file size
      const maxSize = options.maxSize || 10 * 1024 * 1024; // 10MB default
      if (size > maxSize) {
        throw new CustomError(
          "VALIDATION_ERROR",
          `File size exceeds limit of ${maxSize} bytes`,
          400
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
      const uniqueFilename = `${timestamp}_${sanitizedFilename}`;
      const filePath = `${options.folder}/${uniqueFilename}`;

      // Get bucket reference
      const bucket = storage.bucket(options.bucket || this.DEFAULT_BUCKET);
      const fileRef = bucket.file(filePath);

      // Upload file
      const buffer =
        file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;

      await fileRef.save(buffer, {
        metadata: {
          contentType,
          metadata: {
            uploadedBy: metadata?.userId || "anonymous",
            originalName: filename,
            uploadedAt: new Date().toISOString(),
          },
        },
      });

      // Make file publicly accessible (optional)
      await fileRef.makePublic();

      // Get download URL
      const [url] = await fileRef.getSignedUrl({
        action: "read",
        expires: "03-01-2500", // Long expiry for public files
      });

      return {
        url,
        path: filePath,
        filename: uniqueFilename,
        size,
        contentType,
        uploadedAt: new Date(),
      };
    } catch (error) {
      console.error("File upload error:", error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("UPLOAD_ERROR", "Failed to upload file", 500);
    }
  }

  static async deleteFile(filePath: string, bucket?: string): Promise<void> {
    try {
      const bucketRef = storage.bucket(bucket || this.DEFAULT_BUCKET);
      const fileRef = bucketRef.file(filePath);

      await fileRef.delete();
    } catch (error) {
      console.error("File deletion error:", error);
      throw new CustomError("DELETE_ERROR", "Failed to delete file", 500);
    }
  }

  static async getFileInfo(filePath: string, bucket?: string) {
    try {
      const bucketRef = storage.bucket(bucket || this.DEFAULT_BUCKET);
      const fileRef = bucketRef.file(filePath);

      const [metadata] = await fileRef.getMetadata();
      const [url] = await fileRef.getSignedUrl({
        action: "read",
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      });

      return {
        url,
        path: filePath,
        filename: metadata.name || "unknown",
        size:
          typeof metadata.size === "string"
            ? parseInt(metadata.size)
            : metadata.size || 0,
        contentType: metadata.contentType || "application/octet-stream",
        uploadedAt: new Date(metadata.timeCreated || Date.now()),
      };
    } catch (error) {
      console.error("Get file info error:", error);
      throw new CustomError(
        "FILE_ERROR",
        "Failed to get file information",
        500
      );
    }
  }

  static async uploadCV(
    file: File | Buffer,
    userId: string,
    originalName?: string
  ): Promise<UploadedFile> {
    return this.uploadFile(
      file,
      {
        folder: `cvs/${userId}`,
        allowedTypes: this.ALLOWED_TYPES.documents,
        maxSize: 5 * 1024 * 1024, // 5MB for CVs
      },
      { userId, originalName }
    );
  }

  static async uploadProfileImage(
    file: File | Buffer,
    userId: string,
    originalName?: string
  ): Promise<UploadedFile> {
    return this.uploadFile(
      file,
      {
        folder: `profiles/${userId}`,
        allowedTypes: this.ALLOWED_TYPES.images,
        maxSize: 2 * 1024 * 1024, // 2MB for profile images
      },
      { userId, originalName }
    );
  }

  static async uploadCompanyLogo(
    file: File | Buffer,
    companyId: string,
    originalName?: string
  ): Promise<UploadedFile> {
    return this.uploadFile(
      file,
      {
        folder: `companies/${companyId}/logos`,
        allowedTypes: this.ALLOWED_TYPES.images,
        maxSize: 1 * 1024 * 1024, // 1MB for logos
      },
      { originalName }
    );
  }

  static getFileTypeCategory(contentType: string): string {
    if (this.ALLOWED_TYPES.images.includes(contentType)) return "image";
    if (this.ALLOWED_TYPES.documents.includes(contentType)) return "document";
    return "other";
  }

  static validateFileSize(
    size: number,
    category: "image" | "document" | "other"
  ): boolean {
    const limits = {
      image: 2 * 1024 * 1024, // 2MB
      document: 5 * 1024 * 1024, // 5MB
      other: 1 * 1024 * 1024, // 1MB
    };
    return size <= limits[category];
  }
}
