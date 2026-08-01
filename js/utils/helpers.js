/* Helpers generales usados en toda la app */

function formatearPrecio(num) {
  return "S/ " + Number(num).toFixed(2);
}

function fechaMinimaEntrega() {
  const hoy = new Date();
  hoy.setDate(hoy.getDate() + 2);
  return hoy.toISOString().split("T")[0];
}

function generarCodigoPedido() {
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  let codigo = "VC-";
  for (let i = 0; i < 5; i++) codigo += letras[Math.floor(Math.random() * letras.length)];
  return codigo;
}

function vibrar(ms = 15) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

/* Oculta el splash screen tras cargar */
function ocultarSplash() {
  const splash = document.getElementById("splash");
  if (!splash) return;
  setTimeout(() => splash.classList.add("oculto"), 900);
}

/* Registro del service worker */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(console.error);
  });
}

/* Captura el prompt de instalación PWA para ofrecerlo desde un botón propio */
let eventoInstalacionPWA = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  eventoInstalacionPWA = e;
  const btn = document.getElementById("btn-instalar-app");
  if (btn) btn.style.display = "flex";
});

function instalarApp() {
  if (!eventoInstalacionPWA) return;
  eventoInstalacionPWA.prompt();
  eventoInstalacionPWA.userChoice.finally(() => {
    eventoInstalacionPWA = null;
    const btn = document.getElementById("btn-instalar-app");
    if (btn) btn.style.display = "none";
  });
}
