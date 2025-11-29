import { inject, Injectable } from '@angular/core';
import { DomService } from '../document/dom.service';


@Injectable({
providedIn: 'root'
})


export class SwiperService {
readonly #domService = inject(DomService)

async initSwiper() : Promise<void> {
    if (this.#domService.isBrowser()) {
    const { register  } = await import ('swiper/element/bundle');
    register();
}
}

}