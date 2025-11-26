import { computed, inject, Injectable, signal } from '@angular/core';
import { SingleTonApi } from '../../../../../core/services/api/single-ton-api.service';
import { catchError, EMPTY, Observable, of, tap } from 'rxjs';
import { IComment, ICreateComment, IPaginatedCommentsRes , IPaginatedCommentsRepliesRes, IReplyComment, IUpdateComment, CommentFlag } from '../../../../../core/models/comments.model';
import { UserProfileService } from '../../profile/services/user-profile.service';
import { Picture } from '../../../../../core/models/picture';
import { Author, IUser, RelationshipState } from '../../../../../core/models/user.model';
import { Pagination } from '../../../../../core/models/pagination';
import { CommentsStateService } from './comments-state.service';


@Injectable({
  providedIn: 'root'
})
export class CommentService {
  readonly #singleTonApi = inject(SingleTonApi);
  readonly #routeName: string = "posts";

  readonly #userService = inject(UserProfileService);
  readonly #commentsStateService = inject(CommentsStateService);


  // Post Comments State

  // Private
  #comments = signal<IComment[]>([]);
  commentsPage = signal<number>(1);
  hasMoreComments = signal<boolean>(false);

  #replies = signal<IComment[]>([]);
  #comment = signal<IComment | null>(null);
  #reply= signal<IComment | null>(null);




  // Public
  comments = computed<IComment[]>(() => this.#comments());
  replies = computed<IComment[]>(() => this.#replies());
  comment = computed<IComment | null>(() => this.#comment());
  reply = computed<IComment | null>(() => this.#reply());



  updateReplies(updateFn: (replies: IComment[]) => IComment[]): void {
  this.#replies.update(updateFn);
  }

// 🟢 Create Comment
getCommentItems (
  postId : string ,
  id : string ,
  flag : CommentFlag,
  data : ICreateComment , 
  commentId?: string ,
) : IComment | null{

  return {
    _id : id,
    id ,
    commentId,
    postId,
    content : data.content ?? '' ,
    tags : data.tags ?? [] ,
    attachment :  undefined , 
    flag,
    author : this.getAuthor()!,
    createdAt : new Date().toISOString(),
    updatedAt : new Date().toISOString(),
    createdBy : this.#userService.user()?._id || '',
    likes : [],
    }
}


getAuthor() : Author | null {
  const user =  this.#userService.user();
  if(!user) return null;  
  return {
    _id: user._id ,
      id: user._id ,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      picture : {
      url : user.picture?.url || '' ,
      public_id : user.picture?.public_id || '' ,
  }
}
}

private buildCommentFormData(data: ICreateComment | IReplyComment | IUpdateComment): FormData {
  const formData = new FormData();

  if ('content' in data && data.content) formData.append('content', data.content);
  if ('image' in data && data.image) formData.append('image', data.image);
  if ('tags' in data && data.tags?.length) {
    data.tags.forEach((tag, index) => formData.append(`tags[${index}]`, tag));
  }

  // خاص بالتحديث فقط
  if ('removedTags' in data && data.removedTags?.length) {
    data.removedTags.forEach((tag, index) => formData.append(`removedTags[${index}]`, tag));
  }

  if ('removeAttachment' in data && data.removeAttachment) {
    formData.append('removeAttachment', 'true');
  }

  return formData;
}

createComment(postId: string, data: ICreateComment)
: Observable<{ data: {comment : IComment} }> {
  const formData = this.buildCommentFormData(data);
  return this.#singleTonApi.create<{ data: {comment : IComment} }>(
    `${this.#routeName}/${postId}/create-comment`,
    formData
  ).pipe(
    tap(({ data: {comment} }) => {
    const newComment :IComment = {
    ...comment ,
    author : this.getAuthor()!
    }
    
    this.#comments.update((c) =>  [{...newComment}, ...c])
    }
  
  )
  );
}


// 🟢 Reply on Comment
replyComment(postId: string, commentId: string, data: IReplyComment )
: Observable<{ data: IComment}> {
  const formData = this.buildCommentFormData(data);

  return this.#singleTonApi.create<{ data: IComment}>(
    `${this.#routeName}/${postId}/${commentId}/create-reply`,
    formData
  ).pipe(
    tap(({data}) => {
    const newReplyComment :IComment = {
    ...data ,
    author : this.getAuthor()!
    }

    this.#replies.update((replies) => 
    [{...newReplyComment }, ...replies].map((r) =>
    r._id === commentId ? ({...r , lastReply : 'new Reply'}) : r
    )
    );

    this.#comments.update((comments) => comments.map((c) => 
    c._id === commentId ? ({...c , lastReply : 'new Reply'}) : c
    ))

    })
  );
}

