/* Ícono oficial de marca — silueta de avioncito de papel con estela.
   Se usa en: splash, header, nav, mascota. Cambiar SOLO aquí si se ajusta el diseño. */

function iconoAvionVC({ tamano = 26, color = "currentColor", conEstela = false } = {}) {
  const estela = conEstela ? `
    <path d="M2 21 Q 9 19 14 17" stroke-dasharray="2.5 3" opacity="0.55"/>
    <path d="M4 24 Q 10 22.5 15.5 19.5" stroke-dasharray="2.5 3" opacity="0.3"/>
  ` : "";

  return `
  <svg width="${tamano}" height="${tamano}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="${color}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">
      ${estela}
      <path d="M29.5 3.5 L2.5 14.5 L13 17.5 L15.5 28.5 L18.7 21 L23.5 25 L29.5 3.5 Z" fill="${color}" fill-opacity="0.06"/>
      <path d="M29.5 3.5 L15.5 28.5" opacity="0.8"/>
      <path d="M29.5 3.5 L13 17.5" opacity="0.8"/>
      <path d="M18.7 21 L15.5 17.6" opacity="0.6"/>
    </g>
  </svg>`;
}

/* Versión mascota: mismo avión + ojitos pequeños */
function iconoAvionMascota({ tamano = 34, color = "#FFFFFF" } = {}) {
  return `
  <svg width="${tamano}" height="${tamano}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="${color}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">
      <path d="M29.5 3.5 L2.5 14.5 L13 17.5 L15.5 28.5 L18.7 21 L23.5 25 L29.5 3.5 Z" fill="${color}" fill-opacity="0.12"/>
      <path d="M29.5 3.5 L15.5 28.5" opacity="0.8"/>
      <path d="M29.5 3.5 L13 17.5" opacity="0.8"/>
    </g>
    <circle cx="14" cy="12.5" r="1.1" fill="${color}" stroke="none"/>
    <circle cx="19.5" cy="9.5" r="1.1" fill="${color}" stroke="none"/>
  </svg>`;
}
