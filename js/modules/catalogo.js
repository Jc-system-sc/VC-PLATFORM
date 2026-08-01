/* Módulo Catálogo — usa CATALOGO (js/data/catalogo.js) y carrito.js */

function renderCatalogo() {
  const cont = document.getElementById("grid-catalogo");
  if (!cont) return;

  cont.innerHTML = CATALOGO.map(item => `
    <button class="tarjeta-catalogo" onclick="abrirDetalle('${item.codigo}')">
      <div class="tarjeta-imagen"></div>
      <p class="tarjeta-nombre">${item.nombre}</p>
      <p class="texto-suave" style="font-size:0.7rem; margin:2px 0 6px;">${item.medidas}</p>
      <div class="precios-mini">
        <span>Bolsa <strong>${formatearPrecio(item.precioBolsa)}</strong></span>
        <span>Caja <strong>${formatearPrecio(item.precioCaja)}</strong></span>
      </div>
    </button>
  `).join("");

  actualizarBadgeCarrito();
}

function abrirDetalle(codigo) {
  const item = CATALOGO.find(i => i.codigo === codigo);
  if (!item) return;

  document.getElementById("detalle-nombre").textContent = item.nombre;
  document.getElementById("detalle-descripcion").textContent = item.descripcion;
  document.getElementById("detalle-medidas").textContent = `${item.medidas} · ${item.peso}`;
  document.getElementById("detalle-codigo").textContent = item.codigo;

  document.getElementById("btn-agregar-bolsa").innerHTML = `Con bolsa · ${formatearPrecio(item.precioBolsa)}`;
  document.getElementById("btn-agregar-caja").innerHTML = `Con caja · ${formatearPrecio(item.precioCaja)}`;

  document.getElementById("btn-agregar-bolsa").onclick = () => agregarDesdeDetalle(item, "bolsa");
  document.getElementById("btn-agregar-caja").onclick = () => agregarDesdeDetalle(item, "caja");

  abrirSheet("sheet-detalle");
}

function agregarDesdeDetalle(item, presentacion) {
  const precio = presentacion === "caja" ? item.precioCaja : item.precioBolsa;
  const etiqueta = presentacion === "caja" ? "caja" : "bolsa";
  agregarAlCarrito({
    id: `${item.codigo}-${presentacion}`,
    nombre: `${item.nombre} (${etiqueta})`,
    precio,
    codigo: item.codigo
  });
  cerrarSheet("sheet-detalle");
  mostrarToast("Agregado al carrito");
}

/* ===== Sheets genéricos ===== */
function abrirSheet(id) {
  document.getElementById(id).classList.add("abierto");
  document.getElementById(id + "-overlay").classList.add("abierto");
}
function cerrarSheet(id) {
  document.getElementById(id).classList.remove("abierto");
  document.getElementById(id + "-overlay").classList.remove("abierto");
}

/* ===== Carrito ===== */
function abrirCarrito() {
  renderCarritoSheet();
  abrirSheet("sheet-carrito");
}

function renderCarritoSheet() {
  const carrito = obtenerCarrito();
  const cont = document.getElementById("lista-carrito");

  if (carrito.length === 0) {
    cont.innerHTML = `<p class="texto-suave" style="text-align:center; padding:20px 0;">Tu carrito está vacío</p>`;
    document.getElementById("carrito-total").textContent = formatearPrecio(0);
    return;
  }

  cont.innerHTML = carrito.map(i => `
    <div class="item-carrito">
      <div>
        <p class="item-nombre">${i.nombre}</p>
        <p class="texto-suave">${formatearPrecio(i.precio)} c/u</p>
      </div>
      <div class="controles-cantidad">
        <button onclick="cambiarCantidad('${i.id}', -1); renderCarritoSheet();">−</button>
        <span>${i.cantidad}</span>
        <button onclick="cambiarCantidad('${i.id}', 1); renderCarritoSheet();">+</button>
      </div>
    </div>
  `).join("");

  document.getElementById("carrito-total").textContent = formatearPrecio(totalCarrito());
}

