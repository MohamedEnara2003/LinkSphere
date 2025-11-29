import { Component, inject, signal, OnInit, input, OnDestroy } from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { CommentItem } from '../comment-item/ui/comment-item';
import { FeedAutoLoader } from '../../../../components/navigations/feed-auto-loader/feed-auto-loader';
import { LoadingService } from '../../../../../../core/services/loading.service';
import { PostsStateService } from '../../../posts/service/state/posts-state.service';
import { GetCommentsService } from '../../services/api/get-comments.service';
import { CommentsStateService } from '../../services/state/comments-state.service';
import { EmptyComments } from "../empty-comments/empty-comments";



@Component({
    selector: 'app-container-comments',
    imports: [
    SharedModule,
    CommentItem,
    FeedAutoLoader,
    EmptyComments
],
    template: `
    <!-- Comments List -->
    <section class="size-full">
    <ul class="size-full flex flex-col gap-4">
        @for (comment of commentsState.comments(); track comment._id) {
        <li >
        <app-comment-item
        [comment]="comment!" 
        [postId]="postId() || ''"
        />

        </li>
        }@empty {
        <app-empty-comments class="size-full"/>
        }

        @if(commentsState.hasMoreComments()){
        <li >
        <app-feed-auto-loader
        loadingType="comment"
        (loadData)="loadMore()"
        aria-label="Load more comments"
        />
        </li>
        }

        </ul>

</section>
`,
providers : [GetCommentsService]
})
export class ContainerComments implements OnInit , OnDestroy{
    readonly #getCommentService = inject(GetCommentsService);
    readonly commentsState = inject(CommentsStateService);

    loadingService = inject(LoadingService);

    #postsState = inject(PostsStateService);
    postId = input<string>('')

    isOpenReplies = signal<string>('');

    ngOnInit(): void {
    this.loadMore();
    }

    #getComments(): void {
    const post = this.#postsState.post() ;
    if (post && post._id) {
    this.#getCommentService.getPostComment(post._id ).subscribe();
    }
    }


    loadMore() : void {
    this.#getComments();
    }

    ngOnDestroy(): void {
    this.#postsState.setPost(null);
    // this.commentService.clearData();
    }


}