import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, OnDestroy, signal} 
from '@angular/core';


import { DomService } from '../../../../../../core/services/dom.service';
import { NonNullableFormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormArray, FormControl } from '@angular/forms';
import { PostModelHeader } from "./components/post-model-header";
import { CreateByPostInfo } from "./components/create-by-post-info";
import { AllowComments, Availability, FormPost, IPost} from '../../../../../../core/models/posts.model';

import { CustomValidators } from '../../../../../../core/validations/custom/custom-validations';
import { PostAttachments } from "./components/post-attachments";
import { NgControl } from "../../../../../../shared/components/ng-control/ng-control.";
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { TagFriends } from "../tag-friends/tag-friends";
import { TagsService } from '../../../../../../core/services/tags.service';
import { AttachmentsService } from '../../../../../../core/services/attachments.service';
import { CreatePostService } from '../../service/api/create-posts.service';
import { PostsStateService } from '../../service/state/posts-state.service';
import { UpdatePostService } from '../../service/api/update-posts.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-upsert-post-model',
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PostModelHeader,
    CreateByPostInfo,
    PostAttachments,
    NgControl,
    TagFriends
],
  template: `
  <section 
    class="fixed inset-0 flex items-center justify-center bg-dark/60 backdrop-blur-sm z-[50]"
    role="dialog"
    aria-modal="true"
    aria-labelledby="postDialogTitle"
    aria-describedby="postDialogDescription">

    <article 
      class="relative w-full md:w-2xl 2xl:w-4xl h-full rounded-none ngCard grid grid-cols-1 
      overflow-hidden animate-up">

      <!-- 🔹 Form -->
      <form 
        [formGroup]="postForm"
        (ngSubmit)="onSubmitPost()"
        class="flex flex-col gap-4 p-4 h-full overflow-y-auto"
        aria-label="Post creation form">

        <!-- Header -->
        <app-post-model-header  
          id="postDialogTitle"
          [title]="!existingPost() ? 'Create post' : 'Update Post'"
          [isValid]="postForm.invalid"/>

        <p id="postDialogDescription" class="sr-only">
          Use this form to {{ !existingPost() ? 'create' : 'update' }} a post. 
          You can add text, images, and tag friends.
        </p>

        <!-- Create Info -->
        <app-create-by-post-info />

        <!-- Select Options -->
        <fieldset class="flex flex-wrap md:flex-nowrap gap-2 items-center justify-between border-t border-base-200 pt-4">
          <legend class="sr-only">Post options</legend>

          <div class="flex  items-center gap-4">
            
            <!-- Availability -->
            <app-ng-control
              [title]="'posts.availability' | translate"
              [option]="{
                type : 'select',
                name : 'availability',
                formControlName : 'availability',
                id : 'availability',
                selectOptions : ['public', 'friends', 'only-me'],
                textForTranslate : 'posts.',
                inputClass : 'ng-select select-sm',
              }"
              [form]="postForm"
              aria-label="Select post visibility"
            />

            <!-- Allow Comments -->
            <app-ng-control
              title="allowComments"
              [option]="{
                type : 'select',
                name : 'allowComments',
                formControlName : 'allowComments',
                id : 'allowComments',
                selectOptions : ['allow' , 'deny'],
                selectLabel : 'Comments',
                textForTranslate : '',
                inputClass : 'ng-select select-sm',
              }"
              [form]="postForm"
              aria-label="Select comment permission"
            />
          </div>


          <!-- Tag Friends -->
          <button
            type="button"
            (click)="isOpenTagModel.set(!isOpenTagModel())"
            class="ngBtn btn-xs sm:btn-sm flex items-center gap-2"
            aria-pressed="{{isOpenTagModel()}}"
            aria-controls="tagFriendsPanel"
            aria-label="Tag friends"
            [title]="'home.tag_people' | translate"
            >
            
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
            class="size-4 sm:size-6">
              <path fill-rule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clip-rule="evenodd" />
            </svg>
            <span >{{ 'home.tag_people' | translate }}</span>
          </button>
        </fieldset>

        <!-- Content Textarea -->
        <app-ng-control
          [option]="{
            type : 'textarea',
            placeHolder : contentPlaceHolder,
            name : 'content',
            formControlName : 'content',
            id : 'content',
            inputClass : 'ng-textarea  w-full min-h-32 max-h-32 placeholder:text-gray-400'
          }"
          [form]="postForm"
          class="w-full"
          aria-label="Post content area"/>

        <!-- Attachments -->
        <app-post-attachments  
        aria-label="Post attachments section"/>

        <!-- Tag Friends Modal -->
        @if(isOpenTagModel()){
          <app-tag-friends
            id="tagFriendsPanel"
            [postForm]="postForm"
            [isOpenTagModel]="isOpenTagModel()" 
            (isOpenTagModelChange)="isOpenTagModel.set($event)" 
            class="absolute inset-0  z-20"
            aria-live="polite"
            aria-label="Tag your friends"
          />
        }

      </form>
    </article>
  </section>
`,
providers :[
CreatePostService,
UpdatePostService
],
changeDetection : ChangeDetectionStrategy.OnPush
})
export class UpsertPostModel implements  OnDestroy{
  readonly contentPlaceHolder : string = `What's on your mind? ✍️` ;

