import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';




@Component({
selector: 'app-post-model-header',
imports: [RouterModule],
template: `
<header class="flex justify-between  gap-5 border-b-2 border-dark/25 pb-2">
<button [routerLink]="['/public' ,{ outlets: { model: null } }]" queryParamsHandling="merge"
type="button" class="btn btn-sm btn-circle bg-transparent ngText ">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
stroke="currentColor" class="size-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
</button>

<h2 class="ngText text-xl">
{{title()}}
</h2>

<button 
type="submit" class="ngBtn btn-sm" [disabled]="isValid()">
Post
</button>
</header>
`,
})
export class PostModelHeader {
  title = input.required<string>();
  isValid = input.required<boolean>();
}
