import { Component, inject } from '@angular/core';
import { NgImage } from "../../../../../../../shared/components/ng-image/ng-image";
import { PostService } from '../../../services/post.service';
import { AttachmentsService } from '../../../../../../../core/services/attachments.service';

@Component({
selector: 'app-post-attachments',
imports: [NgImage],
template: `
<section class="flex flex-col gap-4">

    <label for="upload" 
    class="w-full btn bg-light dark:bg-dark hover:opacity-80 duration-300 transition-all ngText">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-success">
    <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" />
    </svg>

    Upload photo
    <input 
    type="file" 
    name="upload" 
    id="upload" 
    hidden 
    multiple
    accept="image/*"
    (change)="uploadAttachments($event.target)">
    </label>

    <ul aria-label="Menu Product Images" role="menu" 
        class="w-full overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">

        @for (item of attachmentsService.previews(); let i = $index; track item.public_id) {
        <li class="relative w-full animate-opacity">
            <app-ng-image
            [options]="{
                src: item.url ,
                alt: 'image ' + i,
                width: 100,
                height: 100,
                class: 'w-full h-50 object-cover shadow shadow-card-dark',
                loading: 'lazy',
                decoding: 'async'
              }"
            />
          
            <button 
              type="button"
              class="absolute top-1 right-1 btn btn-circle btn-xs border-transparent  bg-dark/50 hover:bg-error 
              transition duration-200"
              (click)="removeAttachment(i)"
              aria-label="Remove image">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>

            </button>
          </li>
        }
    </ul>

  `,
})
export class PostAttachments {

  attachmentsService = inject(AttachmentsService);
  #postService = inject(PostService);

  
  async uploadAttachments(input: HTMLInputElement): Promise<void> {
  await this.attachmentsService.uploadAttachments(input , 2);
  }

  removeAttachment(index: number): void {
  const isExisitngPost = this.#postService.post() ? true : false;
  this.attachmentsService.onRemoveAttachment(index , isExisitngPost)
  }

}
