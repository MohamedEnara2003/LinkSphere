import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchService } from '../../../service/search.service';
import { NotFoundAll } from "../../../components/not-found-all/not-found-all";
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { ListSearchPeople } from "../../../components/list-search-people/list-search-people";
import { ListSearchPosts } from "../../../components/list-search-posts/list-search-posts";


@Component({
selector: 'app-search-all',
imports: [RouterModule, NotFoundAll, ListSearchPeople, ListSearchPosts],
template : `
<section class="size-full flex flex-col  gap-10">

@if(searchService.isAllLoading() ) { 
    <div class="w-full h-120 flex justify-center items-center">
    <span class="loading text-brand-color size-20"></span>
    </div>
}

@else if(!searchService.users().length && !searchService.posts().length){
<app-not-found-all class="w-full h-full "/>
}@else { 

@if(searchService.users().length ){
<article class="flex flex-col gap-5 border-b border-card-dark ">
<header>
<h1 class="card-title ngText">People</h1>
</header>

<app-list-search-people
[users]="searchService.users()" 
/>


<footer class="w-full flex justify-center">
<button 
routerLink="/public/search" [queryParams]="{result : 'people'}" queryParamsHandling="merge"
title="See all posts"
type="button" 
role="button"
class="btn btn-link btn-md sm:btn-lg text-gray-500 dark:text-gray-300 
link-hover duration-200">
See all people results
</button>
</footer>
</article>
}

@if(searchService.posts().length ){
<article class="flex flex-col gap-5 border-b border-card-dark  ">
<header>
<h1 class="card-title ngText">Posts</h1>
</header>

<app-list-search-posts/> 

<footer class="w-full flex justify-center">
<button 
routerLink="/public/search" [queryParams]="{result : 'posts'}" queryParamsHandling="merge"
title="See all posts"
type="button" 
role="button"
class="btn btn-link btn-md sm:btn-lg text-gray-500 dark:text-gray-300 
link-hover duration-200">
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
toObservable(this.searchService.searchValue).pipe(
tap((querySearch) => {
const hasMorePost  = this.searchService.hasMorePost();
const cachSearchValue = this.searchService.cachSearchValue();

if(!querySearch || cachSearchValue === querySearch && hasMorePost === null) return;
this.searchService.searchForAll().subscribe();
}),
takeUntilDestroyed()
).subscribe()
}


}

