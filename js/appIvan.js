document.addEventListener("DOMContentLoaded", function () {
  var pie = document.querySelector(".pie p");
  pie.innerHTML =
    "Página creada por <strong>Iván Martínez</strong> · " + new Date().getFullYear();
});