# Periódico News — Entrega final (Angular)

Plataforma web de noticias desarrollada para el módulo **Desarrollo de Front-End**.
La versión final está construida con **Angular 20** (componentes standalone, enrutamiento, servicios, signals y formularios), **Bootstrap 5** y **TypeScript**.

- **Repositorio:** https://github.com/Edward6423/periodico-news


## Funcionalidades

| Vista | Ruta | Qué hace |
|---|---|---|
| Inicio | `#/` | Bienvenida, 3 noticias destacadas, llamado a la acción, testimonios |
| Noticias | `#/noticias` | Tarjetas desde JSON, búsqueda, filtro por categoría, paginación, crear y eliminar (mini CRUD) |
| Detalle | `#/noticias/:id` | Información completa, favoritos, ir a contacto, noticias relacionadas |
| Categorías | `#/categorias` | Conteo de noticias por categoría con enlace al listado filtrado |
| Favoritos | `#/favoritos` | Lista personal guardada en `localStorage` |
| Contacto | `#/contacto` | Formulario reactivo con validaciones y mensaje de confirmación |

## Estructura

```
src/app/
├── app.ts / app.config.ts / app.routes.ts   # raíz, configuración y rutas
├── core/
│   ├── models/noticia.ts                    # interfaz Noticia y categorías
│   └── services/                            # noticias, favoritos, avisos, almacenamiento
├── layout/header, layout/footer             # componentes comunes
├── shared/components/noticia-card, avisos   # componentes reutilizables
├── shared/pipes/fecha-larga.pipe.ts         # pipe personalizado
└── pages/                                   # una carpeta por vista
public/data/noticias.json                    # fuente de datos
public/img/                                  # ilustraciones SVG
prototipo-entrega2/                          # versión HTML/CSS/JS de la Entrega 2
```

## Ejecutar en local

Requiere Node.js 20.19 o superior.

```bash
npm install
npm start          # http://localhost:4200
npm run build      # compila en dist/periodico-news/browser
```

## Desplegar en GitHub Pages

1. Sube el proyecto a la rama `main`.
2. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. El flujo `.github/workflows/deploy.yml` compila y publica la aplicación en cada `push`.
   El avance se ve en la pestaña **Actions**; al terminar, la URL aparece en **Settings → Pages**.

La aplicación usa rutas con `#` y `<base href="./">`, así que funciona sin cambios en GitHub Pages, Netlify o Vercel
(en Netlify/Vercel: comando `npm run build`, carpeta `dist/periodico-news/browser`).
