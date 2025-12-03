import { Component, input,  } from '@angular/core';
import { NgImage } from "../../../../../../../../shared/components/ng-image/ng-image";
import { BackLink } from "../../../../../../../../shared/components/links/back-link";
import { IFriend } from '../../../../../../../../core/models/user.model';

@Component({
  selector: 'app-chat-header',
  template: `
    <header 
      class="size-full flex items-center justify-between px-2  ngCard rounded-none"
      role="banner"
      aria-label="Chat header"
    >
      <!-- Left: Chat Info -->
      <div class="flex items-center gap-3">
        <app-back-link  />
        <app-ng-image
              [options]="{
                src : user()?.picture?.url || '',
                alt : 'Profile picture of ' + user()?.userName || '',
                width : 40,
                height : 40,
                class : 'size-10 rounded-full object-cover border border-gray-300 dark:border-gray-60'
              }" 
            />
        <div>

          <h2 class="font-semibold ngText ">
          {{user()?.userName || ''}}
          </h2>
          <p class="text-xs text-brand-color">
            Online
          </p>
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-center gap-2">
        <button 
          type="button" 
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Start a call"
        >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path fill-rule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clip-rule="evenodd" />
        </svg>
        </button>

        <button 
          type="button" 
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Search in chat"
        >

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
        </svg>

        </button>
        <button 
          type="button" 
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="More options"
        >
        ⋮
        </button>
      </div>
    </header>
  `,
  styles: ``,
  imports: [NgImage, BackLink]
})
export class ChatHeaderComponent {

user = input<IFriend>();




}
