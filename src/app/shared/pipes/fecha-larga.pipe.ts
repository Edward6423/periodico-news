import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe personalizado: convierte "2026-09-22" en "22 de septiembre de 2026".
 * Uso en una plantilla: {{ noticia.fecha | fechaLarga }}
 */
@Pipe({ name: 'fechaLarga' })
export class FechaLargaPipe implements PipeTransform {
  transform(iso: string): string {
    if (!iso) return '';
    const [a, m, d] = iso.split('-').map(Number);
    return new Date(a, m - 1, d).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
