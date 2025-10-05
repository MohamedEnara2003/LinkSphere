import { Component } from '@angular/core';
import { ErrorOption } from '../../components/error-option';


@Component({
  selector: 'app-not-found',
  imports: [ErrorOption],
  template: `
  <section aria-label="Not Found Page" role="region" class="w-full">
  <app-error-option
  [status]="404"
  errorMsg="Not Found"
  errorDesc="The page you're looking for doesn't exist or has been moved."
  />
  </section>
  `,
})
export class NotFound {

}
