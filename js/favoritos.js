/* ==========================================================================
   favoritos.js — Lista personalizada de favoritos
   Cruza los IDs guardados en localStorage con las noticias del JSON.
   ========================================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("lista-favoritos");
  const total = document.getElementById("total-favoritos");
  const btnVaciar = document.getElementById("btn-vaciar");
  let noticias = [];

  /** Dibuja las tarjetas de las noticias favoritas. */
  function render() {
    const ids = App.obtenerFavoritos();
    const favoritas = noticias.filter(n => ids.includes(n.id));
    total.textContent = `${favoritas.length} noticia(s) guardada(s)`;
    btnVaciar.classList.toggle("d-none", favoritas.length === 0);

    contenedor.innerHTML = favoritas.length
      ? favoritas.map(n => App.tarjetaNoticia(n)).join("")
      : `<div class="col-12 text-center py-5">
           <i class="bi bi-star display-4 text-secondary"></i>
           <p class="mt-3 text-secondary">Aún no tienes noticias en favoritos.</p>
           <a href="noticias.html" class="btn btn-primary">Explorar noticias</a>
         </div>`;
  }

  try {
    noticias = await App.obtenerNoticias();
    render();
    // Al quitar una estrella la tarjeta desaparece de la lista
    App.activarBotonesFavorito(contenedor, render);
  } catch (error) {
    App.mensajeError(contenedor, error);
  }

  // Vaciar todos los favoritos
  btnVaciar.addEventListener("click", () => {
    if (confirm("¿Quieres eliminar todas las noticias de tus favoritos?")) {
      App.obtenerFavoritos().forEach(id => App.alternarFavorito(id));
      render();
    }
  });
});
