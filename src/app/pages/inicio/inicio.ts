import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoticiasService } from '../../core/services/noticias.service';
import { NoticiaCardComponent } from '../../shared/components/noticia-card/noticia-card';

interface Testimonio {
  texto: string;
  autor: string;
}

/**
 * InicioComponent (Home): bienvenida, noticias destacadas, llamado a la
 * acción y testimonios.
 */
@Component({
  selector: 'app-inicio',
  imports: [RouterLink, NoticiaCardComponent],
  templateUrl: './inicio.html',
})
export class InicioComponent {
  protected servicio = inject(NoticiasService);

  /** Los testimonios se pintan con @for en lugar de repetir HTML. */
  protected readonly testimonios: Testimonio[] = [
    { texto: 'Me gusta que las noticias sean cortas y claras. Guardo en favoritos las que quiero leer con calma.', autor: 'Laura, estudiante' },
    { texto: 'La sección de tecnología me ayuda a entender temas que antes me parecían complicados.', autor: 'Andrés, docente' },
    { texto: 'Encontré ideas para mi próximo viaje en la sección de turismo.', autor: 'Camila, emprendedora' },
  ];

  constructor() {
    this.servicio.cargar();
  }
}
