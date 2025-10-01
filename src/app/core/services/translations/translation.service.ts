import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translateService = inject(TranslateService)

  setDefaultLanguage(lang : string) : void {
  this.translateService.setFallbackLang(lang);
  }
  
  use(lang : string) : void{
  this.translateService.use(lang)
  }

  heroTexts(key: string ) : string {
  return this.translateService.instant(key);
  }
}
