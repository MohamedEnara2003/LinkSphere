import { computed, inject, Injectable, signal } from '@angular/core';
import { Availability, IPost, IUpdatePostContent } from '../../../../../../core/models/posts.model';
import { Picture } from '../../../../../../core/models/picture';
import { UserProfileService } from '../../../profile/services/user-profile.service';




@Injectable({
providedIn: 'root'
})

export class PostsStateService{
#userService = inject(UserProfileService)

// Posts State:
// Private 
#postsStateMap = signal<Record<Availability, { posts: IPost[]; page: number , hasMorePosts : boolean}>>({
public: { posts: [], page: 1   , hasMorePosts : false},
friends: { posts: [], page: 1  , hasMorePosts : false},
'only-me': { posts: [], page: 1, hasMorePosts : false},
});
#userProfilePosts = signal<IPost[]>([]);
#userFreezedPosts = signal<IPost[]>([]);
#post = signal<IPost | null>(null);


// Public 
public getPostsByState = computed(() => this.#postsStateMap())
public userProfilePosts = computed(() => this.#userProfilePosts());
public userFreezedPosts = computed(() => this.#userFreezedPosts());
public post = computed(() => this.#post());

//_____________________________________________________________________


// Update post state


  // ---------------------------
  // 🔥 Get POSTS
  // ---------------------------
  
  addPosts(filteredPosts : IPost[] , availability : Availability ) : void {
  if (!filteredPosts || filteredPosts.length === 0) {
  this.#postsStateMap.update((state) => ({
    ...state,
    [availability]: {
      ...state[availability],
      hasMorePosts: true, 
    },
  }));
  return;
}

  
  this.#postsStateMap.update((map) => {
  const oldPosts = map[availability].posts;

  const uniquePostsSet = new Set([...oldPosts, ...filteredPosts]);
  const uniqueSortedPosts = Array.from(uniquePostsSet).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    ...map,
    [availability]: {
      posts: uniqueSortedPosts,
      page: map[availability].page + 1,
      hasMorePosts: false,
    },
  };
});
  }

  addUserPosts(posts : IPost[]) : void {
  this.#userProfilePosts.set(posts);
  }

  // Set selected post
  setPost(post: IPost | null) {
    this.#post.set(post);
  }

  // ---------------------------
  // 🔥 ADD NEW POST
  // ---------------------------
  addPost(post: IPost) {
    const a = post.availability;

    this.#postsStateMap.update((state) => ({
      ...state,
      [a]: {
        ...state[a],
        posts: [post, ...state[a].posts],
      }
    }));

    if (post.createdBy === this.#userService.user()?._id) {
    this.#userProfilePosts.update((p) => [post, ...p]);
    }
  }

  // ---------------------------
  // 🔥 REMOVE POST
  // ---------------------------
  removePost(postId: string, availability: Availability) {
    this.#postsStateMap.update(state => ({
      ...state,
      [availability]: {
        ...state[availability],
        posts: state[availability].posts.filter(p => p._id !== postId)
      }
    }));

    this.#userProfilePosts.update(p => p.filter(x => x._id !== postId));
  }

#buildUpdatedPost(
  post: IPost,
  payload:  Partial<IUpdatePostContent>,
  attachments: Picture[]
): IPost {

  const updatedPost: IPost = { ...post};

  if (payload.content !== undefined) {
    updatedPost.content = payload.content;
  }

  if (payload.availability !== undefined) {
    updatedPost.availability = payload.availability;
  }

  if (payload.allowComments !== undefined) {
    updatedPost.allowComments = payload.allowComments;
  }

  // tags – دمج بدون تكرار
  if (payload.addToTags?.length) {
    updatedPost.tags = Array.from(
      new Set([...(post.tags || []), ...payload.addToTags])
    );
  }

// attachments – تحديث لو مش فاضي
if (attachments?.length) {
updatedPost.attachments = attachments;
}

return updatedPost;
}

UpdatePostsStateMap(postId: string, payload: Partial<IUpdatePostContent>, attachments: Picture[]): void {
  this.#postsStateMap.update((map) => {
    const newMap = { ...map };

    for (const key of Object.keys(newMap) as Availability[]) {
    newMap[key] = {
        ...newMap[key],
        posts: newMap[key].posts.map((post) =>
        post._id === postId
            ? this.#buildUpdatedPost(post, payload, attachments)
            : post
        )
    };
    }

    return newMap;
});

this.#userProfilePosts.update((posts) =>
    posts.map((post) =>
    post._id === postId
        ? this.#buildUpdatedPost(post, payload, attachments)
        : post
    )
);
}

  // ---------------------------
  // 🔥 FREEZE
  // ---------------------------
  freezePostLocally(postId: string, post: IPost) {
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
  }


  // ---------------------------
  // 🔥 UNFREEZE
  // ---------------------------
  unfreezePostLocally(postId: string, post: IPost) {
    const av = post.availability;

    this.#userFreezedPosts.update(p => p.filter(x => x._id !== postId));

    this.#postsStateMap.update((s) => ({
      ...s,
      [av]: {
        ...s[av],
        posts: [{ ...post, isFreezed: false }, ...s[av].posts]
      }
    }));
  }

  // 🔥 UPDATE POST LIKES
updatePostLikes(postId: string, userId: string): void {
  if (!postId || !userId) return;


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
      newMap[key] = {
        ...newMap[key],
        posts: updateLikes(newMap[key].posts)
      };
    }
    return newMap;
  });


  this.#userProfilePosts.update((posts) => updateLikes(posts));
  this.#post.update((p) => (p?._id === postId ? updateLikes([p])[0] : p));
}

}
