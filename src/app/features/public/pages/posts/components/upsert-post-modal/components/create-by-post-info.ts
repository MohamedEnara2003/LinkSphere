import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserPicture } from "../../../../profile/components/user-picture/user-picture";





@Component({
selector: 'app-create-by-post-info',
imports: [RouterModule, UserPicture],
template: `

<div class="flex items-center gap-2 ">
<app-user-picture 
styleClass="size-10 object-cover  rounded-full shadow shadow-dark"
styleClassFigcaption="ngText capitalize"
/>
</div>

`,
})
export class CreateByPostInfo {
 


}
