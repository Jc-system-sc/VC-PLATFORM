/* Mascota guía: avioncito con ojitos, desplazable, mensajes cortos.
   Uso: <div id="mascota"></div> + iniciarMascota(["Mensaje 1", "Mensaje 2"]) */

function iniciarMascota(mensajes = []) {
  const cont = document.getElementById("mascota");
  if (!cont || mensajes.length === 0) return;

  cont.innerHTML = `
    <div class="mascota-burbuja" id="mascota-burbuja">
      <p id="mascota-texto"></p>
      <button id="mascota-cerrar" aria-label="Cerrar guía">×</button>
    </div>
    <button class="mascota-avion" id="mascota-avion" aria-label="Guía">
      ${iconoAvionMascota({ tamano: 26 })}
    </button>
  `;

  let i = 0;
  const texto = document.getElementById("mascota-texto");
  const burbuja = document.getElementById("mascota-burbuja");
  texto.textContent = mensajes[0];

  document.getElementById("mascota-avion").addEventListener("click", () => {
    i = (i + 1) % mensajes.length;
    texto.textContent = mensajes[i];
    burbuja.classList.add("visible");
    vibrar(10);
  });

  document.getElementById("mascota-cerrar").addEventListener("click", (e) => {
    e.stopPropagation();
    burbuja.classList.remove("visible");
  });

  hacerArrastrable(document.getElementById("mascota-avion"));

  setTimeout(() => burbuja.classList.add("visible"), 2000);
}

function hacerArrastrable(el) {
  let activo = false, offX = 0, offY = 0;
  const mover = (x, y) => { el.style.left = x + "px"; el.style.top = y + "px"; el.style.right = "auto"; el.style.bottom = "auto"; el.style.position = "fixed"; };

  el.addEventListener("touchstart", (e) => {
    activo = true;
    const t = e.touches[0];
    offX = t.clientX - el.offsetLeft;
    offY = t.clientY - el.offsetTop;
  });
  el.addEventListener("touchmove", (e) => {
    if (!activo) return;
    const t = e.touches[0];
    mover(t.clientX - offX, t.clientY - offY);
  });
  el.addEventListener("touchend", () => activo = false);
}
