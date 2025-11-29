import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Backdrop } from "../../../components/backdrop/backdrop";
import { DomService } from '../../../../../core/services/document/dom.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentsModelHeader } from "../components/comments-model-header/comments-model-header";
import { UpsertComment } from "../components/upsert-comment/upsert-comment";
import { ContainerComments } from "../components/container-comments/container-comments";
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';



@Component({
  selector: 'app-post-comments-model',
  imports: [
    Backdrop,
    CommentsModelHeader,
    UpsertComment,
    ContainerComments
],
  template: `
  <section 
    class="fixed inset-0 flex items-end justify-center  z-[50] overflow-hidden"
    role="dialog"
    aria-modal="true"
    aria-labelledby="postDialogTitle"
    aria-describedby="postDialogDescription"
    >

      <!-- Comments Model -->
    <article
    class="relative w-full sm:w-[85%] md:w-[80%] lg:w-1/2 h-[80%]  flex flex-col z-50  gap-5
    rounded-t-3xl rounded-b-none ngCard shadow-2xl animate-up"
    aria-labelledby="comments-title" >
    
    <app-comments-model-header />
    <app-container-comments  
    class="w-full h-full  overflow-y-auto p-2"  
    style="scrollbar-width: none;"
    [postId]="postId()"/>

    <!-- Update & Create - ( Comment & Repliy) -->
    <app-upsert-comment  [postId]="postId()"/>

    </article>

    <app-backdrop  (close)="closeComments()"/>
    </section>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class postCommentsModel { 
    readonly #domService = inject(DomService);
    readonly #router = inject(Router);
    readonly #route = inject(ActivatedRoute);

    postId = toSignal<string ,string>(this.#route.queryParamMap.pipe(map((query) => query.get('postId') || '')) , {
    initialValue : ''
    })

    ngOnInit(): void {
    this.#domService.setBodyOverflow('hidden');
    }

  
    closeComments(): void {
    this.#router.navigate(['/public', { outlets: { model: null }}],{
    queryParams : {postId : null},
    queryParamsHandling: 'merge'
    }
    );
    }

    ngOnDestroy(): void {
    this.#domService.setBodyOverflow('auto');
    }

}