import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeedAutoLoader } from "../../../../../components/navigations/feed-auto-loader/feed-auto-loader";
import { SearchService } from '../../../service/search.service';
import { ListSearchPosts } from "../../../components/list-search-posts/list-search-posts";


@Component({
selector: 'app-search-posts',
imports: [RouterModule, ListSearchPosts],
template : `
<section >

@if(searchService.isPostsLoading()) { 
    <div class="w-full h-120 flex justify-center items-center">
    <span class="loading text-brand-color size-20"></span>
    </div>
    }@else {
    <app-list-search-posts />
    }
{{searchService.hasMorePost() === null ? "null" : ""}} 
</section>
`
})
export class SearchPosts {
    readonly searchService = inject(SearchService);

    ngOnInit(): void {
    const hasMorePost = this.searchService.hasMorePost();
    if(hasMorePost !== null){
    this.#loadPosts();
    }
    }

    #loadPosts() : void {
    this.searchService.searchForPosts().subscribe();
    }

}
