import { Component } from '@angular/core';
import { ErrorOption } from '../../components/error-option';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-not-found',
  imports: [ErrorOption, TranslateModule],
  template: `
  <section aria-label="Not Found Page" role="region" class="w-full">
  <app-error-option
  [status]="404"
  [errorMsg]="'errors.not_found.title' | translate"
  [errorDesc]="'errors.not_found.description' | translate"
  />
  </section>
  `,
})
export class NotFound {

}
