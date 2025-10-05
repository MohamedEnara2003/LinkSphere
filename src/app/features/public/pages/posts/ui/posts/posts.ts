import { Component, inject } from '@angular/core';
import { PostCard } from "../../components/post-card/ui/post-card";

import { IPost } from '../../../../../../core/models/posts.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { MockPostsService } from '../../../../../../core/services/testing/mock-posts.service';


@Component({
  selector: 'app-posts',
  imports: [PostCard],
  template: `

<section class="w-full grid grid-cols-1 gap-10">
@for (post of posts(); track post.id) {
<app-post-card [post]="post"/>
}

</section>
`,
})

export class Posts {
    private readonly  mockPostsService = inject(MockPostsService)
    posts  = toSignal<IPost[] , IPost[]>(this.mockPostsService.getPosts() , {
    initialValue : []
    });
}
