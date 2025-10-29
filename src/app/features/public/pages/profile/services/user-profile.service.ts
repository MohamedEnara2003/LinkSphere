import { computed, inject, Injectable, signal } from '@angular/core';
import { SingleTonApi } from '../../../../../core/services/api/single-ton-api.service';
import { 
  ChangePasswordDto, 
  FriendRequestEnum, 
  IFriend, 
  IUpdateBasicInfo, 
  IUpdateEmail, 
  IUser, 
  RelationshipState, 
  UnfreezePayload, 
  UserProfile
} from '../../../../../core/models/user.model';
import { catchError, EMPTY, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { FriendRequestResponse, IFriendRequest, ReceivedFriendRequest, SentFriendRequest } from '../../../../../core/models/friends-requst.model';
import { ImagesService, ImageType } from '../../../../../core/services/api/images.service';


@Injectable({
  providedIn: 'root'
})

export class UserProfileService {
  
  #singleTonApi = inject(SingleTonApi);
  #imagesService = inject(ImagesService);
  #routeName: string = "users";

  #router = inject(Router);

  // User Profile Management

  #user = signal<IUser | null>(null);
  #userProfile = signal<IUser | null>(null);

  #sentRequests = signal<SentFriendRequest[]>([]);
  #receivedRequests = signal<ReceivedFriendRequest[]>([]);



  public user = computed(() => this.#user());
  public userProfile = computed(() => this.#userProfile());
  public sentRequests = computed(() => this.#sentRequests());
  public receivedRequests = computed(() => this.#receivedRequests());

  public isMyProfile = computed(() => {
  const userId =  this.#user()?._id ;
  const userProfileId = this.#userProfile()?._id;
  return (!userId && !userProfileId) ? false : userId === userProfileId ;
  });

  
  
  public relationshipState = computed<RelationshipState>(() => {
  
  const user =  this.#user();
  const userProfile =  this.#userProfile();
  
  if(!user || !userProfile) return 'myProfile'

  const {_id : userId} = user;
  const {_id : userProfileId} = userProfile;

  // My Profile
  if(userId === userProfileId ) return 'myProfile';

  // My Firend
  if(userProfile.isFriend) return 'friend';

  // Not Friend
  if(userId !== userProfileId && !userProfile.isFriend && !userProfile.friendRequest) return 'notFriend';
  
  if(userProfile.friendRequest ===  FriendRequestEnum.sent) return 'requestSent';
  if(userProfile.friendRequest ===  FriendRequestEnum.resaved) return 'requestReceived';

  return 'myProfile';
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

  #prepareUser(user: IUser, imageType: ImageType): Observable<IUser> {
  const { picture, coverImages = [], friends = [] } = user || {};

  const picture$ = picture
    ? this.#imagesService.getImages(picture, imageType).pipe(
        map(({ url }) => url || ''),
        catchError(() => of(''))
      )
    : of('');

  const coverImages$ = coverImages.length
    ? forkJoin(
        coverImages.map((key) =>
          this.#imagesService.getImages(key, imageType).pipe(
            map(({ url }) => url),
            catchError(() => of(null))
          )
        )
      ).pipe(map((urls) => urls.filter(Boolean) as string[]))
    : of<string[]>([]);

  const friendImages$ = friends.length
    ? forkJoin(
        friends.map((friend) =>
          this.#imagesService.getImages(friend.picture || '', imageType).pipe(
            map((res) => ({
              ...friend,
              picture: res?.url || 'user-placeholder.webp ',
            })),
            catchError(() =>
              of({
                ...friend,
                picture: 'user-placeholder.webp',
              })
            )
          )
        )
      )
    : of<IFriend[]>([]);

  return forkJoin({
    picture: picture$,
    coverImages: coverImages$,
    friends: friendImages$,
  }).pipe(
    map(({ picture, coverImages, friends }) => ({
      ...user,
      picture,
      coverImages,
      friends,
    }))
  );
}


  // 🟢 جلب المستخدم من الـ API

  getUserProfile(): Observable<IUser> {
  if(this.#user()) return EMPTY;
  return this.#singleTonApi.find<UserProfile>(`${this.#routeName}/profile`).pipe(
  switchMap(({data : {user}}) => {
  return this.#prepareUser(user , 'profile')
  }),
  tap((user) => {
  this.#user.set(user);
  })
  )
  }

  
// ✅ جلب بروفايل مستخدم آخر
getUserProfileById(userId: string): Observable<IUser> {
  return this.#singleTonApi
    .findById<{ data: IUser }>(`${this.#routeName}/user` , userId)
    .pipe(
      switchMap(({ data }) => this.#prepareUser(data, 'user')),
      tap((user) => {
        this.#userProfile.set(user);
      }),
      catchError(() => {
        this.#router.navigateByUrl('/public/profile/not-found');
        return EMPTY;
      })
    );
}

  getUserById(userId : string): Observable<IUser> {
  return this.#singleTonApi.findById<{ data: IUser }>(`${this.#routeName}/user` , userId).pipe(
  switchMap(({ data }) => this.#prepareUser(data, 'user')),
  )
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
    return this.#singleTonApi.deleteById<void>(`${this.#routeName}/freeze`, id);
  }

  // 🟢 Unfreeze account (JSON)
  unfreezeAccount(data: UnfreezePayload): Observable<void> {
    return this.#singleTonApi.patch<void>(`${this.#routeName}/un-freeze/me`, data);
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

  sendFriendRequest(receiver : IUser): Observable<FriendRequestResponse> {
    return this.#singleTonApi.create<FriendRequestResponse>(
      `${this.#routeName}/friend-request/${receiver._id}`).pipe(
      
        tap(({ data:  {RequestId}  }) => {
    
        const newRequests : SentFriendRequest = {
        requestId : RequestId,
        createdAt : new Date().toISOString(),
        receiver 
        }
        this.#userProfile.update((u) => u ?
        (u._id === receiver._id) ? ({...u  , friendRequest : FriendRequestEnum.sent}) : u 
        : null
        )
        this.#sentRequests.update((prevRequests) => [newRequests , ...prevRequests])
        
        })
      );
  }


 getFriendsRequests(): Observable<{
  sender: SentFriendRequest[];
  receiver: ReceivedFriendRequest[];
}> {
  return this.#singleTonApi
    .find<{ data: { requests: IFriendRequest[] } }>(
      `${this.#routeName}/friend-requests`
    )
    .pipe(
      switchMap(({ data: { requests } }) => {
        if (!requests?.length) return of({ sender: [], receiver: [] });

        const currentUserId = this.#user()?._id;
        if (!currentUserId) return of({ sender: [], receiver: [] });

        const friends = (this.#user()?.friends || []).map((f) => f._id);

        const sentRequests = requests.filter(
          (req) => req.sendBy === currentUserId && !friends.includes(req.sendTo)
        );

        const receivedRequests = requests.filter(
          (req) => req.sendTo === currentUserId && !friends.includes(req.sendBy)
        );

        // 📨 لو حصل Error في getUserById → رجّع null بدل ما يبوّظ الكل
        const safeGetUserById = (userId: string) =>
          this.getUserById(userId).pipe(
            catchError(() => {
              return of(null);
            })
          );

        const sentRequests$ = sentRequests.map((req) =>
          safeGetUserById(req.sendTo).pipe(
            map(
              (user) =>
                ({
                  requestId: req._id,
                  createdAt: req.createdAt,
                  receiver: user,
                } as SentFriendRequest)
            )
          )
        );

        const receivedRequests$ = receivedRequests.map((req) =>
          safeGetUserById(req.sendBy).pipe(
            map(
              (user) =>
                ({
                  requestId: req._id,
                  createdAt: req.createdAt,
                  sender: user,
                } as ReceivedFriendRequest)
            )
          )
        );

        return forkJoin({
          sender: sentRequests$.length ? forkJoin(sentRequests$) : of([]),
          receiver: receivedRequests$.length ? forkJoin(receivedRequests$) : of([]),
        });
      }),
      map(({ sender, receiver }) => ({
        sender: sender.filter((r) => r.receiver !== null),
        receiver: receiver.filter((r) => r.sender !== null),
      })),
      tap(({ sender, receiver }) => {
        this.#sentRequests.set(sender);
        this.#receivedRequests.set(receiver);
      }),
    );
}

acceptFriendRequest(requestId: string, sender: IUser): Observable<void> {
  return this.#singleTonApi
    .patch<void>(`${this.#routeName}/accept-friend-request/${requestId}`)
    .pipe(
      tap(() => {
        const newFriend: IFriend = {
          _id: sender._id,
          userName: sender.userName,
          firstName: sender.firstName,
          lastName: sender.lastName,
          email: sender.email,
          picture: sender.picture,
        };

        // 🧩 حذف الطلب من قائمة الطلبات المستلمة
        this.#receivedRequests.update((requests) =>
          requests.filter((r) => r.requestId !== requestId)
        );

        // 🧩 تحديث قائمة الأصدقاء للمستخدم الحالي
        this.#user.update((user) => {
          if (!user) return user;
          return {
            ...user,
            friends: [newFriend, ...(user.friends || [])],
          };
        });

        // 🧩 تحديث بروفايل المستخدم اللي تم قبول صداقته
        const userProfile = this.#userProfile();
        if (userProfile && String(userProfile._id) === String(sender._id)) {
          this.#userProfile.update((user) => {
            if (!user) return user;
            return {
              ...user,
              isFriend: true,
              friends: [newFriend, ...(user.friends || [])],
            };
          });
        }
      }),
    );
}


  cancelFriendRequest(RequestId: string): Observable<void> {
  return this.#singleTonApi.deleteById<void>(`${this.#routeName}/cancel-friend-request`, RequestId).pipe(
  tap(() => {
  this.#receivedRequests.update((r) => r.filter((r) => r.requestId !== RequestId));
  })
  );
  }

