/* ==========================================================================
   app.js — Funciones compartidas por todas las páginas de Periódico News
   --------------------------------------------------------------------------
   Contenido:
     1. Constantes y claves de almacenamiento
     2. Header y footer reutilizables (se insertan en cada página)
     3. Carga de noticias desde el archivo JSON local
     4. Gestión de favoritos (localStorage)
     5. Mini CRUD: noticias creadas y eliminadas por el usuario
     6. Utilidades de interfaz (tarjetas, fechas, avisos)
   Se usa un objeto global "App" (patrón módulo) para no ensuciar el ámbito
   global y para que cada página pueda reutilizar estas funciones.
   ========================================================================== */

const App = (() => {
  "use strict";

  /* ---------- 1. Constantes ---------- */
  const RUTA_JSON = "data/noticias.json";          // Fuente de datos local
  const CLAVE_FAVORITOS = "pn_favoritos";           // IDs de noticias favoritas
  const CLAVE_CREADAS = "pn_noticias_creadas";      // Noticias creadas (CRUD)
  const CLAVE_ELIMINADAS = "pn_noticias_eliminadas";// IDs eliminados (CRUD)
  const CATEGORIAS = ["Educación", "Tecnología", "Turismo", "Comercio"];

  // Enlaces del menú principal (mismos cinco del wireframe)
  const MENU = [
    { texto: "Inicio", url: "index.html", icono: "bi-house" },
    { texto: "Noticias", url: "noticias.html", icono: "bi-newspaper" },
    { texto: "Categorías", url: "categorias.html", icono: "bi-grid" },
    { texto: "Favoritos", url: "favoritos.html", icono: "bi-star" },
    { texto: "Contacto", url: "contacto.html", icono: "bi-envelope" }
  ];

  /* ---------- 2. Header y footer ---------- */

  /** Devuelve el nombre del archivo HTML actual (ej. "noticias.html"). */
  function paginaActual() {
    const archivo = window.location.pathname.split("/").pop();
    return archivo === "" ? "index.html" : archivo;
  }

  /** Construye el header con el menú de navegación y marca la página activa. */
  function renderHeader() {
    const contenedor = document.getElementById("app-header");
    if (!contenedor) return;
    const actual = paginaActual();
    const enlaces = MENU.map(item => {
      // La vista de detalle pertenece a la sección "Noticias"
      const activo = item.url === actual || (actual === "detalle.html" && item.url === "noticias.html");
      return `<li class="nav-item">
                <a class="nav-link ${activo ? "active" : ""}" ${activo ? 'aria-current="page"' : ""} href="${item.url}">
                  <i class="bi ${item.icono} me-1"></i>${item.texto}
                  ${item.url === "favoritos.html" ? '<span class="badge rounded-pill bg-warning text-dark ms-1" id="contador-favoritos"></span>' : ""}
                </a>
              </li>`;
    }).join("");

    contenedor.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-dark bg-periodico sticky-top shadow-sm">
        <div class="container">
          <a class="navbar-brand fw-bold" href="index.html">
            <i class="bi bi-newspaper me-2"></i>Periódico <span class="text-warning">News</span>
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal"
                  aria-controls="menuPrincipal" aria-expanded="false" aria-label="Abrir menú">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="menuPrincipal">
            <ul class="navbar-nav ms-auto">${enlaces}</ul>
          </div>
        </div>
      </nav>`;
    actualizarContadorFavoritos();
  }

  /** Construye el footer: redes sociales, enlaces rápidos y datos de contacto. */
  function renderFooter() {
    const contenedor = document.getElementById("app-footer");
    if (!contenedor) return;
    const enlaces = MENU.map(i => `<li><a href="${i.url}">${i.texto}</a></li>`).join("");
    contenedor.innerHTML = `
      <footer class="footer-periodico pt-5 pb-3 mt-5">
        <div class="container">
          <div class="row g-4">
            <div class="col-md-4">
              <h5 class="fw-bold">Periódico <span class="text-warning">News</span></h5>
              <p class="small mb-3">Noticias de educación, tecnología, turismo y comercio, contadas de forma clara.</p>
              <div class="d-flex gap-3 fs-5">
                <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
                <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
                <a href="#" aria-label="X"><i class="bi bi-twitter-x"></i></a>
                <a href="#" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
              </div>
            </div>
            <div class="col-6 col-md-4">
              <h6 class="fw-bold text-uppercase">Enlaces rápidos</h6>
              <ul class="list-unstyled small">${enlaces}</ul>
            </div>
            <div class="col-6 col-md-4">
              <h6 class="fw-bold text-uppercase">Contacto</h6>
              <ul class="list-unstyled small">
                <li><i class="bi bi-envelope me-2"></i>contacto@periodiconews.com</li>
                <li><i class="bi bi-telephone me-2"></i>+57 601 000 0000</li>
                <li><i class="bi bi-geo-alt me-2"></i>Bogotá, Colombia</li>
              </ul>
            </div>
          </div>
          <hr class="border-secondary">
          <p class="text-center small mb-0">&copy; ${new Date().getFullYear()} Periódico News · Proyecto académico del módulo Desarrollo Front-End</p>
        </div>
      </footer>`;
  }

  /* ---------- 3. Carga de datos ---------- */

  /**
   * Lee el archivo JSON local con fetch() y combina el resultado con las
   * noticias creadas y eliminadas por el usuario (guardadas en localStorage).
   * @returns {Promise<Array>} Lista de noticias ordenada de la más reciente a la más antigua.
   */
  async function obtenerNoticias() {
    const respuesta = await fetch(RUTA_JSON);
    if (!respuesta.ok) throw new Error(`No se pudo leer ${RUTA_JSON} (HTTP ${respuesta.status})`);
    const delJson = await respuesta.json();
    const eliminadas = leer(CLAVE_ELIMINADAS);
    return [...leer(CLAVE_CREADAS), ...delJson]
      .filter(n => !eliminadas.includes(n.id))
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  /** Busca una noticia por su id. */
  async function obtenerNoticiaPorId(id) {
    const noticias = await obtenerNoticias();
    return noticias.find(n => n.id === Number(id));
  }

  /* ---------- Utilidades de localStorage ---------- */

  /** Lee un arreglo desde localStorage; si no existe o está dañado devuelve []. */
  function leer(clave) {
    try {
      return JSON.parse(localStorage.getItem(clave)) || [];
    } catch (e) {
      return [];
    }
  }

  /** Guarda un arreglo en localStorage como texto JSON. */
  function guardar(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor));
  }

  /* ---------- 4. Favoritos ---------- */

  const obtenerFavoritos = () => leer(CLAVE_FAVORITOS);
  const esFavorito = id => obtenerFavoritos().includes(Number(id));

  /**
   * Agrega o quita una noticia de favoritos.
   * @returns {boolean} true si quedó como favorita, false si se retiró.
   */
  function alternarFavorito(id) {
    id = Number(id);
    let favoritos = obtenerFavoritos();
    const yaEsta = favoritos.includes(id);
    favoritos = yaEsta ? favoritos.filter(f => f !== id) : [...favoritos, id];
    guardar(CLAVE_FAVORITOS, favoritos);
    actualizarContadorFavoritos();
    return !yaEsta;
  }

  /** Muestra en el menú cuántas noticias hay en favoritos. */
  function actualizarContadorFavoritos() {
    const badge = document.getElementById("contador-favoritos");
    if (!badge) return;
    const total = obtenerFavoritos().length;
    badge.textContent = total > 0 ? total : "";
  }

  /* ---------- 5. Mini CRUD ---------- */

  /** Crea una noticia nueva y la guarda en localStorage. */
  function crearNoticia(datos) {
    const creadas = leer(CLAVE_CREADAS);
    const nueva = {
      id: Date.now(),                                   // id único basado en la hora
      titulo: datos.titulo.trim(),
      resumen: datos.resumen.trim(),
      contenido: datos.contenido.trim(),
      categoria: datos.categoria,
      imagen: datos.imagen?.trim() || "img/placeholder.svg",
      autor: datos.autor?.trim() || "Usuario invitado",
      fecha: new Date().toISOString().slice(0, 10),
      destacada: false,
      creadaPorUsuario: true
    };
    guardar(CLAVE_CREADAS, [nueva, ...creadas]);
    return nueva;
  }

  /**
   * Elimina una noticia. Si fue creada por el usuario se borra de la lista de
   * creadas; si viene del JSON se registra su id como eliminada.
   */
  function eliminarNoticia(id) {
    id = Number(id);
    const creadas = leer(CLAVE_CREADAS);
    if (creadas.some(n => n.id === id)) {
      guardar(CLAVE_CREADAS, creadas.filter(n => n.id !== id));
    } else {
      guardar(CLAVE_ELIMINADAS, [...leer(CLAVE_ELIMINADAS), id]);
    }
    // Si estaba en favoritos también se retira
    guardar(CLAVE_FAVORITOS, obtenerFavoritos().filter(f => f !== id));
    actualizarContadorFavoritos();
  }

  /** Restaura el catálogo original (borra creadas y eliminadas). */
  function restaurarCatalogo() {
    localStorage.removeItem(CLAVE_CREADAS);
    localStorage.removeItem(CLAVE_ELIMINADAS);
  }

  /* ---------- 6. Utilidades de interfaz ---------- */

  /** Escapa caracteres especiales para evitar inyección de HTML. */
  function escaparHTML(texto = "") {
    return String(texto).replace(/[&<>"']/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /** Convierte "2026-09-22" en "22 de septiembre de 2026". */
  function formatearFecha(iso) {
    const [a, m, d] = iso.split("-").map(Number);
    return new Date(a, m - 1, d).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  }

  /**
   * Genera el HTML de una tarjeta (card) de noticia:
   * imagen, categoría, nombre, descripción breve y botón "Ver más".
   * @param {Object} n            Noticia
   * @param {Object} opciones     { eliminar: boolean } muestra botón de eliminar (CRUD)
   */
  function tarjetaNoticia(n, opciones = {}) {
    const fav = esFavorito(n.id);
    return `
      <div class="col-sm-6 col-lg-4">
        <article class="card card-noticia h-100 shadow-sm">
          <img src="${escaparHTML(n.imagen)}" class="card-img-top" alt="Imagen de la noticia: ${escaparHTML(n.titulo)}"
               onerror="this.src='img/placeholder.svg'">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge badge-${slug(n.categoria)}">${escaparHTML(n.categoria)}</span>
              <button class="btn btn-sm btn-fav ${fav ? "activo" : ""}" data-fav="${n.id}"
                      title="${fav ? "Quitar de favoritos" : "Agregar a favoritos"}" aria-label="Favorito">
                <i class="bi ${fav ? "bi-star-fill" : "bi-star"}"></i>
              </button>
            </div>
            <h3 class="card-title h5">${escaparHTML(n.titulo)}</h3>
            <p class="card-text text-secondary small flex-grow-1">${escaparHTML(n.resumen)}</p>
            <p class="small text-muted mb-3"><i class="bi bi-calendar3 me-1"></i>${formatearFecha(n.fecha)}</p>
            <div class="d-flex gap-2">
              <a href="detalle.html?id=${n.id}" class="btn btn-primary btn-sm flex-grow-1">Ver más</a>
              ${opciones.eliminar ? `<button class="btn btn-outline-danger btn-sm" data-eliminar="${n.id}" title="Eliminar noticia"><i class="bi bi-trash"></i></button>` : ""}
            </div>
          </div>
        </article>
      </div>`;
  }

  /** Convierte "Educación" en "educacion" para usarlo como clase CSS. */
  function slug(texto) {
    return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }

  /**
   * Escucha los clics en los botones de estrella dentro de un contenedor
   * (delegación de eventos) y actualiza el ícono sin recargar la página.
   */
  function activarBotonesFavorito(contenedor, alCambiar) {
    contenedor.addEventListener("click", e => {
      const boton = e.target.closest("[data-fav]");
      if (!boton) return;
      const quedo = alternarFavorito(boton.dataset.fav);
      boton.classList.toggle("activo", quedo);
      boton.querySelector("i").className = `bi ${quedo ? "bi-star-fill" : "bi-star"}`;
      boton.title = quedo ? "Quitar de favoritos" : "Agregar a favoritos";
      mostrarAviso(quedo ? "Noticia agregada a favoritos" : "Noticia retirada de favoritos");
      if (alCambiar) alCambiar();
    });
  }

  /** Muestra una notificación breve (toast) en la esquina inferior. */
  function mostrarAviso(mensaje, tipo = "dark") {
    let zona = document.getElementById("zona-avisos");
    if (!zona) {
      zona = document.createElement("div");
      zona.id = "zona-avisos";
      zona.className = "toast-container position-fixed bottom-0 end-0 p-3";
      document.body.appendChild(zona);
    }
    const aviso = document.createElement("div");
    aviso.className = `toast align-items-center text-bg-${tipo} border-0`;
    aviso.setAttribute("role", "status");
    aviso.innerHTML = `<div class="d-flex"><div class="toast-body">${escaparHTML(mensaje)}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button></div>`;
    zona.appendChild(aviso);
    const toast = new bootstrap.Toast(aviso, { delay: 2500 });
    toast.show();
    aviso.addEventListener("hidden.bs.toast", () => aviso.remove());
  }

  /** Mensaje de error cuando no se puede leer el JSON (p. ej. abrir con file://). */
  function mensajeError(contenedor, error) {
    console.error(error);
    contenedor.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger">
          <strong>No fue posible cargar las noticias.</strong><br>
          Abre el proyecto desde un servidor local (por ejemplo, la extensión <em>Live Server</em> de VS Code)
          o desde GitHub Pages; los navegadores bloquean la lectura de archivos JSON con la ruta <code>file://</code>.
        </div>
      </div>`;
  }

  // Al cargar cualquier página se dibujan el header y el footer
  document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
  });

  // API pública del módulo
  return {
    CATEGORIAS, obtenerNoticias, obtenerNoticiaPorId,
    obtenerFavoritos, esFavorito, alternarFavorito,
    crearNoticia, eliminarNoticia, restaurarCatalogo,
    tarjetaNoticia, activarBotonesFavorito, mostrarAviso, mensajeError,
    escaparHTML, formatearFecha, slug
  };
})();
