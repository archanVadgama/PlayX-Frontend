export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoUser {
  username: string;
  displayName: string;
  channelName: string;
  image: string;
}

export interface Video {
  profileImg: string;
  userId: number;
  isAgeRestricted?: boolean
  isPrivate?: boolean
  isUploaded?: boolean
  uuid: string;
  title: string;
  duration: number;
  channelName: string;
  description?:string
  viewCount: string;
  createdAt: string;
  thumbnailPath: string;
  videoPath: string;
  user: VideoUser;
}
