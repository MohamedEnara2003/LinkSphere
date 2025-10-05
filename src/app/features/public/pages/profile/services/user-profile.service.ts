import { computed, inject, Injectable, signal } from '@angular/core';
import { SingleTonApi } from '../../../../../core/services/api/single-ton-api.service';
import { 
  ChangePasswordDto, 
  FriendRequestResponse, 
  IConfirmUpdateEmail, 
  IUpdateBasicInfo, 
  IUpdateEmail, 
  IUser, 
  UnfreezePayload 
} from '../../../../../core/models/user.model';
import { EMPTY, Observable, tap } from 'rxjs';


interface UserProfile {
  data : {
  user : IUser
  }
}


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
  
  public setUser (newData : IUser) : void {
  this.#user.set(newData);
  }

  public setUserProfile(newData : IUser) : void {
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
      [file]
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
    return this.#singleTonApi.patch<IUser>(`${this.#routeName}/update-basic-info`, data);
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
