import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoticiasService } from '../../core/services/noticias.service';
import { FavoritosService } from '../../core/services/favoritos.service';
import { AvisosService } from '../../core/services/avisos.service';
import { NoticiaCardComponent } from '../../shared/components/noticia-card/noticia-card';

/**
 * FavoritosComponent — lista personal de noticias guardadas en localStorage.
 * Cruza los ids de FavoritosService con el catálogo de NoticiasService.
 * Al quitar una estrella la tarjeta desaparece sola, porque la lista es
 * una señal calculada (computed).
 */
@Component({
  selector: 'app-favoritos',
  imports: [RouterLink, NoticiaCardComponent],
  templateUrl: './favoritos.html',
})
export class FavoritosComponent {
  protected servicio = inject(NoticiasService);
  private favoritos = inject(FavoritosService);
  private avisos = inject(AvisosService);

  protected readonly lista = computed(() => {
    const ids = this.favoritos.favoritos();
    return this.servicio.noticias().filter((n) => ids.includes(n.id));
  });

  constructor() {
    this.servicio.cargar();
  }

  vaciar(): void {
    if (!confirm('¿Quieres eliminar todas las noticias de tus favoritos?')) return;
    this.favoritos.vaciar();
    this.avisos.mostrar('Se vaciaron tus favoritos');
  }
}
