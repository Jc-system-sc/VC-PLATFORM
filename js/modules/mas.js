/* Módulo "Más" — retención y engagement del cliente */

function renderMisPedidos() {
  const cont = document.getElementById("lista-mis-pedidos");
  const pedidos = obtenerPedidosLocales();

  if (pedidos.length === 0) {
    cont.innerHTML = `<p class="texto-suave" style="padding:6px 0;">Aún no tienes pedidos guardados en este celular. Cuando hagas uno, aparecerá aquí para que lo rastrees fácil.</p>`;
    return;
  }

  cont.innerHTML = pedidos.map(codigo => `
    <a class="fila-pedido-local" href="rastreo.html?codigo=${codigo}">
      <span>${codigo}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>
    </a>
  `).join("");
}

async function cargarContadorGlobal() {
  const el = document.getElementById("contador-mas");
  if (!el) return;
  try {
    if (typeof db !== "undefined") {
      const doc = await db.collection("config").doc("general").get();
      if (doc.exists && doc.data().contadorCuadrosEntregados) {
        el.textContent = doc.data().contadorCuadrosEntregados + "+";
        return;
      }
    }
  } catch (e) { /* usa el valor por defecto del HTML */ }
}

function alternarFAQ(el) {
  const item = el.parentElement;
  const yaAbierto = item.classList.contains("abierto");
  document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("abierto"));
  if (!yaAbierto) item.classList.add("abierto");
}

function compartirApp() {
  const datos = {
    title: "Vuelo Creativo",
    text: "Mira esta app para pedir cuadros decorativos personalizados en hilorama ✈️",
    url: location.origin + location.pathname.replace("mas.html", "index.html")
  };
  if (navigator.share) {
    navigator.share(datos).catch(() => {});
  } else {
    navigator.clipboard.writeText(datos.url);
    mostrarToastMas("Enlace copiado");
  }
}

function contactarNegocio() {
  const url = `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent("Hola, tengo una consulta sobre Vuelo Creativo")}`;
  window.open(url, "_blank");
}

function mostrarToastMas(texto) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = texto;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2000);
}
