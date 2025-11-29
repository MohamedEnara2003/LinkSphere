import { Component, input } from '@angular/core';

import { RouterModule } from '@angular/router';
import { LikeToggle } from "../../../../../../components/social/like-toggle/like-toggle";


@Component({
    selector: 'app-comment-actions',
    imports: [RouterModule, LikeToggle],
    template : `
    
    <!-- Actions -->
    <nav class="flex items-center gap-3">
    <app-like-toggle
    [postId]="postId()"
    [commentId]="commentId()|| ''"
    [existingLikes]="commentLikes() || []"
    />
        <a
            [routerLink]="[]"
            [queryParams]="{ commentId: commentId() || '', type: 'reply' }"
            queryParamsHandling="merge"
            class="text-xs text-brand-color font-medium hover:underline"
            aria-label="Reply to comment"
        >
            Reply
        </a>
        
    </nav>
`,
})
export class commentActions{
postId = input.required<string>();
commentId = input.required<string>();
commentLikes = input<string[]>([]);
}
