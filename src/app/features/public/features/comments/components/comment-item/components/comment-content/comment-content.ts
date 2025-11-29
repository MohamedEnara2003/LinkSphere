import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IComment } from '../../../../../../../../core/models/comments.model';
import { TagsService } from '../../../../../../../../core/services/forms/tags.service';
import { CommentsStateService } from '../../../../services/state/comments-state.service';
import { ShowTextPipe } from '../../../../../../../../shared/pipes/show-text-pipe';

@Component({
    imports: [RouterModule , ShowTextPipe],
    selector: 'app-comment-content',
    template :`
    @if(comment()){
    <p class="flex flex-wrap items-center gap-2 text-sm ngText"> 
    @if (isReplyTagName()) {
    <span
      role="text"
      [attr.aria-label]="'Replying to ' + isReplyTagName()"
    >
    <span class="text-brand-color">Replying to </span> {{isReplyTagName() }}
    </span>
  }

    <!-- Tagged Users -->
    @if (comment().tags.length) {
    @for (tag of comment().tags; track tag) {
    <a 
        [href]="[ '/public', { outlets: { primary: ['profile', 'user', tag], model: null } } ]"
        [routerLink]="[ '/public', { outlets: { primary: ['profile', 'user', tag], model: null } } ]"
        class="link link-hover text-brand-color"
        role="link"
        tabindex="0"
        aria-label="Tagged user"
      >
      {{ tagService.getUserNameById(tag) }}
    </a>
    }
  }
      <!-- Comment Content -->
      <span (click)="isShowContent.set(!isShowContent())"
      class="text-base-content font-light flex flex-wrap  gap-1"
      role="text"
      aria-label="Comment content"
      >
      {{ comment().content | showText : isShowContent()}}

      @if(comment().content.length > 180){
      <span
      class="cursor-pointer hover:underline text-brand-color font-normal">
      {{isShowContent() ? '' : ' Show more'}}
      </span>
      } 
      </span> 
      </p>
    }
`,

})

export class CommentContent  {
readonly #commentsState = inject(CommentsStateService);
readonly tagService = inject(TagsService);

comment = input.required<IComment>();
  isShowContent = signal<boolean>(false);

isReplyTagName = computed(() => {
const comment = this.comment();
if (comment.flag !== 'reply') return '';
const allComments = [
...this.#commentsState.comments(),
...this.#commentsState.replies()
];
const parent = allComments.find(c => c._id === comment.commentId);
return parent?.author.userName || '';
});

}