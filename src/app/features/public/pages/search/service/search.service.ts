import { computed, inject, Injectable, signal } from "@angular/core";
import { SingleTonApi } from "../../../../../core/services/api/single-ton-api.service";
import { catchError, EMPTY, map, Observable, of, tap } from "rxjs";
import { IUser } from "../../../../../core/models/user.model";
import { UserProfileService } from "../../profile/services/user-profile.service";
import { IPost } from "../../../../../core/models/posts.model";
import { Pagination } from "../../../../../core/models/pagination";
import { ISearch } from "../../../../../core/models/search.model";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { AppPostsService } from "../../posts/service/app/app-posts.service";
import { searchResult } from "../models/search.types";
import { StorageService } from "../../../../../core/services/locale-storage.service";




@Injectable({
  providedIn: 'root'
})

export class SearchService {

readonly #singleTonApi = inject(SingleTonApi);
readonly routeName : string = "search" ;

readonly #userProfileService = inject(UserProfileService);
readonly #postsService = inject(AppPostsService);
readonly #route = inject(ActivatedRoute);
readonly #storageService = inject(StorageService);


public searchValue = toSignal<string, string>(
  this.#route.queryParamMap.pipe(
    map((query) => (query.get('keywords') ?? '') as string)
  ),
  { initialValue: '' }
);

public searchResult = toSignal<searchResult>(
  this.#route.queryParamMap.pipe(
    map((query) => (query.get('result') ?? '') as searchResult)
  ),
);

#usersRouteName = computed(() => this.#userProfileService.routeName);
#postsRouteName = computed(() => this.#postsService.routeName);


// __________________________

// Search Users State
#users = signal<IUser[]>([]);
#isUsersLoading = signal<boolean>(false);

