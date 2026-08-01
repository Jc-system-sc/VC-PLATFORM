/* Ventas presenciales — escaneo EAN, venta activa en memoria, boleta y registro en Firestore */

let ventaActiva = [];
let scannerActivo = null;

function iniciarEscaner() {
  const lector = document.getElementById("lector-qr");
  document.getElementById("escaner-inicio").style.display = "none";
  document.getElementById("btn-detener").style.display = "block";
  lector.style.display = "block";

  scannerActivo = new Html5Qrcode("lector-qr");
  scannerActivo.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 240, height: 140 } },
    (textoDecodificado) => procesarCodigo(textoDecodificado),
    () => {} // errores de frame, ignorar
  ).catch(() => {
    mostrarToastVentas("No se pudo acceder a la cámara. Usa el ingreso manual.");
    detenerEscaner();
  });
}

function detenerEscaner() {
  if (scannerActivo) {
    scannerActivo.stop().catch(() => {});
    scannerActivo = null;
  }
  document.getElementById("lector-qr").style.display = "none";
  document.getElementById("btn-detener").style.display = "none";
  document.getElementById("escaner-inicio").style.display = "block";
}

function procesarCodigoManual(evento) {
  evento.preventDefault();
  const input = document.getElementById("input-ean-manual");
  procesarCodigo(input.value.trim());
  input.value = "";
}

function procesarCodigo(codigo) {
  const tipo = buscarPorEAN(codigo);
  if (!tipo) {
    mostrarToastVentas("Código no reconocido");
    vibrar(30);
    return;
  }

  const existente = ventaActiva.find(i => i.ean === codigo);
  if (existente) {
    existente.cantidad += 1;
  } else {
    ventaActiva.push({ ean: codigo, nombre: tipo.tipo, precio: tipo.precio, cantidad: 1 });
  }
  vibrar(15);
  mostrarToastVentas(`${tipo.tipo} agregado`);
  renderVentaActiva();
}

function quitarItemVenta(ean) {
  ventaActiva = ventaActiva.filter(i => i.ean !== ean);
  renderVentaActiva();
}

function renderVentaActiva() {
  const cont = document.getElementById("lista-venta-activa");

  if (ventaActiva.length === 0) {
    cont.innerHTML = `<p class="texto-suave" style="text-align:center; padding:16px 0;">Escanea un cuadro para agregarlo</p>`;
    document.getElementById("venta-total").textContent = formatearPrecio(0);
    document.getElementById("btn-cerrar-venta").disabled = true;
    return;
  }

  cont.innerHTML = ventaActiva.map(i => `
    <div class="item-carrito">
      <div>
        <p class="item-nombre">${i.nombre}</p>
        <p class="texto-suave">${formatearPrecio(i.precio)} × ${i.cantidad}</p>
      </div>
      <button onclick="quitarItemVenta('${i.ean}')" aria-label="Quitar" style="color:var(--color-error); font-size:1.2rem;">×</button>
    </div>
  `).join("");

  const total = ventaActiva.reduce((s, i) => s + i.precio * i.cantidad, 0);
  document.getElementById("venta-total").textContent = formatearPrecio(total);
  document.getElementById("btn-cerrar-venta").disabled = false;
}

function abrirCierreVenta() {
  if (ventaActiva.length === 0) return;
  abrirSheetVentas("sheet-cierre-venta");
}

async function confirmarVentaPresencial(evento) {
  evento.preventDefault();
  const nombre = document.getElementById("venta-cliente-nombre").value.trim();
  const whatsapp = document.getElementById("venta-cliente-wsp").value.trim();

  if (!nombre) {
    mostrarToastVentas("Ingresa el nombre del cliente");
    return;
  }

  const total = ventaActiva.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const registro = {
    cliente: { nombre, whatsapp },
    items: ventaActiva,
    total,
    fecha: new Date().toISOString()
  };

  try {
    if (typeof db !== "undefined") await db.collection("ventasPresenciales").add(registro);
  } catch (err) {
    console.error(err);
  }

  const canvas = generarBoleta({ cliente: nombre, whatsapp: whatsapp || "—", items: ventaActiva, total, codigoPedido: "Venta directa" });

  document.getElementById("btn-descargar-boleta-venta").onclick = () => descargarBoleta(canvas, `boleta-venta-${Date.now()}`);
  document.getElementById("btn-wsp-boleta-venta").onclick = () => {
    if (!whatsapp) { mostrarToastVentas("Cliente sin WhatsApp registrado"); return; }
    enviarBoletaPorWhatsApp(whatsapp, `Hola ${nombre}, gracias por tu compra en Vuelo Creativo. Aquí tienes tu boleta.`);
  };

  cerrarSheetVentas("sheet-cierre-venta");
  abrirSheetVentas("sheet-venta-lista");
  ventaActiva = [];
  renderVentaActiva();
}

/* Sheets locales (independientes de catalogo.js) */
function abrirSheetVentas(id) {
  document.getElementById(id).classList.add("abierto");
  document.getElementById(id + "-overlay").classList.add("abierto");
}
function cerrarSheetVentas(id) {
  document.getElementById(id).classList.remove("abierto");
  document.getElementById(id + "-overlay").classList.remove("abierto");
}

function mostrarToastVentas(texto) {
  const toast = document.getElementById("toast");
  toast.textContent = texto;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2000);
}
