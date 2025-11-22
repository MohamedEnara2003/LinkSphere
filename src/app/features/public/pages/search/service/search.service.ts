import { computed, inject, Injectable, signal } from "@angular/core";
import { SingleTonApi } from "../../../../../core/services/api/single-ton-api.service";
import { catchError, EMPTY, map, Observable, of, tap } from "rxjs";
import { IUser } from "../../../../../core/models/user.model";
import { UserProfileService } from "../../profile/services/user-profile.service";
import { IPost } from "../../../../../core/models/posts.model";
import { PostService } from "../../posts/services/post.service";
import { Pagination } from "../../../../../core/models/pagination";
import { ISearch } from "../../../../../core/models/search.model";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";




@Injectable({
  providedIn: 'root'
})

export class SearchService {

readonly #singleTonApi = inject(SingleTonApi);
readonly #userProfileService = inject(UserProfileService);
readonly #postsService = inject(PostService);

readonly #route = inject(ActivatedRoute);


isFocusSearch = signal<boolean>(false);

querySearchValue =  toSignal<string , string>(
this.#route.queryParamMap.pipe(map((query) => query.get('keywords') as string)) ,
{initialValue :''}
);

searchType =  toSignal<string , string>(
this.#route.queryParamMap.pipe(map((query) => query.get('search') as string)) ,
{initialValue :''}
);


readonly routeName : string = "search" ;


#usersRouteName = computed(() => this.#userProfileService.routeName);
#postsRouteName = computed(() => this.#postsService.routeName);

// Search Value
searchValue = signal<string>('');
// __________________________

// Search Users State
#users = signal<IUser[]>([]);
#isUsersLoading = signal<boolean>(false);

users = computed(() =>  this.#users());
isUsersLoading = computed(() => this.#isUsersLoading());

// Users Pagination
usersPage = signal<number>(1);
hasMoreUser= signal<boolean>(false);

// __________________________


// Search Posts State
#posts = signal<IPost[]>([]);
#isPostsLoading = signal<boolean>(false);

posts = computed(() =>  this.#posts());
isPostsLoading = computed(() => this.#isPostsLoading());

// Posts Pagination
postsPage = signal<number>(1);
hasMorePost= signal<boolean>(false);

//____________________________

// Search all State
#isAllLoading = signal<boolean>(false);
isAllLoading = computed(() => this.#isAllLoading());


//____________________________

// Update state
#updateSearchPostsState(newPosts : IPost[] , totalPages : number) : void {
    const page = this.postsPage()
    this.#isPostsLoading.set(false);

    this.#posts.update((prev) => [...prev, ...newPosts]);
    this.hasMorePost.set(page < totalPages);
    if (page < totalPages) {
    this.postsPage.update((p) => p + 1);
    }
}

#updateSearchUsersState(newUsers : IUser[] , totalPages : number) : void {
    const page = this.usersPage()
    this.#isUsersLoading.set(false);

    this.#users.update((prev) => [...prev, ...newUsers]);
    this.hasMoreUser.set(page < totalPages);
    if (page < totalPages) {
    this.usersPage.update((p) => p + 1);
    }
}

//____________________________


public searchForUser(limit: number = 10) {
  
  const key = this.querySearchValue();
  if(!key) return EMPTY;

  this.#isUsersLoading.set(true);

  const isNewSearch = key !== this.searchValue();
  if (isNewSearch) {
    this.#resetUsersPagination();
    this.searchValue.set(key);
  }

  const page = this.usersPage();
  return this.#singleTonApi
    .find<{ data: { users: IUser[]; pagination: Pagination } }>(
      `${this.#usersRouteName()}/search?key=${key}&page=${page}&limit=${limit}`
    )
    .pipe(
    tap(({ data: { users: newUsers, pagination: { totalPages } } }) => 
    this.#updateSearchUsersState(newUsers , totalPages)
    ),
      catchError(() =>
        of({
          data: { users: [] },
        })
      )
    );
}



public searchForPosts(author : string = '',  limit: number = 10) {

  const key = this.querySearchValue();
  if(!key) return EMPTY;
  this.#isPostsLoading.set(true);

  const isNewSearch = key !== this.searchValue();

  if (isNewSearch) {
  this.#resetPostsPagination();
  this.searchValue.set(key);
  }

  const page = this.postsPage();

  return this.#singleTonApi
    .find<{ data: { posts: IPost[]; pagination: Pagination } }>(
    `${this.#postsRouteName()}/search?key=${key}&author=${author}&page=${page}&limit=${limit}`
    )
    .pipe(
      tap(({ data: { posts: newPosts, pagination: { totalPages } } }) => 
      this.#updateSearchPostsState(newPosts , totalPages)
      ),
      catchError(() =>
        of({
          data: { posts: [] },
        })
      )
    );
}


searchForAll(
  limit: number = 10
): Observable<ISearch> {
  this.#isAllLoading.set(true);
  
  const key = this.querySearchValue();
  if(!key) return EMPTY;

  const isNewSearch = key !== this.searchValue();

  // Reset only if new search keyword
  if (isNewSearch) {
    this.clearData();
    this.searchValue.set(key);
  }

  const usersPage = this.usersPage();
  const postsPage = this.postsPage();

  // Start loaders
  this.#isUsersLoading.set(true);
  this.#isPostsLoading.set(true);

  return this.#singleTonApi
    .find<ISearch>(
      `${this.routeName}?key=${key}&page=${1}&limit=${limit}`
    )
    .pipe(
      tap(({ data }) => {
        this.#isAllLoading.set(false);
        const { users, posts } = data;

        // --- Update Users ---
        if (users.data.length) {
          this.#users.set(users.data);
        }

          this.#isUsersLoading.set(false);
          this.hasMoreUser.set(false);
        

        // --- Update Posts ---
        if (posts.data.length) {
        this.#posts.set(posts.data);
        } 
        this.#isPostsLoading.set(false);
        this.hasMorePost.set(false);
        

      }),
      catchError(() => {
        this.#isAllLoading.set(false);
        return of({
          data: {
            users: { data: [], totalPages: 1, total: 0 },
            posts: { data: [], totalPages: 1, total: 0 },
            page: 1,
            limit
          }
        })
        }
      )
    );
}



// Clean And Reset States
#resetUsersPagination(): void {
  this.usersPage.set(1);
  this.#users.set([]);
  this.hasMoreUser.set(false);
}

#resetPostsPagination(): void {
  this.postsPage.set(1);
  this.#posts.set([]);
  this.hasMorePost.set(false);
}

clearData() : void {
this.#resetPostsPagination();
this.#resetUsersPagination();
this.#isUsersLoading.set(false);
this.#isPostsLoading.set(false);
this.searchValue.set('');
}


}