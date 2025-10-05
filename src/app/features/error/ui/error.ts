import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [RouterOutlet],
  template: `
  <section class="w-full h-svh flex flex-col justify-center items-center">
  <router-outlet />
  </section>
  `,
})
export class ErrorComponent {

}
