import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';

@Component({
    selector: 'app-not-found-profile',
    imports: [SharedModule],
    template : `
<main
  class="min-h-[90vh] flex flex-col items-center justify-center text-center "
  role="main"
  aria-labelledby="error-title"
>
  <section
    class="ngCard  p-10 w-full max-w-lg flex flex-col items-center gap-5"
    role="alert"
    aria-live="assertive"
  >
    <header>
    <h1
    id="error-title"
    class="text-4xl font-bold text-error mb-2"
    role="heading"
    aria-level="1"
    >
    Profile Not Found
    </h1>
    </header>

    <p
      class="text-base-content/70 text-lg leading-relaxed"
      role="status"
      aria-label="Error message"
    >
  The profile you are looking for might have been removed, had its name changed, or is temporarily unavailable.
    </p>

    <footer class="mt-6">
      <button
        routerLink="/public"
        class="btn btn-error btn-wide"
        type="button"
        aria-label="Go back to home page"
      >
        Go Home
      </button>
    </footer>
  </section>
</main>

    `,
})
export class NotFoundProfile {


}
