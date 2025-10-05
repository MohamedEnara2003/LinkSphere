import { Component, computed, input, linkedSignal, model, signal } from '@angular/core';
import { PostComments } from "../post-comments/ui/post-comments";
import { IPost } from '../../../../../../../../core/models/posts.model';


@Component({
selector: 'app-post-actions',
imports: [PostComments],
template: `
    <nav class="w-full flex items-center gap-4 border-b border-b-brand-color  py-3 font-semibold ngText">

    <button (click)="onToggle()"
    title="like" type="button" class="flex items-center gap-1 ngBtnIcon ">

    @if(!isLiked()) {
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
    } @else{
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
    class="size-6 text-brand-color animate-iconShake">
    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
    </svg>
    }
    
    {{likes().length || 0 }}
    </button>

    <button (click)="isOpenComments.set(true)"
    title="comments" type="button" class="flex items-center gap-1 ngBtnIcon">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
    </svg>
    0
    </button>
    
    </nav>

    @if(isOpenComments()){
    <app-post-comments 
    [isOpenComments]="isOpenComments()"  
    (isOpenCommentsChange)="isOpenComments.set($event)"
    />
    }

`,
})
export class PostActions {
    isOpenComments = signal<boolean>(false);


    post = model<IPost>();

    likes = linkedSignal<Array<{postId : string , userId : string}>>(() => {
    return  [...this.post()?.likes?.map(userId => ({ postId: this.post()?.id || '', userId: userId || '' })) || []];
    });
    

    isLiked = computed(() => {
    const userId = this.post()?.createdBy.id || '';
    const postId = this.post()?.id || '';
    return this.likes().some(like => like.userId === userId && like.postId === postId);
    })

    onToggle() {
    const userId = this.post()?.createdBy.id || '';
    const postId = this.post()?.id || '';
    if (this.likes().some(like => like.userId === userId && like.postId === postId)) {
    this.likes.set(this.likes().filter(like => like.userId !== userId || like.postId !== postId));
    } else {
    this.likes.set([...this.likes(), { userId, postId }]);
    }
    }
    
}
    