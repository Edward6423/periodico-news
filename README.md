# Periódico News — Prototipo funcional (Entrega 2)

Plataforma web de noticias desarrollada con **HTML5, CSS3, JavaScript (ES6)** y **Bootstrap 5** para el módulo *Desarrollo de Front-End*.

## Funcionalidades

- **Inicio (Home):** header con menú, sección de bienvenida, noticias destacadas, llamado a la acción, testimonios y footer.
- **Listado de noticias:** tarjetas generadas dinámicamente desde `data/noticias.json`, búsqueda por palabra clave, filtro por categoría y paginación.
- **Detalle:** información completa, imagen representativa, botones *Agregar a favoritos* e *Ir a contacto*, noticias relacionadas.
- **Categorías:** conteo de noticias por categoría con enlace al listado filtrado.
- **Favoritos:** lista personal guardada en `localStorage`.
- **Contacto:** formulario con validaciones (campos obligatorios, formato de correo) y mensaje de confirmación.
- **Mini CRUD:** crear y eliminar noticias desde el listado (persisten en `localStorage`).
- Diseño **responsivo** (móvil, tableta y escritorio).

## Estructura

```
periodico-news/
├── index.html          # Inicio
├── noticias.html       # Listado + mini CRUD
├── detalle.html        # Detalle (?id=)
├── categorias.html     # Categorías
├── favoritos.html      # Favoritos
├── contacto.html       # Formulario de contacto
├── css/styles.css      # Estilos propios
├── js/app.js           # Módulo común: header/footer, datos, favoritos, CRUD
├── js/*.js             # Un script por página
├── data/noticias.json  # Fuente de datos
└── img/                # Ilustraciones SVG
```

## Cómo ejecutarlo

Los navegadores bloquean `fetch()` de archivos locales con `file://`, por lo que el proyecto debe abrirse desde un servidor:

- **VS Code:** clic derecho en `index.html` → *Open with Live Server*.
- **Python:** `python -m http.server 8080` y abrir `http://localhost:8080`.
- **GitHub Pages:** *Settings → Pages → Deploy from a branch → main / root*.
