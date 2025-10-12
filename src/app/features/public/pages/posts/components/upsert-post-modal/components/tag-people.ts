import { Component, inject, input, model, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgImage } from "../../../../../../../shared/components/ng-image/ng-image";
import { FormArray, FormGroup, NonNullableFormBuilder} from '@angular/forms';



@Component({
selector: 'app-tag-people',
imports: [RouterModule, NgImage],
template: `

    <section class="size-full ngCard  rounded-none md:rounded-2xl border border-brand-color/10 
    p-5 z-10 animate-up space-y-2">

    <header class="flex justify-between  gap-5 border-b-2 border-dark/25 pb-2">
    <button (click)="isOpenTagModel.set(!isOpenTagModel())"
    type="button" class="btn btn-sm btn-circle bg-transparent ngText  ">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
    stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
    </button>

    <h2 class="ngText text-xl ">Tag people</h2>

    <button (click)="isOpenTagModel.set(!isOpenTagModel())"
    type="submit" class="ngBtn btn-sm"
    [disabled]="ArrayTags.controls.length === 0">
    Add
    </button>
    </header>

<div>
    <label class="w-full input  input-neutral bg-dark/50 border-transparent">
    <label for="Search-people" class="label">    
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
    </label>
    <input type="text" id="Search-people" placeholder="Who are you with?" 
    class="placeholder:text-gray-400">
    </label>
</div>

    <h2 class="badge bage-sm bg-brand-color/20 text-brand-color">Suggestions</h2>

    <ul class="w-full h-full overflow-y-auto grid grid-cols-1 gap-1 p-1" 
    style="scrollbar-width: none;">
    @for (friend of friends(); track friend.id) {
    <li class="w-full flex justify-between gap-2">
    <label [for]="'Tag-' + friend.name" 
    class="w-full  flex items-center gap-4 hover:bg-dark/50 hover:text-brand-color 
    p-1 px-2 ">
    <app-ng-image
    [options]="{
    src : friend.avatar,
    alt :'Profile picture of ' + friend.name,
    width :  32,
    height : 32,
    class : 'size-8 rounded-full object-cover  mb-2'
    }"
    />
    {{friend.name}}
    </label>
    <input type="checkbox" [name]="'Tag-' + friend.name" [id]="'Tag-' + friend.name"
    (change)="onTagChange(friend.id, $event.target)"
    class="ng-checkbox ">
    </li>
    }
    </ul>

</section>
`,
})
export class TagPeople {
isOpenTagModel = model<boolean>(false);

postForm = input.required<FormGroup>();
#fb = inject(NonNullableFormBuilder);


friends = signal(
    Array.from({ length: 11 }).map((_, i) => ({
    id: i + 1,
    name: `Friend ${i + 1}`,
    username: `friend${i + 1}`,
    avatar: `https://randomuser.me/api/portraits/men/${i + 10}.jpg`
    }))
);


public get ArrayTags() : FormArray {
return this.postForm().controls['tags'] as FormArray
}


onTagChange(friendId: string | number, input: HTMLInputElement): void {
    const tagsArray = this.ArrayTags;

    if (input.checked) {
      // ✅ أضف id المستخدم في الـ FormArray
    if (!tagsArray.value.includes(friendId)) {
    tagsArray.push(this.#fb.control(String(friendId)));
    }
    } else {
      // ❌ لو اتشال الـ check، شيله من الـ FormArray
    const index = tagsArray.controls.findIndex(c => c.value === String(friendId));
    if (index !== -1) {
    tagsArray.removeAt(index);
    }
    }
}

}
