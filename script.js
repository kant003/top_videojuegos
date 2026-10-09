// 1. Botón "subir" que aparece al bajar la página
const btnSubir = document.createElement("button");
btnSubir.textContent = "↑";
btnSubir.className = "btn-subir";
document.body.appendChild(btnSubir);

window.addEventListener("scroll", () => {
  btnSubir.classList.toggle("visible", window.scrollY > 300);
});

btnSubir.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// 2. Validación del formulario de contacto
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  if (!nombre || !correo.includes("@") || mensaje.length < 5) {
    alert("Rellena todos los campos correctamente.");
    return;
  }

  alert("¡Gracias, " + nombre + "! Mensaje enviado.");
  form.reset();
});

// 3. Al pulsar una imagen de la galería, se alterna un borde naranja
document.querySelectorAll(".galeria img").forEach((img) => {
  img.addEventListener("click", () => img.classList.toggle("seleccionado"));
});
