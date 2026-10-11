import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIAS, Categoria, slug } from '../../core/models/noticia';
import { NoticiasService } from '../../core/services/noticias.service';

const DESCRIPCIONES: Record<Categoria, string> = {
  Educación: 'Colegios, universidades y nuevas formas de aprender.',
  Tecnología: 'Innovación, seguridad digital y tendencias.',
  Turismo: 'Destinos, rutas y consejos para viajar.',
  Comercio: 'Emprendimiento, negocios y economía local.',
};

/**
 * CategoriasComponent — cuenta las noticias de cada categoría y enlaza
 * al listado ya filtrado (/noticias?categoria=...).
 */
@Component({
  selector: 'app-categorias',
  imports: [RouterLink],
  templateUrl: './categorias.html',
})
export class CategoriasComponent {
  protected servicio = inject(NoticiasService);

  /** Se recalcula automáticamente si se crean o eliminan noticias. */
  protected readonly tarjetas = computed(() =>
    CATEGORIAS.map((nombre) => ({
      nombre,
      descripcion: DESCRIPCIONES[nombre],
      imagen: `img/${slug(nombre)}-1.svg`,
      total: this.servicio.noticias().filter((n) => n.categoria === nombre).length,
    })),
  );

  constructor() {
    this.servicio.cargar();
  }
}
