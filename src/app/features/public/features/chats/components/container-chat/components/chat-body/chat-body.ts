
import { Component, computed, inject, input, signal } from '@angular/core';
import { NgImage } from "../../../../../../../../shared/components/ng-image/ng-image";
import { SharedModule } from '../../../../../../../../shared/modules/shared.module';
import { GetChatService } from '../../../../services/api/get-chat.service';
import { ChatsStateService } from '../../../../services/state/chats-state.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';


@Component({
  selector: 'app-chat-body',
  imports: [NgImage , SharedModule],
  template: `
    <!-- Messages -->
    <section class="w-full min-h-[80svh] p-4 flex flex-col gap-5 bg-light dark:bg-dark"
    aria-live="polite"
    [attr.aria-label]="'chats.chat_messages' | translate"
    role="log">

  @if (loading()) { 
       <div 
        class="h-8 sm:h-10 flex items-center gap-2" >
        <div class="size-10 ng-skeleton rounded-full"></div>
        <div class="w-40 sm:w-60 h-full rounded-none ng-skeleton "></div>
        </div>
  }@else { 

        @for (chat of userChat(); track chat._id) {
        @defer (on viewport) {
        <article class="chat" 
        ngClass="{{ chat.isMyMessage ? 'chat-end' : 'chat-start' }}"
        [attr.aria-label]="'chats.chat_message' | translate">
            <!-- Avatar -->
            <figure class="chat-image avatar"> 
            <app-ng-image [options]="{
                src: chat.sender.picture?.url || '/user-placeholder.webp',
                alt: ('chats.profile_picture_of' | translate) + ' ' + chat._id,
                width: 40,
                height: 40,
                class: 'object-cover rounded-full'
            }" class="size-8 sm:size-10" />
            <figcaption class="sr-only">{{chat.sender.userName || ''}}</figcaption>
            </figure>

            <!-- Message Text -->
            @if(chat.content){
            <p class="chat-bubble" 
            ngClass="{{ chat.isMyMessage ? 'bg-brand-color text-dark' : 'bg-card-dark text-light' }}">
            {{chat.content}}
            </p>
            }
        </article>
        }@placeholder {
        <div 
        class="h-8 sm:h-10 flex items-center gap-2" >
        <div class="size-10 ng-skeleton rounded-full"></div>
        <div class="w-40 sm:w-60 h-full rounded-none ng-skeleton "></div>
        </div>
        }
        }
}
    </section>
`,
providers : [
GetChatService
]
})
export class ChatBody{
readonly #getChatService = inject(GetChatService);
readonly chatsStateService = inject(ChatsStateService);
userChat = computed(() => this.chatsStateService.userChat() || [])

chatId = input<string>();
loading = signal<boolean>(false);

constructor() {
this.#getChats()
}

#getChats() : void {
toObservable(this.chatId).pipe(
switchMap((chatId) => {
if(!chatId) return of(null);
this.loading.set(true);
return this.#getChatService.getUserChats(chatId , 1 , 20);
}),
takeUntilDestroyed()
).subscribe({
next: () => this.loading.set(false),
error: () => this.loading.set(false)
});
}


}


