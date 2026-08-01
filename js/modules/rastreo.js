/* Módulo Rastreo — busca en la colección 'pedidos' por el campo 'codigo' */

const ESTADOS_PEDIDO = [
  { id: "confirmado",      label: "Confirmado" },
  { id: "en_proceso",      label: "En proceso" },
  { id: "elaboracion",     label: "Elaboración" },
  { id: "control_calidad", label: "Control de calidad" },
  { id: "listo",           label: "Listo" },
];

async function buscarPedido(evento) {
  if (evento) evento.preventDefault();
  const codigo = document.getElementById("input-codigo").value.trim().toUpperCase();
  if (!codigo) return;

  mostrarCargando(true);
  document.getElementById("resultado-pedido").style.display = "none";
  document.getElementById("mensaje-no-encontrado").style.display = "none";

  try {
    let pedido = null;

    if (typeof db !== "undefined") {
      const snap = await db.collection("pedidos").where("codigo", "==", codigo).limit(1).get();
      if (!snap.empty) pedido = snap.docs[0].data();
    }

    mostrarCargando(false);

    if (!pedido) {
      document.getElementById("mensaje-no-encontrado").style.display = "block";
      return;
    }

    renderResultado(pedido);
  } catch (err) {
    console.error(err);
    mostrarCargando(false);
    document.getElementById("mensaje-no-encontrado").style.display = "block";
  }
}

function mostrarCargando(activo) {
  document.getElementById("cargando-rastreo").style.display = activo ? "flex" : "none";
}

function renderResultado(pedido) {
  const cont = document.getElementById("resultado-pedido");
  cont.style.display = "block";

  document.getElementById("res-codigo").textContent = pedido.codigo;
  document.getElementById("res-cliente").textContent = pedido.cliente?.nombre || "—";
  document.getElementById("res-fecha").textContent = pedido.fechaEntrega || "—";
  document.getElementById("res-total").textContent = formatearPrecio(pedido.total || 0);

  renderWaypoints(pedido.estado || "confirmado");
}

function renderWaypoints(estadoActual) {
  const indiceActual = ESTADOS_PEDIDO.findIndex(e => e.id === estadoActual);
  const cont = document.getElementById("waypoints-rastreo");

  cont.innerHTML = ESTADOS_PEDIDO.map((e, i) => `
    <div class="waypoint ${i < indiceActual ? "completado" : i === indiceActual ? "activo" : ""}"></div>
  `).join("");

  const avion = document.getElementById("avion-waypoint");
  const porcentaje = (indiceActual / (ESTADOS_PEDIDO.length - 1)) * 90 + 5;
  avion.style.left = porcentaje + "%";
  avion.innerHTML = iconoAvionVC({ tamano: 22, color: "var(--color-acento)" });

  const cont2 = document.getElementById("labels-waypoints");
  cont2.innerHTML = ESTADOS_PEDIDO.map((e, i) => `
    <span class="${i === indiceActual ? "label-activo" : ""}">${e.label}</span>
  `).join("");
}
