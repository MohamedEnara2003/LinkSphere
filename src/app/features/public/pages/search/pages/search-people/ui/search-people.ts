import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeedAutoLoader } from "../../../../../components/navigations/feed-auto-loader/feed-auto-loader";
import { SearchService } from '../../../service/search.service';
import { ListSearchPeople } from "../../../components/list-search-people/list-search-people";


@Component({
selector: 'app-search-people',
imports: [RouterModule, FeedAutoLoader, ListSearchPeople],
template : `
<section class="w-full  flex flex-col gap-2  ">

@if(searchService.isUsersLoading()) { 
    <div class="w-full h-120 flex justify-center items-center">
    <span class="loading text-brand-color size-20"></span>
    </div>
    }@else {
    
    <article class="flex flex-col gap-2">
    <app-list-search-people
    [users]="searchService.users()"
    />

    @if(searchService.hasMoreUser()){
    <footer        
    class="w-full flex items-center  p-3  hover:opacity-70  ngCard
    transition-opacity duration-200 animate-opacity cursor-pointer "
    role="listitem"
    aria-label="User search result"
    >
    <app-feed-auto-loader  
    loadingType="users"
    (loadData)="loadUsers()"
    />
    </footer>
    }
    </article>

    }

`
})
export class SearchPeople {
readonly searchService = inject(SearchService);


ngOnInit(): void {
this.loadUsers()
}

public loadUsers() : void {
this.searchService.searchForUsers().subscribe();
}


}

