/**
 * Modelo de datos de una noticia.
 * Define la forma de cada objeto del archivo public/data/noticias.json
 * y de las noticias que crea el usuario desde el mini CRUD.
 */
export interface Noticia {
  id: number;
  titulo: string;
  resumen: string;
  contenido: string;
  categoria: Categoria;
  imagen: string;
  autor: string;
  fecha: string;              // Formato ISO: "2026-09-22"
  destacada: boolean;
  creadaPorUsuario?: boolean; // true si se creó desde el formulario
}

/** Categorías disponibles en el periódico. */
export type Categoria = 'Educación' | 'Tecnología' | 'Turismo' | 'Comercio';

export const CATEGORIAS: Categoria[] = ['Educación', 'Tecnología', 'Turismo', 'Comercio'];

/** Datos que pide el formulario para crear una noticia. */
export type NuevaNoticia = Pick<Noticia, 'titulo' | 'resumen' | 'contenido' | 'categoria'> & {
  autor?: string;
  imagen?: string;
};

/** Convierte "Educación" en "educacion" (útil para clases CSS e imágenes). */
export function slug(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
