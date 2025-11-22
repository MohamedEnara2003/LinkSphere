import { Component, effect, inject, untracked } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchService } from '../../../service/search.service';
import { NotFoundAll } from "../../../components/not-found-all/not-found-all";
import { SearchPeople } from "../../search-people/ui/search-people";
import { SearchPosts } from "../../search-posts/ui/search-posts";


@Component({
selector: 'app-search-all',
imports: [RouterModule, NotFoundAll, SearchPeople, SearchPosts],
template : `
<section class="flex flex-col gap-10">


@if(searchService.isAllLoading() ) { 
    <div class="w-full h-120 flex justify-center items-center">
    <span class="loading text-brand-color size-20"></span>
    </div>
}

@else if(!searchService.users().length && !searchService.posts().length){
<app-not-found-all class="w-full h-[80svh] "/>
}@else {
@if(searchService.users().length ){
<article class="space-y-2 p-1 border-b-4 border-b-brand-color/50">
<header>
<h1 class="card-title ngText">People</h1>
</header>
<app-search-people />

<footer class="w-full flex justify-center">
<button 
routerLink="/public/search/people" queryParamsHandling="merge"
title="See all posts"
type="button" 
role="button"
class="btn btn-link btn-md sm:btn-lg text-gray-500 dark:text-gray-300 
link-hover">
See all people results
</button>
</footer>
</article>
}

@if(searchService.posts().length ){
<article class="space-y-2 p-1 border-b-4 border-b-brand-color/50">
<header>
<h1 class="card-title ngText">Posts</h1>
</header>
<app-search-posts />

<footer class="w-full flex justify-center">
<button 
routerLink="/public/search/posts" queryParamsHandling="merge"
title="See all posts"
type="button" 
role="button"
class="btn btn-link btn-md sm:btn-lg text-gray-500 dark:text-gray-300 
link-hover">
See all posts results
</button>
</footer>
</article>
}
}

</section>
`
})
export class SearchAll {
readonly searchService = inject(SearchService);


constructor(){

effect(() => {
  const query = this.searchService.querySearchValue();

if (query) {
    untracked(() => {
    this.#loadUsers();
    });
}
});
}

#loadUsers() : void {
this.searchService.searchForAll().subscribe();
}

}

