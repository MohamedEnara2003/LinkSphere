import {CanMatchFn, Router  } from '@angular/router';
import { inject } from '@angular/core';
import { UserProfileService } from '../../features/public/pages/profile/services/user-profile.service';

export const isMyProfileGuard: CanMatchFn = () => {
const router = inject(Router)
const userProfileService = inject(UserProfileService);


if(userProfileService.isMyProfile()){
return true;
}

router.navigateByUrl('/public/profile/not-founed');
return false;

};
