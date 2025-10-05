import { Component } from '@angular/core';
import { ErrorOption } from '../../components/error-option';


@Component({
  selector: 'app-server-error',
  imports: [ErrorOption],
  template: `
  <section aria-label="Network Error Page" role="region" class="w-full">
  <app-error-option
  [status]="500"
  errorMsg="Internal Server Error"
  errorDesc="An unexpected error occurred on the server. We're working on it. Please try again later."
  />
  </section>
  `,
})
export class ServerError {

}
