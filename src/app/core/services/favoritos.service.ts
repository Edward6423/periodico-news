import { Injectable, computed, inject, signal } from '@angular/core';
import { AlmacenamientoService } from './almacenamiento.service';

const CLAVE_FAVORITOS = 'pn_favoritos';

/**
 * FavoritosService
 * Guarda en localStorage los ids de las noticias favoritas. Como el estado
 * es una señal, el contador del menú, las estrellas de las tarjetas y la
 * página de favoritos se actualizan al mismo tiempo sin recargar.
 */
@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private almacen = inject(AlmacenamientoService);

  private ids = signal<number[]>(this.almacen.leer<number[]>(CLAVE_FAVORITOS, []));

  /** Lista de ids (solo lectura) y total para el contador del menú. */
  readonly favoritos = this.ids.asReadonly();
  readonly total = computed(() => this.ids().length);

  esFavorito(id: number): boolean {
    return this.ids().includes(id);
  }

  /** Agrega o quita una noticia. Devuelve true si quedó como favorita. */
  alternar(id: number): boolean {
    const yaEsta = this.esFavorito(id);
    this.ids.update((lista) => (yaEsta ? lista.filter((f) => f !== id) : [...lista, id]));
    this.persistir();
    return !yaEsta;
  }

  quitar(id: number): void {
    this.ids.update((lista) => lista.filter((f) => f !== id));
    this.persistir();
  }

  vaciar(): void {
    this.ids.set([]);
    this.persistir();
  }

  private persistir(): void {
    this.almacen.guardar(CLAVE_FAVORITOS, this.ids());
  }
}
