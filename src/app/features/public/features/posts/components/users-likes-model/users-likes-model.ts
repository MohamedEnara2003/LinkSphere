import { Component, inject, input, model, OnInit, OnDestroy } from '@angular/core';
import { IUser } from '../../../../../../core/models/user.model';
import { NgImage } from "../../../../../../shared/components/ng-image/ng-image";
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { DomService } from '../../../../../../core/services/document/dom.service';
import { UserProfileService } from '../../../profile/services/user-profile.service';
import { FriendActionButton } from "../../../profile/pages/user-profile/components/friend-action-button/friend-action-button";




@Component({
  selector: 'app-users-likes-model',
  imports: [SharedModule, NgImage, FriendActionButton],
  template : `

    <!-- Overlay -->
  <section 
    class="fixed inset-0 flex items-end justify-center  z-[50]"
    role="dialog"
    aria-modal="true"
    aria-labelledby="postDialogTitle"
    aria-describedby="postDialogDescription"
    role="dialog">


  <article
    class="relative w-full sm:w-[85%] md:w-[80%] lg:w-1/2 h-[60%]  flex flex-col z-50  gap-5
    rounded-t-3xl rounded-b-none ngCard shadow-2xl animate-up overflow-hidden"
    aria-labelledby="users-likes-title" 
    aria-modal="true"
    >

       <header class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 
       flex justify-center items-center">
        <h2 id="users-likes-title" class="card-title ngText">
        {{'likes.title' | translate}}
        </h2>
      </header>

    <!-- users List -->
      <ul 
        class="size-full  gap-5 overflow-y-auto"
        role="list"
        aria-label="List of sent friend users"
      >
  
        @for (user of (likedUsers() || []); track user._id) {
        <li 
        class="w-full  flex items-center justify-between  p-3 ngCard hover:bg-card-dark/90  transition-opacity duration-200"
        role="listitem"
        aria-label="Sent friend user"
        >
        @defer (on viewport) {
        <!-- User Image -->
        <figure 
        [routerLink]="user._id ? ['/public/profile/user/' , user._id] : null"
        class="flex items-center gap-3">

        <div class="relative size-10 sm:size-12 rounded-full">
        <app-ng-image
        [options]="{
        src :  user.picture?.url || '/user-placeholder.webp',
        alt : user.firstName + ' ' + user.lastName  + ' profile picture',
        width  : 200,
        height : 200,
        class : 'size-full rounded-full object-cover',
        }"
        />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
            class="text-brand-color size-5 absolute -bottom-1 -right-1">
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247
            0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688
            15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688
            3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973
            0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739
            9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247
            0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752
            0 0 1-.704 0l-.003-.001Z" />
            </svg>
        </div>

        <figcaption class="flex flex-col">
            <span 
            class="text-sm text-text-light dark:text-text-dark font-medium"
            aria-label="Username"
            >
            {{ user.firstName + ' ' + user.lastName }}
            </span>
            <time 
            class="text-xs text-gray-500 dark:text-gray-400 mt-1"
            [attr.datetime]="user.createdAt"
            aria-label="user date"
            >
            {{ user.createdAt | date:'mediumDate' }}
            </time>
        </figcaption>
        </figure>
        
    
      @if(user.flag !==  'me' && user){
      <app-friend-action-button
      [relationshipState]="user.flag"
      [userProfile]="user"
      />
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
        }@empty {
        <div class="flex flex-col items-center justify-center py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke-width="1.5" stroke="currentColor"
              class="size-12 md:size-16 mb-4 text-gray-400">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597
                1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1
                3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>

        <h1 class="text-2xl md:text-3xl font-bold">
        {{ 'likes.no_likes_title' | translate }}
        </h1>

        <p class="text-sm text-gray-400">
        {{ 'likes.no_likes_subtitle' | translate }} 
        </p>
        </div>
        }
    </ul>
</article>

      <div  (click)="close() "
      class="size-full bg-dark/50 fixed inset-0 z-40"
      [attr.aria-hidden]="!isLoad()"
      tabindex="-1">
      </div>
      
  </section>
`,
})
export class UsersLikesModel implements OnInit, OnDestroy {
  #domService = inject(DomService);
  #usersService = inject(UserProfileService);

  likedUsers = input<IUser[]>([]);
  isLoad = model<boolean>(false);

  ngOnInit(): void {
  this.#domService.setBodyOverflow('hidden');
  }

  close() {
  this.isLoad.set(false);
  }
  
  public isFriend (userId : string) : boolean {
  const user = this.#usersService.user();
  if(!user)  return false;
  const friendsIds = (user.friends || []).map((f) => f._id);
  if(!friendsIds || friendsIds.length === 0)  return false;
  return friendsIds.includes(userId) || true;
  }


  ngOnDestroy(): void {
  this.#domService.setBodyOverflow('auto');
  }
}
