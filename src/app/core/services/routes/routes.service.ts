import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoutesService {
#route = inject(ActivatedRoute);

getQuery(queryName: string) {
    return this.#route .queryParamMap.pipe(
    map((query) => query.get(queryName))
    );
}


}
