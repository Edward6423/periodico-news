import { Injectable } from '@angular/core';

/**
 * AlmacenamientoService
 * Envuelve localStorage y sessionStorage para leer y guardar datos en
 * formato JSON. Si el navegador bloquea el almacenamiento (modo privado,
 * permisos) los métodos no lanzan errores: devuelven el valor por defecto.
 */
@Injectable({ providedIn: 'root' })
export class AlmacenamientoService {
  /** Lee un valor de localStorage; si no existe o está dañado devuelve `porDefecto`. */
  leer<T>(clave: string, porDefecto: T, sesion = false): T {
    try {
      const texto = this.storage(sesion).getItem(clave);
      return texto ? (JSON.parse(texto) as T) : porDefecto;
    } catch {
      return porDefecto;
    }
  }

  /** Guarda un valor como texto JSON. */
  guardar<T>(clave: string, valor: T, sesion = false): void {
    try {
      this.storage(sesion).setItem(clave, JSON.stringify(valor));
    } catch {
      /* almacenamiento no disponible: se ignora */
    }
  }

  /** Elimina una clave. */
  borrar(clave: string, sesion = false): void {
    try {
      this.storage(sesion).removeItem(clave);
    } catch {
      /* sin acción */
    }
  }

  private storage(sesion: boolean): Storage {
    return sesion ? sessionStorage : localStorage;
  }
}