    readonly #createPostService = inject(CreatePostService);
    readonly #updatePostService = inject(UpdatePostService);
    readonly #postState= inject(PostsStateService);
    readonly #router= inject(Router);



  isOpenTagModel = signal<boolean>(false);

  #tagsService = inject(TagsService);
  #attachmentsService = inject(AttachmentsService);
  #domService = inject(DomService);
  #fb = inject(NonNullableFormBuilder);

  existingPost = computed<IPost | null>( () => this.#postState.post());

  postForm: FormGroup<{
    content: FormControl<string>;
    availability: FormControl<Availability>;
    allowComments: FormControl<AllowComments>;
    tags: FormArray<FormControl<string>>;
    attachments: FormArray<FormControl<File>>;
    removedTags: FormArray<FormControl<string>>;
    removedAttachments :  FormArray<FormControl<string>>;
    }> = this.#fb.group(
    {
      content: this.#fb.control('', [
        Validators.minLength(1),
        Validators.maxLength(50000),
      ]),
  
      availability: this.#fb.control<Availability>(
        'public',
        [
          Validators.required,
          Validators.pattern(/^(public|friends|only-me)$/i),
        ]
      ),
      allowComments: this.#fb.control<AllowComments>(
        'allow',
        [
          Validators.required,
          Validators.pattern(/^(allow|deny)$/i),
        ]
      ),
      
      tags: this.#fb.array<FormControl<string>>([]),
      attachments: this.#fb.array<FormControl<File>>([]),

      removedTags: this.#fb.array<FormControl<string>>([]),
      removedAttachments: this.#fb.array<FormControl<string>>([]),
    },
    {
      validators: CustomValidators.post( this.existingPost()!),
    }
  );


  ngOnInit(): void {
  this.#domService.setBodyOverflow('hidden')
  this.#attachmentsService.initAttachmentsForm(this.postForm);
  this.#initExistingPost();
  }
  

  #initExistingPost() : void {
  const post = this.existingPost();
  if (!post) return;

  this.postForm.patchValue({
    content: post.content || '',
    availability: post.availability,
    allowComments: post.allowComments,
  });

  this.postForm.setControl(
    'tags',
    this.#fb.array(post.tags.map(tag => this.#fb.control(tag)))
  );

  if (post.attachments?.length) {
    this.#attachmentsService.initExistingAttachments(post.attachments);
  }
  }

  #updatePost(post : FormPost , postId : string) : void {
  const exist = this.existingPost();

  const updateContent = post.content !== exist?.content;
  const updateAvailability = post.availability !== exist?.availability;
  const updateAllowComments = post.allowComments !== exist?.allowComments;
  const updateTags = post.tags?.length! > 0 || post.removedTags?.length! > 0;
  
  const updateAttachments =
  (post.attachments?.length ?? 0) > 0 ||
  (post.removedAttachments?.length ?? 0) > 0;

  if (updateContent || updateAvailability || updateAllowComments || updateTags) {
    this.#updatePostService.updatePostContent(postId, post).subscribe();
  }

  if (updateAttachments) {
    this.#updatePostService.updatePostAttachments(postId, post).subscribe();
  }

}


  onSubmitPost(): void {
  if (!this.postForm.valid) return;

  const existingPost = this.existingPost();
  const post : FormPost = this.postForm.getRawValue();
  
  existingPost ? 
  this.#updatePost(post  , existingPost._id) :
  this.#createPostService.createPost(post).subscribe();

  this.#router.navigate([''] , {queryParams : {availability : post.availability }})
  }



#clearForm(): void {
  this.postForm.controls.content.setValue('');
  this.postForm.controls.tags.clear()
  this.postForm.controls.removedTags.clear();
  this.#postState.setPost(null);
  this.#tagsService.clearForm();
  this.#domService.setBodyOverflow('auto');
  
  this.#attachmentsService.clearAttachments();
}

ngOnDestroy(): void {
this.#clearForm()
}

}
