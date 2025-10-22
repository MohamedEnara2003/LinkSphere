import { ChangeDetectionStrategy, Component, computed, effect, inject, input, viewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../../../../../../../../shared/modules/shared.module';
import { NgControl } from '../../../../../../../../../../shared/components/ng-control/ng-control.';
import { CommentTagPeople } from "../comment-tag-people/comment-tag-people";
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize, map, Observable, startWith } from 'rxjs';
import { CommentService } from '../../../../../../services/comments.service';
import { ICreateComment } from '../../../../../../../../../../core/models/comments.model';
import { ActivatedRoute, Router } from '@angular/router';




@Component({
selector: 'app-upsert-comment',
imports: [SharedModule, NgControl, CommentTagPeople],
template: `

<section class="relative w-full  overflow-hidden p-1">

<form [formGroup]="commentForm"  class="w-full flex flex-col gap-2">



@if(isTagging()){
<fieldset class="w-full">
<app-comment-tag-people 
[commentForm]="commentForm"
class="w-full" 
/>
</fieldset>
}



<fieldset class="w-full fieldset flex items-end gap-2">
<label for="upload" 
    class=" btn btn-sm  bg-transparent border-transparent  hover:opacity-80 duration-300 transition-all ngText">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-success">
    <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" />
    </svg>
    <input 
    type="file" 
    name="upload" 
    id="upload" 
    hidden 
    multiple
    accept="image/*"
    >
    </label>

<div class="w-full flex flex-col gap-2">

@if(type() && commentId()){
  <nav class="w-full flex justify-between items-center animate-up ngCard px-2 ">
    
  <h4 class="ngText text-xs font-normal sm:text-sm">
  {{type() === 'reply' ? ( 'Replying to ' + existingComment()?.author?.userName) : 'Edit comment'}}
  </h4>
  
  <button type="button"
  (click)="removeQueries()"
  class="btn btn-link text-brand-color link-hover">
    Cancel
  </button>
</nav>
}

<app-ng-control 
#ngControlRef
[option]="{
type : 'text' ,
formControlName  : 'content' ,
placeHolder : 'Write a comment...' ,
id : 'content' ,
name : 'content' ,
inputClass : 'w-full ng-input bg-light dark:bg-dark '  ,
}" 
[form]="commentForm" 
[isShowValidationsError]="false"
class="w-full"
/>
</div>
<button type="submit" [disabled]="commentForm.invalid"
(click)="onSubmit()" class="btn btn-sm sm:btn-md btn-neutral bg-transparent border-transparent">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
class="size-7"
[ngClass]="commentForm.invalid ? 'text-dark/50' : ' text-brand-color'">
<path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
</svg>
</button>
</fieldset>

</form>

</section>
`,
changeDetection : ChangeDetectionStrategy.OnPush
})
export class UpsertComment {
  #commentService = inject(CommentService);
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
    content: ['', Validators.required],
    attachment: [null],
    tags: this.#fb.array<string>([]),
  });

  isTagging = toSignal(
    this.commentForm.controls['content'].valueChanges.pipe(
      startWith(this.commentForm.controls['content'].value),
      map((value: string | null) => {
        const safeValue = (value ?? '').trimEnd();
        const lastWord = safeValue.split(/\s+/).pop() || '';
        return lastWord === '@';
      })
    ),
    { initialValue: false }
  );
  
  constructor(){

  effect(() => {
  if(this.commentId()){

  this.onFoucsContent();

  if(this.type() === 'edit'){ 
  const comment = this.existingComment();
  if (!comment) return;

  this.commentForm.patchValue({
    content: comment.content  || '',
    availability: comment.attachment ?? '',
    tags: comment.tags || [] ,
  });
  }
  
  }
  })
  }
  
  removeQueries() : void {
    this.#router.navigate([], {
    queryParams : {
      type : null ,
      commentId : null ,
    }, queryParamsHandling : 'merge'
    });
    this.commentForm.reset();
  }

  onFoucsContent() : void {
  const ngControlRef = this.ngControlRef();
  if(ngControlRef){
  ngControlRef.focusInput();
  }
  }

  onSubmit() {
    if (!this.commentForm.valid) return;
  
    const createdComment = this.commentForm.getRawValue() as ICreateComment;
    const postId = this.postId();
    const type = this.type();
    const commentId = this.commentId();
  
  
    if (!postId) return;
    let action$ : Observable<unknown>;
  
    if (type === 'edit' && commentId) {
      action$ = this.#commentService.updateComment(postId, commentId, createdComment);
    } else if (type === 'reply' && commentId) {
      action$ = this.#commentService.replyComment(postId, commentId, createdComment);
    } else {
      action$ = this.#commentService.createComment(postId, createdComment);
    }
  
    action$.subscribe()

  
  }
  
}
