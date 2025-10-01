import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { NgControl } from "../../../../../../../shared/components/ng-control/ng-control.";
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { TagPeople } from "./tag-people";
import { NgImage } from "../../../../../../../shared/components/ng-image/ng-image";
import { UploadService } from '../../../../../../../core/services/upload/upload.service';



@Component({
selector: 'app-upsert-post-form',
imports: [SharedModule, NgControl, TagPeople, NgImage],
template: `
<form class="w-full ">
    <legend class="fieldset-legend sr-only">Create post</legend>
    <fieldset class="fieldset space-y-4 ">
        
    <div class="w-full flex  gap-2">
    <app-ng-control title="Availability"
    [option]="{
    type : 'select',
    name : 'availability',
    formControlName : 'availability',
    id : 'availability',
    selectOptions : ['public' , 'friends' , 'only-me' , 'frozen'] ,
    inputClass : 'w-20 select select-xs select-neutral bg-dark  text-light capitalize' ,
    }"
    [form]="postForm" />

    <app-ng-control title="Allow comments"
    [option]="{
    type : 'select',
    name : 'allowComments',
    formControlName : 'allowComments',
    id : 'allowComments',
    selectOptions : ['allow' , 'deny'] ,
    inputClass : 'w-20  select select-xs select-neutral bg-dark text-light capitalize' ,
    }"
    [form]="postForm" />
    </div>

    <app-ng-control
    [option]="{
    type : 'textarea',
    placeHolder : contentPlaceHolder ,
    name : 'content',
    formControlName : 'content',
    id : 'content',
    inputClass : 'ng-textarea h-10 max-h-30 placeholder:text-gray-400 ' ,
    }"
    [form]="postForm" class="w-full"/>

    
<ul  aria-label="Menu Product Images" role="menu" 
class="w-full h-45 overflow-y-auto grid grid-cols-2 gap-2">
@for (item of uploadService.previews(); let i = $index ; track item) {
<li  class="w-full  ">
        <app-ng-image
        [options]="{
        src : item ,
        alt : 'image ' + i ,
        width :  100 , 
        height : 100 ,
        class : 'w-full h-40 object-cover shadow shadow-card-dark' ,
        loading : 'lazy' ,
        decoding : 'async'
        }"
        />  
</li>
}
</ul>

<div class="flex flex-col gap-2">
<label for="upload"
class="w-50 flex  justify-start gap-4  btn ngText  btn-sm bg-light dark:bg-dark border-transparent ">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
class="size-6 text-green-600">
<path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" />
</svg>
Photo
<input (change)="uploadAttachments($event.target)"  
type="file"  name="upload"  id="upload"  class="hidden"  accept="image/*"  multiple/>
</label>


<button type="button"   (click)="isOpenTagModel.set(!isOpenTagModel())"
class="w-50 flex  justify-start gap-4  btn ngText  btn-sm bg-light dark:bg-dark  border-transparent">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
class="size-6 text-blue-600">
<path fill-rule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clip-rule="evenodd" />
</svg>
Tag people
</button>
</div>

@if(isOpenTagModel()){
<app-tag-people 
[postForm]="postForm"
[isOpenTagModel]="isOpenTagModel()" 
(isOpenTagModelChange)="isOpenTagModel.set($event)" 
class="size-full absolute left-0 top-0 animate-up z-20"/>
}

</fieldset>

</form>
`,
changeDetection : ChangeDetectionStrategy.OnPush
})

export class UpserPostForm implements OnDestroy{
readonly contentPlaceHolder = `What's on your mind? ✍️` ;

postForm!: FormGroup;
#fb = inject(NonNullableFormBuilder);
uploadService = inject(UploadService);


isOpenTagModel = signal<boolean>(false);

constructor(){
this.postForm = this.#fb.group({
content: [
    '', 
    [
    Validators.maxLength(50000),
    ]
],
availability: [
    'public', 
    [
    Validators.required ,
    Validators.pattern(/^(public|friends|only-me|frozen)$/i) 
    ]
],
allowComments: [
'allow', 
[
    Validators.required ,
    Validators.pattern(/^(allow|deny)$/i) 
]
],
tags: this.#fb.array([]),
})
}

uploadAttachments(input: HTMLInputElement): void {
this.uploadService.uploadAttachments(input);
}


ngOnDestroy(): void {
this.uploadService.clear();
}


}
