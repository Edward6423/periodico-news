import { Component, inject } from '@angular/core';
import { AvisosService } from '../../../core/services/avisos.service';

/**
 * AvisosComponent — dibuja las notificaciones (toasts) que guarda
 * AvisosService. Se incluye una sola vez en el componente raíz.
 */
@Component({
  selector: 'app-avisos',
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3" aria-live="polite">
      @for (aviso of servicio.avisos(); track aviso.id) {
        <div class="toast show align-items-center border-0" [class]="'text-bg-' + aviso.tipo" role="status">
          <div class="d-flex">
            <div class="toast-body">{{ aviso.mensaje }}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto"
                    aria-label="Cerrar" (click)="servicio.cerrar(aviso.id)"></button>
          </div>
        </div>
      }
    </div>
  `,
})
export class AvisosComponent {
  protected servicio = inject(AvisosService);
}
