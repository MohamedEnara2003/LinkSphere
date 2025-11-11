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


  placeHolderUser = signal<string>('user-placeholder.webp').asReadonly();

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
    const userProfile = this.userProfile();
    if(!userProfile) return [];
    const {coverImages , picture} = userProfile;
    if(!coverImages || !picture) return [] ;
    const pictures = [picture , ...coverImages];
    return pictures ;
  });


  public userAbout = computed<Array<{title : string , value : string , icon : string}>>(() => {
  const userProfile = this.userProfile();
  if(!userProfile) return [];
  const {userName , gender , phone , email} = userProfile;
  return [
    { 
    title: 'profile.about.username', value: userName, 
    icon: `
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    `
    },
    { 
    title: 'profile.about.gender', value: gender, 
    icon: `
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    `
    },
    { 
    title: 'profile.about.phone', value: phone || '',
    icon: `
    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    `
    },
    { 
    title: 'profile.about.email', value: email, 
    icon: `
    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    `
    },
  ];
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
  if(this.#userProfile()?._id === userId) return EMPTY;
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

  uploadProfileCoverImages(files: File[] , previews: string[]): Observable<{ keys: string[] }> {
    return this.#singleTonApi.uploadImage<{ keys: string[] }>(
      `${this.#routeName}/profile-cover-images`,
      'images',
      files
    ).pipe(
      tap(() => {
        const user = this.#user();
        const userProfile = this.#userProfile();
        if (!user || !userProfile ) return;
        const prevCoverImages = user.coverImages || [];
        const newUserData : IUser = { ...user, coverImages: [...prevCoverImages , ...previews] }
        this.#user.set(newUserData);
        if(this.isMyProfile()){
        this.#userProfile.set(newUserData);
        }
      }
    )
    );
  }

  deleteProfileCoverImages(): Observable<void> {
    return this.#singleTonApi.deleteById<void>(`${this.#routeName}/profile-cover-images`, "").pipe(
    tap(() => {
      const user = this.#user();
      const userProfile = this.#userProfile();
      if (!user || !userProfile ) return;
      this.#user.set({ ...user, coverImages: [] });
      if(this.isMyProfile()){
      this.#userProfile.set({ ...userProfile, coverImages: [] });
      }
      this.#router.navigate([] ,{ queryParams : {edit : null} , queryParamsHandling : 'merge'});
    })
    );
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
    return this.#singleTonApi.patch<IUser>(`${this.#routeName}/update-basic-info` , data).pipe(
      tap(() => {
        this.#user.update((currentUser) => currentUser ? ({...currentUser , ...data}) : null);
        console.log(this.#user());
        this.#router.navigate([] ,{ queryParams : {edit : null} , queryParamsHandling : 'merge'});
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
