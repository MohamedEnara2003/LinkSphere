import { Component, input, output, } from '@angular/core';
import { IComment } from '../../../../../../../../core/models/comments.model';


@Component({
  selector: 'app-toggle-replies-btn',
  imports: [],

  template: `

  @if(comment().lastReply ) {
  <button
    type="button"
    (click)="onToggleReplies()"
    class="btn btn-xs sm:btn-sm btn-link text-neutral-400 link-hover duration-300 transition-all p-0
    flex items-center gap-1"
  >
    @if(isShowReplies()) {
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke-width="1.5" stroke="currentColor" class="size-3 rotate-180 transition-transform">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 15.75L12 8.25l-7.5 7.5" />
      </svg>
      Hide replies
    } @else {
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke-width="1.5" stroke="currentColor" class="size-3 transition-transform">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 8.25l7.5 7.5 7.5-7.5" />
      </svg>
      View replies
    }
  </button>
}


  `,
})
export class ToggleRepliesBtn {
  comment = input.required<IComment>();
  postId = input.required<string>();

  isShowReplies = input<boolean>(false);
  toggleReplies = output<void>()

  onToggleReplies() : void {
  this.toggleReplies.emit()
  }


}


