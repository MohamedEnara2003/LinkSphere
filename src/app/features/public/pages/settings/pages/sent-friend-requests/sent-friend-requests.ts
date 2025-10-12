import { Component, inject } from '@angular/core';
import { NgImage } from '../../../../../../shared/components/ng-image/ng-image';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { UserProfileService } from '../../../profile/services/user-profile.service';


@Component({
  selector: 'app-sent-friend-requests',
  imports: [NgImage, SharedModule],
  template: `
  <section 
    class="ngCard p-4 animate-sideRight"
    aria-labelledby="sent-requests-title"
    role="region"
  >
    <!-- Section Title -->
    <header class="mb-6 border-b border-brand-color/10 pb-3">
      <h1 id="account-settings-heading" class="text-2xl md:text-3xl font-bold">
      {{ 'settings.friend.title' | translate }}
    </h1>
    <p class="text-sm text-gray-400">
    {{ 'settings.friend.subtitle' | translate }}
    </p>
    </header>

    <!-- Requests List -->
      <ul 
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5"
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
                src: request.receiver.picture || '',
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
        <div 
        class="flex flex-col   py-10 text-text-light dark:text-text-dark"
        aria-live="polite"
        >
        <p class="text-base font-medium mb-2">
        {{ 'settings.friend.no_sent_requests' | translate }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ 'settings.friend.you_have_not_sent_any_requests' | translate }}
        </p>
        </div>
        }
    </ul>

  </section>
  `,
})
export class SentFriendRequests{
  userService = inject(UserProfileService);

}
