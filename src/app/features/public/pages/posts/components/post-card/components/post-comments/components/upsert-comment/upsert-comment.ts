import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, viewChild} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SharedModule } from '../../../../../../../../../../shared/modules/shared.module';
import { NgControl } from '../../../../../../../../../../shared/components/ng-control/ng-control.';
import { CommentTagPeople } from "../comment-tag-people/comment-tag-people";
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize, map, Observable } from 'rxjs';
import { CommentService } from '../../../../../../services/comments.service';
import { IUpdateComment } from '../../../../../../../../../../core/models/comments.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadService } from '../../../../../../../../../../core/services/upload/upload.service';
import { CustomValidators } from '../../../../../../../../../../core/validations/custom/custom-validations';
import { UserProfileService } from '../../../../../../../profile/services/user-profile.service';




@Component({
selector: 'app-upsert-comment',
imports: [SharedModule, NgControl, CommentTagPeople],
template: `


<section class="relative w-full  p-2 sm:p-3">


<form [formGroup]="commentForm" class="relative flex flex-col gap-3 w-full">

    @if(isTagging()){
      
    <fieldset class="w-full absolute bottom-full left-0">
    <app-comment-tag-people
      [commentForm]="commentForm"
      [isVisible]="isTagging()"
      (isVisibleChange)="isTagging.set($event)"
    />
    </fieldset>
    }

    <!-- Upload + Input Section -->
    <fieldset class="w-full flex flex-col gap-3">
      <div class="flex items-center justify-between gap-2">
        
        <div class="flex items-center gap-2">
        
        <label
        for="upload"
        class="flex items-center gap-1 px-2 py-1 rounded-lg border border-transparent cursor-pointer transition hover:bg-gray-100 dark:hover:bg-dark/50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6 text-brand-color"
          >
            <path
              fill-rule="evenodd"
              d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Upload</span>
          <input
            type="file"
            id="upload"
            hidden
            multiple
            accept="image/*"
            (change)="onUpload($event)"
          />

        </label>

    <button
    type="button"
    (click)="isTagging.set(!isTagging())"
    class="flex items-center gap-1 px-2 py-1 rounded-lg border border-transparent cursor-pointer transition hover:bg-gray-100 dark:hover:bg-dark/50"
    >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="size-5 text-brand-color"
    >
      <path
        fill-rule="evenodd"
        d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z"
        clip-rule="evenodd"
      />
    </svg>

  <span class="text-xs sm:text-sm text-gray-700 dark:text-gray-300">      
    {{ 'home.tag_people' | translate }}
  </span>
  </button>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          [disabled]="commentForm.invalid"
          (click)="onSubmit()"
          class="btn btn-sm  bg-transparent border-transparent transition-colors hover:opacity-80"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
            [ngClass]="commentForm.invalid ? 'text-gray-400' : 'text-brand-color'"
          >
            <path
              d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
            />
          </svg>
        </button>
      </div>

      <!-- Image Previews -->
      @if (uploadService.previews().length) {
        <ul class="flex flex-wrap gap-2 mt-1">
        @for (p of uploadService.previews(); track p) {
        <li
            class="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 shadow-sm"
          >
            <img
              [src]="p.url"
              alt="preview"
              class="w-full h-full object-cover"
            />
            <button
              type="button"
              (click)="removePreview(p.key)"
              class="absolute top-0 right-0 m-1 bg-red-500 text-white rounded-full size-5 flex items-center justify-center hover:bg-red-600 transition"
            >
              &times;
            </button>
        </li>
        }
      </ul>
      }

      <!-- Edit or Reply Bar -->
      @if (type() && commentId()) {
        <nav
          class="w-full flex justify-between items-center animate-up bg-gray-100 dark:bg-dark/40 rounded-lg p-2 border border-gray-200 dark:border-gray-700"
        >
          <h4 class="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            {{
              type() === 'reply'
                ? 'Replying to ' + existingComment()?.author?.userName
                : 'Edit comment'
            }}
          </h4>
          <button
            type="button"
            (click)="removeQueries()"
            class="text-sm text-brand-color hover:underline"
          >
            Cancel
          </button>
        </nav>
      }
 

      @if (tags.controls.length > 0) {
        <div class="flex flex-wrap gap-2 mt-2 p-2 border-t border-brand-color/20">
          @for (tag of tags.controls; let i = $index; track i) {
            <span class=" badge badge-soft  rounded-lg text-brand-color bg-brand-color/10 text-sm">
              {{getUserNameById(tag.value)}}
              <button type="button" 
              (click)="removeTag(i)"
              class="text-red-500 hover:text-red-600 cursor-pointer">
              &times;
            </button>
            </span>
        }
        </div>
    }

      <!-- Comment Input -->
      <app-ng-control
        #ngControlRef
        [option]="{
          type: 'text',
          formControlName: 'content',
          placeHolder: 'Write a comment...',
          id: 'content',
          name: 'content',
          inputClass: 'w-full ng-input bg-light dark:bg-dark p-2 rounded-lg'
        }"
        [form]="commentForm"
        [isShowValidationsError]="false"
        class="w-full"
      />
    </fieldset>
  </form>
</section>


`,
changeDetection : ChangeDetectionStrategy.OnPush
})
export class UpsertComment {
  uploadService = inject(UploadService);
  #commentService = inject(CommentService);
  #userService = inject(UserProfileService);
  #fb  = inject(FormBuilder);
  #route  = inject(ActivatedRoute);
  #router = inject(Router);


