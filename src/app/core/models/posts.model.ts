// ---- Shared Enums ----
export type AllowComments = 'allow' | 'deny';
export type Availability = 'public' | 'friends' | 'only-me' | 'frozen';


// ---- User Tag (للتاج في البوست) ----
export interface IUserTag {
  id: string;
  name: string;
  picture?: string;
}

// ---- Comment ----
export interface IComment {
id: string;
content: string;
createdBy: {
id: string;
userName: string;
picture?: string;
};
createdAt: string; // ISO string من السيرفر
}

// ---- Post ----
export interface IPost {
  id: string;
  createdBy: {
    id: string;
    userName: string;
    picture?: string;
  };

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
