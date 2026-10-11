/* ==========================================================================
   contacto.js — Formulario de contacto con validaciones
   Reglas: nombre, correo y mensaje son obligatorios; el correo debe tener
   un formato válido. Si todo está bien se muestra el mensaje de confirmación.
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-contacto");
  const confirmacion = document.getElementById("confirmacion");
  const mensaje = document.getElementById("mensaje");
  const contador = document.getElementById("contador-mensaje");

  // Expresión regular para validar el formato del correo (usuario@dominio.ext)
  const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  // Si se llega desde el detalle de una noticia, se precarga el asunto
  const asunto = new URLSearchParams(window.location.search).get("asunto");
  if (asunto) document.getElementById("asunto").value = asunto;

  /** Reglas de validación por campo: devuelven "" si es válido o el mensaje de error. */
  const reglas = {
    nombre: v => !v ? "El nombre es obligatorio."
              : v.length < 3 ? "El nombre debe tener al menos 3 caracteres." : "",
    correo: v => !v ? "El correo electrónico es obligatorio."
              : !REGEX_CORREO.test(v) ? "Ingresa un correo válido, por ejemplo nombre@ejemplo.com." : "",
    mensaje: v => !v ? "El mensaje es obligatorio."
              : v.length < 10 ? "El mensaje debe tener al menos 10 caracteres." : ""
  };

  /** Valida un campo, marca el input como válido/inválido y muestra el error. */
  function validarCampo(id) {
    const input = document.getElementById(id);
    const error = reglas[id](input.value.trim());
    input.classList.toggle("is-invalid", !!error);
    input.classList.toggle("is-valid", !error);
    document.getElementById(`error-${id}`).textContent = error;
    return !error;
  }

  // Validación en tiempo real cuando el usuario sale de cada campo
  Object.keys(reglas).forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener("blur", () => validarCampo(id));
    input.addEventListener("input", () => {
      if (input.classList.contains("is-invalid")) validarCampo(id);
    });
  });

  // Evita que el "blur" del último campo muestre un error y desplace el botón
  // justo antes del clic (el envío valida todos los campos de todas formas)
  form.querySelector("button[type=submit]").addEventListener("mousedown", e => e.preventDefault());

  // Contador de caracteres del mensaje
  mensaje.addEventListener("input", () => {
    contador.textContent = `${mensaje.value.length}/1000`;
  });

  // Envío del formulario
  form.addEventListener("submit", e => {
    e.preventDefault();
    const resultados = Object.keys(reglas).map(validarCampo);  // valida todos
    if (resultados.includes(false)) {
      confirmacion.classList.add("d-none");
      form.querySelector(".is-invalid").focus();               // lleva al primer error
      return;
    }

    // Prototipo: el mensaje se guarda en sessionStorage (no hay servidor todavía)
    const enviados = JSON.parse(sessionStorage.getItem("pn_mensajes") || "[]");
    enviados.push({
      nombre: form.nombre.value.trim(),
      correo: form.correo.value.trim(),
      asunto: form.asunto.value.trim(),
      mensaje: form.mensaje.value.trim(),
      fecha: new Date().toISOString()
    });
    sessionStorage.setItem("pn_mensajes", JSON.stringify(enviados));

    // Mostrar confirmación y limpiar el formulario
    confirmacion.classList.remove("d-none");
    confirmacion.focus();
    form.reset();
    contador.textContent = "0/1000";
    form.querySelectorAll(".is-valid").forEach(el => el.classList.remove("is-valid"));
  });
});
