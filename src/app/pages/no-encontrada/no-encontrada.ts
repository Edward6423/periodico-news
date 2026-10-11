import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Página 404: se muestra cuando la ruta no existe. */
@Component({
  selector: 'app-no-encontrada',
  imports: [RouterLink],
  template: `
    <section class="container py-5 text-center">
      <p class="display-1 fw-bold text-secondary mb-0">404</p>
      <h1 class="h3 fw-bold">Página no encontrada</h1>
      <p class="text-muted">La dirección que buscas no existe o fue movida.</p>
      <a routerLink="/" class="btn btn-primary">Volver al inicio</a>
    </section>
  `,
})
export class NoEncontradaComponent {}
