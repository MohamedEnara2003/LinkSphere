
import { Component, computed, effect, inject } from '@angular/core';
import { ChatHeaderComponent } from "../components/chat-header/chat-header";
import { ChatCreateMessageComponent } from "../components/chat-create-message/chat-create-message";
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {  map, of, switchMap } from 'rxjs';
import { GetChatService } from '../../../services/api/get-chat.service';
import { SocketService } from '../../../../../../../core/services/api/socket.service';
import { ICreateMessage, IMessage } from '../../../../../../../core/models/chats.model';
import { ChatsStateService } from '../../../services/state/chats-state.service';
import { Picture } from '../../../../../../../core/models/picture';
import { Author } from '../../../../../../../core/models/user.model';
import { NgImage } from "../../../../../../../shared/components/ng-image/ng-image";
import { UserProfileService } from '../../../../profile/services/user-profile.service';


@Component({
  selector: 'app-chat-container',
  imports: [SharedModule, ChatHeaderComponent, ChatCreateMessageComponent, NgImage],
  template: `

  <section 
  class="w-full h-svh ngCard rounded-none border-card-light dark:border-card-dark border"
  ngClass="{{chatId() ? 'block' : 'hidden md:block'}}"
  [attr.aria-label]="'chats.chat_container' | translate"
>

  @if (chatId()) {
  <!-- Main Chat Area -->
  <main [aria-label]="'Chat container ' + chatId()" role="main" 
  class="size-full flex flex-col justify-between">
    
    <!-- Chat Header -->
    <app-chat-header
      [title]="'Mohamed Enara'" 
      [status]="'Online'" 
      [avatar]="'https://randomuser.me/api/portraits/men/1.jpg'"
    />

    <!-- Messages -->
    <section 
      class="flex-1 overflow-y-auto p-4 space-y-3 bg-light dark:bg-dark"
      aria-live="polite"
      [attr.aria-label]="'chats.chat_messages' | translate"
      role="log"
      style="scrollbar-width: none;"
    >



      @for (chat of userChat(); track chat._id) {
 

        <article 
          class="chat"
          [ngClass]="chat.isMyMessage ? 'chat-end' : 'chat-start'"
          [attr.aria-label]="'chats.chat_message' | translate"
        >
        
          <!-- Avatar -->
          <div class="chat-image avatar">
            <app-ng-image
              [options]="{
                src : chat.sender.picture?.url || '/user-placeholder.webp',
                alt : ('chats.profile_picture_of' | translate) + ' ' + chat._id,
                width : 40,
                height : 40,
                class : 'object-cover rounded-full'
              }" 
              class="size-10"
            />
          </div>

          <!-- Message Text -->
          <p 
            class="chat-bubble"
            [ngClass]="chat.isMyMessage ? 'bg-brand-color text-dark' : 'bg-card-dark text-light'"
          >
            {{ chat.content }}  
          </p>
 
        </article>
      }
    </section>

    <!-- Create Message -->
    <footer>
      <app-chat-create-message 
      (sendMessage)="sendMessage($event)"
      />
    </footer>
  </main>
  }@else {
 <main class="size-full flex-1  flex-col hidden md:flex">
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
  providers : [
  GetChatService
  ]
})
export class ChatContainer{
  readonly #route = inject(ActivatedRoute);
  readonly #getChatService = inject(GetChatService);
  readonly #socketService = inject(SocketService);
  readonly #userProfile = inject(UserProfileService);

  readonly chatsStateService = inject(ChatsStateService);


  readonly chatId = toSignal( this.#route.paramMap.pipe( map(params => params.get('chatId'))),
  { initialValue: null }
  );

  userChat = computed(() => this.chatsStateService.userChat() || [])



  constructor(){
  this.#getChats();
  this.listenToSocketEvents();
  }

  #getChats() : void {
  toObservable(this.chatId).pipe(
  switchMap((chatId) => {
  if(!chatId) return of(null);
  return this.#getChatService.getUserChats(chatId);
  }),
  takeUntilDestroyed()
  ).subscribe()
  }


  sendMessage(msg : string) : void {


  const sendTo = this.chatId()|| '';

  if(!msg || !sendTo ) return;

  const data : ICreateMessage = {
    content: msg ,
    sendTo,
  }


  this.#socketService.emit<ICreateMessage>('send-message', data);

  }

    private listenToSocketEvents() {
    // connect error
    this.#socketService.on<Error>('connect_error')
      .pipe(takeUntilDestroyed())
      .subscribe(err => console.error('Connection failed:', err.message));

    // custom error
    this.#socketService.on<{ message: string }>('custom_error')
      .pipe(takeUntilDestroyed())
      .subscribe(err => console.log('custom_error:', err));

    // like post
    this.#socketService.on<{ postId: string; userId: string }>('like-post')
      .pipe(takeUntilDestroyed())
      .subscribe(data => console.log('likeData:', data));

    // offline user
    this.#socketService.on<{ userId: string }>('offline-user')
      .pipe(takeUntilDestroyed())
      .subscribe(data => console.log('offline-user:', data));

    this.#socketService.on<{content : string}>('success-message')
    .pipe(takeUntilDestroyed())
    .subscribe(({content}) => {
    const user = this.#userProfile.user();
    if(!user) return;
    this.#updateCreatedNewMessage(content , user as any)
    });

    this.#socketService.on<{content : string , from : Author}>('new-message')
    .pipe(takeUntilDestroyed())
    .subscribe(({content , from}) => {
    this.#updateCreatedNewMessage(content , from)
    });
  }

  #updateCreatedNewMessage(content :string , user : Author) : void {
    const  message : IMessage = {
    sender: user as any,
    isMyMessage: true,
    _id: crypto.randomUUID(),
    content,
    createdBy: user._id,
    seen: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  this.chatsStateService.updateCreatedNewMessage(message);
  }

  ngOnDestroy(): void {
  this.#socketService.disconnect()
  }


}


