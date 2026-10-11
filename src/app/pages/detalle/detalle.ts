import { Component, computed, effect, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { slug } from '../../core/models/noticia';
import { NoticiasService } from '../../core/services/noticias.service';
import { FavoritosService } from '../../core/services/favoritos.service';
import { AvisosService } from '../../core/services/avisos.service';
import { NoticiaCardComponent } from '../../shared/components/noticia-card/noticia-card';
import { FechaLargaPipe } from '../../shared/pipes/fecha-larga.pipe';

/**
 * DetalleComponent — información completa de una noticia (ruta /noticias/:id).
 * El parámetro :id llega directamente como input gracias a
 * withComponentInputBinding() en app.config.ts.
 */
@Component({
  selector: 'app-detalle',
  imports: [RouterLink, NoticiaCardComponent, FechaLargaPipe],
  templateUrl: './detalle.html',
})
export class DetalleComponent {
  protected servicio = inject(NoticiasService);
  private favoritos = inject(FavoritosService);
  private avisos = inject(AvisosService);
  private location = inject(Location);
  private titulo = inject(Title);

  /** Parámetro de la ruta /noticias/:id */
  readonly id = input.required<string>();

  /** Noticia seleccionada (undefined si no existe o fue eliminada). */
  protected readonly noticia = computed(() => this.servicio.porId(Number(this.id())));

  /** El contenido del JSON separa los párrafos con saltos de línea. */
  protected readonly parrafos = computed(() => this.noticia()?.contenido.split(/\n+/) ?? []);

  protected readonly esFavorita = computed(() => {
    const n = this.noticia();
    return !!n && this.favoritos.favoritos().includes(n.id);
  });

  /** Hasta tres noticias de la misma categoría. */
  protected readonly relacionadas = computed(() => {
    const n = this.noticia();
    if (!n) return [];
    return this.servicio.noticias().filter((o) => o.categoria === n.categoria && o.id !== n.id).slice(0, 3);
  });

  protected readonly claseCategoria = computed(() => 'badge-' + slug(this.noticia()?.categoria ?? ''));

  constructor() {
    this.servicio.cargar();
    // Actualiza el título de la pestaña del navegador con el de la noticia
    effect(() => {
      const n = this.noticia();
      if (n) this.titulo.setTitle(`${n.titulo} | Periódico News`);
    });
  }

  alternarFavorito(): void {
    const n = this.noticia();
    if (!n) return;
    const quedo = this.favoritos.alternar(n.id);
    this.avisos.mostrar(quedo ? 'Noticia agregada a favoritos' : 'Noticia retirada de favoritos');
  }

  volver(): void {
    this.location.back();
  }

  imagenPorDefecto(evento: Event): void {
    (evento.target as HTMLImageElement).src = 'img/placeholder.svg';
  }
}