unFriend(friendId: string): Observable<void> {
  return this.#singleTonApi
    .deleteById<void>(`${this.#routeName}/remove-friend`, friendId)
    .pipe(
      tap(() => {
        const currentUser = this.#user();
        if (currentUser) {
          this.#user.update((u) => ({
            ...u!,
            friends: (u?.friends || []).filter((f) => f._id !== friendId),
          }));
        }

        const currentProfile = this.#userProfile();
        if (currentProfile) {
          this.#userProfile.update((p) => ({
            ...p!,
            isFriend: false,
            friendRequest : null ,
            friends: (p?.friends || []).filter((f) => f._id !== friendId),
          }));
        }
      }),
    );
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
    return this.#singleTonApi.patch<void>(`${this.#routeName}/update-email`, data).pipe(
    tap(() => this.#router.navigate(['/auth/confirm-email'] , {queryParams : {state : 'update'}}))
    );
  }

  confirmUpdateEmail(OTP: string): Observable<void> {
    return this.#singleTonApi.patch<void>(`${this.#routeName}/confirm-update-email`, {OTP}).pipe(
    tap(() => this.#router.navigateByUrl('/'))
    );
  }

  changePassword(data: ChangePasswordDto): Observable<void> {
  return this.#singleTonApi.patch<void>(`${this.#routeName}/change-password`, data).pipe(
  tap(() => this.#router.navigateByUrl('/'))
  );
  }
  
}
