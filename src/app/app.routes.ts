import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio';
import { NoticiasComponent } from './pages/noticias/noticias';
import { DetalleComponent } from './pages/detalle/detalle';
import { CategoriasComponent } from './pages/categorias/categorias';
import { FavoritosComponent } from './pages/favoritos/favoritos';
import { ContactoComponent } from './pages/contacto/contacto';
import { NoEncontradaComponent } from './pages/no-encontrada/no-encontrada';

/**
 * Rutas de la aplicación. Cada ruta carga un componente dentro de
 * <router-outlet> sin recargar la página (Single Page Application).
 * La propiedad "title" cambia el título de la pestaña del navegador.
 */
export const routes: Routes = [
  { path: '', component: InicioComponent, title: 'Inicio | Periódico News' },
  { path: 'noticias', component: NoticiasComponent, title: 'Noticias | Periódico News' },
  { path: 'noticias/:id', component: DetalleComponent, title: 'Detalle de la noticia | Periódico News' },
  { path: 'categorias', component: CategoriasComponent, title: 'Categorías | Periódico News' },
  { path: 'favoritos', component: FavoritosComponent, title: 'Favoritos | Periódico News' },
  { path: 'contacto', component: ContactoComponent, title: 'Contacto | Periódico News' },
  { path: '**', component: NoEncontradaComponent, title: 'Página no encontrada | Periódico News' },
];
