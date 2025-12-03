import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { UserProfileService } from '../../services/user-profile.service';
import { NgImage } from "../../../../../../shared/components/ng-image/ng-image";
import { Author } from '../../../../../../core/models/user.model';

@Component({
  selector: 'app-friend-requests',
  imports: [SharedModule, NgImage],
  template : `
  <section
  aria-label="Recent friend requests"
  role="complementary"
  class="size-full flex flex-col p-1 ">

  <header class="w-full flex p-2">
    <h2 class="ngText text-xl font-semibold flex items-center gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
    </svg>
    Recent Activity
    </h2>
  </header>

    <ul class="w-full h-full  space-y-2 overflow-y-auto" role="list">
    @for (request of userProfileService.receivedRequests(); track request._id) {
    <li
        class="w-full flex flex-col  gap-3 p-3 rounded-xl bg-card-light/40 dark:bg-card-dark/40
        transition-colors duration-200 "
        role="article"
        aria-label="Friend request item">

        @defer (on viewport) {
        @if(request.sender) {
        <figure class="flex items-center gap-3">
        <app-ng-image
        [routerLink]="['/public/profile/user' , request.sender._id]"
        [options]="{
        src :  request.sender.picture?.url || '',
        alt : request.sender.userName + ' profile picture',
        width  : 200,
        height : 200,
        class : 'w-12 h-12 rounded-full object-cover',
        }"
        />

        <figcaption class="flex flex-col">
            <p class="ngText font-semibold leading-tight">{{ request.sender.userName }}</p>
            <time
            class="text-xs  text-brand-color"
            [attr.datetime]="request.createdAt"
            >
            {{ request.createdAt | date: 'mediumDate' }}
            </time> 
        </figcaption>
        </figure>

        <nav aria-label="Friend request actions" class="grid grid-cols-2 gap-2">
          
        <button
            type="button"
            (click)="cancelRequest((request._id || '') , (request.sender._id || ''))"
            class="w-full btn btn-xs sm:btn-sm
            text-dark dark:text-light bg-light dark:bg-dark hover:opacity-80 duration-200  
            border-2 border-brand-color
            transition-all border-none"
            aria-label="Remove friend request from {{ request.sender.userName }}"
          >
            Remove
          </button>
          <button
            type="button"
            (click)="acceptFriendRequest((request._id || '') , request.sender)"
            class="w-full btn btn-xs sm:btn-sm text-dark  bg-brand-color hover:opacity-80 duration-200 
            transition-all border-none"
            aria-label="Accept friend request from {{ request.sender.userName }}"
          >
            Accept
          </button>
        </nav>
        } 
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
  </ul>
</section>

  `,
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class FriendRequests implements OnInit {
      userProfileService = inject(UserProfileService);
  
      cancelRequest(requestId : string , receiverId : string) : void {
      if(!requestId || !receiverId) return ;
      this.userProfileService.cancelFriendRequest(requestId , receiverId ).subscribe()
      }

      acceptFriendRequest(requestId : string , sender : Author ) : void {
      if(!requestId || !sender) return ;
      this.userProfileService.acceptFriendRequest(requestId , sender).subscribe()
      }


      ngOnInit(): void {
      this.userProfileService.getReceivedFriendRequests().subscribe();
      }

}
