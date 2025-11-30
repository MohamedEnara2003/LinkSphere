import { inject, Injectable } from '@angular/core';
import { SingleTonApi } from '../../../../../../core/services/api/single-ton-api.service';
import { UserProfileService } from '../../../profile/services/user-profile.service';

@Injectable({
    providedIn: 'root'
})
export class AppChatsService {
readonly singleTonApi = inject(SingleTonApi);
readonly userProfile = inject(UserProfileService);
readonly routeName : string = ""; 



}