import { afterNextRender, ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, signal} 
from '@angular/core';


import { DomService } from '../../../../../../core/services/dom.service';
import { NonNullableFormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormArray, FormControl } from '@angular/forms';
import { PostModelHeader } from "./components/post-model-header";
import { CreateByPostInfo } from "./components/create-by-post-info";
import { ICreatePost, IPost, IUpdatePost } from '../../../../../../core/models/posts.model';
import { PostService } from '../../services/post.service';
import { CustomValidators } from '../../../../../../core/validations/custom/custom-validations';
import { PostAttachments } from "./components/post-attachments";
import { NgControl } from "../../../../../../shared/components/ng-control/ng-control.";
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { TagPeople } from "./components/tag-people";
import { PreviewImage, UploadService } from '../../../../../../core/services/upload/upload.service';



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
    TagPeople
],
  template: `
  <section class="w-full h-svh fixed top-0 left-0 flex justify-center items-center  z-20">

<article 
  role="dialog"
  aria-modal="true" 
  class="relative w-full md:w-2xl 2xl:w-4xl h-full md:h-[95%] ngCard grid grid-cols-1
  rounded-none md:rounded-2xl border border-brand-color/10  overflow-hidden
  z-10 animate-sideLeft ">
  

<form [formGroup]="postForm" (ngSubmit)="createPost()"
class="size-full flex flex-col gap-2  px-2 py-4">
<legend class="fieldset-legend sr-only">
{{ !existingPost() ? 'Create post' : 'Update Post'}}
</legend>

<app-post-model-header  
[title]="!existingPost() ? 'Create post' : 'Update Post'"
[isValid]="postForm.invalid"/>

<fieldset class="size-full fieldset space-y-4  overflow-y-auto px-2">
        
<app-create-by-post-info />


<div class="w-full flex flex-wrap md:flex-nowrap items-center justify-between gap-3 md:gap-5">
  
  <!-- Availability Select -->
  <app-ng-control
    [title]="'posts.availability' | translate"
    [option]="{
      type : 'select',
      name : 'availability',
      formControlName : 'availability',
      id : 'availability',
      selectOptions : ['public', 'friends', 'only-me'],
      textForTranslate : 'posts.',
      inputClass : 'select select-sm md:select-md select-neutral bg-dark text-light capitalize w-32 md:w-40 border border-brand-color/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-color transition-all duration-300'
    }"
    [form]="postForm"
    class="flex-1"
  />

  <!-- Tag People Button -->
  <button
    type="button"
    (click)="isOpenTagModel.set(!isOpenTagModel())"
    class="btn btn-sm md:btn-md h-9 md:h-10 px-4 flex items-center gap-2 bg-dark border border-brand-color/20 text-light hover:bg-brand-color/20 transition-all duration-300 rounded-xl"
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
    <span class="text-sm md:text-base">
      {{ 'home.tag_people' | translate }}
    </span>
  </button>
</div>

    <app-ng-control
    [option]="{
    type : 'textarea',
    placeHolder : contentPlaceHolder ,
    name : 'content',
    formControlName : 'content',
    id : 'content',
    inputClass : 'ng-textarea h-30 max-h-30 placeholder:text-gray-400 ' ,
    }"
    [form]="postForm" class="w-full"/>

<app-post-attachments [postForm]="postForm" />


@if(isOpenTagModel()){
<app-tag-people
[postForm]="postForm"
[isOpenTagModel]="isOpenTagModel()" 
(isOpenTagModelChange)="isOpenTagModel.set($event)" 
class="size-full absolute left-0 top-0 animate-up z-20"/>
}

</fieldset>
</form>


</article>
  <div aria-hidden="true" class="size-full bg-dark/50 fixed top-0 left-0"></div>
  </section>
`,
changeDetection : ChangeDetectionStrategy.OnPush
})
export class UpsertPostModel implements  OnDestroy{
  readonly contentPlaceHolder = `What's on your mind? ✍️` ;
  isOpenTagModel = signal<boolean>(false);


