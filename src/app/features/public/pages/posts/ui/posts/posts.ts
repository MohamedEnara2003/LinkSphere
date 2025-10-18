import { Component , effect, inject, signal } from '@angular/core';
import { PostCard } from "../../components/post-card/ui/post-card";
import { PostService } from '../../services/post.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { Availability} from '../../../../../../core/models/posts.model';


@Component({
  selector: 'app-posts',
  imports: [PostCard , RouterModule],
  template: `
  

<main class="size-full grid grid-cols-1 gap-5">
@for (post of postService.posts(); track post._id) {
<article class="w-full min-h-60">
@defer (on viewport) {
<app-post-card [post]="post" class="size-full"/>
}@placeholder {
<div class="size-full bg-neutral-300 animate-pulse ngCard"></div>
}
</article>
}@empty {
  <section
      class="w-full h-100 flex flex-col items-center justify-center gap-4  ngCard text-center animate-opacity"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="size-16 text-info"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      <h2 class="text-lg font-semibold ngText">
        No posts yet
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Be the first to share something with your friends!
      </p>
      <button class="ngBtn mt-2"
      [routerLink]="['/public' ,{ outlets: { 'model': ['upsert-post'] } }]" >
      Create Post
      </button>
    </section>
}

</main>
`,
})

export class Posts {
    postService = inject(PostService);
    #route = inject(ActivatedRoute);

    postsState = toSignal<Availability , Availability>(
    this.#route.queryParamMap.pipe(
    map((query) => query.get('state') as Availability),
    ) 
    , {initialValue : 'public'});

    page = signal(1);
    limit = signal(3);
    totalPages = signal(1);

    constructor(){
      toObservable(this.postsState)
      .pipe(
        switchMap((state) =>
          this.postService.getPosts(state || 'public')
        ),
        takeUntilDestroyed()
      )
      .subscribe();
    }
    

    loadMore() {
      this.page.update((p) => p + 1);

      this.postService
        .getPosts(this.postsState(), this.page() , this.limit())
        .subscribe(({ data }) => {
          this.totalPages.set(data.pagination.totalPages);
        });
    }
    
}
