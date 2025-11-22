import {computed, inject, Injectable, signal } from '@angular/core';
import {SingleTonApi } from '../../../../../core/services/api/single-ton-api.service';
import {catchError, EMPTY,Observable , tap } from 'rxjs';
import {Availability, FormPost, ICreatePost, IPaginatedPostsResponse, IPost, IUpdatePostAttachments, IUpdatePostContent } from '../../../../../core/models/posts.model';
import {UserProfileService } from '../../profile/services/user-profile.service';
import {Router } from '@angular/router';

import { Picture } from '../../../../../core/models/picture';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  #singleTonApi = inject(SingleTonApi);

  #userService = inject(UserProfileService);

  #router = inject(Router);

  readonly routeName: string = "posts";

  // Posts State
  #postsStateMap = signal<Record<Availability, { posts: IPost[]; page: number , hasMorePosts : boolean}>>({
    public: { posts: [], page: 1   , hasMorePosts : false},
    friends: { posts: [], page: 1  , hasMorePosts : false},
    'only-me': { posts: [], page: 1, hasMorePosts : false},
  });

  #userProfilePosts = signal<IPost[]>([]);
  #userFreezedPosts = signal<IPost[]>([]);
  #post = signal<IPost | null>(null);

  
  getPostsByState = computed(() => this.#postsStateMap())
  userProfilePosts = computed(() => this.#userProfilePosts());
  userFreezedPosts = computed(() => this.#userFreezedPosts());
  post = computed(() => this.#post());


  setPost(post : IPost | null) : void {
  this.#post.set(post);
  }


 //_____________________________________________________


  #closeUpsertModelPost(availability : Availability) : void {
  this.#router.navigate([''] , {queryParams : {state : availability }})
  }


  // 🟢 Create Post
  createPost(data: FormPost)
  : Observable<{data : {postId : string , attachments : Picture[]} }> {

    // Preload Post
    const post = data as any;

    const createdPost: ICreatePost = {
      ...post,
      allowCommentsEnum: post.allowCommentsEnum || 'allow',
    };

    const formData = new FormData();

    // 🟢 Attachments (optional, max 2)
    if (createdPost.attachments && createdPost.attachments.length > 0) {
      createdPost.attachments.forEach(file => formData.append('attachments', file));
    }
  
    // 🟢 Content (optional)
    if (createdPost.content) {
      formData.append('content', createdPost.content);
    }
  
    // 🟢 Availability (default = public)
    formData.append('availability', createdPost.availability || 'public');
    formData.append('allowCommentsEnum', createdPost.allowCommentsEnum|| 'allow');
  
    // 🟢 Tags (optional array)
    if (createdPost.tags && createdPost.tags.length > 0) {
      createdPost.tags.forEach((tagId, index) => {
        // الـ backend بيستقبلها كـ tags[0], tags[1], ...
        formData.append(`tags[${index}]`, tagId);
      });
    }

    // 🚀 إرسال الطلب
    return this.#singleTonApi.create<{data : {postId : string , attachments : Picture[]} }>
    (`${this.routeName}/create-post`, formData).pipe(
    tap(({data : {postId , attachments }}) => {

    const availability = data.availability || 'public';
    this.#closeUpsertModelPost(availability);

    this.#postsStateMap.update((map) => {
            const statePosts = map[availability].posts;
            return {
              ...map,
              [availability]: {
                posts: [
                  {
                    _id: postId,
                    content: createdPost.content || '',
                    availability,
                    attachments,
                    tags: createdPost.tags || [],
                    createdBy: this.#userService.user()?._id ?? '',
                    author: this.#userService.user(),
                    allowComments: createdPost.allowCommentsEnum|| 'allow' ,
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
  
    // 🟢 Update Post Content
    updatePostContent(postId: string, data : FormPost): Observable<{ data: { postId: string } }> {

    const payload: Partial<IUpdatePostContent> = {};

    const existingPost = this.#post();
    if (!existingPost) return EMPTY;

    // Check content change
    if (data.content && data.content !== existingPost.content) {
      payload.content = data.content;
    }

    // Check availability change
    if (data.availability && data.availability !== existingPost.availability) {
      payload.availability = data.availability;
    }

    // Check allowComments change (normalize to check against proper field)
    const currentAllowComments = (existingPost.allowComments as string) || 'allow';
    if (data.allowComments  && data.allowComments!== currentAllowComments) {
      payload.allowComments= data.allowComments;
    }

    // Check tags change
    const isExistingTags  = (data.tags || []).some((id) => existingPost.tags.includes(id));
    if (data.tags && data.tags.length > 0 && !isExistingTags) {
      payload.addToTags = data.tags.slice();
    }

  // Check add removedTags
    if (data.removedTags && data.removedTags.length > 0) {
    payload.removeFromTags = data.removedTags.slice();
    }

    if (Object.keys(payload).length === 0) {
    return EMPTY;
    }

    return this.#singleTonApi.patch<{ data: { postId: string } }>(
    `${this.routeName}/update-content/${postId}`,
    payload
    ).pipe(
    
    tap(() => {
  
      this.#postsStateMap.update((map) => {
          const newMap = { ...map };
          for (const key of Object.keys(newMap) as Availability[]) {
            newMap[key] = {
              ...newMap[key],
              posts: newMap[key].posts.map((p) =>
                p._id === postId
                  ? {
                      ...p,
                    content : payload.content || p.content ,
                    availability : payload.availability || p.availability  ,
                    allowComments : payload.allowComments || p.allowComments,
                    tags : payload.addToTags || [] ,
                    }
                  : p
              ),
            };
          }
          return newMap;
        });

  this.#userProfilePosts.update((posts) =>
          posts.map((p) =>
            p._id === postId
              ? {
                  ...p,
                  ...(payload.content  && { content: payload.content }),
                  ...(payload.availability && { availability: payload.availability }),
                  ...(payload.allowComments  && { allowComments: payload.allowComments }),
                }
              : p
          )
        );
      
      this.#closeUpsertModelPost(payload.availability || 'public');

    })

    );
  }

  


  updatePostAttachments(postId: string, data : FormPost )
  : Observable<{ data: { post :IPost} }> {

   const payload: Partial<IUpdatePostAttachments> = {};

    if (data.attachments && data.attachments.length > 0) {
      payload.addToAttachments = data.attachments;
    }

    if (data.removedAttachments && data.removedAttachments.length > 0) {
      payload.removeFromAttachments = data.removedAttachments;
    }

    // nothing to update
    if (!payload.addToAttachments && !payload.removeFromAttachments) {
    return EMPTY;
    }

    const formData = new FormData();

    // 🟢 Attachments 
    if (payload.addToAttachments && payload.addToAttachments.length > 0) {
      payload.addToAttachments.forEach((file: File) => formData.append('addToAttachments', file));
    }

    // 🟢 Removed Attachments 
    if (payload.removeFromAttachments && payload.removeFromAttachments.length > 0) {

      payload.removeFromAttachments.forEach((att, index) => {
        formData.append(`removeFromAttachments[${index}]`, att);
      });
    }
    return this.#singleTonApi.patch<{ data: { post: IPost } }>(
    `${this.routeName}/update-attachments/${postId}`,
    formData
    ).pipe(
    tap(({data : {post}}) => {
    this.#postsStateMap.update((map) => {
    const newMap = { ...map };
    for (const key of Object.keys(newMap) as Availability[]) {
           newMap[key] = {
             ...newMap[key],
             posts: newMap[key].posts.map((p) =>
              p._id === postId ? { ...p, attachments: post.attachments } : p
            ),
          };
        }
        return newMap;
       });

       // update user profile posts cache
       this.#userProfilePosts.update((posts) =>
         posts.map((p) => (p._id === postId ? { ...p, attachments: post.attachments  } : p))
       );

      this.#closeUpsertModelPost(post.availability);
    })
    )
  }


// 🟢 Delete Post
private removePostFromState(postId: string, availability: Availability) {
  const filteringPosts = (posts : IPost[]) : IPost[] => posts.filter((p) => p._id !== postId);

  this.#postsStateMap.update((state) => {
    const target = state[availability];
    return {
      ...state,
      [availability]: {
        ...target,
        posts: filteringPosts(target.posts),
      },
    };
  });

  if(this.#userProfilePosts().length > 0){
  this.#userProfilePosts.update((posts) => filteringPosts(posts))
  }
}

deletePost(postId: string, availability: Availability): Observable<void> {
  return this.#singleTonApi.deleteById<void>(this.routeName, postId).pipe(
  tap(() => this.removePostFromState(postId, availability)),
  );
}

