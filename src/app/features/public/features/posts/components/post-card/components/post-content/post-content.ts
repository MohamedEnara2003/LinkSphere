import { Component, input, signal } from '@angular/core';
import { ShowTextPipe } from '../../../../../../../../shared/pipes/show-text-pipe';


@Component({
selector: 'app-post-content',
imports: [ShowTextPipe],
template: `
        <p (click)="isShowContent.set(!isShowContent())"
        class="ngText capitalize text-sm  col-span-2">

        {{content() | showText : isShowContent()}}

        @if(content().length > 180){
        <span
        class="cursor-pointer hover:underline text-brand-color font-normal">
        {{isShowContent() ? '' : ' Show more'}}
        </span>
        } 
        
        </p>
`,
})
export class PostContent {
    content = input<string>('');
    isShowContent = signal<boolean>(false);
}
