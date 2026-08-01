/* Precios fijos de personalización — según tamaño y presentación (bolsa o caja).
   Edita o agrega tamaños aquí; el formulario los lee automáticamente. */

const PRECIOS_PERSONALIZADO = [
  { tamano: "20x20", ancho: 20, alto: 20, bolsa: 14.90, caja: 19.90 },
  { tamano: "25x25", ancho: 25, alto: 25, bolsa: 24.90, caja: 29.90 },
];

function obtenerPrecioPersonalizado(tamano, presentacion) {
  const item = PRECIOS_PERSONALIZADO.find(p => p.tamano === tamano);
  if (!item) return 0;
  return presentacion === "caja" ? item.caja : item.bolsa;
}
