import { Component, input } from '@angular/core';
import { BackLink } from "../../../../../../../../shared/components/links/back-link";
import { RouterModule } from '@angular/router';
import { NgImage } from "../../../../../../../../shared/components/ng-image/ng-image";
import { Picture } from '../../../../../../../../core/models/picture';


@Component({
selector: 'app-cover-image',
imports: [BackLink, RouterModule, NgImage],
template: `

<header class="relative w-full h-[30svh] sm:h-[45svh] md:h-[50svh] overflow-hidden 
rounded-b-2xl shadow-md">

@if(!isNavHide()) {
<nav class="w-full flex justify-between items-center absolute top-0 left-0  p-4 z-10 ">
<app-back-link />

  @if(isMyProfile()){
  <button 
    [routerLink]="['/public/profile/user' , userId() , 'update']"
    [queryParams]="{edit : 'cover-images'}"
    class="ngBtn">
    <svg xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    class="w-6 h-6">
    <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
    <path fill-rule="evenodd" 
            d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 
        1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 
        1.11.71.386.054.77.113 1.152.177 
        1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 
        3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 
        2.429-2.909.382-.064.766-.123 1.151-.178a1.56 
        1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 
        0 0 1 2.332-1.39ZM6.75 12.75a5.25 
        5.25 0 1 1 10.5 0 5.25 5.25 0 0 
        1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 
        0 0 0 0 1.5Z" 
            clip-rule="evenodd" />
    </svg>
    <span class="text-sm font-medium  hidden md:inline">Add cover photo </span>
  </button>
  }
</nav>
}

    @if(coverImage()) {
    <app-ng-image
        [options]="{
        src : coverImage()?.url || '' ,
        alt : 'Profile picture ' ,
        width  : 800,
        height : 800,
        class : 'size-full object-cover rounded-b-2xl transition-transform duration-500 hover:scale-105',
        loading : 'eager' ,
        decoding : 'async' ,
        fetchpriority : 'high', 
        }"
        [isPreview]="true"
        />
    }@else {
    <div
    class="w-full h-full ngCard flex items-center justify-center rounded-b-2xl t text-sm">
    <span>No cover image</span>
    </div>
    }

</header>

`,  
})
export class coverImage {
  coverImage = input<Picture>();
  userId = input<string>('');
  isNavHide = input<boolean>(false);
  isMyProfile = input<boolean>(false);
}
