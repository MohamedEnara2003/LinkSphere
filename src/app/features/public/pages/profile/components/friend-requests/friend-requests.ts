import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { UserProfileService } from '../../services/user-profile.service';
import { NgImage } from "../../../../../../shared/components/ng-image/ng-image";
import { IUser } from '../../../../../../core/models/user.model';

@Component({
  selector: 'app-friend-requests',
  imports: [SharedModule, NgImage],
  template : `
  <section
  aria-label="Recent friend requests"
  role="complementary"
  class="w-full p-1 ">

    <ul class="space-y-2" role="list">

    @for (request of userProfileService.receivedRequests(); track request.requestId) {
    <li
        class="w-full flex flex-col  gap-3 p-3 rounded-xl bg-card-light/40 dark:bg-card-dark/40
        transition-colors duration-200 "
        role="article"
        aria-label="Friend request item">

        @defer (on viewport) {

        <figure class="flex items-center gap-3">
        <app-ng-image
        [routerLink]="['/public/profile/user' , request.sender._id]"
        [options]="{
        src :  request.sender.picture ||  '/user-placeholder.jpg',
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
            (click)="cancelRequest(request.requestId || '')"
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
            (click)="acceptFriendRequest(request.requestId || '' , request.sender)"
            class="w-full btn btn-xs sm:btn-sm text-dark  bg-brand-color hover:opacity-80 duration-200 
            transition-all border-none"
            aria-label="Accept friend request from {{ request.sender.userName }}"
          >
            Accept
          </button>
        </nav>
      }@placeholder {
      <div class="w-full h-20"></div>
      }
      </li>
    }
  </ul>
</section>

  `,
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class FriendRequests {
      userProfileService = inject(UserProfileService);
  

      cancelRequest(requestId : string) : void {
      if(!requestId) return ;
      this.userProfileService.cancelFriendRequest(requestId).subscribe()
      }

      acceptFriendRequest(requestId : string , sender : IUser ) : void {
      if(!requestId || !sender) return ;
      this.userProfileService.acceptFriendRequest(requestId , sender).subscribe()
      }


}
