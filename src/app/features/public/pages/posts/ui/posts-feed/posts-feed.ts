import { Component , computed, inject, signal } from '@angular/core';
import { PostCard } from "../../components/post-card/ui/post-card";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, finalize, map, switchMap } from 'rxjs';
import { Availability, IPost} from '../../../../../../core/models/posts.model';
import { FeedAutoLoader } from "../../../../components/navigations/feed-auto-loader/feed-auto-loader";
import { LoadingPost } from "../../components/loading/loading-post/loading-post";
import { EmptyPosts } from "../../components/empty-posts/empty-posts";
import { PostsStateService } from '../../service/state/posts-state.service';
import { GetPostsService } from '../../service/api/get-posts.service';
import { LoadingService } from '../../../../../../core/services/loading.service';


@Component({
  selector: 'app-posts-feed',
  imports: [PostCard, RouterModule, FeedAutoLoader, LoadingPost, EmptyPosts],
  template: `
  
<main class="size-full grid grid-cols-1 gap-5">
@if(!isLoading()){ 
@for (post of posts(); track post._id) {
<article class="w-full min-h-60">
@defer (on viewport) {
<app-post-card [post]="post" class="size-full"/>
}@placeholder {
<app-loading-post class="size-full"/>
}
</article>
}@empty {
<app-empty-posts class="size-full min-h-100" />
} 

@if(hasMorePosts()){ 
<app-feed-auto-loader 
loadingType="post"
(loadData)="loadMore()"
aria-label="Load more posts"
/>
}

}@else {
<app-loading-post class="w-full min-h-60"/>
}


</main>
`,
providers : [GetPostsService]
})

export class PostsFeed {
    isLoading = signal<boolean>(false);
    
    #getPostsService = inject(GetPostsService);
    #postState= inject(PostsStateService);

    #route = inject(ActivatedRoute);

    postsState = toSignal<Availability , Availability>(
    this.#route.queryParamMap.pipe(
    map((query) => query.get('state') as Availability),
    ) 
    , {initialValue : 'public'});

    
    posts = computed<IPost[]>(() => 
    this.#postState.getPostsByState()[this.postsState() || 'public'].posts ?? []
    );

    hasMorePosts = computed<boolean>(() =>  
    this.#postState.getPostsByState()[this.postsState() || 'public'].hasMorePosts
    );


  constructor(){
    this.isLoading.set(true);
    toObservable(this.postsState)
      .pipe(
        switchMap((state) => {
          const currentState = state || 'public';
          const cached = this.#postState.getPostsByState()[currentState]?.posts ?? [];
          if (cached.length > 0) return EMPTY;
          return this.#getPostsService.getPosts(currentState);
        }),
        finalize(() => {
        this.isLoading.set(false);
        }),
        catchError(() => {
        this.isLoading.set(false);
        return EMPTY
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
    }
    
    loadMore() {  
    const currentState = this.postsState() || 'public';
    this.#getPostsService.getPosts(currentState ).subscribe();
    }

}
