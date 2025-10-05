// ---- Shared Enums ----
export type AllowComments = 'allow' | 'deny';
export type Availability = 'public' | 'friends' | 'only-me' | 'frozen';


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
  id: string;
  createdBy: ICreatedBy;
  content?: string;
  attachments?: string[];
  assetsFolderId: string;

  availability: Availability;
  except?: string[];
  only?: string[];
  allowComments: AllowComments;

  tags?: IUserTag[];
  likes: string[]; // IDs of users who liked
  lastComment?: IComment;

  freezedAt?: string;
  freezedBy?: string;

  restoredAt?: string;
  restoredBy?: string;

  createdAt: string;
  updatedAt?: string;
}

// ---- Paginated Response ----
export interface IPaginatedPostsResponse {
  statusCode: number;
  message: string;
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
  availability?: 'public' | 'private' | 'friends';
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
