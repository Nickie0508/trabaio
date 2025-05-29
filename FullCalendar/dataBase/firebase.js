// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyDtGAbJ6Ws-KIY6iFobIoS_g90o5hXupO0",
authDomain: "planner-d496e.firebaseapp.com",
projectId: "planner-d496e",
storageBucket: "planner-d496e.firebasestorage.app",
messagingSenderId: "1090059052717",
appId: "1:1090059052717:web:ba2bf8dfb2f927ae454824",
measurementId: "G-3DVRN0HGCK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o módulo de autenticação
const auth = getAuth(app);

// Exporte o auth para ser usado em outros arquivos
export { auth };

//apenas debug do firebase, pode ser removido depois
console.log("Firebase iniciado:", app);
console.log("Auth iniciado:", auth);