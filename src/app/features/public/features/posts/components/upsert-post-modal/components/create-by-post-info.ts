import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserPicture } from "../../../../profile/components/user-picture/user-picture";
import { TagsService } from '../../../../../../../core/services/forms/tags.service'; 


@Component({
selector: 'app-create-by-post-info',
imports: [RouterModule, UserPicture],
template: `

<section class="flex flex-wrap items-center gap-2 ">
<app-user-picture 
styleClass="size-10 object-cover  rounded-full shadow shadow-dark"
styleClassFigcaption="ngText capitalize"
/>

<p class="text-brand-color font-semibold text-xs line-clamp-2">
{{tagsService.generateTagText() || ''}}
</p>
</section>

`,
})
export class CreateByPostInfo {
tagsService = inject(TagsService);
}
