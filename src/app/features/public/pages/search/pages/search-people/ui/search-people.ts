import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeedAutoLoader } from "../../../../../components/navigations/feed-auto-loader/feed-auto-loader";
import { SearchService } from '../../../service/search.service';
import { NgImage } from "../../../../../../../shared/components/ng-image/ng-image";
import { NotFoundUsers } from '../../../components/not-found-users/not-found-users';


@Component({
selector: 'app-search-people',
imports: [RouterModule ,FeedAutoLoader, NotFoundUsers, NgImage],
template : `
<section class="w-full  flex flex-col gap-2  ">

@if(searchService.isUsersLoading()) { 
    <div class="w-full h-120 flex justify-center items-center">
    <span class="loading text-brand-color size-20"></span>
    </div>
    }@else {
    <ul class="w-full h-full overflow-y-auto flex flex-col gap-2" role="list" aria-label="Search results list" >
        @for (user of searchService.users(); track user._id) {
        <li 
        [routerLink]="['/public/profile/user' , user._id]"
        class="w-full flex items-center justify-between p-3 ngCard hover:opacity-70 
        transition-opacity duration-200 animate-opacity cursor-pointer "
        role="listitem"
        aria-label="User search result"
        >

        @defer (on viewport) {
        
        <!-- User Image -->
        <figure class="flex items-center gap-3">
        <app-ng-image
        [options]="{
        src :  user.picture?.url || '/user-placeholder.webp',
        alt : user.userName + ' profile picture',
        width  : 200,
        height : 200,
        class : 'size-10 sm:size-12 rounded-full object-cover',
        }"
        />

        <figcaption class="flex flex-col">
            <span 
            class="text-sm text-text-light dark:text-text-dark font-medium"
            aria-label="Username"
            >
            {{ user.userName }}
            </span>
        </figcaption>

        </figure>

        }@placeholder {
        <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full ng-skeleton"></div>
            <div class="flex-1">
            <div class="h-4 ng-skeleton rounded w-32 mb-2"></div>
            <div class="h-3 ng-skeleton rounded w-20"></div>
            </div>
        </div>
        }
        </li>
        }@empty {
        <li  class="size-full flex justify-center items-center">
        <app-not-found-users/> 
        </li>
        }

    @if(searchService.hasMoreUser()){
    <li        
    class="w-full flex items-center  p-3  hover:opacity-70  ngCard
    transition-opacity duration-200 animate-opacity cursor-pointer "
    role="listitem"
    aria-label="User search result"
    >
    <app-feed-auto-loader  
    loadingType="users"
    (loadData)="loadUsers()"
    />
    </li>
    }

    </ul>
    }

`
})
export class SearchPeople {
    readonly searchService = inject(SearchService);
    
    
    public loadUsers() : void {
    this.searchService.searchForUser().subscribe();
    }

}

