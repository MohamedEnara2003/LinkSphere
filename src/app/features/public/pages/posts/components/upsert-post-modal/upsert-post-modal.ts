import { afterNextRender, ChangeDetectionStrategy, Component, inject, OnDestroy} 
from '@angular/core';


import { RouterModule } from '@angular/router';
import { UpserPostForm } from "./components/upsert-post-form";
import { UserPicture } from "../../../profile/components/user-picture/user-picture";
import { DomService } from '../../../../../../core/services/dom.service';

@Component({
  selector: 'app-upsert-post-model',
  imports: [RouterModule, UpserPostForm, UserPicture],
  template: `
  <section class="w-full h-svh fixed top-0 left-0 flex justify-center items-center  z-20">

  <article 
  role="dialog"
  aria-modal="true" 
  class="relative w-full md:w-2xl 2xl:w-4xl h-full md:h-[90%] ngCard 
  rounded-none md:rounded-2xl border border-brand-color/10  overflow-hidden
  p-5 z-10 animate-sideLeft space-y-2">

  <header class="flex justify-between  gap-5 border-b-2 border-dark/25 pb-2">

  <button [routerLink]="['/public' ,{ outlets: { model: null } }]"
  type="button" class="btn btn-sm btn-circle bg-transparent ngText ">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
  stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
  </button>

  <h2 class="ngText text-xl">Create Post</h2>

  <button 
  type="submit" class="ngBtn btn-sm">
  Post
  </button>

</header>

<div class="flex items-center gap-2">
<app-user-picture styleClass="size-10 object-cover  rounded-full shadow shadow-dark"/>

<h2 class="card-title ngText capitalize"> Mohamed enara</h2>
</div>

  <app-upsert-post-form />

  </article>

  <div [routerLink]="['/public' ,{ outlets: { model: null } }]" 
  aria-hidden="true" class="size-full bg-dark/50 fixed top-0 left-0">
  </div>
  </section>
`,
changeDetection : ChangeDetectionStrategy.OnPush
})
export class UpsertPostModel implements  OnDestroy{
  
  #domService = inject(DomService);


  constructor(){
  afterNextRender(() => this.#domService.setBodyOverflow('hidden'))
  }


ngOnDestroy(): void {
this.#domService.setBodyOverflow('auto');
}


}
