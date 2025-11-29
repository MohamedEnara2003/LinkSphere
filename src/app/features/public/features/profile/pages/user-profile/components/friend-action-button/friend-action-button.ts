import { Component, inject, input, signal} from '@angular/core';

import { SharedModule } from '../../../../../../../../shared/modules/shared.module';
import { UserProfileService } from '../../../../services/user-profile.service';

import { IUser, RelationshipState } from '../../../../../../../../core/models/user.model';
import { UnFriendPopup } from '../../../../components/un-friend-popup/un-friend-popup';

@Component({
selector: 'app-friend-action-button',
imports: [SharedModule, UnFriendPopup],
template: `

<section class="w-full relative "> 
<button 
type="button" 
class="w-full btn btn-sm sm:btn-md btn-neutral bg-light dark:bg-dark hover:opacity-80 transition duration-300 
text-brand-color border-transparent"
[ngClass]="relationshipState() === 'requestSent' ? 'bg-transparent border-light dark:border-dark' : ''"
(click)="onUserAction()">


@switch (relationshipState()) {
@case ('notFriend') {
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 sm:size-6">
<path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
</svg>
Add friend
}

@case ('isFriend') {
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 sm:size-6">
<path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
</svg>
Friend
}

@case ('requestSent') {
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 sm:size-6">
<path fill-rule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clip-rule="evenodd" />
</svg>  
Cancel request
}

@case ('requestReceived') {
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 sm:size-6">
<path fill-rule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
</svg>
Confirm
}

}
</button>

@if(isOpenUnFriendPopup()){
<app-unfriend-popup
[isLoad]="isOpenUnFriendPopup()"
(isLoadChange)="isOpenUnFriendPopup.set($event)"
(onUnFriend)="unFriend()"
/>
}

</section>

`,
})
export class FriendActionButton {
#userProfileService = inject(UserProfileService);

relationshipState = input<RelationshipState>();
isOpenUnFriendPopup = signal<boolean>(false);

userProfile = input<IUser | null>(null);

onUserAction() : void {
    switch(this.relationshipState()){
    case 'notFriend': this.#sendFriendRequest();
    break
    case 'isFriend': this.isOpenUnFriendPopup.set(!this.isOpenUnFriendPopup());
    break
    case 'requestSent': this.#cancelRequest();
    break
    case 'requestReceived': this.#accepRequest();
    }
}
    
    // unFriend 
    unFriend() : void {
    const userProfile = this.userProfile();
    if(!userProfile) return ;
    this.#userProfileService.unFriend(userProfile._id || '').subscribe();
    this.isOpenUnFriendPopup.set(false);
    }

    // Send Request
    #sendFriendRequest() : void {
    const userProfile = this.userProfile();
    if(!userProfile) return ;
    this.#userProfileService.sendFriendRequest(userProfile).subscribe();
    }

    // Cancel Request
    #cancelRequest() : void {
    const userProfile = this.userProfile();
    if(!userProfile) return ;

    const requestSentRequest  = 
    this.#userProfileService.sentRequests().find(({receiver}) => (receiver._id || '')
    === userProfile._id)!

    if(!requestSentRequest) return;
    const {_id : requestId , receiver : {_id : receiverId}} = requestSentRequest;
    this.#userProfileService.cancelFriendRequest(requestId , receiverId).subscribe()
    }
    
    // Accep Request
    #accepRequest() : void {
    const userProfile = this.userProfile();
    if(!userProfile) return ;
    
    const requestSentRequests = 
    this.#userProfileService.receivedRequests().find((s) => s.sender._id === userProfile._id);

    if(requestSentRequests){
    this.#userProfileService.acceptFriendRequest(
    requestSentRequests._id || '' , requestSentRequests.sender
    ).subscribe()
    }
    }
}
