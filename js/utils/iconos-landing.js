/* Íconos de línea, estilo propio, coherentes con el trazo del avioncito */

const ICONOS_LANDING = {
  disenar: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16l8-8 4 4-8 8H4v-4z"/><path d="M13 5l3 3"/></svg>`,
  pagar: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10.5h18"/><path d="M7 15h3"/></svg>`,
  entregar: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l7 7L21 5"/></svg>`,
  unico: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.6 6.6L21 11l-6.4 2.4L12 20l-2.6-6.6L3 11l6.4-2.4L12 2z"/></svg>`,
  tiempo: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>`,
  seguimiento: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0112 3a7 7 0 017 6.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.2"/></svg>`,
};

function pintarIconosLanding() {
  document.querySelectorAll("[data-icono]").forEach(el => {
    const clave = el.getAttribute("data-icono");
    if (ICONOS_LANDING[clave]) el.innerHTML = ICONOS_LANDING[clave];
  });
}

/* Revela secciones al hacer scroll (fade + slide sutil) */
function activarRevelado() {
  const elementos = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visible");
        obs.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  elementos.forEach(el => obs.observe(el));
}
