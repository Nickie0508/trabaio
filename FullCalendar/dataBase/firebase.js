import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyDtGAbJ6Ws-KIY6iFobIoS_g90o5hXupO0",
authDomain: "planner-d496e.firebaseapp.com",
projectId: "planner-d496e",
storageBucket: "planner-d496e.firebasestorage.app",
messagingSenderId: "1090059052717",
appId: "1:1090059052717:web:ba2bf8dfb2f927ae454824",
measurementId: "G-3DVRN0HGCK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, firebaseConfig, app };

//confirmaçao se estao sendo iniciados
console.log("Firebase iniciado:", app);
console.log("Auth iniciado:", auth);
console.log("Firestore iniciado:", db);