// 🟢 Update Comment
  updateComment(postId: string, commentId: string, data: IUpdateComment, previewImage?: Picture): Observable<void> {
    const formData = this.buildCommentFormData(data);

    return this.#singleTonApi.patch<void>(
      `${this.#routeName}/${postId}/update/${commentId}`,
      formData
    ).pipe(
      tap(() => {
        // Helper function to update a single comment
        const updateCommentData = (comment: IComment): IComment => {
          if (comment._id !== commentId) return comment;

          // Handle tags update
          let updatedTags = [...(comment.tags || [])];
          
          if (data.removedTags?.length) {
            updatedTags = updatedTags.filter(tag => !data.removedTags?.includes(tag));
          }

          if (data.tags?.length) {
            const newTags = data.tags.filter(tag => !updatedTags.includes(tag));
            updatedTags = [...updatedTags, ...newTags];
          }

          // Handle attachment
          let updatedAttachment = comment.attachment;
          
          if (data.removeAttachment) {
            updatedAttachment = undefined ;
          } else if (previewImage) {
            updatedAttachment = previewImage;
          }

          return {
            ...comment,
            content: data.content ?? comment.content,
            tags: updatedTags,
            attachment: updatedAttachment,
            updatedAt: new Date().toISOString()
          };
        };

        // Update in main comments
        this.#comments.update(comments => 
          comments.map(c => updateCommentData(c))
        );

        // Update in replies including nested ones
        this.#replies.update(replies => 
          replies.map(r => updateCommentData(r))
        );
      })
    );
  }

  
// 🟢 Delete Comment
  deleteComment(postId: string, commentId: string): Observable<void> {
    return this.#singleTonApi.deleteById<void>(`${this.#routeName}/${postId}/delete`, commentId)
      .pipe(
        tap(() => {

          // Delete the comment itself
          this.#comments.update(comments => comments.filter(c => c._id !== commentId));


          // Delete the reply comment itself
          if (this.#replies().length > 0) {

          const deletedReply = this.#replies().find(r => r._id === commentId);
          const parentCommentId = deletedReply?.commentId;

          const commentReplies = this.#replies().filter((r) => r._id === parentCommentId);

          this.#replies.update(replies =>
          replies
          .map(r =>
          (r._id === parentCommentId && commentReplies.length === 0) ? {...r, lastReply: null } : r
          )
          .filter(r => r._id !== commentId)
          );
          }

        })
      );
  }

    // 🔹 جلب تعليقات المنشور
    getPostComment(
      postId: string,
      limit: number = 4
    ): Observable<IPaginatedCommentsRes> {
      
      const page = this.commentsPage() ;
      if(!this.hasMoreComments() && page > 1) return EMPTY;

      return this.#singleTonApi
        .find<IPaginatedCommentsRes>(
        `${this.#routeName}/${postId}/comments?page=${page}&limit=${limit}`
        )
        .pipe(
          tap(({ data: { comments : newComments} }) => {
          if(!newComments.length){
          return this.hasMoreComments.set(false)
          }

          this.#comments.update((comments) => [...comments ,...newComments]);
          this.commentsPage.update((p) => p + 1)

          })
        );
    }
  

  getCommentReplies(
    postId: string,
    commentId: string,
    page: number = 1,
    limit: number = 2
  ): Observable<IPaginatedCommentsRepliesRes> {
    return this.#singleTonApi
      .find<IPaginatedCommentsRepliesRes>(
        `${this.#routeName}/${postId}/${commentId}/replies?page=${page}&limit=${limit}`
      )
      .pipe(

        tap(({ data: { replies } }) => {
          this.#replies.update(existing => {
            const newReplies = replies.filter(r => 
            !existing.some(e => e._id === r._id)
            );
            return [...existing, ...newReplies];
          });
        })
      );
  }


  // 🟢 Like/Unlike Comment
likeComment(postId: string, commentId: string, userId: string): Observable<void> {
  if (!postId || !commentId || !userId) return EMPTY;
  const prevComments = this.#comments();
  const prevReplies = this.#replies();

  const toggleLike = (list: IComment[]) =>
    list.map((c) => {
      if (c._id !== commentId) return c;
      const updatedLikes = new Set(c.likes ?? []);
      updatedLikes.has(userId)
        ? updatedLikes.delete(userId)
        : updatedLikes.add(userId);
      return { ...c, likes: Array.from(updatedLikes) };
    });

  this.#comments.update(toggleLike);

  if (this.#replies().length) {
    this.#replies.update(toggleLike);
  }

  // استدعاء الـ API
  return this.#singleTonApi
    .create<void>(`${this.#routeName}/${postId}/${commentId}/like`)
    .pipe(
      catchError(() => {
        this.#comments.set(prevComments);
        if (prevReplies.length) this.#replies.set(prevReplies);
        return EMPTY;
      })
    );
}

getCommentLikes(postId: string, commentId: string): Observable<{data: {likedUsers: IUser[] , pagination?: Pagination}}> {
  const cacheCommentId = this.#commentsStateService.commentIdLikedUsers().commentId;
  const likedUsers = this.#commentsStateService.commentIdLikedUsers().likedUsers;

  if (cacheCommentId === commentId && likedUsers.length > 0) {
    return of({data: {likedUsers}});
  }

  return this.#singleTonApi.find<{data: {likedUsers: IUser[] , pagination?: Pagination}}>(
    `${this.#routeName}/${postId}/${commentId}/liked-users`
  ).pipe(
    tap(({data: {likedUsers}}) => {
    this.#commentsStateService.updateCommentIdLikedUsers(commentId , likedUsers);
    }),
    catchError(() => EMPTY)
  );
}
clearData() : void {
this.#comments.set([]);
this.#replies.set([]);
this.commentsPage.set(1);
this.hasMoreComments.set(this.commentsPage() > 1);
}




}
