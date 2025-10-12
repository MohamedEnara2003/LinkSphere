import { Component, input } from '@angular/core';
import { NgImage } from "../../../../../../../../shared/components/ng-image/ng-image";
import { SharedModule } from '../../../../../../../../shared/modules/shared.module';


@Component({
selector: 'app-post-content',
imports: [NgImage , SharedModule],
template: `
    <main class="w-full flex flex-col  gap-2  "
    [id]="'post-desc-' + postId()"
    [attr.aria-labelledby]="'post-title-' + postId()" 
    [attr.aria-describedby]="'post-desc-' + postId()" 
    role="main"
    >
        @if(attachments() && attachments().length > 0){
            <section class="w-full grid  gap-5 "
            [ngClass]="attachments().length === 1 ? 'grid-cols-1' : 'grid-cols-2'">
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
                            class: 'object-cover w-full h-full  min-h-60 max-h-100 aspect-square shadow-xs shadow-card-dark/50 hover:opacity-80 duration-200 transition-opacity',
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
