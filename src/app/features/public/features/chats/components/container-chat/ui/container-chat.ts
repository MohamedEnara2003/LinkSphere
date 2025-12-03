
import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { ChatHeaderComponent } from "../components/chat-header/chat-header";
import { ChatCreateMessageComponent } from "../components/chat-create-message/chat-create-message";
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {  catchError, map, of, tap } from 'rxjs';
import { SocketService } from '../../../../../../../core/services/api/socket.service';
import { ICreateMessage, IMessage } from '../../../../../../../core/models/chats.model';
import { ChatsStateService } from '../../../services/state/chats-state.service';
import { Author, IFriend } from '../../../../../../../core/models/user.model';
import { UserProfileService } from '../../../../profile/services/user-profile.service';
import { DomService } from '../../../../../../../core/services/document/dom.service';
import { ChatBody } from "../components/chat-body/chat-body";
import { SoundService } from '../../../../../../../core/services/sound/sound.service';


@Component({
  selector: 'app-chat-container',
  imports: [SharedModule, ChatHeaderComponent, ChatCreateMessageComponent, ChatBody],
  template: `
<section class="w-full min-h-svh ngCard rounded-none "
  ngClass="{{ chatId() ? 'block' : 'hidden md:block' }}"
  [attr.aria-label]="'chats.chat_container' | translate">

  @if (chatId()) {
    <main class="w-full flex flex-col justify-between ">
    <!-- Chat Header -->
    <app-chat-header
    [user]="friend()"
    class="w-full h-[10svh] sticky top-0 bg-dark z-50"
    />

    <!-- Messages -->
    <app-chat-body [chatId]="chatId()!"  />


    <!-- Create Message -->
    <footer class="w-full h-[10svh] sticky bottom-0 z-50 px-2  ngCard rounded-none">
      <app-chat-create-message (sendMessage)="sendMessage($event)" />
    </footer>

    </main>

  } @else {
    <main class="w-full h-svh flex-1 flex-col hidden md:flex">
      <header class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-lg font-bold">{{ 'chats.select_chat' | translate }}</h1>
      </header>
      <div class="flex-1 flex items-center justify-center text-gray-400">
        <p>{{ 'chats.no_chat_selected' | translate }}</p>
      </div>
    </main>
  }
</section> 

  `,

})
export class ChatContainer implements OnInit {
  readonly #route = inject(ActivatedRoute);

  readonly #socketService = inject(SocketService);
  readonly #userProfile = inject(UserProfileService);
  readonly #domService = inject(DomService);
  readonly #soundService = inject(SoundService);
  readonly chatsStateService = inject(ChatsStateService);


  readonly chatId = toSignal( this.#route.paramMap.pipe( map(params => params.get('chatId'))),
  { initialValue: null }
  );

  userChat = computed(() => this.chatsStateService.userChat() || [])

  friend = computed<IFriend>(() => {
  const me = this.#userProfile.user();
  const chatId = this.chatId();
  if(!me || !chatId) return {} as IFriend;
  const friend  = (me.friends || []).find((f) => f._id === chatId)!;
  return friend ;
  })


  constructor(){
  this.#listenToSocketEvents();
  effect(() => { 
  if(this.userChat()) {
  this.#initScrollDown();
  }
  })
  }
  
  ngOnInit(): void {
  this.#soundService.loadSound('send-message', '/sounds/SendMessage.wav');
  this.#soundService.loadSound('receive-message', '/sounds/ReceiveMessage.wav');
  }


  public sendMessage(content : string) : void {
  const sendTo = this.chatId()|| '';
  if(!content || !sendTo ) return;
  const data : ICreateMessage = { content, sendTo };
  this.#socketService.emit<ICreateMessage>('send-message', data , () => {});
  }

#listenToSocketEvents() {
  this.#handleSendMessage();
  this.#handleReceiveMessage();
}


#handleSendMessage() {
  this.#socketService.on<{ content: string; messageId: string }>('success-message')
    .pipe(
      tap(({ content, messageId }) => {
        const user = this.#userProfile.user();
        if (!user) return;

        const sender: Author = {
          _id: user._id,
          id: user._id,
          picture: user.picture,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
        };

        this.#updateCreatedNewMessage(content, messageId, sender, true);
        this.#playSoundEffect('send-message');
      }),
      catchError((err) => {
        console.error('Error sending message', err);
        return of({ content: '', messageId: '' });
      }),
      takeUntilDestroyed(),
    )
    .subscribe();
}


#handleReceiveMessage() {
  this.#socketService.on<{ content: string; messageId: string; from: Author }>('new-message')
    .pipe(
      tap(({ content, messageId, from }) => {
        this.#updateCreatedNewMessage(content, messageId, from, false);
        this.#playSoundEffect('receive-message');
      }),
      catchError((err) => {
      console.error('Error receiving message', err);
      return of({ content: '', messageId: '' });
      }),
      takeUntilDestroyed(),
    )
    .subscribe();
}


  #updateCreatedNewMessage(content :string , messageId : string , user : Author , isMyMessage : boolean) : void {
    const  message : IMessage = {
    sender: user,
    isMyMessage,
    _id: messageId,
    content,
    createdBy: user._id,
    seen: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }


  this.chatsStateService.updateCreatedNewMessage(message);
  }


#playSoundEffect(name :  string) : void {
this.#soundService.play(name);
}

#initScrollDown() {
requestAnimationFrame(() => {
const body = this.#domService.document.documentElement;
body.scrollTop = body.scrollHeight;
});
}



  ngOnDestroy(): void {
  this.#socketService.disconnect()
  }


}


