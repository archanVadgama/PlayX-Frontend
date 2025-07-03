/**
 * Upload related types
 */
export interface UploadRequest {
  video: File;
  thumbnail: File;
  userId: number;
  categoryId: number;
  isAgeRestricted: boolean;
  isPrivate: boolean;
  title:string;
  description:string;
  keywords:string;
}