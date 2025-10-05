import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../../../../../../../../shared/modules/shared.module';
import { NgControl } from '../../../../../../../../../../shared/components/ng-control/ng-control.';




@Component({
selector: 'app-upsert-comment',
imports: [ SharedModule , NgControl],
template: `
<form  class="w-full  flex items-center gap-4 ">

<div class="w-full">
<app-ng-control [option]="{
type : 'text' ,
formControlName  : 'comment' ,
placeHolder : 'Write a comment...' ,
id : 'comment' ,
name : 'comment' ,
inputClass : 'w-full input input-neutral   bg-dark' ,
}" 
[form]="commentForm" 
[isShowValidationsError]="false"
/>
</div>

<button type="submit" (click)="onSubmit()" class="ngBtnIcon">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
class="size-6 text-brand-color">
<path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
</svg>
</button>

</form>
`,
})
export class UpsertComment {
  commentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.commentForm.valid) {
      const comment = this.commentForm.value.comment;
      this.commentForm.reset();
    }
  }
}
