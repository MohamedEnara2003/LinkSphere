import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, input } from '@angular/core';
import { NgImage } from "../../../../shared/components/ng-image/ng-image";

import { register as registerSwiperElements } from 'swiper/element/bundle';
import { DomService } from '../../../../core/services/dom.service';


@Component({
selector: 'app-images-slider',
imports: [NgImage],
template: `

<swiper-container #swiperRef role="container" 
[speed]="500"
effect="slide"
[grabCursor]="true"
[keyboard]="true"
[navigation]="true"
[observer]="true"
[grabCursor]="true"
[observeParents]="true"
[class]="styleClass()" >
@for (image of images(); track image) {
<swiper-slide>
    <app-ng-image
        [options]="{
        src :  image || '',
        alt : 'Profile picture ' ,
        width  : 200,
        height : 200,
        class : styleClass() || 'size-50',
        loading : 'eager' ,
        decoding : 'async' ,
        fetchpriority : 'high', 
        }"
        [isPreview]="true"

        />
</swiper-slide>
}
</swiper-container>

`,

schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImagesSlider {
#domService = inject(DomService);
images = input<string[]>([]);
styleClass = input<string>('');


constructor(){
if(this.#domService.isBrowser()){
registerSwiperElements();
}
}

}
