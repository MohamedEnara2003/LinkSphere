import { Component, ChangeDetectionStrategy, signal, model } from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { NgImage } from "../../../../../../shared/components/ng-image/ng-image";

@Component({
  selector: 'app-post-comments',
  imports: [SharedModule, NgImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `

    <section
    class="w-full h-svh fixed bottom-0 left-0 flex justify-center items-end z-20"
    aria-label="Comments Section"
    role="region"
    >

    <article
        class="relative w-full sm:w-[70%] md:w-[60%] 2xl:w-1/2 h-120 animate-up 
        2xl:h-80 ngCard rounded-t-2xl 
        shadow shadow-card-light dark:shadow-card-dark z-10 flex flex-col"
        aria-labelledby="comments-title"
        role="dialog">

        <header class="p-4 border-b border-base-200 flex items-center gap-2">
        <h2 id="comments-title" class="text-lg font-semibold ngText" tabindex="0">
        Comments
        </h2>
        </header>
        <section class="flex-1 overflow-y-auto p-4" aria-live="polite">

    <ul class="list rounded-box shadow-md">

    @for (comment of comments; track comment.id) {
    <li class="list-row">

    <app-ng-image [options]="{
    src : comment.img,
    alt : comment.author,
    width : 300 ,
    height :300 ,
    class : 'size-12  rounded-box object-cover'
    }" />

    <header>
    <h3 class="ngText">{{comment.author}}</h3>
    <time class="text-xs ngText" [attr.datetime]="comment.date" itemprop="datePublished">
    {{ comment.date | date:'short' }}
    </time>
    </header>

    <p class="list-col-wrap text-xs ngText font-normal">
    {{comment.text}}
    </p>

    <button type="button" class="ngLink link-hover  ngText">0 liks</button>
    <button type="button" class="ngLink link-hover  ngText">Reply</button>
    
</li>

}
</ul>

</section>
</article>

      <div (click)="isOpenComments.set(false)"
        class="size-full bg-dark/50 fixed bottom-0 left-0 z-5 "
        aria-hidden="true"
        tabindex="-1"
      ></div>

    </section>
  `,
})
export class PostComments {
    isOpenComments = model<boolean>(false);

    comments = [
    { id: 1, img : 'woman-empty-avatar-photo.webp'
    , author: 'Alice', text: 'Great post!', date: '2024-09-28T12:00:00.000Z' 
    },
    { id: 2, img : '/man-empty-avatar-photo.webp'
    , author: 'Bob', text: 'Thanks for sharing.', date: '2024-09-28T13:00:00.000Z' },
    ];


}