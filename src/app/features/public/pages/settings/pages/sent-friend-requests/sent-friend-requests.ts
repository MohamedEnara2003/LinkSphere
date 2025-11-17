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
        @for (request of userService.sentRequests(); track request.requestId) {
          <li 
            class="flex flex-col items-center p-3 rounded-xl shadow-md bg-card-light dark:bg-card-dark hover:scale-[1.03] transition-transform duration-200"
            role="listitem"
            aria-label="Sent friend request"
          >
            <!-- User Image -->
            <app-ng-image
              [options]="{
                src: request.receiver.picture?.url || '',
                alt: request.receiver.firstName + ' ' + request.receiver.lastName,
                width: 64,
                height: 64,
                class: 'size-16 rounded-full object-cover border-2 border-brand-color mb-2'
              }"
            />
            <!-- Username -->
            <span 
              class="text-sm text-text-light dark:text-text-dark font-medium"
              aria-label="Username"
            >
              {{ request.receiver.userName }}
            </span>
            <!-- Sent Date -->
            <time 
              class="text-xs text-gray-500 dark:text-gray-400 mt-1"
              [attr.datetime]="request.createdAt"
              aria-label="Request date"
            >
              {{ request.createdAt | date:'mediumDate' }}
            </time>
          </li>
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

}
