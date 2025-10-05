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
  id: string;
  flag: CommentFlag;

  createdBy: IUserRef;
  postId: string;
  commentId?: string; // parent comment ID لو كان reply

  content?: string;
  attachment?: string;

  tags?: IUserRef[];
  likes: string[];

  lastReply?: IComment;

  freezedAt?: string;
  freezedBy?: string;

  restoredAt?: string;
  restoredBy?: string;

  createdAt: string;
  updatedAt?: string;
}

// ---- Paginated Response ----
export interface IPaginatedCommentsResponse {
  statusCode: number;
  message: string;
  comments: IComment[];
  pagination: {
    page: number;
    limit: number;
    count: number;
    totalComments: number;
    totalPages: number;
  };
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
  content?: string;         // نص التعليق الجديد
  image?: File;             // صورة جديدة للتعليق (اختياري)
  removedTags?: string[];   // التاجات اللي عايز تشيلها (اختياري)
  tags?: string[];          // التاجات الجديدة (اختياري)
  removeAttachment?: boolean; // لتحديد حذف الصورة القديمة قبل رفع جديدة
}

export interface IReplyComment {
  content?: string;
  image?: File;
  tags?: string[];
}
