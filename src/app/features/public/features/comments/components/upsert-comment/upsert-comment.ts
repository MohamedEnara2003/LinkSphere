import { Component, computed, effect, inject, input, signal, viewChild} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { TagFriends } from '../../../posts/components/tag-friends/tag-friends';
import { ActivatedRoute, Router } from '@angular/router';
import { TagsService } from '../../../../../../core/services/forms/tags.service';
import { AttachmentsService } from '../../../../../../core/services/forms/attachments.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize, map, Observable } from 'rxjs';
import { CustomValidators } from '../../../../../../core/validations/custom/custom-validations';
import { ICreateComment, IUpdateComment } from '../../../../../../core/models/comments.model';
import { NgControl } from '../../../../../../shared/components/ng-control/ng-control.';
import { CreateCommentService } from '../../services/api/create-comment.service';
import { UpdateCommentService } from '../../services/api/update-comment.service';
import { CommentsStateService } from '../../services/state/comments-state.service';


@Component({
selector: 'app-upsert-comment',
imports: [SharedModule, NgControl, TagFriends],
template: `


<section class="relative w-full ngCard p-2">
  <form 
  [formGroup]="commentForm" 
  role="form"
  aria-label="Add or edit comment"
  class="flex flex-col gap-3">

    <!-- Upload + Input Section -->
    <fieldset class="w-full flex flex-col gap-3">
    @if (isTagging()) {
      <app-tag-friends
        [postForm]="commentForm"
        [isOpenTagModel]="isTagging()"
        (isOpenTagModelChange)="isTagging.set($event)"
        class="w-full h-70 z-20 absolute  bottom-40 left-0"
        role="dialog"
        aria-modal="true"
        aria-label="Tag friends dialog"
      />
    }
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
            (change)="onUpload($event.target)"
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
          class="btn  btn-sm  btn-circle btn-info"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-5">
            <path
              d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
            />
          </svg>
        </button>
      </div>

      <!-- Image Previews -->
      @if (attachmentsService.previews().length) {
        <ul class="flex flex-wrap gap-2 mt-1">
        @for (p of attachmentsService.previews(); let i = $index; track p) {
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
              (click)="removePreview(i)"
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
    
      <!-- Comment Input -->
      <app-ng-control
        #ngControlRef
        [option]="{
          type: 'text',
          formControlName: 'content',
          placeHolder: 'Write a comment...',
          id: 'content',
          name: 'content',
          inputClass: 'w-full input bg-light dark:bg-dark p-2 rounded-lg'
        }"
        [form]="commentForm"
        [isShowValidationsError]="false"
        class="w-full"
      />
    </fieldset>
  </form>
</section>

`,

providers : [
CreateCommentService,
UpdateCommentService
]

})

export class UpsertComment {
  readonly #createCommentService = inject(CreateCommentService);
  readonly #updateCommentService = inject(UpdateCommentService);
  readonly #commentsState = inject(CommentsStateService);

  readonly #fb  = inject(FormBuilder);
  readonly #route  = inject(ActivatedRoute);
  readonly #router = inject(Router);


  attachmentsService = inject(AttachmentsService);
  tagsService = inject(TagsService);


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
  const comment =  this.#commentsState.comments().find((c) => c._id === commentId);
  const reply =  this.#commentsState.replies().find((c) => c._id === commentId);
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

commentForm: FormGroup<{
  content: FormControl<string | null>;
  tags: FormArray<FormControl<string>>;
  attachments: FormArray<FormControl<File>>;
  removedTags: FormArray<FormControl<string>>;
    removedAttachments: FormArray<FormControl<string>>;
}> = this.#fb.group(
  {
    content: this.#fb.control('', [Validators.minLength(1),Validators.maxLength(50000)]),

    tags: this.#fb.array<FormControl<string>>([]),
    attachments: this.#fb.array<FormControl<File>>([]),
    removedTags: this.#fb.array<FormControl<string>>([]),
    removedAttachments: this.#fb.array<FormControl<string>>([]),
  },
  {
  validators: CustomValidators.comment(this.existingComment()),
  }
);


  isTagging = signal<boolean>(false);
  
  constructor() {
  effect(() =>  {
  if(this.type() && this.type() === 'reply'){
  this.onFocus();
  }
  })
  }
  ngOnInit(): void {
  this.attachmentsService.initAttachmentsForm(this.commentForm);
  this.tagsService.initForm(this.commentForm);
  }
  
  
  onFocus() : void {
  this.ngControlRef()?.focusInput();
  }

  #initExistingComment() : void {
      if (this.commentId() && this.type() === 'edit') {
        const comment = this.existingComment();
        if (!comment) return;
          this.commentForm.patchValue({
          content: comment.content || '',
          tags: comment.tags || [],
          removedTags: [], 
          removedAttachments: [] 
        });

        const image = comment.attachment;
        if (image) {
        this.attachmentsService.initExistingAttachments([image]);
        }
  
      }
  }


  removeQueries() : void {
    this.#router.navigate([], {
    queryParams : {
      type : null ,
      commentId : null ,
    }, 
    queryParamsHandling : 'merge'
    });
    this.commentForm.reset();
    this.isTagging.set(false);
    this.attachmentsService.clearAttachments();
  }

  async onUpload(input: HTMLInputElement): Promise<void> {
  this.attachmentsService.uploadAttachments(input , 1);
  }

  removePreview(index: number): void {
  const isExisitngComment = Boolean(this.existingComment());
  this.attachmentsService.onRemoveAttachment(index , isExisitngComment);
  }

   onSubmit(): void {
    if (!this.commentForm.valid) return;

    const postId = this.postId();
    const type = this.type();
    const commentId = this.commentId();
    

    if (!postId) return;

    // Get preview image URL for optimistic updates
    const previewImage = this.attachmentsService.previews()[0];

    // Get form data and ensure image is included
    const formData  =  this.commentForm.getRawValue();
    if(!formData) return;

    let action$: Observable<unknown>;

        const updateData: IUpdateComment = {
        ...formData!,
        content: formData.content ?? undefined,
        image: formData.attachments[0]!,
        removedTags: formData.removedTags || [],
        removeAttachment: formData.removedAttachments.length >= 1,
      };

      const createData: ICreateComment = {
        ...formData!,
        content: formData.content ?? undefined,
        image: formData.attachments[0]!,
      };

    if (type === 'edit' && commentId) {
      action$ = this.#updateCommentService.updateComment(postId, commentId, updateData, previewImage);
    } else if (type === 'reply' && commentId) {
      action$ = this.#createCommentService.replyComment(postId, commentId, createData);
    } else {
      action$ = this.#createCommentService.createComment(postId, createData);
    }

    action$.pipe(
    finalize(() => this.removeQueries())
    ).subscribe();
  }
  

}
