import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PostCard } from "../../../posts/components/post-card/ui/post-card";


import { FeedAutoLoader } from "../../../../components/navigations/feed-auto-loader/feed-auto-loader";
import { SearchService } from '../../service/search.service';
import { EmptyPosts } from "../../../posts/components/empty-posts/empty-posts";
import { LoadingPost } from '../../../posts/components/loading-post/loading-post';


@Component({
selector: 'app-list-search-posts',
imports: [RouterModule, PostCard, LoadingPost , FeedAutoLoader, EmptyPosts],
template : `
<section role="region" aria-label="Search results posts">
    <ul class="grid grid-cols-1 gap-2" role="list">
        @for (post of searchService.posts(); track post._id) {
            <li class="w-full min-h-60" role="listitem">
                @defer (on viewport) { 
                    <app-post-card [post]="post" class="size-full"/>
                }@placeholder {
                    <app-loading-post class="w-full "/>
                }
            </li>
        }@empty {
            <li class="size-full" role="listitem">
                <app-empty-posts class="size-full" [isCreatePost]="false"/>
            </li>
        } 

        <li role="listitem">
            @if(searchService.hasMorePost()){
                <app-feed-auto-loader
                    class="w-full min-h-60"
                    loadingType="post"
                    (loadData)="loadPosts()"
                    aria-label="Load more search posts"
                />
            }
        </li>
    </ul>
</section>


`
})
export class ListSearchPosts {
searchService = inject(SearchService);


public loadPosts() : void {
this.searchService.searchForPosts().subscribe();
}

}

