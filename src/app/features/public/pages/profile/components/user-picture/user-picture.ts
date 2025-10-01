import { Component, input } from '@angular/core';

import { NgImage } from "../../../../../../shared/components/ng-image/ng-image";
import { IUser } from '../../../../../../core/models/user.model';

@Component({
selector: 'app-user-picture',
imports: [NgImage],
template: `
        <app-ng-image
        [options]="{
                src : '/man-empty-avatar-photo.webp',
                alt : '',
                placeholder : '/man-empty-avatar-photo.webp' ,
                width  : 100,
                height : 100,
                class : styleClass() || 'size-50'
    }"
    />
`
})
export class UserPicture {
styleClass = input('');
user = input<IUser>() ;

}