function irACheckout() {
  if (obtenerCarrito().length === 0) return;
  cerrarSheet("sheet-carrito");
  document.getElementById("checkout-fecha").min = fechaMinimaEntrega();
  abrirSheet("sheet-checkout");
}

/* ===== Checkout ===== */
function seleccionarMetodoPago(metodo) {
  document.querySelectorAll(".metodo-pago").forEach(b => b.classList.remove("activo"));
  document.getElementById("metodo-" + metodo).classList.add("activo");
  document.getElementById("checkout-metodo").value = metodo;
  document.getElementById("qr-pago").style.display = metodo === "efectivo" ? "none" : "block";
  document.getElementById("qr-imagen").textContent = metodo === "yape" ? "QR Yape" : metodo === "bcp" ? "QR BCP" : "";
}

async function confirmarPedido(evento) {
  evento.preventDefault();

  const nombre = document.getElementById("checkout-nombre").value.trim();
  const whatsapp = document.getElementById("checkout-whatsapp").value.trim();
  const direccion = document.getElementById("checkout-direccion").value.trim();
  const fecha = document.getElementById("checkout-fecha").value;
  const metodo = document.getElementById("checkout-metodo").value;
  const codigoOperacion = document.getElementById("checkout-operacion").value.trim();

  if (!nombre || !whatsapp || !fecha || (metodo !== "efectivo" && !codigoOperacion)) {
    mostrarToast("Completa todos los campos");
    return;
  }

  const codigoPedido = generarCodigoPedido();
  const carrito = obtenerCarrito();
  const total = totalCarrito();

  const pedido = {
    codigo: codigoPedido,
    tipo: "catalogo",
    cliente: { nombre, whatsapp, direccion },
    fechaEntrega: fecha,
    items: carrito,
    pago: { metodo, codigoOperacion },
    total,
    estado: "confirmado",
    creadoEn: new Date().toISOString()
  };

  await guardarPedidoFirestore(pedido);

  cerrarSheet("sheet-checkout");
  guardarPedidoLocal(codigoPedido);
  mostrarConfirmacion(codigoPedido, { cliente: nombre, whatsapp, items: carrito, total });
  vaciarCarrito();
}

async function guardarPedidoFirestore(pedido) {
  try {
    if (typeof db !== "undefined") {
      await db.collection("pedidos").add(pedido);
    } else {
      console.warn("Firestore no inicializado — pedido no guardado en la nube:", pedido);
    }
  } catch (err) {
    console.error("Error guardando pedido:", err);
  }
}

function mostrarConfirmacion(codigo, datosBoleta) {
  document.getElementById("confirmacion-codigo").textContent = codigo;
  abrirSheet("sheet-confirmacion");
  lanzarConfeti();

  document.getElementById("btn-descargar-boleta").onclick = () => {
    const canvas = generarBoleta({ ...datosBoleta, codigoPedido: codigo });
    descargarBoleta(canvas, `boleta-${codigo}`);
  };
  document.getElementById("btn-wsp-boleta").onclick = () => {
    enviarBoletaPorWhatsApp(datosBoleta.whatsapp, `Hola ${datosBoleta.cliente}, gracias por tu pedido en Vuelo Creativo. Tu código de seguimiento es ${codigo}.`);
  };
}

/* ===== Extras UI ===== */
function mostrarToast(texto) {
  const toast = document.getElementById("toast");
  toast.textContent = texto;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2200);
}

function lanzarConfeti() {
  for (let i = 0; i < 24; i++) {
    const p = document.createElement("div");
    p.className = "confeti-particula";
    p.style.left = Math.random() * 100 + "%";
    p.style.background = i % 2 === 0 ? "#2E8B7F" : "#6FBDAF";
    p.style.animationDelay = Math.random() * 0.4 + "s";
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 2000);
  }
}
