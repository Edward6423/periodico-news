import { Injectable, signal } from '@angular/core';

export interface Aviso {
  id: number;
  mensaje: string;
  tipo: 'dark' | 'success' | 'danger';
}

/**
 * AvisosService
 * Muestra notificaciones breves (toasts) en la esquina inferior derecha.
 * Cualquier componente puede llamar a `mostrar()`; el componente
 * AvisosComponent se encarga de dibujarlas.
 */
@Injectable({ providedIn: 'root' })
export class AvisosService {
  readonly avisos = signal<Aviso[]>([]);

  mostrar(mensaje: string, tipo: Aviso['tipo'] = 'dark', duracion = 2500): void {
    const aviso: Aviso = { id: Date.now() + Math.random(), mensaje, tipo };
    this.avisos.update((lista) => [...lista, aviso]);
    setTimeout(() => this.cerrar(aviso.id), duracion);
  }

  cerrar(id: number): void {
    this.avisos.update((lista) => lista.filter((a) => a.id !== id));
  }
}
