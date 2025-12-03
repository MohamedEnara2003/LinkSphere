import { Component , computed, inject, signal } from '@angular/core';
import { PostCard } from "../../components/post-card/ui/post-card";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, finalize, map, switchMap } from 'rxjs';
import { Availability, IPost} from '../../../../../../core/models/posts.model';
import { FeedAutoLoader } from "../../../../components/navigations/feed-auto-loader/feed-auto-loader";
import { EmptyPosts } from "../../components/empty-posts/empty-posts";
import { PostsStateService } from '../../service/state/posts-state.service';
import { GetPostsService } from '../../service/api/get-posts.service';


@Component({
  selector: 'app-posts-feed',
  imports: [PostCard, RouterModule, FeedAutoLoader, EmptyPosts],
  template: `
  
<main class="w-full flex flex-col gap-5 " role="main" aria-labelledby="feed-posts-heading">
  <h2 id="feed-posts-heading" class="sr-only">Posts feed</h2>

    <section role="region" aria-label="Feed posts">
      @for (post of posts(); track post._id) {
          <app-post-card [post]="post" />
      }@empty {
        <app-empty-posts class="w-full h-70" />
      } 

      @if(hasMorePosts()){ 
        <app-feed-auto-loader 
          loadingType="post"
          (loadData)="loadMore()"
          aria-label="Load more posts"
        />
      }
    </section>

</main>
  `,
  providers: [GetPostsService]
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
