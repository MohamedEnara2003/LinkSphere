import { Component, inject, input } from '@angular/core';
import { NgImage } from "../../../../../../shared/components/ng-image/ng-image";
import { UserProfileService } from '../../services/user-profile.service';
import { SharedModule } from '../../../../../../shared/modules/shared.module';

@Component({
selector: 'app-user-picture',
imports: [NgImage  , SharedModule],
template: `

        <figure class="size-full"
        [ngClass]="styleClassFigure() || 'flex justify-center items-center gap-2'">
        
        <!-- Figcaption -->
        <app-ng-image
        [routerLink]="path() || null"
        [options]="{
        src :  userProfileService.user()?.picture || '',
        placeholder :'user-placeholder.webp',
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

        <figcaption [class]="styleClassFigcaption()">
        {{styleClassFigcaption() ? (userProfileService.user()?.userName || '') : ''}}
        </figcaption>

        </figure>
`
})
export class UserPicture {
userProfileService = inject(UserProfileService);

styleClass = input<string>('');
isPreview = input<boolean>(false);

styleClassFigure = input<string>('');
styleClassFigcaption = input<string>('');

path = input<string>('');



}
