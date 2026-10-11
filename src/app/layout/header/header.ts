import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FavoritosService } from '../../core/services/favoritos.service';

/** Enlace del menú principal. */
export interface EnlaceMenu {
  texto: string;
  ruta: string;
  icono: string;
}

/** Los cinco enlaces del menú (los mismos del wireframe de la Entrega 1). */
export const MENU: EnlaceMenu[] = [
  { texto: 'Inicio', ruta: '/', icono: 'bi-house' },
  { texto: 'Noticias', ruta: '/noticias', icono: 'bi-newspaper' },
  { texto: 'Categorías', ruta: '/categorias', icono: 'bi-grid' },
  { texto: 'Favoritos', ruta: '/favoritos', icono: 'bi-star' },
  { texto: 'Contacto', ruta: '/contacto', icono: 'bi-envelope' },
];

/**
 * HeaderComponent — barra de navegación común a todas las vistas.
 * routerLinkActive marca la sección actual y el contador de favoritos
 * se lee de una señal del FavoritosService.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class HeaderComponent {
  protected favoritos = inject(FavoritosService);
  protected readonly menu = MENU;

  /** Controla el menú desplegable en pantallas pequeñas (sin JavaScript de Bootstrap). */
  protected readonly menuAbierto = signal(false);

  alternarMenu(): void {
    this.menuAbierto.update((abierto) => !abierto);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }
}
