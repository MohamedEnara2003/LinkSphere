import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { SingleTonApi } from '../../../../../core/services/api/single-ton-api.service';
import { catchError, EMPTY, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { IComment, ICreateComment, IPaginatedCommentsRes , IPaginatedCommentsRepliesRes, IReplyComment, IUpdateComment, CommentFlag } from '../../../../../core/models/comments.model';
import { UserProfileService } from '../../profile/services/user-profile.service';
import { ImagesService } from '../../../../../core/services/api/images.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  #singleTonApi = inject(SingleTonApi);
  #imagesService = inject(ImagesService);
  #userService = inject(UserProfileService);
  #routeName: string = "posts";

  // Post Management

  #comments = signal<IComment[]>([]);
  commentsPage = signal<number>(1);
  hasMoreComments = linkedSignal<boolean>(() => this.commentsPage() > 1 );


  #replies = signal<IComment[]>([]);

  #comment = signal<IComment | null>(null);
  #reply= signal<IComment | null>(null);
  
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
  const user =  this.#userService.user();
  if(!user) return null;
  return {
    _id : id,
    id ,
    commentId,
    postId,
    content : data.content ?? '' ,
    tags : data.tags ?? [] ,
    attachment :  '' , 
    flag,
    author : {
      _id: user._id ,
      id: user._id ,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      picture : user.picture || '',
    },
    createdAt : new Date().toISOString(),
    updatedAt : new Date().toISOString(),
    createdBy : this.#userService.user()?._id || '',
    likes : [],
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

createComment(postId: string, data: ICreateComment , preveiwImage? : string): Observable<{ data: { commentId: string } }> {
  const formData = this.buildCommentFormData(data);

  return this.#singleTonApi.create<{ data: { commentId: string } }>(
    `${this.#routeName}/${postId}/create-comment`,
    formData
  ).pipe(
    tap(({ data: { commentId } }) => {
      const newComment: IComment = this.getCommentItems(postId, commentId, 'comment', data)!;
      this.#comments.update((c) => 
      [{...newComment ,  attachment : preveiwImage}, ...c]);
    })
  );
}


// 🟢 Reply on Comment
replyComment(postId: string, commentId: string, data: IReplyComment , preveiwImage? : string)
: Observable<{ data: { replyId: string } }> {
  const formData = this.buildCommentFormData(data);

  return this.#singleTonApi.create<{ data: { replyId: string } }>(
    `${this.#routeName}/${postId}/${commentId}/create-reply`,
    formData
  ).pipe(
    tap(({ data: { replyId } }) => {

    const newReplyComment: IComment = this.getCommentItems(postId, replyId, 'reply', data, commentId)!;

    this.#replies.update((replies) => 
    [{...newReplyComment , attachment : preveiwImage}, ...replies].map((r) =>
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
  updateComment(postId: string, commentId: string, data: IUpdateComment, previewImage?: string): Observable<void> {
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
            updatedAttachment = '';
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

    // 🟢 Get Comment By Id
    #enrichCommentsWithAssets(
      comments: IComment[],
      type: 'comment' | 'reply'
    ): Observable<IComment[]> {
      if (!comments.length) return of([]);
  
      const enriched$ = comments.map((c) => {
        // جلب صورة الكاتب
        const authorPicture$ = c.author?.picture
          ? this.#imagesService
              .getImages(c.author.picture, 'comment')
              .pipe(
                map(({ url }) => url || ''),
                catchError(() => of(''))
              )
          : of('');
  
        // جلب المرفق (لو موجود)
        const attachment$ = c.attachment
          ? this.#imagesService
              .getImages(c.attachment, type === 'comment' ? 'comment' : 'post')
              .pipe(
                map(({ url }) => url || ''),
                catchError(() => of(''))
              )
          : of('');
              
        return forkJoin({ authorPicture$, attachment$ }).pipe(
          map(({ authorPicture$, attachment$ }) => ({
            ...c,
            author: { ...c.author, picture: authorPicture$ },
            attachment: attachment$,
          }))
        );
      });
  
      return forkJoin(enriched$);
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
          switchMap(({ data: { comments, pagination } }) =>
            this.#enrichCommentsWithAssets(comments, 'comment').pipe(
              map((enrichedComments) => ({
                data: { comments: enrichedComments, pagination },
              }))
            )
          ),
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
        switchMap(({ data: { replies, pagination } }) =>
          this.#enrichCommentsWithAssets(replies, 'reply').pipe(
            map((enrichedReplies) => ({
              data: {
                replies: this.organizeReplies(enrichedReplies, commentId),
                pagination
              },
            }))
          )
        ),
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

  private organizeReplies(replies: IComment[], parentId: string): IComment[] {
    // Get direct replies to the parent comment
    const directReplies = replies.filter(r => r.commentId === parentId);
    
    // Get nested replies
    const nestedReplies = replies.filter(r => 
      r.commentId !== parentId && 
      replies.some(p => p._id === r.commentId)
    );

    // Return all replies in correct order
    return [...directReplies, ...nestedReplies];
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

clearData() : void {
this.#comments.set([]);
this.#replies.set([]);
this.commentsPage.set(1);
this.hasMoreComments.set(this.commentsPage() > 1);
}

}
