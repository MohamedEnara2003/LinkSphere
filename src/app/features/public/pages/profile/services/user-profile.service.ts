import { computed, inject, Injectable, signal } from '@angular/core';
import { SingleTonApi } from '../../../../../core/services/api/single-ton-api.service';
import { 
  ChangePasswordDto, 
  FriendRequestResponse, 
  GenderEnum, 
  IConfirmUpdateEmail, 
  IUpdateBasicInfo, 
  IUpdateEmail, 
  IUser, 
  UnfreezePayload, 
  UserProfile
} from '../../../../../core/models/user.model';
import { EMPTY, Observable, tap } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  #singleTonApi = inject(SingleTonApi);
  #routeName: string = "users";

  // User Profile Management

  #user = signal<IUser | null>(null);
  #userProfile = signal<IUser | null>(null);

  public user = computed(() => this.#user());
  public userProfile = computed(() => this.#userProfile());

  public isMyProfile = computed(() => {
  const userId =  this.#user()?._id ;
  const userProfileId = this.#userProfile()?._id;
  return (!userId && !userProfileId) ? false : userId === userProfileId ;
  });
  
  
  public pictures = computed<string[]>(() => {
    const {coverImages , picture} = this.userProfile()!;
    if(!coverImages || !picture) return [] ;
    const pictures = [picture , ...coverImages];
    return pictures ;
  });

  public about = computed<{ userName: string; email: string; phone: string; gender: string }>(() => {
  const {userName , gender , phone , email} = this.userProfile()!;
  return {userName , gender , phone : phone || '' , email};
  });

  public setUser (newData : IUser | null) : void {
  this.#user.set(newData);
  }

  public setUserProfile(newData : IUser | null) : void {
  this.#userProfile.set(newData);
  }
  

  // ==============================
  // 👤 User Profile
  // ==============================

  // 🟢 Get user profile
  getUserProfile(): Observable<UserProfile> {
  if(this.#user()) return EMPTY
  return this.#singleTonApi.find<UserProfile>(`${this.#routeName}/profile`).pipe(
  tap((res) => {
  const user =  res.data.user ;
  this.#user.set({...user , placeholder : '/user-placeholder.jpg'});
  })
  );
  }

  getUserProfileById(userId : string): Observable<UserProfile> {
  const userProfile = this.#userProfile();
  if(userProfile && userId === userProfile._id) return EMPTY ;
  return this.#singleTonApi.findById<UserProfile>(`${this.#routeName}`, userId).pipe(
  tap((res) => {
  const user =  res.data.user ;
  this.#userProfile.set({...user , placeholder : '/user-placeholder.jpg'});
  })
  );
  }

  // 🟢 Update user profile (JSON)
  updateUserProfile(data: Partial<IUser>, userId: string): Observable<IUser> {
    return this.#singleTonApi.update<IUser>(`${this.#routeName}/profile`, data, userId);
  }

  // ==============================
  // ❄️ Account Freeze / Unfreeze
  // ==============================

  // 🟢 Freeze account
  freezeAccount(userId?: string): Observable<void> {
    const id = userId || "me";
    return this.#singleTonApi.deleteById<void>(`${this.#routeName}/freez`, id);
  }

  // 🟢 Unfreeze account (JSON)
  unfreezeAccount(data: UnfreezePayload): Observable<void> {
    return this.#singleTonApi.patch<void>(`${this.#routeName}/un-freez/me`, data);
  }

  // ==============================
  // 📸 Profile Picture (FormData)
  // ==============================

  uploadProfilePicture(file: File): Observable<{ key: string }> {
    return this.#singleTonApi.uploadImage<{ key: string }>(
      `${this.#routeName}/profile-picture`,
      'image',
      [file] ,
    );
  }

  deleteProfilePicture(): Observable<void> {
    return this.#singleTonApi.deleteById<void>(`${this.#routeName}/profile-picture`, "");
  }

  // ==============================
  // 🖼️ Profile Cover Images (FormData)
  // ==============================

  uploadProfileCoverImages(files: File[]): Observable<{ keys: string[] }> {
    return this.#singleTonApi.uploadImage<{ keys: string[] }>(
      `${this.#routeName}/profile-cover-images`,
      'images',
      files
    );
  }

  deleteProfileCoverImages(): Observable<void> {
    return this.#singleTonApi.deleteById<void>(`${this.#routeName}/profile-cover-images`, "");
  }

  // ==============================
  // 👥 Friends
  // ==============================

  sendFriendRequest(userId: string): Observable<FriendRequestResponse> {
    return this.#singleTonApi.create<FriendRequestResponse>(
      `${this.#routeName}/friend-requst/${userId}`,
      {} // الباك إند بياخد userId من الـ params
    );
  }

  cancelFriendRequest(requestId: string): Observable<void> {
    return this.#singleTonApi.deleteById<void>(`${this.#routeName}/cancel-friend-requst`, requestId);
  }

  unFriend(friendId: string): Observable<void> {
    return this.#singleTonApi.deleteById<void>(`${this.#routeName}/remove-friend`, friendId);
  }

  // ==============================
  // 📝 User Information Updates (JSON)
  // ==============================

  updateBasicInfo(data: IUpdateBasicInfo): Observable<IUser> {
    console.log(data);
    
    return this.#singleTonApi.patch<IUser>(`${this.#routeName}/update-basic-info` , data).pipe(
      tap(() => {
        const currentUser = this.#user();
        if(!currentUser) return ;
        this.setUser({...currentUser , 
        userName: data.userName ?? currentUser.userName,
        phone: data.phone ?? currentUser.phone,
        gender: data.gender ?? currentUser.gender,
        })
      })
    );
  }


  updateEmail(data: IUpdateEmail): Observable<void> {
    return this.#singleTonApi.patch<void>(`${this.#routeName}/update-email`, data);
  }

  confirmUpdateEmail(data: IConfirmUpdateEmail): Observable<void> {
    return this.#singleTonApi.patch<void>(`${this.#routeName}/confirm-update-email`, data);
  }

  changePassword(data: ChangePasswordDto): Observable<void> {
    return this.#singleTonApi.patchById<void>(`${this.#routeName}/change-password`, data, "me");
  }
}
