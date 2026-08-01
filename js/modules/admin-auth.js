/* Autenticación simple del admin — sesión guardada en sessionStorage
   (se cierra sola al cerrar el navegador). Sin Firebase Auth. */

const CLAVE_SESION_ADMIN = "vc-admin-sesion";

function intentarLogin(evento) {
  evento.preventDefault();
  const usuario = document.getElementById("admin-usuario").value.trim();
  const clave = document.getElementById("admin-clave").value;

  if (usuario === ADMIN_CREDENCIALES.usuario && clave === ADMIN_CREDENCIALES.clave) {
    sessionStorage.setItem(CLAVE_SESION_ADMIN, "activa");
    location.href = "admin-panel.html";
  } else {
    document.getElementById("login-error").style.display = "block";
    vibrar(20);
  }
}

/* Llamar al inicio de cada página protegida */
function protegerPaginaAdmin() {
  if (sessionStorage.getItem(CLAVE_SESION_ADMIN) !== "activa") {
    location.href = "admin-login.html";
  }
}

function cerrarSesionAdmin() {
  sessionStorage.removeItem(CLAVE_SESION_ADMIN);
  location.href = "admin-login.html";
}
