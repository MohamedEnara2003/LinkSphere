import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgImage } from '../../../../../../../../../../shared/components/ng-image/ng-image';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserProfileService } from '../../../../../../../profile/services/user-profile.service';
import { IFriend } from '../../../../../../../../../../core/models/user.model';




@Component({
selector: 'app-comment-tag-people',
imports: [RouterModule, NgImage, FormsModule, ReactiveFormsModule],
template: `

    <section class="w-full ngCard   border border-brand-color/50 
    p-2 z-10 animate-up ">

    <ul [formGroup]="commentForm()!" class="w-full h-35 overflow-y-auto flex flex-col gap-1 " 
    style="scrollbar-width: none;">
    @for (friend of friends(); track friend._id) {
    <li class="w-full flex  gap-2 hover:bg-brand-color/60  p-1 rounded cursor-pointer"
    (click)="createTag(friend._id , friend.userName)">
    <app-ng-image
    [options]="{
    src : friend.picture || '/user-placeholder.jpg',
    alt :'Profile picture of ' + friend.userName,
    width :  32,
    height : 32,
    class : 'size-8 rounded-full object-cover  mb-2'
    }"
    />

    <span class="ngText text-sm">{{friend.userName}}</span>
    
    </li>
    }
    </ul>

</section>
`,
})
export class CommentTagPeople {

userService = inject(UserProfileService);

commentForm = input<FormGroup>();

#fb = inject(FormBuilder);

friends =  computed<IFriend[]>(() => this.userService.user()?.friends || []);



public get tags() : FormArray{
return this.commentForm()?.controls['tags'] as FormArray
}


createTag(userId : string , userName : string) : void {
this.tags.push(this.#fb.control([userId]));

const commentControl = this.commentForm()?.controls['content'] as FormControl;
const currentValue = commentControl.value || '';

const newValue = currentValue.replace(/@\w*$/, `@${userName} `);
commentControl.setValue(newValue);
}




}