// ________________________________________________________________

// 🟢 Get Posts (paginated)
getPosts(availability: Availability): Observable<{ data: IPaginatedPostsResponse }> {

  const state = this.#postsStateMap()[availability];
  if (state.hasMorePosts) return EMPTY;

  return this.#singleTonApi
    .find<{ data: IPaginatedPostsResponse }>(
      `${this.routeName}?page=${state.page}&limit=5`
    )
    .pipe(
      tap(({ data: { posts: fetchedPosts } }) => {

  
        const filtered = fetchedPosts.filter(
          (p) => p.availability === availability
        );

        if (filtered.length === 0) {
          this.#postsStateMap.update((prev) => ({
            ...prev,
            [availability]: {
              ...prev[availability],
              hasMorePosts: true,
            },
          }));
          return;
        }

        const merged = [...state.posts, ...filtered];

        const uniqueById = merged.reduce((acc, post) => {
          acc.set(post._id, post);
          return acc;
        }, new Map<string, IPost>());

        const finalPosts = Array.from(uniqueById.values()).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        this.#postsStateMap.update((prev) => ({
          ...prev,
          [availability]: {
            ...prev[availability],
            posts: finalPosts,
            page: prev[availability].page + 1,
            hasMorePosts: false,
          },
        }));

      })
    );
}



  getUserPosts(
  userId : string ,
  page: number = 1,
  limit: number = 10
  ) : Observable<{data: IPaginatedPostsResponse }>{
  
  const posts = this.#userProfilePosts();

  const cachedPosts = posts.filter((p) => p.createdBy === (userId || ''));
  if (cachedPosts.length > 0)  return EMPTY
  
  return this.#singleTonApi.find<{data :IPaginatedPostsResponse}>
  (`${this.routeName}/user/${userId}?page=${page}&limit=${limit} `).pipe(
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
    if (cachedPosts.length > 0) return EMPTY

    return this.#singleTonApi.find<{data : IPaginatedPostsResponse}>(`
    ${this.routeName}/freezed?page=${page}&limit=${5}`) .pipe(
    tap(({data : {posts}}) => {
    this.#userFreezedPosts.set(posts.map((p) => ({...p , isFreezed : true})))
    })
    )
    }

// 🟢 Like / Unlike
toggleLikePost(postId: string, userId: string): Observable<void> {
  if (!postId || !userId) return EMPTY;

  const prevMap = this.#postsStateMap();
  const prevUserProfilePosts = this.#userProfilePosts();

  const updateLikes = (posts: IPost[]) =>
    posts.map((p) => {
      if (p._id !== postId) return p;
      const updatedLikes = new Set(p.likes ?? []);
      updatedLikes.has(userId)
        ? updatedLikes.delete(userId)
        : updatedLikes.add(userId);
      return { ...p, likes: Array.from(updatedLikes) };
    });

  // تحديث الحالة المحلية (Optimistic UI)
  this.#postsStateMap.update((map) => {
    const newMap = { ...map };
    for (const key of Object.keys(newMap) as Availability[]) {
      newMap[key].posts = updateLikes(newMap[key].posts);
    }
    return newMap;
  });

  this.#userProfilePosts.update((posts) => updateLikes(posts));

  return this.#singleTonApi
    .create<void>(`${this.routeName}/like/${postId}`)
    .pipe(
      catchError(() => {
        this.#postsStateMap.set(prevMap);
        this.#userProfilePosts.set(prevUserProfilePosts);
        return EMPTY;
      })
    );
}



  // 🟢 Freeze Post
freezePost(postId: string, post: IPost): Observable<void> {
  return this.#singleTonApi.deleteById<void>(`${this.routeName}/freeze`, postId).pipe(
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
  return this.#singleTonApi.patch<void>(`${this.routeName}/unfreeze/${postId}`).pipe(
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
