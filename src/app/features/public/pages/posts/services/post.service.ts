import { computed, inject, Injectable, signal } from '@angular/core';
import { SingleTonApi } from '../../../../../core/services/api/single-ton-api.service';
import {  catchError, forkJoin, map, Observable ,of,switchMap,take, tap } from 'rxjs';
import { Availability, ICreatePost, IPaginatedPostsResponse, IPost, IUpdatePost } from '../../../../../core/models/posts.model';
import { UserProfileService } from '../../profile/services/user-profile.service';
import { Router } from '@angular/router';
import { ImagesService } from '../../../../../core/services/api/images.service';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  #singleTonApi = inject(SingleTonApi);
  #imagesService= inject(ImagesService);
  #userService = inject(UserProfileService);

  #router = inject(Router);

  #routeName: string = "posts";

  // Post Management

  #posts = signal<IPost[]>([]);
  #post = signal<IPost | null>(null);
  
  posts = computed(() => this.#posts());
  post = computed(() => this.#post());


  setPost(post : IPost | null) : void {
  this.#post.set(post);
  }


 //_____________________________________________________

  // 🟢 Create Post
  createPost(data: ICreatePost , prevViewImages : string[] = []): Observable<{data : {postId : string} }> {
    const formData = new FormData();
  
    // 🟢 Attachments (optional, max 2)
    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach(file => formData.append('attachments', file));
    }
  
    // 🟢 Content (optional)
    if (data.content) {
      formData.append('content', data.content);
    }
  
    // 🟢 Availability (default = public)
    formData.append('availability', data.availability || 'public');
  
    // 🟢 Tags (optional array)
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach((tagId, index) => {
        // الـ backend بيستقبلها كـ tags[0], tags[1], ...
        formData.append(`tags[${index}]`, tagId);
      });
    }
  
    // 🚀 إرسال الطلب
    return this.#singleTonApi.create<{data : {postId : string} }>(`${this.#routeName}/create-post`, formData).pipe(
    tap(({data : {postId}}) => {
    this.#router.navigate(['/public' ,{ outlets: { 'model' :null} }]);
    
    this.#posts.update((posts) => [
      {
        _id: postId,
        content: data.content || '',
        availability: data.availability || 'public',
        attachments: prevViewImages,
        tags: data.tags || [],
        createdBy: this.#userService.user()?._id ?? '', // لو عندك المستخدم 
        author : this.#userService.user(), 
        allowComments: 'allow',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as IPost,
      ...posts,
    ]);
    
    
    })
    );
  }
  
  // 🟢 Update Post
  updatePost(postId: string, data: IUpdatePost): Observable<{ data: { postId: string } }> {
    const formData = new FormData();
  
    // 🟢 Attachments (optional)
    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach(file => formData.append('attachments', file));
    }
  
    // 🟢 Removed Attachments (optional)
    if (data.removedAttachments && data.removedAttachments.length > 0) {
      data.removedAttachments.forEach((att, index) => {
        formData.append(`removedAttachments[${index}]`, att);
      });
    }
  
    // 🟢 Content (optional)
    if (data.content) {
      formData.append('content', data.content);
    }
  
    // 🟢 Tags (optional)
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach((tagId, index) => {
        formData.append(`tags[${index}]`, tagId);
      });
    }
  
    // 🟢 Removed Tags (optional)
    if (data.removedTags && data.removedTags.length > 0) {
      data.removedTags.forEach((tagId, index) => {
        formData.append(`removedTags[${index}]`, tagId);
      });
    }
  
    // 🚀 Send PATCH request (single request)
    return this.#singleTonApi
      .patch<{ data: { postId: string } }>(`${this.#routeName}/update-post/${postId}`, formData)
      .pipe(
        tap(() => {
          // 🟢 تحديث الكاش المحلي بعد التعديل
          this.#posts.update(posts =>
            posts.map(p =>
              p._id === postId
                ? {
                    ...p,
                    content: data.content ?? p.content,
                    attachments: data.attachments
                      ? data.attachments.map(f => URL.createObjectURL(f))
                      : p.attachments,
                    tags: data.tags ?? p.tags,
                    updatedAt: new Date().toISOString(),
                  }
                : p
            )
          );
        })
      );
  }
  

  // 🟢 Delete Post
  deletePost(postId: string): Observable<void> {
    return this.#singleTonApi.deleteById<void>(`${this.#routeName}`, postId).pipe(
    tap(() => {
    this.#posts.update((posts) => posts.filter((post) => post._id !== postId));
    })
    );
  }

  // 🟢 Get Posts (paginated)
  getPosts(
    availability: Availability,
    page: number = 1,
    limit: number = 10
  ): Observable<{ data: IPaginatedPostsResponse }> {
    const posts = this.#posts();
    const cachedPosts = posts.filter((p) => p.availability === availability);
  
    // ✅ كاش جاهز
    if (cachedPosts.length > 0) {
      return of({
        data: {
          posts: cachedPosts,
          pagination: {
            page,
            limit,
            count: cachedPosts.length,
            totalPosts: cachedPosts.length,
            totalPages: 1,
          },
        },
      });
    }
  
    // 🌐 استدعاء الـ API
    return this.#singleTonApi
      .find<{ data: IPaginatedPostsResponse }>(
        `${this.#routeName}/?page=${page}&limit=${limit}`
      )
      .pipe(
        switchMap(({ data: { posts, pagination } }) => {
          if (!posts.length) {
            this.#posts.set([]);
            return of({ data: { posts, pagination } });
          }
  
          // ✅ تجهيز كل بوست مع الصور والـ author picture
          const postsWithAssets$ = posts.map((post) => {
            const attachmentUrls$ = post.attachments?.length
              ? forkJoin(
                  post.attachments.map((key) =>
                    this.#imagesService
                      .getImages(key, 'post')
                      .pipe(map(({ url }) => url))
                  )
                )
              : of<string[]>([]);
  
            const authorPicture$ = post.author?.picture
              ? this.#imagesService
                  .getImages(post.author.picture, 'user')
                  .pipe(
                    map(({ url }) => url || '/user-placeholder.jpg'),
                    catchError(() => of('/user-placeholder.jpg'))
                  )
              : of('/user-placeholder.jpg');
  
            // 🧩 دمج نتائج الصور كلها
            return forkJoin({
              attachments: attachmentUrls$,
              authorPicture: authorPicture$,
            }).pipe(
              map(({ attachments, authorPicture }) => ({
                ...post,
                attachments,
                author: {
                  ...post.author,
                  picture: authorPicture,
                },
              }))
            );
          });
  
          // 🧠 بعد ما كل البوستات تجهز
          return forkJoin(postsWithAssets$).pipe(
            tap((finalPosts) => {
              this.#posts.set(
                finalPosts.filter((p) => p.availability === availability)
              );
            }),
            map((finalPosts) => ({
              data: { posts: finalPosts, pagination },
            }))
          );
        })
      );
  }
  
  

  // 🟢 Like / Unlike Post
  toggleLike(postId: string): Observable<void> {
    return this.#singleTonApi.create<void>(`${this.#routeName}/like/${postId}`, {}).pipe(

    );
  }

  // 🟢 Freeze Post
  freezePost(postId: string): Observable<void> {
    return this.#singleTonApi.deleteById<void>(`${this.#routeName}/freeze`, postId);
  }

  // 🟢 Unfreeze Post
  unfreezePost(postId: string): Observable<void> {
    return this.#singleTonApi.patchById<void>(`${this.#routeName}/unfreeze`, {}, postId);
  }
}
