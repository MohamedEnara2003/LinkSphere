import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { UserProfileService } from './services/user-profile.service';
import { combineLatest, map, startWith, take } from 'rxjs';





@Component({
selector: 'app-profile',
imports: [ RouterOutlet],
template: `
<main >
<router-outlet />
</main>

`,
})
export class Profile {
#userProfileService = inject(UserProfileService);
#route = inject(ActivatedRoute);
#router = inject(Router);

userId = toSignal<string | null>(
    combineLatest([
    this.#route.paramMap.pipe(
    map(p => p.get('userId')),
    startWith(null)
    ),
    this.#route.children.length ? this.#route.firstChild!.paramMap.pipe(
    map(p => p.get('userId')),
    startWith(null)
    )
    : [null]
    ]).pipe(
    map(([mainId, childId]) => mainId || childId)
),
{ initialValue: null }
);

constructor(){
effect(() => this.getUserProfileById())
}

private getUserProfileById() : void {
const userId = this.userId();
if(userId) {
this.#userProfileService.getUserProfileById(userId).pipe(take(1)).subscribe();
return
}
this.#router.navigateByUrl('/public/profile/not-founed')
}

}
