
import { Component, inject, signal } from '@angular/core';
import { ChatHeaderComponent } from "../components/chat-header/chat-header";
import { ChatCreateMessageComponent } from "../components/chat-create-message/chat-create-message";
import { NgImage } from "../../../../../../../shared/components/ng-image/ng-image";
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';


@Component({
  selector: 'app-chat-container',
  imports: [SharedModule, ChatHeaderComponent, ChatCreateMessageComponent, NgImage],
  template: `

  <section 
  class="w-full h-svh ngCard rounded-none border-card-light dark:border-card-dark border"
  ngClass="{{chatId() ? 'block' : 'hidden md:block'}}"
  aria-label="Chat container"
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
      aria-label="Chat messages"
      role="log"
      style="scrollbar-width: none;"
    >
      @for (chat of chats(); track chat.id) {
        @let isMyMessage = chat.userId === 'user1';
        
        <article 
          class="chat"
          [ngClass]="isMyMessage ? 'chat-end' : 'chat-start'"
          aria-label="Chat message"
        >
          <!-- Avatar -->
          <div class="chat-image avatar">
            <app-ng-image
              [options]="{
                src : chat.image,
                alt : 'Profile picture of ' + chat.userId,
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
            [ngClass]="isMyMessage ? 'bg-brand-color/50 text-white' : 'bg-card-dark text-light'"
          >
            {{ chat.message }}
          </p>
        </article>
      }
    </section>

    <!-- Create Message -->
    <footer>
      <app-chat-create-message />
    </footer>
  </main>
  }@else {
 <main class="flex-1  flex-col hidden md:flex">
        <header class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 class="text-lg font-bold">Select a chat</h1>
        </header>

        <div class="flex-1 flex items-center justify-center text-gray-400">
          <p>No chat selected</p>
        </div>
  </main>
  }
</section>

  `
})
export class ChatContainer{
  #route = inject(ActivatedRoute);
  chatId = toSignal( this.#route.paramMap.pipe( map(params => params.get('chatId'))),
  { initialValue: null }
  );

  chats = signal([
  {id : 1 , userId : 'user1' , message : 'Hello Mohamed 👋' ,image : 'https://randomuser.me/api/portraits/men/1.jpg'},
  {id : 2 , userId : 'user2' , message : 'Hi! How are you?' , image : 'https://randomuser.me/api/portraits/men/2.jpg'},
  {id : 3 , userId : 'user1' , message : 'Hello Mohamed 👋' ,image : 'https://randomuser.me/api/portraits/men/1.jpg'},
  {id : 4 , userId : 'user2' , message : 'Hi! How are you?' , image : 'https://randomuser.me/api/portraits/men/2.jpg'},
  {id : 5 , userId : 'user1' , message : 'Hello Mohamed 👋' ,image : 'https://randomuser.me/api/portraits/men/1.jpg'},
  {id : 6 , userId : 'user2' , message : 'Hi! How are you?' , image : 'https://randomuser.me/api/portraits/men/2.jpg'},
  {id : 7 , userId : 'user1' , message : 'Hello Mohamed 👋' ,image : 'https://randomuser.me/api/portraits/men/1.jpg'},
  {id : 8 , userId : 'user2' , message : 'Hi! How are you?' , image : 'https://randomuser.me/api/portraits/men/2.jpg'},
  {id : 9 , userId : 'user1' , message : 'Hello Mohamed 👋' ,image : 'https://randomuser.me/api/portraits/men/1.jpg'},
  {id :10 , userId : 'user2' , message : 'Hi! How are you?' , image : 'https://randomuser.me/api/portraits/men/2.jpg'},
  {id :11 , userId : 'user1' , message : 'Hello Mohamed 👋' ,image : 'https://randomuser.me/api/portraits/men/1.jpg'},
  {id :12 , userId : 'user2' , message : 'Hi! How are you?' , image : 'https://randomuser.me/api/portraits/men/2.jpg'},
  ])
}


