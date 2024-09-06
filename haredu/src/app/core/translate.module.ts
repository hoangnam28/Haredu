import { HttpClient, provideHttpClient } from '@angular/common/http';
import { Translation, TranslocoLoader, TranslocoModule, TranslocoService, provideTransloco } from '@ngneat/transloco';
import { APP_INITIALIZER, Injectable, NgModule, isDevMode } from '@angular/core';
import { APP_LOCALES, Default_Lang } from '#utils/const';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string) {
    return this.http.get<Translation>(`./assets/i18n/${lang}.json`);
  }
}

export function preLoadLang(transloco: TranslocoService) {
  return function () {
    let lang = localStorage.getItem('lang');
    if (!lang) {
      localStorage.setItem('lang', Default_Lang);
      lang = Default_Lang;
    }

    transloco.setActiveLang(lang);
    return transloco.load(lang).subscribe();
  };
}

@NgModule({
  exports: [TranslocoModule],
  providers: [
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: APP_LOCALES,
        defaultLang: Default_Lang,
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
        flatten: {
          aot: false,
        },
      },
      loader: TranslocoHttpLoader,
    }),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: preLoadLang,
      deps: [TranslocoService],
    },
  ],
})
export class TranslocoRootModule {}
