/* ==========================================================================
   noticias.js — Listado de noticias
   Funciones: renderizado dinámico desde JSON, búsqueda por palabra clave,
   filtro por categoría, paginación y mini CRUD (crear / eliminar).
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const POR_PAGINA = 6;                 // Tarjetas por página

  // Referencias al DOM
  const listado = document.getElementById("listado");
  const paginacion = document.getElementById("paginacion");
  const resumen = document.getElementById("resumen-resultados");
  const inputBuscar = document.getElementById("buscar");
  const selectCategoria = document.getElementById("filtro-categoria");
  const formCrear = document.getElementById("form-crear");

  // Estado de la vista
  let noticias = [];
  let paginaActual = 1;

  // Llenar los <select> de categoría con la lista definida en app.js
  const opciones = App.CATEGORIAS.map(c => `<option value="${c}">${c}</option>`).join("");
  selectCategoria.insertAdjacentHTML("beforeend", opciones);
  document.getElementById("nt-categoria").insertAdjacentHTML("beforeend", opciones);

  // Si la URL trae ?categoria=Turismo (desde la página Categorías) se aplica el filtro
  const parametros = new URLSearchParams(window.location.search);
  if (parametros.get("categoria")) selectCategoria.value = parametros.get("categoria");

  /** Carga (o recarga) las noticias y pinta la vista. */
  async function cargar() {
    try {
      noticias = await App.obtenerNoticias();
      render();
    } catch (error) {
      App.mensajeError(listado, error);
    }
  }

  /** Aplica búsqueda + filtro y devuelve las noticias que coinciden. */
  function filtrar() {
    const texto = normalizar(inputBuscar.value);
    const categoria = selectCategoria.value;
    return noticias.filter(n =>
      (!categoria || n.categoria === categoria) &&
      (!texto || normalizar(`${n.titulo} ${n.resumen}`).includes(texto))
    );
  }

  /** Quita tildes y pasa a minúsculas para comparar textos. */
  function normalizar(t) {
    return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  }

  /** Dibuja las tarjetas de la página actual y los controles de paginación. */
  function render() {
    const resultado = filtrar();
    const totalPaginas = Math.max(1, Math.ceil(resultado.length / POR_PAGINA));
    paginaActual = Math.min(paginaActual, totalPaginas);
    const inicio = (paginaActual - 1) * POR_PAGINA;
    const pagina = resultado.slice(inicio, inicio + POR_PAGINA);

    resumen.textContent = `${resultado.length} noticia(s) encontradas`;
    listado.innerHTML = pagina.length
      ? pagina.map(n => App.tarjetaNoticia(n, { eliminar: true })).join("")
      : `<div class="col-12"><div class="alert alert-info">No hay noticias que coincidan con la búsqueda.</div></div>`;

    renderPaginacion(totalPaginas);
  }

  /** Genera los botones « 1 2 3 » de la paginación. */
  function renderPaginacion(total) {
    let html = `<li class="page-item ${paginaActual === 1 ? "disabled" : ""}">
                  <a class="page-link" href="#" data-pagina="${paginaActual - 1}" aria-label="Anterior">&laquo;</a></li>`;
    for (let i = 1; i <= total; i++) {
      html += `<li class="page-item ${i === paginaActual ? "active" : ""}">
                 <a class="page-link" href="#" data-pagina="${i}">${i}</a></li>`;
    }
    html += `<li class="page-item ${paginaActual === total ? "disabled" : ""}">
               <a class="page-link" href="#" data-pagina="${paginaActual + 1}" aria-label="Siguiente">&raquo;</a></li>`;
    paginacion.innerHTML = html;
  }

  /* ---------- Eventos ---------- */

  // Búsqueda en tiempo real y cambio de categoría: vuelven a la página 1
  inputBuscar.addEventListener("input", () => { paginaActual = 1; render(); });
  selectCategoria.addEventListener("change", () => { paginaActual = 1; render(); });

  // Clic en la paginación
  paginacion.addEventListener("click", e => {
    const enlace = e.target.closest("[data-pagina]");
    if (!enlace) return;
    e.preventDefault();
    paginaActual = Number(enlace.dataset.pagina);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Favoritos (estrella en cada tarjeta)
  App.activarBotonesFavorito(listado);

  // Eliminar noticia (mini CRUD) con confirmación
  listado.addEventListener("click", e => {
    const boton = e.target.closest("[data-eliminar]");
    if (!boton) return;
    const noticia = noticias.find(n => n.id === Number(boton.dataset.eliminar));
    if (confirm(`¿Eliminar la noticia "${noticia.titulo}"?`)) {
      App.eliminarNoticia(noticia.id);
      App.mostrarAviso("Noticia eliminada", "danger");
      cargar();
    }
  });

  // Crear noticia (mini CRUD) con validación de Bootstrap + Constraint Validation API
  formCrear.addEventListener("submit", e => {
    e.preventDefault();
    if (!formCrear.checkValidity()) {
      formCrear.classList.add("was-validated");
      return;
    }
    App.crearNoticia({
      titulo: document.getElementById("nt-titulo").value,
      categoria: document.getElementById("nt-categoria").value,
      resumen: document.getElementById("nt-resumen").value,
      contenido: document.getElementById("nt-contenido").value,
      autor: document.getElementById("nt-autor").value,
      imagen: document.getElementById("nt-imagen").value
    });
    formCrear.reset();
    formCrear.classList.remove("was-validated");
    bootstrap.Collapse.getOrCreateInstance("#panel-crear").hide();
    App.mostrarAviso("Noticia creada correctamente", "success");
    paginaActual = 1;
    cargar();
  });

  // Restaurar catálogo original
  document.getElementById("btn-restaurar").addEventListener("click", () => {
    if (confirm("Se borrarán las noticias creadas y se recuperarán las eliminadas. ¿Continuar?")) {
      App.restaurarCatalogo();
      App.mostrarAviso("Catálogo restaurado");
      cargar();
    }
  });

  cargar();
});
