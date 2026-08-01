/* Modo oscuro — guarda preferencia en localStorage */

function iniciarTema() {
  const guardado = localStorage.getItem("vc-tema");
  if (guardado === "dark") document.documentElement.setAttribute("data-theme", "dark");
}

function alternarTema() {
  const actual = document.documentElement.getAttribute("data-theme");
  if (actual === "dark") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("vc-tema", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("vc-tema", "dark");
  }
}

iniciarTema();
