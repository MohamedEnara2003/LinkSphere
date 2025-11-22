import { Component, inject } from '@angular/core';
import { NgImage } from '../../../../../../shared/components/ng-image/ng-image';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { UserProfileService } from '../../../profile/services/user-profile.service';


@Component({
  selector: 'app-sent-friend-requests',
  imports: [NgImage, SharedModule],
  template: `
  <article class="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8" role="region" 
  aria-labelledby="friend-requests-settings-heading">

    <header id="friend-requests-settings-heading"
    class="mb-6 border-b border-brand-color/10 pb-3"> 
    <h1  class="text-2xl md:text-3xl font-bold">
    {{ 'settings.friend.title' | translate }}
    </h1>
    <p class="text-sm text-gray-400">
    {{ 'settings.friend.subtitle' | translate }}
    </p>
    </header>

    <!-- Requests List -->
      <ul 
        class="w-full  gap-5"
        role="list"
        aria-label="List of sent friend requests"
      >
        @for (request of userService.sentRequests(); track request._id) {
        @if(request.receiver){
        <li 
        class="w-full  flex items-center justify-between  p-3 ngCard hover:opacity-90 transition-opacity duration-200"
        role="listitem"
        aria-label="Sent friend request"
        >
        @defer (on viewport) {
        <!-- User Image -->
        <figure class="flex items-center gap-3">
        <app-ng-image
        [routerLink]="['/public/profile/user' , request.receiver._id]"
        [options]="{
        src :  request.receiver.picture?.url || '',
        alt : request.receiver.userName + ' profile picture',
        width  : 200,
        height : 200,
        class : 'w-12 h-12 rounded-full object-cover',
        }"
        />
        

        <figcaption class="flex flex-col">
            <span 
              class="text-sm text-text-light dark:text-text-dark font-medium"
              aria-label="Username"
            >
              {{ request.receiver.userName }}
            </span>
            <time 
              class="text-xs text-gray-500 dark:text-gray-400 mt-1"
              [attr.datetime]="request.createdAt"
              aria-label="Request date"
            >
              {{ request.createdAt | date:'mediumDate' }}
            </time>
        </figcaption>
        </figure>

        <!-- Button Cancel Requet-->
        <button (click)="cancelRequet((request._id) , (request.receiver._id))"
        type="button" 
        title="Cancel Requet" 
        aria-label="Button Cancel Requet" 
        class="ngBtnIcon hover:text-error">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
        stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
        </button>

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
        }
        }@empty {
        <div class="flex flex-col items-center justify-center py-12 text-center">
        <!-- HeroIcon: Newspaper -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
        class="size-12 md:size-16 mb-4 text-gray-400">
        <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>

        <h2 class="text-xl font-semibold ngText">
        {{ 'settings.friend.no_sent_requests' | translate }}
        </h2>
        <p class="text-gray-500 mt-2">
        {{ 'settings.friend.you_have_not_sent_any_requests' | translate }}
        </p>
        </div>
        }
    </ul>

  </article>
  `,
})
export class SentFriendRequests{
  userService = inject(UserProfileService);



  public cancelRequet(requestId : string , receiverId : string ) : void {
  this.userService.cancelFriendRequest(requestId , receiverId).subscribe()
  }

}
