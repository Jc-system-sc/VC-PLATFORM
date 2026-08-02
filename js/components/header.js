/* Header dinámico. Uso: <div id="app-header"></div>
   renderHeader({ titulo: "Catálogo", mostrarVolver: true }) */

function renderHeader({ titulo = "Vuelo Creativo", mostrarVolver = false, accionExtra = "" } = {}) {
  const header = document.getElementById("app-header");
  if (!header) return;

  header.innerHTML = `
    ${mostrarVolver
      ? `<button id="btn-volver" aria-label="Volver">${iconoFlecha()}</button>`
      : `<button id="logo-marca-secreto" class="logo-mini" aria-label="Vuelo Creativo">${iconoAvionVC({ tamano: 24, color: "var(--color-acento)" })}</button>`}
    <h1 class="titulo-header">${titulo}</h1>
    <span class="header-extra">${accionExtra}</span>
  `;

  if (mostrarVolver) {
    document.getElementById("btn-volver").addEventListener("click", () => history.back());
  }
}

function iconoFlecha() {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>`;
}
