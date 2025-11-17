import { Pagination } from "./pagination";
import { Picture } from "./picture";
import { Author } from "./user.model";

// ---- Comment Flag ----
export type CommentFlag = 'comment' | 'reply';

// ---- User Info (مختصر للعرض في الكومنت) ----
export interface IUserRef {
  id: string;
  userName: string;
  picture?: string;
}


// ---- Comment ----

export interface IComment {
  _id: string;
  id: string;
  commentId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  postId: string;
  flag: CommentFlag;
  lastReply?: string | null;
  replies?: IComment[];
  likes: string[];
  tags: string[];
  author: Author;
  attachment?: Picture;
  __v?: number;
}

// ---- Paginated Response ----
export interface IPaginatedCommentsRes{
  data : {
    statusCode?: number;
    message?: string;
    comments: IComment[];
    pagination: Pagination
  }
}
export interface IPaginatedCommentsRepliesRes{
  data : {
    statusCode?: number;
    message?: string;
    replies: IComment[];
    pagination: Pagination
  }
}

// ---- Action Responses ----
export interface ILikeUnlikeCommentResponse {
  statusCode: number;
  message: string; // "Comment liked" | "Comment unliked"
  commentId: string;
  likes: number; // updated like count
}

export interface IFreezeUnfreezeCommentResponse {
  statusCode: number;
  message: string; // "Comment frozen" | "Comment unfrozen"
  commentId: string;
  freezedAt?: string;
  restoredAt?: string;
}


export interface ICreateComment {
  content?: string;
  image?: File;
  tags?: string[];
}

export interface IUpdateComment {
  content?: string;        
  image?: File;          
  removedTags?: string[];  
  tags?: string[];
  removeAttachment?: boolean;
}

export interface IReplyComment extends ICreateComment {

}
