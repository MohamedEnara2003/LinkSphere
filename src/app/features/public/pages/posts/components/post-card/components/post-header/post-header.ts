import { Component, HostListener, inject, input, signal } from '@angular/core';
import { NgImage } from "../../../../../../../../shared/components/ng-image/ng-image";
import { Router, RouterModule } from '@angular/router';
import { IUser } from '../../../../../../../../core/models/user.model';
import { DomService } from '../../../../../../../../core/services/dom.service';
import { PostService } from '../../../../services/post.service';
import { IPost } from '../../../../../../../../core/models/posts.model';


@Component({
selector: 'app-post-header',
imports: [NgImage , RouterModule],
template: `
   <header class="flex justify-between items-center border-b border-brand-color/10 pb-1">
    <address class="not-italic flex items-center gap-2">

      <!-- Profile Image -->
      <app-ng-image  
        [routerLink]="['/public/profile/user', post()?.author?._id || '']"
        [options]="{
          src: post()?.author?.picture ?? 'user-placeholder.jpg',
          placeholder: post()?.author?.placeholder ?? '',
          alt: 'Profile picture of ' + post()?.author?.userName || '',
          width: 60,
          height: 60, 
          class: 'object-cover btn btn-circle btn-outline'
        }" 
      />

      <!-- Author Info -->
      <div class="flex flex-col">
        <h2  class="card-title ngText capitalize">
          {{ post()?.author?.userName || ''}}
        </h2>
        <time 
          class="text-brand-color badge badge-xs p-1 bg-brand-color/20"
          [attr.datetime]="post()?.createdAt || ''">
          {{ formatTime(post()?.createdAt || '') }}
        </time>
      </div>
    </address>

    <!-- Options Button -->
    <section class="relative flex flex-col gap-2 select-none">
  <!-- Menu Button -->
  <button
    (click)="toggleMenu($event)"
    title="Post Menu"
    type="button"
    class="ngBtnIcon btn-circle flex items-center justify-center hover:bg-info/20 transition"
  >
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
  </svg>
  </button>

  <!-- Dropdown Menu -->
  @if (isOpenPostMenu()) {
    <nav
      class="absolute right-0 top-10 w-48 z-50 
      bg-card-light dark:bg-card-dark 
      shadow-lg rounded-xl border border-base-200 dark:border-base-content/20
      flex flex-col gap-1 py-2 animate-sideLeft"
      (click)="$event.stopPropagation()"
    >
      <button
        type="button"
        class="w-full flex items-center gap-2 px-4 py-2 text-left
        hover:bg-info/10 rounded-md transition"
        (click)="editPost()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 
            16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 
            4.5 0 0 1 1.13-1.897l8.932-8.931ZM18 14v4.75A2.25 
            2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 
            3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
        Edit Post
      </button>

      <button
        type="button"
        class="w-full flex items-center gap-2 px-4 py-2 text-left
        hover:bg-warning/10 rounded-md transition"
        (click)="freezPost()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 
            5.454-1.31A8.967 8.967 0 0 1 
            18 9.75V9A6 6 0 0 0 6 9v.75a8.967 
            8.967 0 0 1-2.312 6.022c1.733.64 
            3.56 1.085 5.455 1.31m5.714 
            0a24.255 24.255 0 0 1-5.714 
            0m5.714 0a3 3 0 1 1-5.714 
            0M10.5 8.25h3l-3 4.5h3" />
        </svg>
        Freeze Post
      </button>

      <button
        type="button"
        class="w-full flex items-center gap-2 px-4 py-2 text-left
        hover:bg-error/10 text-error rounded-md transition"
        (click)="deletePost()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 
            9m9.968-3.21c.342.052.682.107 
            1.022.166m-1.022-.165L18.16 
            19.673a2.25 2.25 0 0 1-2.244 
            2.077H8.084a2.25 2.25 0 0 
            1-2.244-2.077L4.772 5.79m14.456 
            0a48.108 48.108 0 0 0-3.478-.397m-12 
            .562c.34-.059.68-.114 
            1.022-.165m0 0a48.11 48.11 0 
            0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 
            51.964 0 0 0-3.32 0c-1.18.037-2.09 
            1.022-2.09 2.201v.916m7.5 0a48.667 
            48.667 0 0 0-7.5 0" />
        </svg>
        Delete Post
      </button>
    </nav>
  }
</section>


  </header>
    
`,
})
export class PostHeader {
  #domService = inject(DomService);
  #postService = inject(PostService);
  #router = inject(Router);

  post = input<IPost>();

  isOpenPostMenu = signal<boolean>(false);

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isOpenPostMenu.set(!this.isOpenPostMenu());
  }

  @HostListener('document:click')
  closeMenu() : void {
    if(this.#domService.isBrowser()){
      this.isOpenPostMenu.set(false);
    }
  }

  formatTime(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric' ,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  editPost() : void {
  const post = this.post();
  if(post){
  this.#router.navigate(['/public' ,{ outlets: { 'model': ['upsert-post'] } }])
  this.#postService.setPost(post);
  this.closeMenu();
  }
  }

  freezPost() : void {
  const postId = this.post()?._id;
  if(postId){
  this.#postService.freezePost(postId).subscribe();
  this.closeMenu();
  }
  }

  deletePost() : void {
    const postId = this.post()?._id;
  if(postId){
  this.#postService.deletePost(postId).subscribe();
  this.closeMenu();
  }
  }

}
