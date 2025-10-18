import { computed, inject, Injectable, signal } from '@angular/core';
import { SingleTonApi } from '../../../../../core/services/api/single-ton-api.service';
import { EMPTY, Observable, tap } from 'rxjs';
import { IComment, ICreateComment, IPaginatedCommentsRes , IPaginatedCommentsRepliesRes, IReplyComment, IUpdateComment, CommentFlag } from '../../../../../core/models/comments.model';
import { UserProfileService } from '../../profile/services/user-profile.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  #singleTonApi = inject(SingleTonApi);
  #userService = inject(UserProfileService);
  #routeName: string = "posts";

  // Post Management

  #comments = signal<IComment[]>([]);
  #replies = signal<IComment[]>([]);

  #comment = signal<IComment | null>(null);
  #reply= signal<IComment | null>(null);
  
  comments = computed<IComment[]>(() => this.#comments());
  replies = computed<IComment[]>(() => this.#replies());

  comment = computed<IComment | null>(() => this.#comment());
  reply = computed<IComment | null>(() => this.#reply());


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
createComment(postId: string, data: ICreateComment): Observable<{data : {commentId : string }}> {
    const formData = new FormData();
    if (data.content) formData.append('content', data.content);
    if (data.image) formData.append('image', data.image);
    if (data.tags) {
    data.tags.forEach((tag, index) => formData.append(`tags[${index}]`, tag));
    }
    return this.#singleTonApi.create<{data : {commentId : string }}> (`${this.#routeName}/${postId}/create-comment`
    , formData).pipe(
    tap(({data : {commentId}}) => {

    const newComment : IComment = this.getCommentItems(postId , commentId , 'comment' , data)! ;
    this.#comments.update((c) => [newComment , ...c]);
    })
    );
}

// 🟢 Reply on Comment
replyComment(postId: string, commentId: string, data: IReplyComment): Observable<{data : {replyId : string}}> {
  const formData = new FormData();
  if (data.content) formData.append('content', data.content);
  if (data.image) formData.append('image', data.image);
  if (data.tags) {
  data.tags.forEach((tag, index) => formData.append(`tags[${index}]`, tag));
  }

  return this.#singleTonApi.create<any>(
  `${this.#routeName}/${postId}/${commentId}/create-reply`, 
  formData
  ).pipe(
  tap(({data : {replyId}}) => {
  const newReplyComment : IComment = this.getCommentItems(postId , replyId , 'reply' , data , commentId)! ;
  this.#replies.update((r) => [newReplyComment , ...r]);
  })
  );
}


// 🟢 Update Comment
updateComment(postId: string, commentId: string, data: IUpdateComment): Observable<any> {
    const formData = new FormData();
    if (data.content) formData.append('content', data.content);
    if (data.image) formData.append('image', data.image);
    if (data.tags) {
      data.tags.forEach((tag, index) => formData.append(`tags[${index}]`, tag));
    }
    if (data.removedTags) {
      data.removedTags.forEach((tag, index) => formData.append(`removedTags[${index}]`, tag));
    }
    if (data.removeAttachment) {
      formData.append('removeAttachment', 'true');
    }
  
    return this.#singleTonApi.patch<any>(
      `${this.#routeName}/${postId}/update/${commentId}`,
      formData
    ).pipe(
    tap(() => {
 
    this.#comments.update((comments) => comments.map((c) =>  {
    if (c._id === commentId) {
      return {
        ...c,
        content: data.content ?? c.content,
        tags: data.tags ?? c.tags ?? [],
      };
    }
    return c
    }))

    })
    );
  }
  
// 🟢 Delete Comment
deleteComment(postId: string, commentId: string): Observable<void> {
return this.#singleTonApi.deleteById<void>( `${this.#routeName}/${postId}/delete`, commentId
).pipe(
tap(() => {

  if(this.#replies().length > 0){
  this.#replies.update((c) => c.filter((c) => (c._id !== commentId)));
  }

  this.#comments.update((c) => c.filter((c) => (c._id !== commentId)));
})

);
}

    // 🟢 Get Comment By Id
    getPostComment(
    postId: string ,
    page : number = 1, 
    limit : number = 5 ,
    ): Observable<IPaginatedCommentsRes > {
    return this.#singleTonApi.find<IPaginatedCommentsRes>
    (`${this.#routeName}/${postId}/comments?page=${page}&limit=${limit}`).pipe(
    tap(({data : {comments}}) => {
    this.#comments.set(comments);
    }) 
    );
    }

    getCommentReplies(
    postId: string ,
    commentId : string ,
    page : number = 1, 
    limit : number = 2 ,
    ): Observable<IPaginatedCommentsRepliesRes> {
    return this.#singleTonApi.find<IPaginatedCommentsRepliesRes>
    (`${this.#routeName}/${postId}/${commentId}/replies?page=${page}&limit=${limit}`).pipe(
    tap(({data : {replies}}) => {
    this.#replies.set(replies);
    }) 
    );
    }
    
    getCommentById(postId: string, commentId: string): Observable<{data : {comment : IComment}}> {
    if(this.#comment() && this.#comment()?._id === commentId) return EMPTY;
    return this.#singleTonApi.find<{data : {comment : IComment}}>
    (`${this.#routeName}/${postId}/comment/${commentId}`).pipe(
    tap(({data : {comment}}) => {
    this.#comment.set(comment);
    }) 
    );
    }
    
      // 🟢 Like/Unlike Comment
    likeComment(postId: string, commentId: string): Observable<any> {
    return this.#singleTonApi.create<any>(`${this.#routeName}/${postId}/${commentId}/like`, null);
    }
}
