/* Configurador 3D — Three.js r128
   Genera el cuadro en vivo según tamaño, color e iniciales.
   Frente: mosaico de iniciales (canvas, sin imágenes).
   Atrás: sticker de código de barras referencial (esquina inferior). */

let escena, camara, renderer, cuboMesh, luz;
let rotY = 0.4, rotX = -0.15;
let arrastrando = false, ultimoX = 0, ultimoY = 0;

const ESTADO_CONFIG = {
  tamano: "20x20",
  ancho: 20,
  alto: 20,
  presentacion: "bolsa",
  color: "#E9D8C3",
  iniciales: "V&C",
};

function iniciarEscena3D() {
  const cont = document.getElementById("canvas-3d");
  const ancho = cont.clientWidth, alto = cont.clientHeight;

  escena = new THREE.Scene();
  camara = new THREE.PerspectiveCamera(38, ancho / alto, 0.1, 100);
  camara.position.set(0, 0, 6);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(ancho, alto);
  renderer.setPixelRatio(window.devicePixelRatio);
  cont.innerHTML = "";
  cont.appendChild(renderer.domElement);

  luz = new THREE.DirectionalLight(0xffffff, 1);
  luz.position.set(2, 3, 4);
  escena.add(luz);
  escena.add(new THREE.AmbientLight(0xffffff, 0.65));

  construirCuadro();
  activarRotacionTactil(renderer.domElement);
  animar3D();

  window.addEventListener("resize", () => {
    const w = cont.clientWidth, h = cont.clientHeight;
    camara.aspect = w / h;
    camara.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

function construirCuadro() {
  if (cuboMesh) escena.remove(cuboMesh);

  const escala = 2.6;
  const proporcion = ESTADO_CONFIG.alto / ESTADO_CONFIG.ancho;
  const geo = new THREE.BoxGeometry(escala, escala * proporcion, 0.18);

  const texturaFrente = new THREE.CanvasTexture(generarTexturaMosaico());
  const materialFrente = new THREE.MeshStandardMaterial({ map: texturaFrente });
  const materialLados = new THREE.MeshStandardMaterial({ color: ESTADO_CONFIG.color });
  const texturaAtras = new THREE.CanvasTexture(generarTexturaTrasera());
  const materialAtras = new THREE.MeshStandardMaterial({ map: texturaAtras });

  // Orden de materiales BoxGeometry: [derecha, izquierda, arriba, abajo, frente, atrás]
  const materiales = [materialLados, materialLados, materialLados, materialLados, materialFrente, materialAtras];

  cuboMesh = new THREE.Mesh(geo, materiales);
  cuboMesh.rotation.y = rotY;
  cuboMesh.rotation.x = rotX;
  escena.add(cuboMesh);
}

/* Mosaico de iniciales — patrón repetido, sin subir imágenes */
function generarTexturaMosaico() {
  const canvas = document.createElement("canvas");
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = ESTADO_CONFIG.color;
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = "rgba(22,40,63,0.16)";
  ctx.font = "600 34px 'Baloo 2', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const texto = (ESTADO_CONFIG.iniciales || "V&C").toUpperCase();
  const paso = 90;
  let fila = 0;
  for (let y = -paso; y < 512 + paso; y += paso) {
    const offsetX = (fila % 2 === 0) ? 0 : paso / 2;
    for (let x = -paso; x < 512 + paso; x += paso) {
      ctx.save();
      ctx.translate(x + offsetX, y);
      ctx.rotate(-0.4);
      ctx.fillText(texto, 0, 0);
      ctx.restore();
    }
    fila++;
  }

  return canvas;
}

/* Trasera: color liso + sticker de código de barras esquina inferior */
function generarTexturaTrasera() {
  const canvas = document.createElement("canvas");
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = ESTADO_CONFIG.color;
  ctx.fillRect(0, 0, 512, 512);

  // Sticker
  const sx = 340, sy = 420, sw = 140, sh = 60;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(sx, sy, sw, sh);
  ctx.strokeStyle = "#DCE7E4";
  ctx.strokeRect(sx, sy, sw, sh);

  ctx.fillStyle = "#16283F";
  let bx = sx + 8;
  while (bx < sx + sw - 8) {
    const grosor = Math.random() > 0.5 ? 2 : 4;
    ctx.fillRect(bx, sy + 8, grosor, sh - 24);
    bx += grosor + 3;
  }
  ctx.font = "10px 'Inter', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("VUELO CREATIVO", sx + sw / 2, sy + sh - 6);

  return canvas;
}

/* ===== Rotación táctil (frente / atrás) ===== */
function activarRotacionTactil(el) {
  const inicio = (x, y) => { arrastrando = true; ultimoX = x; ultimoY = y; };
  const mover = (x, y) => {
    if (!arrastrando) return;
    rotY += (x - ultimoX) * 0.01;
    rotX += (y - ultimoY) * 0.006;
    rotX = Math.max(-0.6, Math.min(0.6, rotX));
    ultimoX = x; ultimoY = y;
    if (cuboMesh) { cuboMesh.rotation.y = rotY; cuboMesh.rotation.x = rotX; }
  };
  const fin = () => arrastrando = false;

  el.addEventListener("touchstart", (e) => inicio(e.touches[0].clientX, e.touches[0].clientY));
  el.addEventListener("touchmove", (e) => { mover(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); }, { passive: false });
  el.addEventListener("touchend", fin);

  el.addEventListener("mousedown", (e) => inicio(e.clientX, e.clientY));
  window.addEventListener("mousemove", (e) => mover(e.clientX, e.clientY));
  window.addEventListener("mouseup", fin);
}

function animar3D() {
  requestAnimationFrame(animar3D);
  renderer.render(escena, camara);
}

/* ===== Conexión con el formulario ===== */
function actualizarTamano(tamano) {
  const info = PRECIOS_PERSONALIZADO.find(p => p.tamano === tamano);
  if (!info) return;
  ESTADO_CONFIG.tamano = tamano;
  ESTADO_CONFIG.ancho = info.ancho;
  ESTADO_CONFIG.alto = info.alto;
  construirCuadro();
  actualizarPrecioEnVivo();
}
function actualizarPresentacion(presentacion) {
  ESTADO_CONFIG.presentacion = presentacion;
  actualizarPrecioEnVivo();
}
function actualizarColor(hex) {
  ESTADO_CONFIG.color = hex;
  construirCuadro();
}
function actualizarIniciales(texto) {
  ESTADO_CONFIG.iniciales = texto || "V&C";
  construirCuadro();
}

function actualizarPrecioEnVivo() {
  const precio = obtenerPrecioPersonalizado(ESTADO_CONFIG.tamano, ESTADO_CONFIG.presentacion);
  const el = document.getElementById("precio-vivo");
  if (el) el.textContent = formatearPrecio(precio);
  return precio;
}

/* ===== Checkout del pedido personalizado ===== */
function seleccionarColor(hex, btn) {
  document.querySelectorAll(".swatch").forEach(s => s.classList.remove("activo"));
  btn.classList.add("activo");
  actualizarColor(hex);
}

function abrirCheckoutPersonalizado() {
  const ocasion = document.getElementById("p-ocasion").value;
  const fecha = document.getElementById("p-fecha").value;
  const dibujo = document.getElementById("p-dibujo").value.trim();

  if (!fecha || !dibujo) {
    mostrarToast("Completa la fecha y el diseño deseado");
    return;
  }

  document.getElementById("checkout-fecha").min = fechaMinimaEntrega();
  document.getElementById("checkout-fecha").value = fecha;
  abrirSheet("sheet-checkout");
}

async function confirmarPedidoPersonalizado(evento) {
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

  const precio = actualizarPrecioEnVivo();
  const codigoPedido = generarCodigoPedido();
  const itemDescriptivo = `Cuadro personalizado ${ESTADO_CONFIG.tamano}cm (${ESTADO_CONFIG.presentacion})`;

  const pedido = {
    codigo: codigoPedido,
    tipo: "personalizado",
    cliente: { nombre, whatsapp, direccion },
    fechaEntrega: fecha,
    ocasion: document.getElementById("p-ocasion").value,
    tamano: ESTADO_CONFIG.tamano,
    presentacion: ESTADO_CONFIG.presentacion,
    color: ESTADO_CONFIG.color,
    iniciales: ESTADO_CONFIG.iniciales,
    nombreDibujo: document.getElementById("p-dibujo").value.trim(),
    pago: { metodo, codigoOperacion },
    total: precio,
    estado: "confirmado",
    creadoEn: new Date().toISOString()
  };

  await guardarPedidoFirestore(pedido);

  cerrarSheet("sheet-checkout");
  guardarPedidoLocal(codigoPedido);
  mostrarConfirmacion(codigoPedido, {
    cliente: nombre,
    whatsapp,
    items: [{ nombre: itemDescriptivo, cantidad: 1, precio }],
    total: precio
  });
}
