import { Component, signal, inject } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/shared.module';
import { UserProfileService } from '../../pages/profile/services/user-profile.service';
import { IconRenderer } from "./Icon-renderer/Icon-renderer";

@Component({
  selector: 'app-main-links',
  imports: [SharedModule, IconRenderer],
  template: `
    <ul class="w-full grid grid-cols-5 gap-1  
    text-text-dark md:text-text-light dark:md:text-text-dark">

      @for (link of navLinks(); track link.title) {
        @if (userService.user() || !link.requiresUser) {
          <li  class="indicator w-full  group relative">
            <a
              [routerLink]="link.router(userService.user()?._id || '')"
              [queryParams]="link.queryParams || {}"
              routerLinkActive="active-link"
              [routerLinkActiveOptions]="{ exact: true }"
              class="w-full flex flex-col justify-center items-center hover:text-brand-color duration-200 
              transition-colors py-1 "
            >
            
              <app-icon-renderer 
              [svgString]="link.icon"
              styleClass="size-6 sm:size-8 md:size-7 lg:size-8"
              fill="solid"
              />
              <span class="md:sr-only text-[10px]">{{ link.title | translate }}</span>
            </a>

          <span class="hidden md:inline indicator-item indicator-end badge bg-brand-color 
          text-dark opacity-0 group-hover:opacity-100  transition-opacity duration-400 mt-1">
          {{link.title | translate}}
          </span>

          </li>
        }
      }
    </ul>
  `
})
export class MainLinks {
  userService = inject(UserProfileService);

  navLinks = signal([
    {
      title: 'navigation.home',
      router: () => ['/public/feed'],
      requiresUser: false,
      icon: `
        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
        <path d="m12 5.432 8.159 8.159v6.198c0 1.035-.84 1.875-1.875 1.875H15v-5.25h-6V21H5.625A1.875 1.875 0 0 1 3.75 19.125v-6.198L12 5.432Z" />
      `
    },
    {
      title: 'navigation.friends',
      router: (id: string) => ['/public/profile/user', id],
      queryParams: { list: 'Friends' },
      requiresUser: true,
      icon: `
        <path fill-rule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clip-rule="evenodd" />
        <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
      `
    },
    {
      title: 'navigation.profile',
      router: (id: string) => ['/public/profile/user', id],
      requiresUser: true,
      queryParams: { list: 'Posts' },
      icon: `
        <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
      `
    },
    {
      title: 'navigation.chats',
      router: () => ['/public/chats'],
      requiresUser: false,
      icon: `
      <path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" clip-rule="evenodd" />
      `
    },
    {
      title: 'navigation.settings',
      router: () => ['/public/settings'],
      requiresUser: false,
      icon: `
      <path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clip-rule="evenodd" />
      `
    }
  ]);
}
