# Vuelo Creativo — PWA

## Estado del proyecto
**Proyecto completo.** Landing, inicio, catálogo + carrito + checkout + boleta, configurador 3D, rastreo de pedido,
panel admin (pedidos + estado + WhatsApp), ventas presenciales (escaneo EAN) y pestaña "Más" con funciones de retención:
- "Mis pedidos" guardados localmente en el celular del cliente (acceso directo sin re-escribir código)
- Botón para instalar la PWA en el celular
- Galería de inspiración, testimonios, preguntas frecuentes
- Contacto directo por WhatsApp y botón de compartir la app
- Modo oscuro

### Acceso admin
- **Gesto secreto:** toca 5 veces rápido (menos de 2 segundos entre toques) el avioncito del logo — en el header de Inicio/Catálogo/Pedidos/Más, o en el ícono del hero del landing. Te redirige a `admin-login.html`. No hay ningún botón visible.
- Usuario/clave editables en `js/data/admin-config.js`
- Sesión con `sessionStorage` (se cierra al cerrar el navegador)
- Desde el panel (`admin-panel.html`) se accede a "Ventas presenciales" (`ventas.html`)

### Flujo de aceptación de pedidos
Todo pedido nuevo entra con estado **"Por revisar"**. El cliente ve "tu pedido está en revisión" en la confirmación.
Desde el panel admin puedes **Aceptar** (pasa a "Confirmado" y sigue el flujo normal) o **Rechazar** (con motivo, que se le envía al cliente por WhatsApp automáticamente).

### Exportar a Excel
Botón "Exportar pedidos a Excel" en el panel admin — descarga un `.xlsx` con todos los datos de cada pedido (cliente, personalización completa, pago, estado, etc.), útil como respaldo además de Firestore.

**Pendiente (opcional / fase 2):** notificaciones push reales con Firebase Cloud Messaging (la base ya está en `service-worker.js`, falta la Cloud Function que las dispare).

## Estructura de Firestore (colecciones sugeridas)

### `pedidos` (unifica personalizados y de catálogo)
```
{
  codigo: "VC-AB3KX",
  tipo: "personalizado" | "catalogo",
  cliente: { nombre, whatsapp, direccion },
  fechaEntrega: "2026-08-05",
  ocasion: "Cumpleaños",
  tamano: "30x30",
  color: "#...",
  iniciales: "J&S",           // solo si personalizado
  nombreDibujo: "Pareja...",  // solo si personalizado
  codigoCatalogo: "CAT-002",  // solo si es del catálogo
  pago: { metodo: "yape", codigoOperacion: "123456" },
  total: 110,
  estado: "confirmado" | "en_proceso" | "elaboracion" | "control_calidad" | "listo",
  creadoEn: timestamp
}
```

### `ventasPresenciales`
```
{
  cliente: { nombre, whatsapp },
  items: [{ ean, tipo, precio }],
  total: 145,
  fecha: timestamp
}
```

### `config`
```
{ contadorCuadrosEntregados: 120 }
```

## Cómo continuar en VS Code
1. Abre la carpeta `vuelo-creativo/` completa.
2. Instala la extensión "Live Server" para previsualizar (`index.html` → clic derecho → Open with Live Server).
3. Crea tu proyecto en [Firebase Console](https://console.firebase.google.com), copia tus credenciales en `js/firebase-config.js`.
4. Sube el proyecto a GitHub:
   ```
   git init
   git add .
   git commit -m "Base del proyecto Vuelo Creativo"
   git branch -M main
   git remote add origin TU_URL_DE_GITHUB
   git push -u origin main
   ```
5. Para publicarlo como PWA real, usa GitHub Pages o Firebase Hosting (gratis).

## Próximo paso recomendado
Construir `personalizar.html` (el configurador 3D) — es el módulo más complejo, conviene hacerlo con calma.