users = computed(() =>  this.#users());
isUsersLoading = computed(() => this.#isUsersLoading());

// Users Pagination
usersPage = signal<number>(1);
hasMoreUser= signal<boolean>(false);

// ____________________________


// Search Posts State
#posts = signal<IPost[]>([]);
#isPostsLoading = signal<boolean>(false);

posts = computed(() =>  this.#posts());
isPostsLoading = computed(() => this.#isPostsLoading());

// Posts Pagination
postsPage = signal<number>(1);
hasMorePost= signal<boolean>(false);

//______________________________

// Search all State
#isAllLoading = signal<boolean>(false);
isAllLoading = computed(() => this.#isAllLoading());

// Recent Searches State
readonly #recentSearchesKey = 'search_recent_searches';
readonly #maxRecentSearches = 10;
#recentSearches = signal<string[]>([]);
recentSearches = computed(() => this.#recentSearches());

//____________________________

#removeDuplicates<T extends { _id: string }>(prev: T[], next: T[]): T[] {
  const map = new Map(prev.map(item => [item._id, item]));
  next.forEach(item => map.set(item._id, item));
  return Array.from(map.values());
}

//_________________________________

// Update state
#updateSearchPostsState(newPosts: IPost[], totalPages: number): void {
  const page = this.postsPage();
  this.#isPostsLoading.set(false);

  // merge without duplicates (append behavior)
  this.#posts.update(prev => this.#removeDuplicates(prev, newPosts));

  if (page < totalPages) {
    this.hasMorePost.set(true);
    this.postsPage.update(p => p + 1);
  } else {
    this.hasMorePost.set(false);
  }
}

#updateSearchUsersState(newUsers: IUser[], totalPages: number): void {
  const page = this.usersPage();
  this.#isUsersLoading.set(false);

  this.#users.update(prev => this.#removeDuplicates(prev, newUsers));

  if (page < totalPages) {
    this.hasMoreUser.set(true);
    this.usersPage.update(p => p + 1);
  } else {
    this.hasMoreUser.set(false);
  }
}
//____________________________


// Search For Users
public searchForUsers(limit: number = 3)
  : Observable<{ data: { users: IUser[]; pagination: Pagination } } | null> {

  const key = this.searchValue();
  if(!key)  return of(null);;


  const page = this.usersPage();
  
  if(page === 1){
  this.#isUsersLoading.set(true);
  }
  
  return this.#singleTonApi
    .find<{ data: { users: IUser[]; pagination: Pagination } }>(
      `${this.#usersRouteName()}/search?key=${key}&page=${page}&limit=${limit}`
    )
    .pipe(
    tap(({ data: { users: newUsers, pagination: { totalPages } } }) => 
    this.#updateSearchUsersState(newUsers , totalPages)
    ),
    catchError(() => { 
    this.#isUsersLoading.set(false);
    this.hasMoreUser.set(false)
    return EMPTY
    }
      )
    );
}


// Search For Posts
public searchForPosts(author: string = '', limit: number = 1)
  : Observable<{ data: { posts: IPost[]; pagination: Pagination } } | null> {

  const key = this.searchValue();
  if (!key) return of(null);

  const querykey = key ? `key=${key}` : '';
  const queryAuther = author ? `author=${author}` : '';

  const page = this.postsPage();

  if (page === 1) {
    this.#isPostsLoading.set(true);
  }

  return this.#singleTonApi
    .find<{ data: { posts: IPost[]; pagination: Pagination } }>(
      `${this.#postsRouteName()}/search?${querykey}&${queryAuther}&page=${page}&limit=${limit}`
    )
    .pipe(
      tap(({ data: { posts: newPosts, pagination: { totalPages } } }) =>
        this.#updateSearchPostsState(newPosts, totalPages)
      ),
      catchError(() => {
        this.#isPostsLoading.set(false);
        this.hasMorePost.set(false);
        return of(null);
      })
    );
}

// Search For All
searchForAll(limit: number = 10): Observable<ISearch | null> {
  this.#isAllLoading.set(true);

  const key = this.searchValue();
  if (!key) {
    this.#isAllLoading.set(false);
    return of(null);
  }

  // loaders
  this.#isUsersLoading.set(true);
  this.#isPostsLoading.set(true);

  const users_limit = 3;
  const posts_limit = 10;
  const users_page = 1;
  const posts_page = 1;

  const queries = `key=${key}&users_limit=${users_limit}&posts_limit=${posts_limit}&users_page=${users_page}&posts_page=${posts_page}`;

  return this.#singleTonApi.find<ISearch>(`${this.routeName}?${queries}`).pipe(
    tap((res) => {
      this.#isAllLoading.set(false);
      if (!res) return;

      const { users, posts } = res.data;

      // Replace users (not append)
      this.#users.set(users.data ?? []);
      // set next page to 2 (since we loaded page 1)
      this.usersPage.set(2);
      this.hasMoreUser.set((users.pagination?.totalPages ?? 0) > 1);
      this.#isUsersLoading.set(false);

      // Replace posts (not append)
      this.#posts.set(posts.data ?? []);
      this.postsPage.set(2);
      this.hasMorePost.set((posts.pagination?.totalPages ?? 0) > 1);
      this.#isPostsLoading.set(false);
    }),
    catchError(() => {
      this.#isAllLoading.set(false);
      this.#isUsersLoading.set(false);
      this.#isPostsLoading.set(false);
      return of(null);
    })
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
}

//____________________________

// Recent Searches Methods
constructor() {
  this.#loadRecentSearches();
}

#loadRecentSearches(): void {
  const recent = this.#storageService.getItem<string[]>(this.#recentSearchesKey);
  this.#recentSearches.set(recent ?? []);
}

addRecent(searchTerm: string): void {
  if (!searchTerm || !searchTerm.trim()) return;

  const trimmedTerm = searchTerm.trim();
  const current = this.#recentSearches();
  
  // Remove if already exists (to move to top)
  const filtered = current.filter(term => term.toLowerCase() !== trimmedTerm.toLowerCase());
  
  // Add to beginning and limit to maxRecentSearches
  const updated = [trimmedTerm, ...filtered].slice(0, this.#maxRecentSearches);
  
  this.#recentSearches.set(updated);
  this.#storageService.setItem(this.#recentSearchesKey, updated);
}

getRecent(): string[] {
  return this.#recentSearches();
}

deleteRecent(searchTerm: string): void {
  const current = this.#recentSearches();
  const filtered = current.filter(term => term.toLowerCase() !== searchTerm.toLowerCase());
  
  this.#recentSearches.set(filtered);
  this.#storageService.setItem(this.#recentSearchesKey, filtered);
}

clearRecent(): void {
  this.#recentSearches.set([]);
  this.#storageService.removeItem(this.#recentSearchesKey);
}

}