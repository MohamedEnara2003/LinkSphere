import { inject, Injectable, signal } from '@angular/core';
import { SingleTonApi } from './single-ton-api.service';
import {  catchError, of, tap } from 'rxjs';

export type ImageType = 'user' | 'post' | 'comment' | 'profile';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  #api = inject(SingleTonApi);


#cache = {
    user: signal<Record<string, string>>({}),
    post: signal<Record<string, string>>({}),
    comment: signal<Record<string, string>>({}),
    profile: signal<Record<string, string>>({}),
};

  // ✅ دالة عامة لجلب الصورة مع الكاش
  getImages(imageKey: string, type: ImageType = 'post') {
    if (!imageKey) return of({ url: '' });

    const cacheSignal = this.#cache[type];
    const cache = cacheSignal();

    // 🔍 لو الصورة موجودة في الكاش نرجعها مباشرة بدون طلب API
    if (cache[imageKey]) {
    return this.#wrapAsObservable({ url: cache[imageKey] });
    }

    // 🌐 نجيب الصورة من الـ API ونحدث الكاش بالإشارة
    return this.#api.find<{ url: string }>(`image/${imageKey}`).pipe(
    tap(({ url }) => {
        cacheSignal.update((prev) => ({
        ...prev,
        [imageKey]: url,
        }));
    }),
    catchError(() => of({ url: '' }))
    );
    }

  // 🧠 دالة بسيطة لتحويل قيمة إلى Observable
  #wrapAsObservable<T>(value: T) {
    return of(value)
  }


    get cache() {
    return this.#cache;
    }


    clear(type?: ImageType) {
    if (type) {
    this.#cache[type].set({});
    return ;
    } 
    Object.values(this.#cache).forEach((c) => c.set({}));
    }

}
