import {ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Figyelj az elérési útra!
import Aura from '@primeng/themes/aura';
import { BASE_PATH } from './api/generated';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MessageService} from 'primeng/api';

export function HttpLoaderFactory(http: HttpClient) {
  return new (TranslateHttpLoader as any)(http, 'assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: BASE_PATH, useValue: 'http://localhost:8080' },
    { provide: TRANSLATE_HTTP_LOADER_CONFIG, useValue: {} },
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimationsAsync(),
    MessageService,
    providePrimeNG({
      theme: {
        preset: Aura, // Itt választhatsz: Aura, Lara, vagy Nora
        options: {
          darkModeSelector: '.my-app-dark', // Opcionális: sötét mód kezelése
        },
      },
    }),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        },
        fallbackLang: 'en'
      })
    )
  ],
};
