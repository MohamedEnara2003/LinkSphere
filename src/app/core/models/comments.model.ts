import { Pagination } from "./pagination";

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
  _id: string;               // معرف التعليق
  id: string;      
            // نفس المعرف غالبًا، يمكن توحيده
  commentId?: string;    // if replay
              // نفس المعرف غالبًا، يمكن توحيده
  content: string;           // نص التعليق
  createdAt: string;         // تاريخ الإنشاء (ISO string)
  updatedAt: string;         // آخر تحديث (ISO string)
  createdBy: string;         // معرف المستخدم اللي كتب التعليق
  postId: string;            // معرف المنشور المرتبط
  flag: CommentFlag;  // نوع التعليق (غالبًا ثابت 'comment')
  lastReply?: string | null;  // آخر رد على التعليق (إن وجد)
  likes: string[];           // قائمة بمعرفات المستخدمين اللي عملوا إعجاب
  tags: string[];            // الوسوم (إن وجدت)
  author: {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    _id: string;
    picture? : string;
  };
  attachment?: string;       // مرفق (اختياري)
  __v?: number; 
}


// ---- Paginated Response ----
export interface IPaginatedCommentsRes{
  data : {
    statusCode: number;
    message: string;
    comments: IComment[];
    pagination: Pagination
  }
}
export interface IPaginatedCommentsRepliesRes{
  data : {
    statusCode: number;
    message: string;
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
  content?: string;         // نص التعليق الجديد
  image?: File;             // صورة جديدة للتعليق (اختياري)
  removedTags?: string[];   // التاجات اللي عايز تشيلها (اختياري)
  tags?: string[];          // التاجات الجديدة (اختياري)
  removeAttachment?: boolean; // لتحديد حذف الصورة القديمة قبل رفع جديدة
}

export interface IReplyComment extends ICreateComment {

}
