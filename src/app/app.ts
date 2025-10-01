import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template : `


  <main class="bg-light dark:bg-dark">
  <router-outlet/>

  </main>
  `
})
export class App {
  protected readonly title = signal('LinkSphere');
}
