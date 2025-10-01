import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";


@Component({
  selector: 'app-public',
  imports: [RouterOutlet, Header, Footer],
  template: `

  <main>
  <app-header />
  <router-outlet name="model"/>
  <router-outlet />
  <app-footer />
  </main>

  `,
})
export class Public {

}
