import { Component, input } from '@angular/core';
import { IComment2 } from '../../ui/post-comments';
import { CommonModule } from '@angular/common';



@Component({
selector: 'app-comment-item',
imports: [CommonModule],
template: `
<address class="flex items-start justify-between px-2 py-2 rounded-lg transition 
hover:dark:bg-card-dark hover:bg-card-light">
  <!-- User Info -->

    <div class="flex items-center gap-3">
    <img class="size-10 rounded-full border border-base-200 object-cover" 
    src="/1747983819132_476165657_1152867902877267_3612919625248808281_n.webp" alt="User avatar" />
    <div>
    
      <h3 id="comment-{{comment()._id}}-author" class="font-medium ngText">{{ comment().author }}</h3>
      <time 
        class="badge badge-xs bg-brand-color/10 text-brand-color"
        [attr.datetime]="comment().createdAt"
        itemprop="datePublished">
        {{ comment().createdAt | date:'short' }}
      </time>
    </div>
  </div>

  <!-- Actions -->
  <div class="flex flex-col items-center gap-2 text-sm">
    <button 
      class="ngBtnIcon flex items-center gap-1 hover:text-brand-color transition"
      title="Like this comment"
      aria-label="Like this comment">
      <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
      {{ comment().likes.length }}
    </button>

    <button 
      type="button" 
      class="btn btn-link text-xs text-brand-color link-hover"
      aria-label="Reply to this comment">
      Reply
    </button>
  </div>
</address>

<!-- Comment Content -->
<p id="comment-{{comment()._id}}-content" class="text-sm ngText font-light px-2">
  {{ comment().content }}
</p>


`,
})
export class CommentItem {
    comment = input.required<IComment2>();  
}
    