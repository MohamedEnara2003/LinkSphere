import { Component, computed, inject, signal } from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { BackLink } from "../../../../../../shared/components/links/back-link";
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { UserProfileService } from '../../../profile/services/user-profile.service';
import { IFriend } from '../../../../../../core/models/user.model';


@Component({
    selector: 'app-chat-sidebar',
    imports: [SharedModule, BackLink, TranslateModule],
    template: `
<aside 
  class="w-full h-svh ngCard rounded-none overflow-y-auto 
  p-4 flex flex-col gap-4"
  [ngClass]="chatId() ? 'hidden md:flex' : ''"
  aria-labelledby="chat-sidebar-title">

  <!-- Sidebar Header -->
  <header class="flex items-center gap-2 mb-2">
    <app-back-link path="/public" aria-label="Go back to public page" />
    <h2 id="chat-sidebar-title" class="ngText text-xl font-bold">
      {{ 'chats.title' | translate }}
    </h2>
  </header>

  <!-- Search Chats -->
  <label for="search-chats" class="w-full ng-input flex items-center gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" fill="currentColor" 
        class="size-5 text-gray-400">
      <path fill-rule="evenodd" 
      d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 
      6.75 6.75 0 0 0 0-13.5ZM2.25 
      10.5a8.25 8.25 0 1 1 14.59 
      5.28l4.69 4.69a.75.75 0 1 1-1.06 
      1.06l-4.69-4.69A8.25 8.25 0 0 1 
      2.25 10.5Z" 
      clip-rule="evenodd" />
    </svg>
    <input 
      type="search" 
      id="search-chats"
      [placeholder]="'chats.search_chats' | translate"
      class="w-full bg-transparent focus:outline-none text-sm"
    />
  </label>

<!-- Chats Navigation -->
<nav aria-label="Chat conversations" class="flex-1 overflow-y-auto">
  <ul role="list" class="space-y-2">
    @for (friend of friends(); track friend.id) {
    <li role="listitem">
      <a 
        [href]="['/public/chats/', friend.id]"
        [routerLink]="['/public/chats/', friend.id]"
        class="w-full flex items-center gap-3 p-2 rounded-lg 
        duration-200 transition-colors5 text-left"
        [ngClass]="chatId() === friend._id ? 'border border-brand-color' : ''">
        
        <!-- Avatar -->
        <img 
          [src]="friend.picture?.url || ''" 
          [alt]="('chats.profile_picture_of' | translate) + ' ' + friend.userName " 
          class="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600" 
          loading="lazy"
        />

        <!-- Chat Info -->
        <div class="flex flex-col overflow-hidden">
          <span class="font- text-sm ngText">
            {{ friend.userName }}
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400 truncate">
        
          </span>
        </div>
      </a>
    </li>
    }
  </ul>
</nav>

</aside>

`,

})
export class ChatSidebarComponent {
  readonly #userProfile = inject(UserProfileService);
  #route = inject(ActivatedRoute);
  chatId = toSignal( this.#route.paramMap.pipe(map(params => params.get('chatId')!)),
  { initialValue: '' }
  );

  friends = computed<IFriend[]>(() => this.#userProfile.user()?.friends || []);
}
