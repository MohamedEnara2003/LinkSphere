import { Component } from '@angular/core';

@Component({
selector: 'app-loading-comment',
imports: [],
template: `
<li class="w-full h-20  flex  p-2 gap-3">
<div class="size-10 rounded-full ng-skeleton "></div>
<div class="w-full ng-skeleton  "></div>
</li>


`,

})
export class LoadingComment{}