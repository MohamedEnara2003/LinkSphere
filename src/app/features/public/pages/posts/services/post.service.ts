import {computed, inject, Injectable, signal } from '@angular/core';
import {SingleTonApi } from '../../../../../core/services/api/single-ton-api.service';
import {catchError, EMPTY, forkJoin, map, Observable , of,switchMap, tap } from 'rxjs';
import {Availability, ICreatePost, IPaginatedPostsResponse, IPost, IUpdatePost } from '../../../../../core/models/posts.model';
import {UserProfileService } from '../../profile/services/user-profile.service';
import {Router } from '@angular/router';
import {ImagesService } from '../../../../../core/services/api/images.service';

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

  #postsStateMap = signal<Record<Availability, { posts: IPost[]; page: number }>>({
    public: { posts: [], page: 1 },
    friends: { posts: [], page: 1 },
    'only-me': { posts: [], page: 1 },
  });

  getPostsByState = computed(() => this.#postsStateMap())




  #userProfilePosts = signal<IPost[]>([]);
  #userFreezedPosts = signal<IPost[]>([]);
  #post = signal<IPost | null>(null);
  

  userProfilePosts = computed(() => this.#userProfilePosts());
  userFreezedPosts = computed(() => this.#userFreezedPosts());
  post = computed(() => this.#post());


  setPost(post : IPost | null) : void {
  this.#post.set(post);
  }


 //_____________________________________________________

  // 🟢 Create Post
  createPost(data: ICreatePost , prevViewImages : string[] = [])
  : Observable<{data : {postId : string , attachments : string[]} }> {
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
    return this.#singleTonApi.create<{data : {postId : string , attachments : string[]} }>
    (`${this.#routeName}/create-post`, formData).pipe(
    tap(({data : {postId , attachments }}) => {

    const availability = data.availability || 'public';
    this.#router.navigate(['/public'] , {queryParams : {state : availability }})

     this.#postsStateMap.update((map) => {
            const statePosts = map[availability].posts;
            return {
              ...map,
              [availability]: {
                posts: [
                  {
                    _id: postId,
                    content: data.content || '',
                    availability,
                    attachments,
                    imageUrls: prevViewImages,
                    tags: data.tags || [],
                    createdBy: this.#userService.user()?._id ?? '',
                    author: this.#userService.user(),
                    allowComments: 'allow',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  } as IPost,
                  ...statePosts,
                ],
                page: 1,
              },
            };
          });
        
    
    })
    );
  }
  

  // 🟢 Update Post
  updatePost(postId: string, data: IUpdatePost , prevViewImages : string[] = []): Observable<{ data: { postId: string } }> {
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

          this.#router.navigate(['/public' ,{ outlets: { 'model' :null} }]);

          // 🟢 تحديث الكاش المحلي بعد التعديل
          this.#postsStateMap.update((map) => {
            const newMap = { ...map };
            for (const key of Object.keys(newMap) as Availability[]) {
              newMap[key].posts = newMap[key].posts.map((p) =>
                p._id === postId
                  ? {
                      ...p,
                      content: data.content ?? p.content,
                      imageUrls: prevViewImages,
                      tags: data.tags ?? p.tags,
                      updatedAt: new Date().toISOString(),
                    }
                  : p
              );
            }
            return newMap;
          });

        })
      );
  }
  

  // 🟢 Delete Post
  deletePost(postId: string): Observable<void> {
    return this.#singleTonApi.deleteById<void>(`${this.#routeName}`, postId).pipe(
      tap(() => {
        this.#postsStateMap.update((map) => {
          const newMap = { ...map };
          for (const key of Object.keys(newMap) as Availability[]) {
            newMap[key].posts = newMap[key].posts.filter(
              (post) => post._id !== postId
            );
          }
          return newMap;
        });
      })
    );
  }


  #preparePosts(
  routeName : string,
  page: number = 1,
  limit: number = 5
  ) : Observable<{ data: IPaginatedPostsResponse }> {
    return this.#singleTonApi
    .find<{ data: IPaginatedPostsResponse }>(
      `${this.#routeName}/${routeName}?page=${page}&limit=${limit}`
    )
    .pipe(
      switchMap(({ data: { posts, pagination } }) => {

        if (!posts.length) {
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
                  map(({ url }) => url || ''),
                  catchError(() => of(''))
                )
            : of('');

          // 🧩 دمج نتائج الصور كلها
          return forkJoin({
            attachments: attachmentUrls$,
            authorPicture: authorPicture$,
          }).pipe(
            map(({ attachments, authorPicture }) => ({
              ...post,
              imageUrls : attachments ,
              author: {
                ...post.author,
                picture: authorPicture,
              },
            }))
          );
        });

        // 🧠 بعد ما كل البوستات تجهز
        return forkJoin(postsWithAssets$).pipe(
          map((finalPosts) => ({
            data: {   
            posts: finalPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            ) , pagination },
          }))
        );
      })
    );
  }


