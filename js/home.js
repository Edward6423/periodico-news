/* ==========================================================================
   home.js — Página de inicio
   Muestra las noticias marcadas como "destacada": true en el JSON.
   ========================================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("destacadas");
  try {
    const noticias = await App.obtenerNoticias();
    // Se priorizan las destacadas; si hay menos de 3 se completa con las más recientes
    let destacadas = noticias.filter(n => n.destacada);
    if (destacadas.length < 3) {
      destacadas = [...destacadas, ...noticias.filter(n => !n.destacada)].slice(0, 3);
    }
    contenedor.innerHTML = destacadas.slice(0, 3).map(n => App.tarjetaNoticia(n)).join("");
    App.activarBotonesFavorito(contenedor);
  } catch (error) {
    App.mensajeError(contenedor, error);
  }
});
