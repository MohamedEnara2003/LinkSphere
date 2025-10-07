import { Component, inject, input } from '@angular/core';
import { NgImage } from "../../../../../../shared/components/ng-image/ng-image";
import { UserProfileService } from '../../services/user-profile.service';


@Component({
selector: 'app-user-picture',
imports: [NgImage ],
template: `
        <app-ng-image
        [options]="{
        src :  userProfileService.user()?.picture || userProfileService.user()?.placeholder  || '',
        alt : 'Profile picture ' + userProfileService.user()?.userName || '',
        width  : 200,
        height : 200,
        class : styleClass() || 'size-50',
        loading : 'eager' ,
        decoding : 'async' ,
        fetchpriority : 'high', 
        }"
        [isPreview]="isPreview()"
        />
`
})
export class UserPicture {
userProfileService = inject(UserProfileService);
styleClass = input<string>('');
isPreview = input<boolean>(false);


}
