import { Component, input } from '@angular/core';
import { NgImage } from "../../../../../../../../shared/components/ng-image/ng-image";
import { RouterModule } from '@angular/router';
import { ICreatedBy } from '../../../../../../../../core/models/posts.model';


@Component({
selector: 'app-post-header',
imports: [NgImage , RouterModule],
template: `
   <header class="flex justify-between items-center border-b border-brand-color/10 pb-1">
    <address class="not-italic flex items-center gap-2">

      <!-- Profile Image -->

      <app-ng-image  [routerLink]="['/public/profile', createdBy().id]"
        [options]="{
          src: createdBy().picture ?? '',
          alt: 'Profile picture of ' + createdBy().userName,
          width: 60,
          height: 60,
          class: 'object-cover btn btn-circle btn-outline'
        }" 
      />

      <!-- Author Info -->
      <div class="flex flex-col">
        <h2 [id]="'post-title-' + postId()" class="card-title ngText capitalize">
          {{ createdBy().userName }}
        </h2>
        <time 
          class="text-brand-color badge badge-sm p-1 bg-brand-color/20"
          [attr.datetime]="createdAt()">
          {{ formatTime(createdAt()) }}
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
    
`,
})
export class PostHeader {
    postId = input.required<string>();
    createdAt = input.required<string>();
    createdBy = input.required<ICreatedBy>();
    
  formatTime(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }


}
