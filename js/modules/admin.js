/* Panel Admin — lee/actualiza la colección 'pedidos' de Firestore */

const ESTADOS_FILTRO = [
  { id: "todos", label: "Todos" },
  { id: "confirmado", label: "Confirmados" },
  { id: "en_proceso", label: "En proceso" },
  { id: "elaboracion", label: "Elaboración" },
  { id: "control_calidad", label: "Control calidad" },
  { id: "listo", label: "Listos" },
];

const LABELS_ESTADO = {
  confirmado: "Confirmado",
  en_proceso: "En proceso",
  elaboracion: "Elaboración",
  control_calidad: "Control de calidad",
  listo: "Listo",
};

let pedidosCache = [];
let filtroActivo = "todos";

async function cargarPedidos() {
  mostrarCargandoAdmin(true);
  try {
    if (typeof db === "undefined") {
      mostrarCargandoAdmin(false);
      document.getElementById("admin-lista").innerHTML = `<p class="estado-vacio">Configura Firebase en js/firebase-config.js para ver pedidos reales.</p>`;
      return;
    }
    const snap = await db.collection("pedidos").orderBy("creadoEn", "desc").get();
    pedidosCache = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    mostrarCargandoAdmin(false);
    renderPedidosAdmin();
  } catch (err) {
    console.error(err);
    mostrarCargandoAdmin(false);
    document.getElementById("admin-lista").innerHTML = `<p class="estado-vacio">No se pudieron cargar los pedidos.</p>`;
  }
}

function mostrarCargandoAdmin(activo) {
  document.getElementById("admin-cargando").style.display = activo ? "flex" : "none";
}

function renderTabsAdmin() {
  const cont = document.getElementById("admin-tabs");
  cont.innerHTML = ESTADOS_FILTRO.map(e => `
    <button class="admin-tab ${e.id === filtroActivo ? "activo" : ""}" onclick="cambiarFiltro('${e.id}')">${e.label}</button>
  `).join("");
}

function cambiarFiltro(id) {
  filtroActivo = id;
  renderTabsAdmin();
  renderPedidosAdmin();
}

function renderPedidosAdmin() {
  const cont = document.getElementById("admin-lista");
  const lista = filtroActivo === "todos" ? pedidosCache : pedidosCache.filter(p => p.estado === filtroActivo);

  if (lista.length === 0) {
    cont.innerHTML = `<p class="estado-vacio">No hay pedidos en esta categoría.</p>`;
    return;
  }

  cont.innerHTML = lista.map(p => `
    <div class="tarjeta-pedido">
      <div class="tarjeta-pedido-header">
        <span class="tarjeta-pedido-codigo">${p.codigo}</span>
        <span class="badge-estado badge-${p.estado}">${LABELS_ESTADO[p.estado] || p.estado}</span>
      </div>
      <div class="tarjeta-pedido-fila"><span>Cliente</span><strong>${p.cliente?.nombre || "—"}</strong></div>
      <div class="tarjeta-pedido-fila"><span>Tipo</span><strong>${p.tipo === "personalizado" ? "Personalizado" : "Catálogo"}</strong></div>
      <div class="tarjeta-pedido-fila"><span>Entrega</span><strong>${p.fechaEntrega || "—"}</strong></div>
      <div class="tarjeta-pedido-fila"><span>Dirección</span><strong>${p.cliente?.direccion || "—"}</strong></div>
      <div class="tarjeta-pedido-fila"><span>Total</span><strong>${formatearPrecio(p.total || 0)}</strong></div>
      ${p.tipo === "personalizado" ? `
        <div class="tarjeta-pedido-fila"><span>Tamaño</span><strong>${p.tamano || "—"} cm (${p.presentacion === "caja" ? "caja" : "bolsa"})</strong></div>
        <div class="tarjeta-pedido-fila"><span>Diseño</span><strong>${p.nombreDibujo || "—"}</strong></div>
        <div class="tarjeta-pedido-fila"><span>Iniciales</span><strong>${p.iniciales || "—"}</strong></div>
      ` : ""}
      <div class="tarjeta-pedido-acciones">
        <select onchange="actualizarEstadoPedido('${p.id}', this.value)">
          ${ESTADOS_FILTRO.filter(e => e.id !== "todos").map(e => `
            <option value="${e.id}" ${e.id === p.estado ? "selected" : ""}>${e.label}</option>
          `).join("")}
        </select>
        <button class="btn-wsp-mini" onclick="contactarClienteWsp('${p.cliente?.whatsapp || ""}', '${p.cliente?.nombre || ""}', '${p.codigo}')">WhatsApp</button>
      </div>
    </div>
  `).join("");
}

async function actualizarEstadoPedido(id, nuevoEstado) {
  try {
    if (typeof db !== "undefined") {
      await db.collection("pedidos").doc(id).update({ estado: nuevoEstado });
    }
    const pedido = pedidosCache.find(p => p.id === id);
    if (pedido) pedido.estado = nuevoEstado;
    renderPedidosAdmin();

    if (nuevoEstado === "listo" && pedido) {
      contactarClienteWsp(pedido.cliente?.whatsapp, pedido.cliente?.nombre, pedido.codigo, true);
    }
  } catch (err) {
    console.error(err);
  }
}

function contactarClienteWsp(numero, nombre, codigo, esListo = false) {
  if (!numero) return;
  const mensaje = esListo
    ? `Hola ${nombre}, tu pedido ${codigo} en Vuelo Creativo ya está listo. Coordinemos la entrega.`
    : `Hola ${nombre}, te escribimos por tu pedido ${codigo} en Vuelo Creativo.`;
  const numeroLimpio = numero.replace(/\D/g, "");
  window.open(`https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`, "_blank");
}
