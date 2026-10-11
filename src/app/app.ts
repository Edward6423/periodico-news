import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header';
import { FooterComponent } from './layout/footer/footer';
import { AvisosComponent } from './shared/components/avisos/avisos';

/**
 * Componente raíz. Define la estructura que comparten todas las vistas:
 * header, contenido de la ruta activa (<router-outlet>), footer y avisos.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AvisosComponent],
  template: `
    <app-header />
    <main>
      <router-outlet />
    </main>
    <app-footer />
    <app-avisos />
  `,
})
export class App {}
