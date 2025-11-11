import { Component , computed, inject } from '@angular/core';
import { PostCard } from "../../components/post-card/ui/post-card";
import { PostService } from '../../services/post.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { Availability, IPost} from '../../../../../../core/models/posts.model';
import { FeedAutoLoader } from "../../../../components/navigations/feed-auto-loader/feed-auto-loader";
import { LoadingPost } from "../../components/loading/loading-post/loading-post";
import { EmptyPosts } from "../../components/empty-posts/empty-posts";


@Component({
  selector: 'app-posts',
  imports: [PostCard, RouterModule, FeedAutoLoader, LoadingPost, EmptyPosts],
  template: `
  
<main class="size-full grid grid-cols-1 gap-5">
@for (post of posts(); track post._id) {
<article class="w-full min-h-60">
@defer (on viewport) {
<app-post-card [post]="post" class="size-full"/>
}@placeholder {
<app-loading-post class="size-full"/>
}
</article>
}@empty {
<app-empty-posts />
}


@if(!hasMorePosts()){ 
<app-feed-auto-loader 
loadingType="post"
(loadData)="loadMore()"
aria-label="Load more posts"
/>
}

</main>
`,
})

export class Posts {
    #postService = inject(PostService);
    #route = inject(ActivatedRoute);

    postsState = toSignal<Availability , Availability>(
    this.#route.queryParamMap.pipe(
    map((query) => query.get('state') as Availability),
    ) 
    , {initialValue : 'public'});

    posts = computed<IPost[]>(() => 
    this.#postService.getPostsByState()[this.postsState() || 'public'].posts ?? []
    );

    hasMorePosts = computed<boolean>(() =>  
    this.#postService.getPostsByState()[this.postsState() || 'public'].hasMorePosts
    );


  constructor(){

    toObservable(this.postsState)
      .pipe(
        switchMap((state) => {
          const currentState = state || 'public';
          // const cached = this.#postService.getPostsByState()[currentState]?.posts ?? [];
          // if (cached.length > 0) return EMPTY;
          return this.#postService.getPosts(currentState);
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    }
    

    loadMore() {
    const currentState = this.postsState() || 'public';
    this.#postService.getPosts(currentState ).subscribe();
    }
    
}
