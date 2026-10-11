/* ==========================================================================
   categorias.js — Página de categorías
   Cuenta cuántas noticias hay por categoría y enlaza al listado filtrado.
   ========================================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("lista-categorias");

  // Descripción corta de cada categoría
  const descripciones = {
    "Educación": "Colegios, universidades y nuevas formas de aprender.",
    "Tecnología": "Innovación, seguridad digital y tendencias.",
    "Turismo": "Destinos, rutas y consejos para viajar.",
    "Comercio": "Emprendimiento, negocios y economía local."
  };

  try {
    const noticias = await App.obtenerNoticias();
    contenedor.innerHTML = App.CATEGORIAS.map(cat => {
      const total = noticias.filter(n => n.categoria === cat).length;
      return `
        <div class="col-sm-6 col-lg-3">
          <a href="noticias.html?categoria=${encodeURIComponent(cat)}" class="text-decoration-none">
            <div class="card card-categoria position-relative shadow-sm h-100">
              <img src="img/${App.slug(cat)}-1.svg" alt="">
              <div class="capa d-flex flex-column justify-content-end p-4">
                <h2 class="h4 fw-bold mb-1">${cat}</h2>
                <p class="small mb-2">${descripciones[cat]}</p>
                <span class="badge bg-light text-dark align-self-start">${total} noticia(s)</span>
              </div>
            </div>
          </a>
        </div>`;
    }).join("");
  } catch (error) {
    App.mensajeError(contenedor, error);
  }
});
