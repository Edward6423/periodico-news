import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
  withInMemoryScrolling,
} from '@angular/router';
import { routes } from './app.routes';

/**
 * Configuración global de la aplicación.
 *  - provideHttpClient: permite leer el archivo JSON con HttpClient.
 *  - withHashLocation: usa URLs con # (ej. /#/noticias) para que las rutas
 *    funcionen en GitHub Pages, que no redirige las rutas a index.html.
 *  - withComponentInputBinding: entrega el parámetro :id como input del componente.
 *  - withInMemoryScrolling: al cambiar de vista se sube al inicio de la página.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      withHashLocation(),
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
  ],
};
