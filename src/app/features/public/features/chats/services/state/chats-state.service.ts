import { computed, Injectable, signal } from '@angular/core';
import { IChat, IMessage } from '../../../../../../core/models/chats.model';
import { _ } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})

export class ChatsStateService {

// Chat State

// Private
#_userChat = signal<IMessage[]>([]);

// Public
public userChat = computed(() => this.#_userChat());

//____________________________________________________________


// Update All Chat State

// Update Get User Chat
updateGetUserChat(chat : IMessage[]) : void {
this.#_userChat.set(chat);
}

//____________________________________________________________

// Update Created Message

updateCreatedNewMessage(newChat : IMessage) : void {
this.#_userChat.update((chat) => [...chat , newChat]);
}

}