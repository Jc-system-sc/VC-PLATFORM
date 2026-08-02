/* Panel Admin — lee/actualiza la colección 'pedidos' de Firestore */

const ESTADOS_FILTRO = [
  { id: "todos", label: "Todos" },
  { id: "pendiente", label: "Por revisar" },
  { id: "confirmado", label: "Confirmados" },
  { id: "en_proceso", label: "En proceso" },
  { id: "elaboracion", label: "Elaboración" },
  { id: "control_calidad", label: "Control calidad" },
  { id: "listo", label: "Listos" },
  { id: "rechazado", label: "Rechazados" },
];

/* Progresión real del pedido (usada en el selector, una vez aceptado) */
const ESTADOS_PROGRESO = ESTADOS_FILTRO.filter(e => !["todos", "pendiente", "rechazado"].includes(e.id));

const LABELS_ESTADO = {
  pendiente: "Por revisar",
  confirmado: "Confirmado",
  en_proceso: "En proceso",
  elaboracion: "Elaboración",
  control_calidad: "Control de calidad",
  listo: "Listo",
  rechazado: "Rechazado",
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
    renderStatsAdmin();
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

function renderStatsAdmin() {
  const cont = document.getElementById("admin-stats");
  if (!cont) return;
  const pendientes = pedidosCache.filter(p => p.estado === "pendiente").length;
  const enCurso = pedidosCache.filter(p => ["confirmado","en_proceso","elaboracion","control_calidad"].includes(p.estado)).length;
  const totalHoy = pedidosCache.filter(p => (p.creadoEn || "").slice(0,10) === new Date().toISOString().slice(0,10)).length;

  cont.innerHTML = `
    <div class="stat-card"><strong>${pendientes}</strong><span>Por revisar</span></div>
    <div class="stat-card"><strong>${enCurso}</strong><span>En curso</span></div>
    <div class="stat-card"><strong>${totalHoy}</strong><span>Pedidos hoy</span></div>
  `;
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
    <div class="tarjeta-pedido borde-${p.estado}">
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
      ${p.motivoRechazo ? `<div class="tarjeta-pedido-fila"><span>Motivo rechazo</span><strong>${p.motivoRechazo}</strong></div>` : ""}
      ${renderAccionesPedido(p)}
    </div>
  `).join("");
}

function renderAccionesPedido(p) {
  if (p.estado === "pendiente") {
    return `
      <div class="tarjeta-pedido-acciones">
        <button class="btn-aceptar" onclick="aceptarPedido('${p.id}')">Aceptar pedido</button>
        <button class="btn-rechazar" onclick="abrirRechazo('${p.id}')">Rechazar</button>
      </div>
    `;
  }
  if (p.estado === "rechazado") {
    return `
      <div class="tarjeta-pedido-acciones">
        <button class="btn-wsp-mini" style="flex:1;" onclick="contactarClienteWsp('${p.cliente?.whatsapp || ""}', '${p.cliente?.nombre || ""}', '${p.codigo}')">Escribir al cliente</button>
      </div>
    `;
  }
  return `
    <div class="tarjeta-pedido-acciones">
      <select onchange="actualizarEstadoPedido('${p.id}', this.value)">
        ${ESTADOS_PROGRESO.map(e => `
          <option value="${e.id}" ${e.id === p.estado ? "selected" : ""}>${e.label}</option>
        `).join("")}
      </select>
      <button class="btn-wsp-mini" onclick="contactarClienteWsp('${p.cliente?.whatsapp || ""}', '${p.cliente?.nombre || ""}', '${p.codigo}')">WhatsApp</button>
    </div>
  `;
}

async function aceptarPedido(id) {
  try {
    if (typeof db !== "undefined") {
      await db.collection("pedidos").doc(id).update({ estado: "confirmado" });
    }
    const pedido = pedidosCache.find(p => p.id === id);
    if (pedido) {
      pedido.estado = "confirmado";
      contactarClienteWsp(pedido.cliente?.whatsapp, pedido.cliente?.nombre, pedido.codigo, false,
        `Hola ${pedido.cliente?.nombre}, tu pedido ${pedido.codigo} en Vuelo Creativo fue aceptado. Ya empezamos a prepararlo.`);
    }
    renderStatsAdmin(); renderPedidosAdmin();
  } catch (err) {
    console.error(err);
  }
}

let idPedidoARechazar = null;

function abrirRechazo(id) {
  idPedidoARechazar = id;
  document.getElementById("input-motivo-rechazo").value = "";
  abrirSheetVentas("sheet-rechazo");
}

async function confirmarRechazo(evento) {
  evento.preventDefault();
  const motivo = document.getElementById("input-motivo-rechazo").value.trim() || "No especificado";

  try {
    if (typeof db !== "undefined") {
      await db.collection("pedidos").doc(idPedidoARechazar).update({ estado: "rechazado", motivoRechazo: motivo });
    }
    const pedido = pedidosCache.find(p => p.id === idPedidoARechazar);
    if (pedido) {
      pedido.estado = "rechazado";
      pedido.motivoRechazo = motivo;
      contactarClienteWsp(pedido.cliente?.whatsapp, pedido.cliente?.nombre, pedido.codigo, false,
        `Hola ${pedido.cliente?.nombre}, lamentablemente no podemos procesar tu pedido ${pedido.codigo}. Motivo: ${motivo}. Escríbenos si tienes dudas.`);
    }
    cerrarSheetVentas("sheet-rechazo");
    renderStatsAdmin(); renderPedidosAdmin();
  } catch (err) {
    console.error(err);
  }
}

/* Sheets simples reutilizados en el panel admin */
function abrirSheetVentas(id) {
  document.getElementById(id).classList.add("abierto");
  document.getElementById(id + "-overlay").classList.add("abierto");
}
function cerrarSheetVentas(id) {
  document.getElementById(id).classList.remove("abierto");
  document.getElementById(id + "-overlay").classList.remove("abierto");
}
  try {
    if (typeof db !== "undefined") {
      await db.collection("pedidos").doc(id).update({ estado: nuevoEstado });
    }
    const pedido = pedidosCache.find(p => p.id === id);
    if (pedido) pedido.estado = nuevoEstado;
    renderStatsAdmin(); renderPedidosAdmin();

    if (nuevoEstado === "listo" && pedido) {
      contactarClienteWsp(pedido.cliente?.whatsapp, pedido.cliente?.nombre, pedido.codigo, true);
    }
  } catch (err) {
    console.error(err);
  }
}

function contactarClienteWsp(numero, nombre, codigo, esListo = false, mensajePersonalizado = null) {
  if (!numero) return;
  const mensaje = mensajePersonalizado || (esListo
    ? `Hola ${nombre}, tu pedido ${codigo} en Vuelo Creativo ya está listo. Coordinemos la entrega.`
    : `Hola ${nombre}, te escribimos por tu pedido ${codigo} en Vuelo Creativo.`);
  const numeroLimpio = numero.replace(/\D/g, "");
  window.open(`https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`, "_blank");
}
