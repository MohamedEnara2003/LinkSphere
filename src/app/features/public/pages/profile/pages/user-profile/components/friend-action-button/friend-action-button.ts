import { Component, computed, inject, signal} from '@angular/core';

import { SharedModule } from '../../../../../../../../shared/modules/shared.module';
import { UserProfileService } from '../../../../services/user-profile.service';

@Component({
selector: 'app-friend-action-button',
imports: [SharedModule],
template: `

<section class="w-full relative "> 
<button 
type="button" 
class="w-full ngBtn btn-neutral bg-light dark:bg-dark hover:opacity-80 transition duration-300 
text-brand-color border-transparent"
[ngClass]="type() === 'requestSent' ? 'bg-transparent border-light dark:border-dark' : ''"
(click)="onUserAction()">


@switch (type()) {
@case ('notFriend') {
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
<path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
</svg>
Add friend
}

@case ('friend') {
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
<path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
</svg>
Friend
}

@case ('requestSent') {
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
<path fill-rule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clip-rule="evenodd" />
</svg>  
Cancel request
}

@case ('requestReceived') {
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
<path fill-rule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
</svg>
Confirm
}

}
</button>

@if(isOpenFriendMenu()){

<!-- ✅ Desktop Dropdown Menu -->
<nav
  class="hidden md:flex absolute top-full mt-2 w-full bg-card-light dark:bg-card-dark rounded-2xl shadow-lg 
  border border-base-200 dark:border-base-content/20 flex-col gap-1 py-2 animate-opacity z-40"
  role="menu"
  aria-label="Friend actions"
  (click)="$event.stopPropagation()"
>
  <ul role="menu" class="flex flex-col gap-1 w-full">
    <li>
      <button
        type="button"
        class="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-error/10 transition cursor-pointer"
        role="menuitem"
        aria-label="Unfriend this user"
        (click)="unFriend()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
          />
        </svg>
        <span>Unfriend</span>
      </button>
    </li>

    <!-- 🟢 New Cancel button for Desktop -->
    <li>
      <button
        type="button"
        class="w-full flex items-center justify-center gap-2 px-4 py-2 text-left text-sm text-gray-400 hover:text-gray-600 transition cursor-pointer"
        role="menuitem"
        aria-label="Cancel and close menu"
        (click)="isOpenFriendMenu.set(false)"
      >
        Cancel
      </button>
    </li>
  </ul>
</nav>

<!-- ✅ Mobile Bottom Sheet -->
<section
  class="fixed inset-0 bg-black/40 z-30 flex items-end md:hidden"
  role="dialog"
  aria-modal="true"
  aria-labelledby="friendOptionsTitle"
  aria-describedby="friendOptionsDesc"
  tabindex="-1"
  (click)="isOpenFriendMenu.set(false)"
>
  <article
    class="w-full bg-card-light dark:bg-card-dark rounded-t-2xl shadow-xl p-4 animate-up"

  >
    <header class="text-center mb-3">
      <h2 id="friendOptionsTitle" class="font-medium">Friend Options</h2>
      <p id="friendOptionsDesc" class="sr-only">
        Manage your friendship options such as unfriend or cancel.
      </p>
    </header>

    <ul role="menu" class="flex flex-col gap-2">
      <li>
        <button
          type="button"
          class="w-full flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-error/10 transition"
          role="menuitem"
          aria-label="Unfriend this user"
          (click)="unFriend()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
            />
          </svg>
          <span>Unfriend</span>
        </button>
      </li>

      <li>
        <button
          type="button"
          class="w-full py-2 text-sm text-gray-400 hover:text-gray-600"
          (click)="isOpenFriendMenu.set(false)"
          aria-label="Cancel and close menu"
        >
          Cancel
        </button>
      </li>
    </ul>
  </article>
</section>
}
</section>

`,
})
export class FriendActionButton {
#userProfileService = inject(UserProfileService);
public type = computed(() => this.#userProfileService.relationshipState())


isOpenFriendMenu = signal<boolean>(false);

onUserAction() : void {
    switch(this.type()){
    case 'notFriend': this.#sendFriendRequest();
    break
    case 'friend': this.isOpenFriendMenu.set(!this.isOpenFriendMenu());
    break
    case 'requestSent': this.#cancelRequest();
    break
    case 'requestReceived': this.#accepRequest();
    }
}
    
    unFriend() : void {
    const userProfile = this.#userProfileService.userProfile();
    if(!userProfile) return ;
    this.#userProfileService.unFriend(userProfile._id || '').subscribe();
    this.isOpenFriendMenu.set(false);
    }

    
    #sendFriendRequest() : void {
      const  userProfile = this.#userProfileService.userProfile()!;
      if(!userProfile) return ;
      this.#userProfileService.sendFriendRequest(userProfile).subscribe();
    }
    
    #cancelRequest() : void {
    const  {_id : userProfileId} = this.#userProfileService.userProfile()!;
    if(!userProfileId) return ;
    // this.#userProfileService.cancelFriendRequest(sentRequests?.requestId || '').subscribe()
    }
    
    #accepRequest() : void {
    const  {_id : userProfileId} = this.#userProfileService.userProfile()!;
    if(!userProfileId) return ;
    
    const sentRequests = this.#userProfileService.receivedRequests().find((s) => s.sender._id === userProfileId);
    console.log(sentRequests);
    
    if(sentRequests){
    this.#userProfileService.acceptFriendRequest(sentRequests.requestId || '' , sentRequests.sender).subscribe()
    }
    }
}
