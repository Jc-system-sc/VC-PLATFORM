/* Exporta pedidosCache (ya cargado desde Firestore) a un archivo .xlsx */

function exportarPedidosExcel() {
  if (!pedidosCache || pedidosCache.length === 0) {
    mostrarToastAdmin("No hay pedidos para exportar");
    return;
  }

  const filas = pedidosCache.map(p => ({
    "Código": p.codigo,
    "Tipo": p.tipo === "personalizado" ? "Personalizado" : "Catálogo",
    "Cliente": p.cliente?.nombre || "",
    "WhatsApp": p.cliente?.whatsapp || "",
    "Dirección": p.cliente?.direccion || "",
    "Fecha entrega": p.fechaEntrega || "",
    "Ocasión": p.ocasion || "",
    "Tamaño": p.tamano || "",
    "Presentación": p.presentacion || "",
    "Color": p.color || "",
    "Iniciales": p.iniciales || "",
    "Diseño pedido": p.nombreDibujo || "",
    "Método de pago": p.pago?.metodo || "",
    "Código de operación": p.pago?.codigoOperacion || "",
    "Total (S/)": p.total || 0,
    "Estado": LABELS_ESTADO[p.estado] || p.estado,
    "Motivo rechazo": p.motivoRechazo || "",
    "Creado": p.creadoEn || "",
  }));

  const hoja = XLSX.utils.json_to_sheet(filas);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Pedidos");

  const fechaArchivo = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(libro, `pedidos-vuelo-creativo-${fechaArchivo}.xlsx`);
}

function mostrarToastAdmin(texto) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = texto;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2200);
}
