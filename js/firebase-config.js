/* Reemplaza estos valores con los de tu proyecto Firebase
   (Firebase Console → Configuración del proyecto → Tus apps → SDK config) */

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// Se inicializa en cada página que lo necesite, usando Firebase SDK vía CDN (ver README)
// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();
