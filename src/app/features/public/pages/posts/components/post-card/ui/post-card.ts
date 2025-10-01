import { Component, input, signal } from '@angular/core';
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { InteractionPost } from '../../interaction-post/interaction-post';
import { NgImage } from '../../../../../../../shared/components/ng-image/ng-image';
import { BackLink } from "../../../../../../../shared/components/links/back-link";
import { IPost } from '../../../../../../../core/models/posts.model';

@Component({
  selector: 'app-post-card',
  imports: [NgImage, InteractionPost, SharedModule, BackLink],
  template: `
<article 
  class="relative size-full min-h-50 max-h-svh ngCard p-4 flex flex-col gap-2"
  [attr.aria-labelledby]="'post-title-' + post().id"
  [attr.aria-describedby]="'post-desc-' + post().id">

  <!-- Post Header -->
  <header class="flex justify-between items-center">
    <address class="not-italic flex items-center gap-2">

      @if (isShowLinkBack()) {
        <app-back-link />
      }

      <!-- Profile Image -->
      @let createdBy = post().createdBy ;
      <app-ng-image [routerLink]="['/public/profile', post().createdBy.id]"
        [options]="{
          src: createdBy.picture ?? '',
          alt: 'Profile picture of ' + createdBy.userName,
          width: 60,
          height: 60,
          class: 'object-cover btn btn-circle btn-outline'
        }" 
      />

      <!-- Author Info -->
      <div class="flex flex-col">
        <h2 [id]="'post-title-' + post().id" class="card-title ngText capitalize">
          {{ post().createdBy.userName }}
        </h2>
        <time 
          class="text-brand-color badge badge-sm p-1 bg-brand-color/20"
          [attr.datetime]="post().createdAt">
          {{ formatTime(post().createdAt) }}
        </time>
      </div>
    </address>

    <!-- Options Button -->
    <button 
      title="Post options" 
      type="button" 
      class="ngBtnIcon" 
      aria-label="Post menu options">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" 
      viewBox="0 0 24 24" stroke-width="1.5"
      stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" 
        d="M6.75 12a.75.75 0 1 1-1.5 0 
        .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 
        0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 
        12a.75.75 0 1 1-1.5 0 .75.75 
        0 0 1 1.5 0Z" />
      </svg>
    </button>
  </header>

  <!-- Post Main Content -->
  @let attachments = post().attachments ;
  @if(attachments){
      <main class="w-full grid "
      [ngClass]="attachments.length >= 2 ? 'grid-cols-2' : 'grid-cols-1'">
  @for (attachment of attachments; track attachment) {
    <a  [attr.aria-label]="'View full post by ' + post().createdBy.userName">
      <app-ng-image
        [options]="{
          src: attachments[0] || '/Rectangle.png',
          alt: 'Post image by ' + post().createdBy.userName,
          width: 300,
          height: 300,
          class: 'object-cover size-full min-h-50 max-h-200 shadow-xs shadow-card-dark/50 hover:opacity-80 duration-200 transition-opacity',
        }"
        [isPreview]="true"
      />
    </a>
  }
  <p class="ngText capitalize text-sm line-clamp-1 sm:line-clamp-2 md:line-clamp-3">
  {{post().content}}
  </p>
  </main>
  }


  <!-- Post Footer (Interactions) -->
  <footer class="w-full flex flex-col justify-start gap-1" aria-label="Post interactions">
    <app-interaction-post />
  </footer>
</article>

  `,
})
export class PostCard {
  isShowLinkBack = input(false);


  post = input.required<IPost>();

  formatTime(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }


}


