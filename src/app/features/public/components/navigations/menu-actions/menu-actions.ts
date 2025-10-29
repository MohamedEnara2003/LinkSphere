import { Component, HostListener, output, input, signal, computed, inject } from '@angular/core';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { UserProfileService } from '../../../pages/profile/services/user-profile.service';

export type ActionType = 'edit' | 'delete' | 'freeze' | 'unFreeze';

export interface IMenuAction {
  type: ActionType ;
  label: string;
  icon?: 'edit' | 'delete' | 'freeze'  | 'default';
  variant?: 'info' | 'danger' | 'warning';
}

@Component({
  selector: 'app-ng-menu-actions',
  imports: [SharedModule],
  template: `
    @if(isMyMenu()){ 
    <section class="relative select-none">
      <!-- Trigger -->
      <button
        type="button"
        (click)="toggleMenu($event)"
        class="btn btn-sm btn-circle bg-card-light dark:bg-card-dark hover:opacity-80 transition"
        [attr.title]="title() || 'Menu'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 
            0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 
            0-1.5.75.75 0 0 1 0 1.5ZM12 
            18.75a.75.75 0 1 1 0-1.5.75.75 
            0 0 1 0 1.5Z" />
        </svg>
      </button>

      <!-- Dropdown -->
      @if (isOpen()) {
        <nav
          class="w-50 absolute right-0 top-10 z-50  ngCard   
          flex flex-col gap-1 py-2 animate-opacity"
          (click)="$event.stopPropagation()"
        >
          @for (action of actions(); track action.type) {
            <button
                [title]="action.label"
                type="button"
                (click)="handleAction(action.type)"
                class="w-full flex items-center gap-2 px-4 py-2 text-left rounded-md transition text-sm"
                [ngClass]="{
                'hover:bg-info/10': action.variant === 'info',
                'hover:bg-warning/10': action.variant === 'warning',
                'text-error hover:bg-error/10': action.variant === 'danger',
                'hover:bg-base-200/50': !action.variant
                }"
                >

            @switch (action.icon) {
            @case ('edit') {
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
            }
            @case ('delete') {
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
            stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            }
            @case ('freeze') {
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M10.5 8.25h3l-3 4.5h3" />
            </svg>
            }
            }

            {{ action.label }}
            </button>
        }
    </nav>
    }
    </section>
}
`,
})
export class NgMenuActions {
  #userService = inject(UserProfileService);
  actions = input<IMenuAction[]>([]);
  title = input<string>('');
  userId = input<string>('');
  action = output<ActionType>();
  isOpen = signal(false);

  isMyMenu = computed<boolean>(() => this.#userService.user()?._id === this.userId());

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isOpen.set(!this.isOpen());
  }

  @HostListener('document:click')
  onCloseMenu() {
    this.isOpen.set(false);
  }

  handleAction(type: ActionType) {
    this.action.emit(type);
    this.onCloseMenu();
  }
}
