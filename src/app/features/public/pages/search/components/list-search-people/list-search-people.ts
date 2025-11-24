import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IUser } from '../../../../../../core/models/user.model';
import { NgImage } from '../../../../../../shared/components/ng-image/ng-image';
import { NotFoundUsers } from '../not-found-users/not-found-users';


@Component({
selector: 'app-list-search-people',
imports: [RouterModule , NotFoundUsers, NgImage],
template : `
    <ul class="w-full h-full overflow-y-auto flex flex-col gap-2" role="list" aria-label="Search results list" >
        @for (user of users(); track user._id) {
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
    </ul>
    

`
})
export class ListSearchPeople {
users = input<IUser[]>([]);
}

