import { Component, input } from '@angular/core';
import { NgImage } from "../../../../../../../../shared/components/ng-image/ng-image";
import { SharedModule } from '../../../../../../../../shared/modules/shared.module';


@Component({
selector: 'app-post-content',
imports: [NgImage , SharedModule],
template: `
    <main class="grid  grid-cols-1 gap-5  "
    [ngClass]="attachments() && attachments().length === 1 ? 'md:grid-cols-1 ' : 'md:grid-cols-2'"
    [id]="'post-desc-' + postId()"
    [attr.aria-labelledby]="'post-title-' + postId()" 
    [attr.aria-describedby]="'post-desc-' + postId()" 
    role="main"
    >

        @if(attachments() && attachments().length > 0){
            <section class="grid grid-cols-1 gap-5">
                @for (attachment of attachments(); track attachment) {
                    <app-ng-image
                        [options]="{
                            src: attachment,
                            alt: 'Post attachment',
                            width:  300,
                            height: 300,
                            decoding : 'async',
                            fetchpriority : 'high',
                            loading : 'eager',
                            class: 'object-cover size-full min-h-80 max-h-160 aspect-square shadow-xs shadow-card-dark/50 hover:opacity-80 duration-200 transition-opacity',
                        }"
                        [isPreview]="true"
                    />
                }
            </section>
        }

        <p 
        class="ngText capitalize text-sm line-clamp-1 sm:line-clamp-2 md:line-clamp-3 
        col-span-2 ">
        {{content()}}
        </p>

    </main>
    
`,
})
export class PostContent {
    postId = input.required<string>();
    content = input<string>('');
    attachments = input<string[]>([]);
}
