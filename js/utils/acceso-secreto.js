/* Acceso secreto al panel admin — 5 toques rápidos sobre el avioncito de marca.
   No hay ningún botón visible ni enlace: solo quien conoce el gesto puede entrar. */

function activarAccesoSecreto(elementoId) {
  const el = document.getElementById(elementoId);
  if (!el) return;

  let toques = 0;
  let temporizador = null;

  el.addEventListener("click", () => {
    toques++;
    if (temporizador) clearTimeout(temporizador);

    if (toques >= 5) {
      toques = 0;
      location.href = "admin-login.html";
      return;
    }
    temporizador = setTimeout(() => { toques = 0; }, 1800);
  });
}
