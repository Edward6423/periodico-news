import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CATEGORIAS, Categoria, Noticia } from '../../core/models/noticia';
import { NoticiasService } from '../../core/services/noticias.service';
import { FavoritosService } from '../../core/services/favoritos.service';
import { AvisosService } from '../../core/services/avisos.service';
import { NoticiaCardComponent } from '../../shared/components/noticia-card/noticia-card';

const POR_PAGINA = 6;

/** Quita tildes y pasa a minúsculas para comparar textos. */
const normalizar = (t: string) =>
  t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/**
 * NoticiasComponent — listado completo con búsqueda, filtro por categoría,
 * paginación y mini CRUD (crear y eliminar).
 *
 * Usa two-way binding [(ngModel)] para el buscador, el filtro y el
 * formulario de creación (formulario dirigido por plantilla).
 */
@Component({
  selector: 'app-noticias',
  imports: [FormsModule, NoticiaCardComponent],
  templateUrl: './noticias.html',
})
export class NoticiasComponent {
  protected servicio = inject(NoticiasService);
  private favoritos = inject(FavoritosService);
  private avisos = inject(AvisosService);
  private ruta = inject(ActivatedRoute);

  protected readonly categorias = CATEGORIAS;

  /* ---------- Estado de la vista (signals) ---------- */
  protected readonly busqueda = signal('');
  protected readonly categoria = signal<string>('');
  protected readonly pagina = signal(1);
  protected readonly panelCrearAbierto = signal(false);

  /** Modelo del formulario "Crear noticia" enlazado con [(ngModel)]. */
  protected nueva = this.formularioVacio();

  /** Noticias que cumplen la búsqueda y el filtro. */
  protected readonly filtradas = computed(() => {
    const texto = normalizar(this.busqueda());
    const cat = this.categoria();
    return this.servicio
      .noticias()
      .filter(
        (n) =>
          (!cat || n.categoria === cat) &&
          (!texto || normalizar(`${n.titulo} ${n.resumen}`).includes(texto)),
      );
  });

  protected readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.filtradas().length / POR_PAGINA)),
  );

  /** Arreglo [1, 2, 3...] para dibujar los botones de paginación. */
  protected readonly numerosPagina = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1),
  );

  /** Página válida (por si se eliminan noticias y la página actual queda vacía). */
  protected readonly paginaValida = computed(() => Math.min(this.pagina(), this.totalPaginas()));

  /** Tarjetas de la página actual. */
  protected readonly paginaActual = computed(() => {
    const inicio = (this.paginaValida() - 1) * POR_PAGINA;
    return this.filtradas().slice(inicio, inicio + POR_PAGINA);
  });

  constructor() {
    this.servicio.cargar();

    // Si se llega desde Categorías (/noticias?categoria=Turismo) se aplica el filtro
    const desdeUrl = this.ruta.snapshot.queryParamMap.get('categoria');
    if (desdeUrl && CATEGORIAS.includes(desdeUrl as Categoria)) this.categoria.set(desdeUrl);

    // Al cambiar la búsqueda o la categoría se vuelve a la página 1
    effect(() => {
      this.busqueda();
      this.categoria();
      this.pagina.set(1);
    });
  }

  irAPagina(numero: number, evento: Event): void {
    evento.preventDefault();
    if (numero < 1 || numero > this.totalPaginas()) return;
    this.pagina.set(numero);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- Mini CRUD ---------- */

  /** Se ejecuta con (ngSubmit). Solo guarda si el formulario es válido. */
  guardar(formulario: NgForm): void {
    if (formulario.invalid) {
      formulario.form.markAllAsTouched();
      return;
    }
    this.servicio.crear(this.nueva);
    this.avisos.mostrar('Noticia creada correctamente', 'success');
    this.nueva = this.formularioVacio();
    formulario.resetForm(this.nueva);
    this.panelCrearAbierto.set(false);
    this.busqueda.set('');
    this.categoria.set('');
  }

  /** Recibe el evento (eliminar) emitido por la tarjeta hija. */
  eliminar(noticia: Noticia): void {
    if (!confirm(`¿Eliminar la noticia "${noticia.titulo}"?`)) return;
    this.servicio.eliminar(noticia.id);
    this.favoritos.quitar(noticia.id);
    this.avisos.mostrar('Noticia eliminada', 'danger');
  }

  restaurar(): void {
    if (!confirm('Se borrarán las noticias creadas y se recuperarán las eliminadas. ¿Continuar?')) return;
    this.servicio.restaurar();
    this.avisos.mostrar('Catálogo restaurado');
  }

  private formularioVacio() {
    return {
      titulo: '',
      categoria: '' as Categoria,
      resumen: '',
      contenido: '',
      autor: '',
      imagen: '',
    };
  }
}
