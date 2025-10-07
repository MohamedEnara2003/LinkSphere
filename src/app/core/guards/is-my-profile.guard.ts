import {CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserProfileService } from '../../features/public/pages/profile/services/user-profile.service';

export const isMyProfileGuard: CanMatchFn = () => {
const router = inject(Router)
const userProfileService = inject(UserProfileService);

const userId : string = userProfileService.user()?._id || '';
const userProfileId : string = userProfileService.userProfile()?._id || '';


if(userId === userProfileId){
return true;
}

router.navigateByUrl('/');
return false;

};