  #postService = inject(PostService);
  #uploadService = inject(UploadService);
  #domService = inject(DomService);

  #fb = inject(NonNullableFormBuilder);


  existingPost = computed<IPost | null>( () => this.#postService.post());

  postForm: FormGroup<{
    content: FormControl<string>;
    availability: FormControl<'public' | 'friends' | 'only-me'>;
    tags: FormArray<FormControl<string>>;
    attachments: FormArray<FormControl<File>>;
    removedTags: FormArray<FormControl<string>>;
    removedAttachments :  FormArray<FormControl<string>>;
  }> = this.#fb.group(
    {
      content: this.#fb.control('', [
        Validators.min(1),
        Validators.maxLength(50000),
      ]),
  
      availability: this.#fb.control<'public' | 'friends' | 'only-me'>(
        'public',
        [
          Validators.required,
          Validators.pattern(/^(public|friends|only-me)$/i),
        ]
      ),
      
      tags: this.#fb.array<FormControl<string>>([]),
      attachments: this.#fb.array<FormControl<File>>([]),

      removedTags: this.#fb.array<FormControl<string>>([]),
      removedAttachments: this.#fb.array<FormControl<string>>([]),
    },
    {
      validators: CustomValidators.post('content', 'attachments'),
    }
  );
  
  constructor(){
  afterNextRender(() => this.#domService.setBodyOverflow('hidden'));

  effect(() => {
    const post = this.existingPost();
    if (!post) return;

    this.postForm.patchValue({
      content: post.content,
      availability: post.availability,
      tags: post.tags ,
    });

    if (post.imageUrls && post.imageUrls.length > 0) {
      const existingPostImage: PreviewImage[] = post.imageUrls.map((url, index) => ({
        url,
        key: post.attachments?.[index] ?? '' 
      }));
      this.#uploadService.setPreviews = existingPostImage;
    }
    


    // لو عندك tags موجودة في البوست
    this.postForm.setControl(
      'tags',
      this.#fb.array(post.tags.map(tag => this.#fb.control(tag)))
    )})
  }


  getPostPayload(isUpdate = false): ICreatePost | IUpdatePost {
    const form = this.postForm.value;
    const existingPost = this.existingPost();
  
    const basePayload: Partial<ICreatePost & IUpdatePost> = {};
  
    // ✅ فقط أضف content لو اختلف عن القديم
    if (!isUpdate || form.content?.trim() !== existingPost?.content?.trim()) {
      basePayload.content = form.content?.trim() || undefined;
    }
  
    // ✅ المرفقات الجديدة فقط
    if (form.attachments?.length) {
      basePayload.attachments = form.attachments;
    }
  
    // ✅ التاجز الجديدة فقط
    if (form.tags?.length) {
      basePayload.tags = form.tags;
    }
  
    if (isUpdate) {
      if (form.removedAttachments?.length) {
        basePayload.removedAttachments = form.removedAttachments;
      }
      if (form.removedTags?.length) {
        basePayload.removedTags = form.removedTags;
      }
      return basePayload as IUpdatePost;
    }
  
    // ✅ متغير خاص بالإنشاء فقط
    basePayload.availability = form.availability;
    return basePayload as ICreatePost;
  }
  

  
  createPost() : void {
  if(this.postForm.valid){
  const previews = this.#uploadService.previews().map(({url}) => url);

  const existingPost = this.existingPost();
  
  (existingPost && existingPost._id) ?
  this.#postService.updatePost(existingPost._id , this.getPostPayload(true) , previews).subscribe() :
  this.#postService.createPost(this.getPostPayload() ,previews).subscribe() ;

  
  this.postForm.controls.content.setValue('');
  this.postForm.controls.attachments.clear();
  this.postForm.controls.tags.clear();
  return 
  }
  }


ngOnDestroy(): void {
this.#domService.setBodyOverflow('auto');
this.#postService.setPost(null);
this.#uploadService.clear();
}

}
