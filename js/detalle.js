/* ==========================================================================
   detalle.js — Vista de detalle
   Lee el parámetro ?id= de la URL, busca la noticia y muestra su información
   completa con los botones "Agregar a favoritos" e "Ir a contacto".
   ========================================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("detalle");
  const id = new URLSearchParams(window.location.search).get("id");

  // "Volver" regresa a la página anterior si el usuario vino desde el sitio
  document.getElementById("btn-volver").addEventListener("click", e => {
    if (document.referrer.includes(window.location.host)) {
      e.preventDefault();
      history.back();
    }
  });

  try {
    const noticia = await App.obtenerNoticiaPorId(id);
    if (!noticia) {
      contenedor.innerHTML = `<div class="alert alert-warning">La noticia solicitada no existe o fue eliminada.
        <a href="noticias.html" class="alert-link">Ver todas las noticias</a>.</div>`;
      return;
    }
    document.title = `${noticia.titulo} | Periódico News`;

    // Cada salto de línea doble del JSON se convierte en un párrafo
    const parrafos = noticia.contenido.split(/\n+/).map(p => `<p>${App.escaparHTML(p)}</p>`).join("");

    contenedor.innerHTML = `
      <img src="${App.escaparHTML(noticia.imagen)}" alt="Imagen representativa de la noticia" class="detalle-imagen shadow-sm mb-4"
           onerror="this.src='img/placeholder.svg'">
      <span class="badge badge-${App.slug(noticia.categoria)} mb-2">${App.escaparHTML(noticia.categoria)}</span>
      <h1 class="fw-bold mb-3">${App.escaparHTML(noticia.titulo)}</h1>
      <p class="text-muted border-bottom pb-3">
        <i class="bi bi-person me-1"></i>${App.escaparHTML(noticia.autor)}
        <span class="mx-2">·</span><i class="bi bi-calendar3 me-1"></i>${App.formatearFecha(noticia.fecha)}
      </p>
      <p class="lead">${App.escaparHTML(noticia.resumen)}</p>
      <div class="detalle-contenido">${parrafos}</div>
      <div class="row g-3 mt-3">
        <div class="col-md-6 d-grid">
          <button class="btn btn-lg" id="btn-favorito"></button>
        </div>
        <div class="col-md-6 d-grid">
          <a class="btn btn-outline-primary btn-lg" href="contacto.html?asunto=${encodeURIComponent("Sobre: " + noticia.titulo)}">
            <i class="bi bi-envelope me-1"></i>Ir a contacto</a>
        </div>
      </div>`;

    // Botón de favoritos: cambia su texto y estilo según el estado
    const botonFav = document.getElementById("btn-favorito");
    const pintarBoton = () => {
      const fav = App.esFavorito(noticia.id);
      botonFav.className = `btn btn-lg ${fav ? "btn-warning" : "btn-acento"}`;
      botonFav.innerHTML = fav
        ? `<i class="bi bi-star-fill me-1"></i>Quitar de favoritos`
        : `<i class="bi bi-star me-1"></i>Agregar a favoritos`;
    };
    pintarBoton();
    botonFav.addEventListener("click", () => {
      const quedo = App.alternarFavorito(noticia.id);
      pintarBoton();
      App.mostrarAviso(quedo ? "Noticia agregada a favoritos" : "Noticia retirada de favoritos");
    });

    // Noticias relacionadas (misma categoría, máximo 3)
    const todas = await App.obtenerNoticias();
    const relacionadas = todas.filter(n => n.categoria === noticia.categoria && n.id !== noticia.id).slice(0, 3);
    if (relacionadas.length) {
      const zona = document.getElementById("relacionadas");
      zona.innerHTML = relacionadas.map(n => App.tarjetaNoticia(n)).join("");
      App.activarBotonesFavorito(zona);
      document.getElementById("bloque-relacionadas").classList.remove("d-none");
    }
  } catch (error) {
    App.mensajeError(contenedor, error);
  }
});
