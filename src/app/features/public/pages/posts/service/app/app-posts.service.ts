import { inject, Injectable } from '@angular/core';

import { SingleTonApi } from '../../../../../../core/services/api/single-ton-api.service';
import { UserProfileService } from '../../../profile/services/user-profile.service';
import { Router } from '@angular/router';
import { Availability} from '../../../../../../core/models/posts.model';





@Injectable({
providedIn: 'root'
})

export class AppPostsService{

// core
readonly singleTonApi = inject(SingleTonApi);
readonly userService = inject(UserProfileService);
readonly router = inject(Router);
readonly routeName: string = "posts";


closeUpsertModelPost(availability : Availability) : void {
this.router.navigate([''] , {queryParams : {state : availability }})
}

}
