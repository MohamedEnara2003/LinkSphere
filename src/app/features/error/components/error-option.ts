import { Component, input } from '@angular/core';


@Component({
  selector: 'app-error-option',
  imports: [],
  template: `
    <article aria-label="Error" role="alert" class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div class="mx-auto max-w-screen-sm text-center">
            <h1  [attr.aria-label]="'Error status ' + status()" role="status"
            class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-brand-color">
            {{status()}}
            </h1>
            <p [attr.aria-label]="'Error message ' + errorMsg()" role="errorMessage"
            class="mb-4 text-3xl tracking-tight font-bold text-brand-color/50">
            {{errorMsg()}}
            </p>
            <p [attr.aria-label]="'Error description ' + errorDesc()" role="errorDescription"
            class="mb-4 text-lg font-light ngText">
            {{errorDesc()}}
            </p>
            <a href="/" class="ngBtn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clip-rule="evenodd" />
            </svg>
            {{'Refrash Page'}}
            </a>
        </div>   
    </article>
  `,
})
export class ErrorOption {
  status = input<number | string>(404);
  errorMsg = input<string>('Not Found');
  errorDesc = input<string>('We are already working to solve the problem.');
}
