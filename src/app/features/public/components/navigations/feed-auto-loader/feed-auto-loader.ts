import {
  Component,
  ElementRef,
  OnDestroy,
  effect,
  signal,
  output,
  input,
} from '@angular/core';
import { LoadingComment } from "../../../pages/posts/components/loading/loading-comment/loading-comment";
import { LoadingPost } from "../../../pages/posts/components/loading/loading-post/loading-post";


@Component({
  selector: 'app-feed-auto-loader',
  template: `
    <nav class="w-full flex justify-center items-center" >
    @if(!loadingType()){
    <span class="loading loading-spinner text-brand-color loading-lg"></span>
    }@else if (loadingType() === 'comment') {
    <app-loading-comment class="w-full" />
    }@else if (loadingType() === 'post') {
    <app-loading-post class="w-full h-60"/>
    }@else if((loadingType() === 'users')){
            <div class="w-full flex items-center gap-3">
            <div class="w-12 h-12 rounded-full ng-skeleton"></div>
            <div class="flex-1">
            <div class="h-4 ng-skeleton rounded w-32 mb-2"></div>
            <div class="h-3 ng-skeleton rounded w-20"></div>
            </div>
        </div>
    }
    </nav>
  `,
  imports: [LoadingComment, LoadingPost],
})
export class FeedAutoLoader  implements OnDestroy {
  loadingType = input<'comment' | 'post' | 'chat' | 'users'>();
  
  loadData = output<void>();
  isInView = signal(false);

  private observer = signal<IntersectionObserver | null>(null);

  constructor(private el: ElementRef) {
    effect(() =>   this.#onView())

    effect(() => {
      if (this.isInView()) {
        this.#loadMore();
      }
    });
  
  }


  #onView() : void {
    this.observer.set(new IntersectionObserver((entries) => {
      const entry = entries[0];
      this.isInView.set(entry.isIntersecting);
    }))

    this.observer()?.observe(this.el.nativeElement);
  }

  #loadMore(): void {
    this.loadData.emit();
  }

  ngOnDestroy(): void {
    this.observer()?.disconnect();
  }
}
