import { Component, input, OnInit } from '@angular/core';
import { Picture } from '../../../../../../../../core/models/picture';
import { NgImage } from "../../../../../../../../shared/components/ng-image/ng-image";

@Component({
    imports: [NgImage],
    selector: 'app-comment-attachment',
    template :`
    @if(attachment()){
        <figure class="w-full h-80  flex mt-2">
        <app-ng-image
            [options]="{
            src: attachment()?.url || '',
            alt: 'Image attached to comment by ' + userName(),
            width:  600,
            height: 400,
            decoding: 'async',
            class: 'rounded-xl object-contain max-h-full w-full  cursor-pointer hover:opacity-90 transition'
            }"
            [isPreview]="true"
        />
        <figcaption class="sr-only">Comment image</figcaption>
        </figure>
    }
`,

})

export class CommentAttachment  {
attachment = input<Picture | null>(null);
userName = input<string>('');
}