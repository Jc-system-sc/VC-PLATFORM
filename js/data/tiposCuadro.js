/* Tipos de cuadro para venta presencial — asociar cada EAN físico a un tipo/precio.
   Edita el campo 'ean' con el código real impreso en cada cuadro. */

const TIPOS_CUADRO = [
  { ean: "7751234500011", tipo: "Chico 20x20",  precio: 60 },
  { ean: "7751234500028", tipo: "Mediano 30x30", precio: 85 },
  { ean: "7751234500035", tipo: "Grande 40x40",  precio: 110 },
  { ean: "7751234500042", tipo: "Extra grande 50x50", precio: 140 }
];

function buscarPorEAN(codigo) {
  return TIPOS_CUADRO.find(t => t.ean === codigo) || null;
}