// 🟢 Get Posts (paginated)
getPosts(
availability: Availability ,

): Observable<{ data: IPaginatedPostsResponse }> {

  const page = this.#postsStateMap()[availability].page;

  return this.#preparePosts('', page, 10).pipe(
    tap(({ data: { posts : newPosts} }) => {

  if (!newPosts || newPosts.length === 0) return;

  const filteredPosts = newPosts.filter(p => p.availability === availability);

      this.#postsStateMap.update((map) => ({
        ...map,
        [availability]: {
          posts: [...map[availability].posts, ...filteredPosts],
          page: map[availability].page + 1,
        },
      }));


    
    }),
  );
}


  getUserPosts(
  userId : string ,
  page: number = 1,
  limit: number = 10
  ) : Observable<{data: IPaginatedPostsResponse }>{

  const posts = this.#userProfilePosts();
  const cachedPosts = posts.filter((p) => p.createdBy === userId);
  if (cachedPosts.length > 0)  return EMPTY
  
  return this.#preparePosts(`user/${userId}` , page , limit).pipe(
  tap(({data : {posts}}) => {
  this.#userProfilePosts.set(posts);
  })
  )
  }

  getFreezedPosts(
    page: number = 1,
    limit: number = 10
  ) : Observable<{data: IPaginatedPostsResponse }>{
    const cachedPosts = this.#userFreezedPosts();

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

    return this.#preparePosts('freezed').pipe(
    tap(({data : {posts}}) => {
    this.#userFreezedPosts.set(posts.map((p) => ({...p , isFreezed : true})))
    })
    )
    }

// 🟢 Like / Unlike Post with cache update
  toggleLikePost(postId: string, userId: string): Observable<void> {
    if (!postId || !userId) return EMPTY;

    const prevMap = this.#postsStateMap();

    const updateLikes = (posts: IPost[]) =>
      posts.map((p) => {
        if (p._id !== postId) return p;
        const updatedLikes = new Set(p.likes ?? []);
        updatedLikes.has(userId)
          ? updatedLikes.delete(userId)
          : updatedLikes.add(userId);
        return { ...p, likes: Array.from(updatedLikes) };
      });

    this.#postsStateMap.update((map) => {
      const newMap = { ...map };
      for (const key of Object.keys(newMap) as Availability[]) {
        newMap[key].posts = updateLikes(newMap[key].posts);
      }
      return newMap;
    });

    return this.#singleTonApi
      .create<void>(`${this.#routeName}/like/${postId}`)
      .pipe(
        catchError(() => {
          this.#postsStateMap.set(prevMap);
          return EMPTY;
        })
      )
  }


  // 🟢 Freeze Post
freezePost(postId: string, post: IPost): Observable<void> {
  return this.#singleTonApi.deleteById<void>(`${this.#routeName}/freeze`, postId).pipe(
    tap(() => {
      const availability = post.availability || 'public';

      // 🧹 احذف البوست من الـ state map الحالي
      this.#postsStateMap.update(prev => ({
        ...prev,
        [availability]: {
          ...prev[availability],
          posts: prev[availability].posts.filter(p => p._id !== postId),
        },
      }));

      // 🧩 أضفه في قائمة البوستات المجمّدة
      this.#userFreezedPosts.update(posts => [
        { ...post, isFreezed: true },
        ...posts,
      ]);
    })
  );
}


  // 🟢 Unfreeze Post
unfreezePost(postId: string, post: IPost): Observable<void> {
  return this.#singleTonApi.patch<void>(`${this.#routeName}/unfreeze/${postId}`).pipe(
    tap(() => {
      const availability = post.availability || 'public';

      // 🧹 احذف البوست من قائمة المجمّدات
      this.#userFreezedPosts.update(posts =>
        posts.filter(p => p._id !== postId)
      );

      // 🔄 أضفه تاني في الـ state map
      this.#postsStateMap.update(prev => ({
        ...prev,
        [availability]: {
          ...prev[availability],
          posts: [{ ...post, isFreezed: false }, ...prev[availability].posts],
        },
      }));
    })
  );
}

}
