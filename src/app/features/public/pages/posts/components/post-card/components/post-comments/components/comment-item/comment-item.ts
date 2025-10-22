import { Component, computed, HostListener, inject, input, signal } from '@angular/core';
import { IComment } from '../../../../../../../../../../core/models/comments.model';
import { NgImage } from "../../../../../../../../../../shared/components/ng-image/ng-image";
import { UserProfileService } from '../../../../../../../profile/services/user-profile.service';
import { CommentService } from '../../../../../../services/comments.service';
import { SharedModule } from '../../../../../../../../../../shared/modules/shared.module';


@Component({
  selector: 'app-comment-item',
  imports: [SharedModule, NgImage],

  // ✅ HTML inline template
  template: `
  <article 
    class=" flex gap-2 items-start p-2 animate-opacity border-b border-base-200 dark:border-base-content/10"
    aria-label="User comment"
  >

    <!-- 🧑‍💻 Author Avatar -->
    <app-ng-image
      [routerLink]="[
        '/public',
        { outlets: { primary: ['profile', 'user', comment().author._id || ''], model: null } }
      ]"
      [options]="{
        src: comment().author.picture || '/user-placeholder.jpg',
        alt: comment().author.userName + ' profile picture',
        width: 100,
        height: 100,
        decoding: 'async',
        fetchpriority: 'high',
        class: 'size-10 rounded-full object-cover border border-base-200 cursor-pointer hover:ring-2 hover:ring-brand-color/50 transition'
      }"
      [isPreview]="!!comment().author.picture"
    />

    <!-- 💬 Comment Content -->
    <section class="relative flex-1 space-y-2">
      <!-- Header -->
      <header class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <a 
            class="font-semibold text-sm text-base-content hover:text-brand-color transition-colors"
            [routerLink]="[
              '/public',
              { outlets: { primary: ['profile', 'user', comment().author._id || ''], model: null } }
            ]"
            aria-label="View user profile"
          >
            {{ comment().author.userName }}
          </a>
          <time
            class="badge-xs badge bg-brand-color/10 text-brand-color border-transparent"
            [attr.datetime]="comment().createdAt"
            aria-label="Comment creation date"
          >
            {{ formatDate(comment().createdAt) }}
          </time>
        </div>

        @if (isMyComment()) {
          <button
            type="button"
            title="Open comment menu"
            (click)="toggleMenu($event)"
            class="btn btn-sm btn-circle bg-card-light dark:bg-card-dark hover:bg-base-200 transition"
            aria-haspopup="true"
            aria-expanded="{{ isOpenMenu() }}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 
                1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 
                0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 
                0 0 1 0 1.5Z" />
            </svg>
          </button>
        }
      </header>

      <!-- Comment Text -->
      <p class="text-sm leading-relaxed text-base-content break-words">
        <span *ngIf="isReplyTagName()" class="text-sm text-brand-color font-semibold">
          {{ '@' + isReplyTagName() }}
        </span>
        {{ comment().content }}
      </p>

      <!-- 🖼️ Comment Image (optional) -->
      @if(comment().attachment) {
        <figure class="mt-2">
          <app-ng-image
            [options]="{
              src: comment().attachment || '',
              alt: 'Image attached to comment by ' + comment().author.userName,
              width:  600,
              height: 400,
              decoding: 'async',
              class: 'rounded-xl border border-base-200 dark:border-base-content/10 object-cover max-h-80 w-full  cursor-pointer hover:opacity-90 transition'
            }"
            [isPreview]="true"
          />
          <figcaption class="sr-only">Comment image</figcaption>
        </figure>
      }

      <!-- Actions -->
      <footer class="flex items-center gap-3">
        <button
          class="flex items-center gap-1 text-sm text-base-content hover:text-brand-color transition"
          title="Like comment"
          aria-label="Like this comment"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 
              1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 
              3.75 3 5.765 3 8.25c0 7.22 9 12 9 
              12s9-4.78 9-12Z" />
          </svg>
          <span>{{ comment().likes.length || 0 }}</span>
        </button>

        @if (comment().flag === 'comment') {
          <a
            [routerLink]="[]"
            [queryParams]="{ commentId: comment()._id || '', type: 'reply' }"
            queryParamsHandling="merge"
            class="text-xs text-brand-color font-medium hover:underline"
            aria-label="Reply to comment"
          >
            Reply
          </a>
        }
      </footer>

      <!-- Dropdown Menu -->
      @if (isOpenMenu()) {
        <nav class="" aria-label="Comment menu" (click)="$event.stopPropagation()">
          <ul
            class="absolute right-0 top-10 w-44 ngCard
            shadow-md  border border-base-200 dark:border-base-content/10 
            overflow-hidden z-50 animate-opacity"
            role="menu"
          >
            <li role="menuitem">
              <a
                [routerLink]="[]"
                [queryParams]="{ commentId: comment()._id || '', type: 'edit' }"
                queryParamsHandling="merge"
                (click)="closeMenu()"
                class="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-base-200/60 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                  class="size-4 opacity-80">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 
                    1.875 0 1 1 2.652 2.652L10.582 
                    16.07a4.5 4.5 0 0 1-1.897 1.13L6 
                    18l.8-2.685a4.5 4.5 0 0 1 
                    1.13-1.897l8.932-8.931Z" />
                </svg>
                Edit Comment
              </a>
            </li>
            <li role="menuitem">
              <button
                (click)="deleteComment()"
                class="flex items-center gap-2 w-full px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                  class="size-4 opacity-80">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 
                    9m9.968-3.21c.342.052.682.107 
                    1.022.166m-1.022-.165L18.16 
                    19.673a2.25 2.25 0 0 1-2.244 
                    2.077H8.084a2.25 2.25 0 0 
                    1-2.244-2.077L4.772 5.79m14.456 
                    0a48.108 48.108 0 0 0-3.478-.397m-12 
                    .562c.34-.059.68-.114 
                    1.022-.165m0 0a48.11 48.11 0 
                    1 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 
                    51.964 0 0 0-3.32 0c-1.18.037-2.09 
                    1.022-2.09 2.201v.916m7.5 0a48.667 
                    48.667 0 0 0-7.5 0" />
                </svg>
                Delete Comment
              </button>
            </li>
          </ul>
        </nav>
      }
    </section>
  </article>

  `,
})
export class CommentItem {
  
  #userService = inject(UserProfileService);
  #commentService = inject(CommentService);
  
  comment = input.required<IComment>();
  postId = input.required<string>();

  isOpenMenu = signal<boolean>(false);
  isMyComment = computed<boolean>(() => (this.#userService.user()?._id || '') === this.comment().createdBy)
  
  isReplyTagName = computed(() => 
  this.comment().flag === 'reply' ?
  this.#commentService.comments().find((c) => c._id ===  this.comment().commentId)?.author.userName || ''
  : ''
)

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isOpenMenu.set(!this.isOpenMenu());
  }

  @HostListener('document:click')
  closeMenu() : void {
  this.isOpenMenu.set(false);
  }

  // ✅ Utilities
  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  }


  deleteComment  () : void {
  const {_id : commentId} = this.comment();
  const postId = this.postId();
  if(commentId && postId){
  this.#commentService.deleteComment(postId , commentId).subscribe()
  this.closeMenu()
  }
  }




}
