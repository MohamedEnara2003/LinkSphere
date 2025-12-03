import { Component, input, signal } from '@angular/core';
import { ShowTextPipe } from '../../../../../../../../shared/pipes/show-text-pipe';


@Component({
selector: 'app-post-content',
imports: [ShowTextPipe],
template: `
    <section class="col-span-2">
        <div role="region" aria-label="Post content" class="ngText capitalize text-sm">
            <p id="post-content-text" class="break-words">
                {{content() | showText : isShowContent()}}
            </p>

            @if(content().length > 180){
                <button
                    type="button"
                    class="mt-1 text-sm text-brand-color hover:underline"
                    (click)="isShowContent.set(!isShowContent())"
                    [attr.aria-expanded]="isShowContent()"
                    aria-controls="post-content-text"
                    aria-label="Toggle full post content"
                >
                    {{ isShowContent() ? ('Show less') : ('Show more') }}
                </button>
            }
        </div>
    </section>
`,
})
export class PostContent {
    content = input<string>('');
    isShowContent = signal<boolean>(false);
}
