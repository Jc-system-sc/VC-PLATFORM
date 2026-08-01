/* "Mis pedidos" — guardado local en el celular del cliente (no es una cuenta, es solo memoria del navegador) */

const CLAVE_MIS_PEDIDOS = "vc-mis-pedidos";

function guardarPedidoLocal(codigo) {
  const lista = obtenerPedidosLocales();
  if (!lista.includes(codigo)) {
    lista.unshift(codigo);
    localStorage.setItem(CLAVE_MIS_PEDIDOS, JSON.stringify(lista.slice(0, 8)));
  }
}

function obtenerPedidosLocales() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_MIS_PEDIDOS)) || [];
  } catch {
    return [];
  }
}
