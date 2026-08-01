/* Carrito genérico — usado en catálogo online y ventas presenciales.
   Cada ítem: { id, nombre, precio, cantidad, codigo } */

const CLAVE_CARRITO = "vc-carrito";

function obtenerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
  } catch {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  actualizarBadgeCarrito();
}

function agregarAlCarrito(item) {
  const carrito = obtenerCarrito();
  const existente = carrito.find(i => i.id === item.id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ ...item, cantidad: 1 });
  }
  guardarCarrito(carrito);
  vibrar(15);
}

function cambiarCantidad(id, delta) {
  let carrito = obtenerCarrito();
  carrito = carrito.map(i => i.id === id ? { ...i, cantidad: i.cantidad + delta } : i).filter(i => i.cantidad > 0);
  guardarCarrito(carrito);
}

function eliminarDelCarrito(id) {
  const carrito = obtenerCarrito().filter(i => i.id !== id);
  guardarCarrito(carrito);
}

function vaciarCarrito() {
  localStorage.removeItem(CLAVE_CARRITO);
  actualizarBadgeCarrito();
}

function totalCarrito() {
  return obtenerCarrito().reduce((sum, i) => sum + i.precio * i.cantidad, 0);
}

function cantidadTotalCarrito() {
  return obtenerCarrito().reduce((sum, i) => sum + i.cantidad, 0);
}

function actualizarBadgeCarrito() {
  const badge = document.getElementById("carrito-badge");
  if (!badge) return;
  const total = cantidadTotalCarrito();
  badge.textContent = total;
  badge.style.display = total > 0 ? "flex" : "none";
}
