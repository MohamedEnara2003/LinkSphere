import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgControl } from "../../../../../../shared/components/ng-control/ng-control.";
import { SharedModule } from '../../../../../../shared/modules/shared.module';


@Component({
selector: 'app-create-post-comment',
imports: [NgControl , SharedModule],
template: `
<form >
<app-ng-control [option]="{
type : 'text' ,
formControlName  : 'comment' ,
id : 'comment' ,
name : 'comment' ,
inputClass : 'ng-input' ,
}" [form]="commentForm" />
</form>
`,
})
export class CreatePostComment {
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
