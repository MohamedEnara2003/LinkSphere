import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserProfileService } from '../../../profile/services/user-profile.service';
import { TranslateModule } from '@ngx-translate/core';
import { UserPicture } from "../../../profile/components/user-picture/user-picture";
import { SharedModule } from '../../../../../../shared/modules/shared.module';



@Component({
  selector: 'app-btn-open-model-upsert-post',
  imports: [SharedModule , UserPicture],
  template: `

<article class="w-full  rounded-2xl ngCard p-4  flex justify-between items-center ">

    <div class="flex items-center gap-2 ">

      @let userId = userProfileService.user()?._id || '';

      <app-user-picture 
      [routerLink]="userId ? ['/public/profile/user', userId] : null"
      styleClass="size-10 object-cover  rounded-full shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer"
      />

    <button 
    [routerLink]="['/public' ,{ outlets: { 'model': ['upsert-post'] } }]" 
    queryParamsHandling="merge"
    type="button" class=" btn-ghost hover:bg-dark/40 btn font-light">
    {{ 'home.whats_on_mind' | translate }}
    </button>
    </div>

<span     
[routerLink]="['/public' ,{ outlets: { 'model': ['upsert-post'] } }]" 
queryParamsHandling="merge"

class="cursor-pointer">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"  
class="size-6 text-brand-color">
<path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" />
</svg>

</span>

</article>
`,
})
export class btnOpenModelUpsertPost {
userProfileService = inject(UserProfileService);

}