  ngControlRef = viewChild<NgControl>('ngControlRef');

  postId = input<string>();

  commentId = toSignal(
    this.#route.queryParamMap.pipe(
      map((query) => query.get('commentId') || undefined)
    )
  );

  existingComment = computed(() => {
  const commentId = this.commentId();
  if(!commentId) return ;
  const comment =  this.#commentService.comments().find((c) => c._id === commentId);
  const reply =  this.#commentService.replies().find((c) => c._id === commentId);
  return comment || reply
  })



  type = toSignal<'reply' | 'edit' | undefined>(
    this.#route.queryParamMap.pipe(
      map((query) => {
        const value = query.get('type');
        return value === 'reply' || value === 'edit' ? value : undefined;
      })
    )
  );

  commentForm: FormGroup = this.#fb.group({
    content: [''],
    image: [null],
    tags: this.#fb.array<string>([]),
    removedTags: [[] as string[]], // Add control for tracking removed tags
    removeAttachment: [false], // Add control for tracking image removal
  }, {
    validators: CustomValidators.post('content', 'image')
  });

  public get tags(): FormArray {
    return this.commentForm.get('tags') as FormArray;
  }

  // helper to get display name
  getUserNameById(userId: string): string {
    return this.#userService.user()?.friends?.find(f => f._id === userId)?.userName || userId;
  }

  isTagging = signal<boolean>(false);
  
  constructor() {
    // ... existing effects ...

    // Update form when editing existing comment
    effect(() => {
      if (this.commentId() && this.type() === 'edit') {
        const comment = this.existingComment();
        if (!comment) return;

        // Reset form first
        this.commentForm.reset();
        
        // Patch existing values
        this.commentForm.patchValue({
          content: comment.content || '',
          tags: comment.tags || [],
          removedTags: [], // Initialize empty removed tags array
          removeAttachment: false // Initialize attachment removal flag
        });

        // If comment has existing attachment, show it in preview
        if (comment.attachment) {
          this.uploadService.setPreviews = [{
            key: 'existing',
            url: comment.attachment
          }];
        }
      }
    });
  }


  removeTag(index: number): void {
    if (index < 0 || index >= this.tags.length) return;

    const userId = this.tags.at(index).value;
    this.tags.removeAt(index);

    const existing: string[] = this.commentForm.get('existingTags')?.value || [];
    if (existing.includes(userId)) {
      const removedCtrl = this.commentForm.get('removedTags');
      const current = removedCtrl?.value || [];
      if (!current.includes(userId)) {
        removedCtrl?.setValue([...current, userId]);
      }
    }
  }

 removeQueries() : void {
    this.#router.navigate([], {
    queryParams : {
      type : null ,
      commentId : null ,
    }, queryParamsHandling : 'merge'
    });
    this.commentForm.reset();
    // clear uploads as well
    this.uploadService.clear();
  }

  async onUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if(!input) return;
    await this.uploadService.uploadAttachments(input, 1);
    
    // Set the image in form after upload
    const files = this.uploadService.files();
    this.commentForm.patchValue({
      image: files.length ? files[0] : null
    });
  }

  removePreview(key: string): void {
    const previews = this.uploadService.previews();
    
    // If removing existing attachment
    if (key === 'existing') {
      this.uploadService.setPreviews = [];
      this.uploadService.setFiles = [];
      this.commentForm.patchValue({ 
        removeAttachment: true,
        image: null 
      });
      return;
    }

    // Handle new uploaded files
    const idx = previews.findIndex(p => p.key === key);
    if (idx === -1) return;

    const newPreviews = previews.filter((_, i) => i !== idx);
    const files = this.uploadService.files();
    const newFiles = files.filter((_, i) => i !== idx);

    this.uploadService.setPreviews = newPreviews;
    this.uploadService.setFiles = newFiles;
    this.commentForm.patchValue({ 
      image: newFiles.length ? newFiles[0] : null 
    });
  }


   onSubmit(): void {
    if (!this.commentForm.valid) return;

    const postId = this.postId();
    const type = this.type();
    const commentId = this.commentId();
    
    if (!postId) return;

    // Get preview image URL for optimistic updates
    const previewImage = this.uploadService.previews()[0]?.url;

    // Get form data and ensure image is included
    const formData = {
      ...this.commentForm.getRawValue(),
      image: this.uploadService.files()[0] || null
    };

    let action$: Observable<unknown>;

    if (type === 'edit' && commentId) {
      const updateData: IUpdateComment = {
        content: formData.content,
        image: formData.image,
        tags: formData.tags,
        removedTags: formData.removedTags,
        removeAttachment: formData.removeAttachment
      };
      action$ = this.#commentService.updateComment(postId, commentId, updateData, previewImage);
    } else if (type === 'reply' && commentId) {
      action$ = this.#commentService.replyComment(postId, commentId, formData, previewImage);
    } else {
      action$ = this.#commentService.createComment(postId, formData, previewImage);
    }

    action$.pipe(
      finalize(() => {
        this.removeQueries();
        this.uploadService.clear();
      })
    ).subscribe();
  }
  
}
