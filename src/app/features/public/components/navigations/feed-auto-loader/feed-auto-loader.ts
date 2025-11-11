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
    }
    </nav>
  `,
  imports: [LoadingComment, LoadingPost],
})
export class FeedAutoLoader  implements OnDestroy {
  loadingType = input<'comment' | 'post' | 'chat'>();
  
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
