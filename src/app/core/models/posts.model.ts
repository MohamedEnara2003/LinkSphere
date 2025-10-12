import { IUser } from "./user.model";

// ---- Shared Enums ----
export type AllowComments = 'allow' | 'disable';
export type Availability = 'public' | 'friends' | 'only-me';


// ---- User Tag (للتاج في البوست) ----
export interface IUserTag {
  id: string;
  name: string;
  picture?: string;
}

export interface ICreatedBy{
  id: string;
  userName: string;
  picture?: string;
  createdAt?: string; // ISO string من السيرفر
}

// ---- Comment ----
export interface IComment {
id: string;
content: string;
createdBy: ICreatedBy;
createdAt?: string; // ISO string من السيرفر
}

  // ---- Post ----
  export interface IPost {
    _id: string; // MongoDB ID
    id: string;  // duplicate key for frontend use
    content?: string;
    attachments: string[]; // URLs or filenames of uploaded media
    imageUrls?: string[]; // URLs or filenames of uploaded media
    availability: Availability;
    allowComments: AllowComments;
    tags: string[];
    likes: string[];
    createdBy: string ; // userId
    author: IUser ; // user data
    assetsFolderId?: string;
    only: string[]; // visible only to these users
    except: string[]; // hidden from these users
    lastComment: string | null;
    createdAt: string; // ISO date
    updatedAt: string; // ISO date
    __v?: number;
  }


// ---- Paginated Response ----
export interface IPaginatedPostsResponse {
  statusCode?: number;
  message?: string;
  posts: IPost[];
  pagination: {
    page: number;
    limit: number;
    count: number;
    totalPosts: number;
    totalPages: number;
  };
}

// ---- Action Responses ----
export interface ILikeUnlikeResponse {
  statusCode: number;
  message: string; // "Post liked" | "Post unliked"
  postId: string;
  likes: number; // updated like count
}

export interface IFreezeUnfreezeResponse {
  statusCode: number;
  message: string; // "Post frozen" | "Post unfrozen"
  postId: string;
  availability: Availability;
}


export interface ICreatePost {
  availability?: Availability;
  content?: string;
  attachments?: File[];
  tags?: string[];
}

export interface IUpdatePost {
  content?: string;
  attachments?: File[];
  removedAttachments?: string[];
  tags?: string[];
  removedTags?: string[];
}
