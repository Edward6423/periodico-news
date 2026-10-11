import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Noticia, NuevaNoticia } from '../models/noticia';
import { AlmacenamientoService } from './almacenamiento.service';

const RUTA_JSON = 'data/noticias.json';
const CLAVE_CREADAS = 'pn_noticias_creadas';
const CLAVE_ELIMINADAS = 'pn_noticias_eliminadas';

/**
 * NoticiasService
 * Fuente única de datos de la aplicación:
 *  - Lee el catálogo desde el archivo JSON local con HttpClient.
 *  - Combina ese catálogo con las noticias creadas y eliminadas por el
 *    usuario (mini CRUD), que se guardan en localStorage.
 *  - Expone el resultado como una señal (signal) para que todos los
 *    componentes se actualicen automáticamente cuando algo cambia.
 */
@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private http = inject(HttpClient);
  private almacen = inject(AlmacenamientoService);

  /** Noticias originales del JSON (se cargan una sola vez). */
  private delJson = signal<Noticia[]>([]);
  /** Noticias creadas por el usuario. */
  private creadas = signal<Noticia[]>(this.almacen.leer<Noticia[]>(CLAVE_CREADAS, []));
  /** Ids de noticias eliminadas por el usuario. */
  private eliminadas = signal<number[]>(this.almacen.leer<number[]>(CLAVE_ELIMINADAS, []));

  /** Estado de la carga, útil para mostrar el spinner o un mensaje de error. */
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  /** Catálogo final: creadas + JSON, sin las eliminadas, de la más reciente a la más antigua. */
  readonly noticias = computed(() => {
    const fuera = this.eliminadas();
    return [...this.creadas(), ...this.delJson()]
      .filter((n) => !fuera.includes(n.id))
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  });

  /** Noticias destacadas para el Home (si hay menos de 3 se completa con las recientes). */
  readonly destacadas = computed(() => {
    const todas = this.noticias();
    const marcadas = todas.filter((n) => n.destacada);
    return [...marcadas, ...todas.filter((n) => !n.destacada)].slice(0, 3);
  });

  private peticion?: Promise<void>;

  /** Descarga el JSON (solo la primera vez que se llama). */
  cargar(): Promise<void> {
    this.peticion ??= firstValueFrom(this.http.get<Noticia[]>(RUTA_JSON))
      .then((datos) => this.delJson.set(datos))
      .catch((e) => {
        console.error(e);
        this.error.set('No fue posible cargar las noticias. Verifica que la aplicación se ejecute desde un servidor.');
        this.peticion = undefined; // permite reintentar
      })
      .finally(() => this.cargando.set(false));
    return this.peticion;
  }

  /** Busca una noticia por id. */
  porId(id: number): Noticia | undefined {
    return this.noticias().find((n) => n.id === id);
  }

  /** Crea una noticia nueva (mini CRUD) y la guarda en localStorage. */
  crear(datos: NuevaNoticia): Noticia {
    const nueva: Noticia = {
      id: Date.now(), // id único basado en la hora
      titulo: datos.titulo.trim(),
      resumen: datos.resumen.trim(),
      contenido: datos.contenido.trim(),
      categoria: datos.categoria,
      imagen: datos.imagen?.trim() || 'img/placeholder.svg',
      autor: datos.autor?.trim() || 'Usuario invitado',
      fecha: new Date().toISOString().slice(0, 10),
      destacada: false,
      creadaPorUsuario: true,
    };
    this.creadas.update((lista) => [nueva, ...lista]);
    this.almacen.guardar(CLAVE_CREADAS, this.creadas());
    return nueva;
  }

  /**
   * Elimina una noticia. Si la creó el usuario se borra de su lista;
   * si viene del JSON se registra su id como eliminada (el archivo
   * original no puede modificarse desde el navegador).
   */
  eliminar(id: number): void {
    if (this.creadas().some((n) => n.id === id)) {
      this.creadas.update((lista) => lista.filter((n) => n.id !== id));
      this.almacen.guardar(CLAVE_CREADAS, this.creadas());
    } else {
      this.eliminadas.update((ids) => [...ids, id]);
      this.almacen.guardar(CLAVE_ELIMINADAS, this.eliminadas());
    }
  }

  /** Deshace los cambios del CRUD y recupera el catálogo original. */
  restaurar(): void {
    this.creadas.set([]);
    this.eliminadas.set([]);
    this.almacen.borrar(CLAVE_CREADAS);
    this.almacen.borrar(CLAVE_ELIMINADAS);
  }
}
