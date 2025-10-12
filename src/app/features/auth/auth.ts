import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-authentication',
  imports: [RouterOutlet],
  template: `
  <main aria-label="Authentication Page" role="region">
  <router-outlet />
  </main>
  `,
  providers : []
})
export class Authentication {

}
