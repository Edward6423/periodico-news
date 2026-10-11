import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MENU } from '../header/header';

/** FooterComponent — redes sociales, enlaces rápidos y datos de contacto. */
@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
})
export class FooterComponent {
  protected readonly menu = MENU;
  protected readonly anio = new Date().getFullYear();
}
