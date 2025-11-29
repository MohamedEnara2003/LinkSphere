import { Component, HostListener, model, output} from '@angular/core';

@Component({
  selector: 'app-unfriend-popup',
  template: `

<nav
  class="hidden md:flex absolute top-full  w-full bg-card-light dark:bg-card-dark rounded-2xl shadow-lg 
  border border-base-200 dark:border-base-content/20 flex-col gap-1 py-2 animate-opacity z-40"
  role="menu"
  aria-label="Friend actions"
    (click)="stop($event)"
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
        <span>UnFriend</span>
      </button>
    </li>

    <!-- 🟢 New Cancel button for Desktop -->
    <li>
      <button
        type="button"
        class="w-full flex items-center justify-center gap-2 px-4 py-2 text-left text-sm text-gray-400 hover:text-gray-600 transition cursor-pointer"
        role="menuitem"
        aria-label="Cancel and close menu"
        (click)="closeMenu()"
      >
        Cancel
      </button>
    </li>
  </ul>
</nav>


<!-- ✅ Mobile Bottom Sheet -->
<section
  class="fixed inset-0 bg-black/40 z-50 flex items-end md:hidden"
  role="dialog"
  aria-modal="true"
  aria-labelledby="friendOptionsTitle"
  aria-describedby="friendOptionsDesc"
  tabindex="-1"
  (click)="closeMenu()"
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
          (click)="unFriend(); stop($event)"
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
          <span>UnFriend</span>
        </button>
      </li>

      <li>
        <button
          type="button"
          class="w-full py-2 text-sm text-gray-400 hover:text-gray-600"
          (click)="closeMenu()"
          aria-label="Cancel and close menu"
        >
          Cancel
        </button>
      </li>
    </ul>
  </article>
</section>


  `
})
export class UnFriendPopup {
    isLoad = model<boolean>(false);
    
    onUnFriend = output<void>();

  @HostListener('document:click')
  closeMenu(): void {
  this.isLoad.set(false);
  }

stop(event: Event): void {
event.stopPropagation();
}


unFriend() : void {
this.onUnFriend.emit();
this.isLoad.set(false);
}

}
