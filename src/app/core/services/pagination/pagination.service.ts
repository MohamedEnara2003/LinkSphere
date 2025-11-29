import { Injectable, signal, computed } from '@angular/core';

@Injectable()
export class PaginationService<T> {

  // States
  readonly #_data = signal<T[]>([]);
  readonly #_page = signal<number>(1);
  readonly #_hasMore = signal<boolean>(false);
  readonly #_isLoading = signal<boolean>(false);

  // Exposed signals
  readonly data = computed(() => this.#_data());
  readonly page = computed(() => this.#_page());
  readonly hasMore = computed(() => this.#_hasMore());
  readonly isLoading = computed(() => this.#_isLoading());


}
