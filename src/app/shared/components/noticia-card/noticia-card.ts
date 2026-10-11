import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Noticia, slug } from '../../../core/models/noticia';
import { FavoritosService } from '../../../core/services/favoritos.service';
import { AvisosService } from '../../../core/services/avisos.service';
import { FechaLargaPipe } from '../../pipes/fecha-larga.pipe';

/**
 * NoticiaCardComponent — tarjeta reutilizable de una noticia.
 * Muestra imagen, categoría, título, descripción breve, fecha, estrella de
 * favoritos y el botón «Ver más».
 *
 * Entradas (property binding):  [noticia]  [mostrarEliminar]
 * Salidas  (event binding):     (eliminar)
 */
@Component({
  selector: 'app-noticia-card',
  imports: [RouterLink, FechaLargaPipe],
  templateUrl: './noticia-card.html',
})
export class NoticiaCardComponent {
  private favoritos = inject(FavoritosService);
  private avisos = inject(AvisosService);

  /** Noticia que se va a mostrar (obligatoria). */
  readonly noticia = input.required<Noticia>();
  /** Si es true aparece el botón de papelera (mini CRUD). */
  readonly mostrarEliminar = input(false);
  /** Avisa al componente padre que el usuario quiere eliminar la noticia. */
  readonly eliminar = output<Noticia>();

  /** Se recalcula solo cuando cambian los favoritos o la noticia. */
  readonly esFavorita = computed(() => this.favoritos.favoritos().includes(this.noticia().id));
  readonly claseCategoria = computed(() => 'badge-' + slug(this.noticia().categoria));

  alternarFavorito(): void {
    const quedo = this.favoritos.alternar(this.noticia().id);
    this.avisos.mostrar(quedo ? 'Noticia agregada a favoritos' : 'Noticia retirada de favoritos');
  }

  /** Si la URL de la imagen falla se usa la imagen por defecto. */
  imagenPorDefecto(evento: Event): void {
    (evento.target as HTMLImageElement).src = 'img/placeholder.svg';
  }
}
