/* Genera un comprobante visual (canvas) con header del negocio, ítems y total.
   Se puede descargar como imagen o abrir directo en WhatsApp. */

function generarBoleta({ cliente, whatsapp, items, total, codigoPedido }) {
  const canvas = document.createElement("canvas");
  const ancho = 380, alto = 200 + items.length * 30;
  canvas.width = ancho * 2; // retina
  canvas.height = alto * 2;
  const ctx = canvas.getContext("2d");
  ctx.scale(2, 2);

  // Fondo
  ctx.fillStyle = "#F6FAF9";
  ctx.fillRect(0, 0, ancho, alto);

  // Header marino
  ctx.fillStyle = "#16283F";
  ctx.fillRect(0, 0, ancho, 64);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "600 20px 'Baloo 2', sans-serif";
  ctx.fillText("Vuelo Creativo", 20, 36);
  ctx.font = "12px 'Inter', sans-serif";
  ctx.fillStyle = "#9BB0C2";
  ctx.fillText("Comprobante de pedido", 20, 54);

  // Datos cliente
  ctx.fillStyle = "#14263D";
  ctx.font = "600 14px 'Inter', sans-serif";
  ctx.fillText(`Cliente: ${cliente}`, 20, 90);
  ctx.font = "12px 'Inter', sans-serif";
  ctx.fillStyle = "#6B7C8C";
  ctx.fillText(`WhatsApp: ${whatsapp}`, 20, 108);
  ctx.fillText(`Pedido: ${codigoPedido}`, 20, 124);
  ctx.fillText(`Fecha: ${new Date().toLocaleDateString("es-PE")}`, 20, 140);

  // Línea
  ctx.strokeStyle = "#DCE7E4";
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(20, 154);
  ctx.lineTo(ancho - 20, 154);
  ctx.stroke();
  ctx.setLineDash([]);

  // Ítems
  let y = 176;
  ctx.font = "13px 'Inter', sans-serif";
  items.forEach(item => {
    ctx.fillStyle = "#14263D";
    ctx.fillText(`${item.cantidad}x ${item.nombre}`, 20, y);
    ctx.fillStyle = "#2E8B7F";
    ctx.font = "600 13px 'Inter', sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(formatearPrecio(item.precio * item.cantidad), ancho - 20, y);
    ctx.textAlign = "left";
    ctx.font = "13px 'Inter', sans-serif";
    y += 28;
  });

  // Total
  ctx.strokeStyle = "#DCE7E4";
  ctx.beginPath();
  ctx.moveTo(20, y + 6);
  ctx.lineTo(ancho - 20, y + 6);
  ctx.stroke();

  ctx.font = "700 16px 'Inter', sans-serif";
  ctx.fillStyle = "#14263D";
  ctx.fillText("Total", 20, y + 32);
  ctx.fillStyle = "#2E8B7F";
  ctx.textAlign = "right";
  ctx.fillText(formatearPrecio(total), ancho - 20, y + 32);
  ctx.textAlign = "left";

  return canvas;
}

function descargarBoleta(canvas, nombreArchivo = "boleta-vuelo-creativo") {
  const link = document.createElement("a");
  link.download = `${nombreArchivo}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function enviarBoletaPorWhatsApp(numero, mensaje) {
  const numeroLimpio = numero.replace(/\D/g, "");
  const url = `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}
