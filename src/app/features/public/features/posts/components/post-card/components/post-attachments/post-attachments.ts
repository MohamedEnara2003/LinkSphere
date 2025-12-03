import { Component, input , CUSTOM_ELEMENTS_SCHEMA, inject} from '@angular/core';
import { NgImage } from "../../../../../../../../shared/components/ng-image/ng-image";
import { Picture } from '../../../../../../../../core/models/picture';
import { SwiperService } from '../../../../../../../../core/services/style/swiper.service';


@Component({
selector: 'app-post-attachments',
imports: [NgImage ],
template: `

@if(attachments() && attachments().length > 0){

<figure role="group" aria-label="Post attachments carousel" class="w-full">
    <swiper-container #swiperRef
        aria-label="Images Slider"
        role="region"
        aria-roledescription="carousel"
        [slidesPerView]="1"
        [spaceBetween]="0"
        [mousewheel]="true"
        [navigation]="false"
        [pagination]="{ clickable: true }"
        [keyboard]="true"
        [effect]="'slide'"
        [observer]="true"
        [observeParents]="true"
        class="size-full " >

        @for (attachment of attachments(); let i = $index ; let count = $count; track attachment.public_id) {
            <swiper-slide  class="relative w-full min-h-60 max-h-100" role="group" aria-label="Slide {{ i + 1 }} of {{ count }}">
                <figure class="relative w-full h-full">
                    <app-ng-image
                        [options]="{
                            src: attachment.url,
                            alt: 'Post attachment',
                            width:  300,
                            height:  300,
                            decoding : 'async',
                            fetchpriority : 'high',
                            loading : 'eager',
                            class: 'object-cover w-full h-full   aspect-square shadow-xs shadow-card-dark/50 hover:opacity-90 duration-200 transition-opacity',
                        }"
                        [isPreview]="true"
                    />
                    <figcaption class="sr-only">Attachment {{ i + 1 }} of {{ count }}</figcaption>
                </figure>

                <span class="badge badge-sm  absolute right-2 top-2 z-20
                    dark:bg-dark dark:text-light shadow shadow-dark
                    bg-light text-dark   border-brand-color/20
                    ">
                    {{i + 1}}/{{count}}
                </span>
            </swiper-slide>
        }
    </swiper-container>
</figure>
}

`,
schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class PostAttachments {
readonly #swiperService = inject(SwiperService);
attachments = input<Picture[]>([]);


async ngOnInit() {
await this.#swiperService.initSwiper();
}
}
