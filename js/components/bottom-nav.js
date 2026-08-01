/* Nav inferior de 4 pestañas con indicador líquido.
   Uso: <div id="bottom-nav"></div> + renderBottomNav("inicio") */

const TABS = [
  { id: "inicio",   label: "Inicio",   href: "app.html",      icono: iconoCasa() },
  { id: "catalogo", label: "Catálogo", href: "catalogo.html", icono: iconoCatalogo() },
  { id: "rastreo",  label: "Pedidos",  href: "rastreo.html",  icono: iconoAvionVC({ tamano: 21 }) },
  { id: "mas",      label: "Más",      href: "mas.html",      icono: iconoMas() },
];

function renderBottomNav(tabActiva) {
  const nav = document.getElementById("bottom-nav");
  if (!nav) return;

  const indice = TABS.findIndex(t => t.id === tabActiva);

  nav.innerHTML = `
    <div class="nav-indicador" style="transform: translateX(${indice * 100}%)"></div>
    ${TABS.map(t => `
      <a class="nav-item ${t.id === tabActiva ? "activa" : ""}" href="${t.href}">
        ${t.icono}
        <span>${t.label}</span>
      </a>
    `).join("")}
  `;
}

function iconoCasa() {
  return `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5l9-7.5 9 7.5"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>`;
}
function iconoCatalogo() {
  return `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3.5" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/></svg>`;
}
function iconoMas() {
  return `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/></svg>`;
}
