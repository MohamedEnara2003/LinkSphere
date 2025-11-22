import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PostCard } from "../../../../posts/components/post-card/ui/post-card";
import { EmptyPosts } from "../../../../posts/components/empty-posts/empty-posts";
import { FeedAutoLoader } from "../../../../../components/navigations/feed-auto-loader/feed-auto-loader";
import { SearchService } from '../../../service/search.service';
import { LoadingPost } from "../../../../posts/components/loading/loading-post/loading-post";


@Component({
selector: 'app-search-posts',
imports: [RouterModule, PostCard, EmptyPosts, FeedAutoLoader, LoadingPost],
template : `
<section class="w-full grid gap-5 ">

@for (post of searchService.posts(); track post._id) {
<article class="w-full min-h-60 ">

@defer (on viewport) { 
<app-post-card [post]="post" class="size-full"/>
}@placeholder {
<app-loading-post class="w-full "/>
}

</article>
}
@empty {
<app-empty-posts class="w-full h-full" [isCreatePost]="false"/>
} 

    @if(searchService.hasMorePost()){
    <app-feed-auto-loader
    class="w-full min-h-60"
    loadingType="post"
    (loadData)="loadPosts()"
    />
    }

</section>

`
})
export class SearchPosts {
    readonly searchService = inject(SearchService);

    public loadPosts() : void {
    this.searchService.searchForPosts().subscribe();
    }

}
