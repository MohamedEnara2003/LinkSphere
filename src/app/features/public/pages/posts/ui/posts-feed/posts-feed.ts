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



@Component({
  selector: 'app-posts-feed',
  imports: [PostCard, RouterModule, FeedAutoLoader, LoadingPost, EmptyPosts],
  template: `
  
<main class="size-full flex flex-col gap-5">


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
<app-loading-post class="w-full min-h-full"/>
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

    postsAvailability = toSignal<Availability , Availability>(
    this.#route.queryParamMap.pipe(
    map((query) => query.get('availability') as Availability),
    ) 
    , {initialValue : 'public'});

    
    posts = computed<IPost[]>(() => 
    this.#postState.getPostsByState()[this.postsAvailability() || 'public'].posts ?? []
    );

    hasMorePosts = computed<boolean>(() =>  
    this.#postState.getPostsByState()[this.postsAvailability() || 'public'].hasMorePosts
    );


  constructor(){
  this.#getPosts(); 
  }

 #getPosts(): void {
  toObservable(this.postsAvailability)
    .pipe(
      switchMap((availability) => {
        const currentAvailability = availability || "public";
        const stateData = this.#postState.getPostsByState()[currentAvailability];

        if (stateData.posts.length > 0) {
        this.isLoading.set(false);
        return EMPTY;
        }

        this.isLoading.set(true);
        return this.#getPostsService.getPosts(currentAvailability).pipe(
        finalize(() => this.isLoading.set(false))
      );
      }),
      catchError(() => {
        this.isLoading.set(false);
        return EMPTY;
      }),
      takeUntilDestroyed()
    )
    .subscribe();
}

    
    loadMore() {  
    const currentAvailability = this.postsAvailability() || 'public';
    this.#getPostsService.getPosts(currentAvailability ).subscribe();
    }

}
