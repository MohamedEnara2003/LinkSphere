import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // عدد الطلبات الجارية
  #activeRequests = signal<number>(0);

  // الإشارة المحسوبة اللي ترجع true لو في طلبات شغالة
  isLoading = computed(() => this.#activeRequests() > 0);

  // لما يبدأ أو ينتهي طلب
  setLoading(isLoading: boolean): void {
    if (isLoading) {
      this.#activeRequests.update(count => count + 1);
    } else {
      this.#activeRequests.update(count => Math.max(0, count - 1));
    }
}

    reset(): void {
    this.#activeRequests.set(0);
    }
}
