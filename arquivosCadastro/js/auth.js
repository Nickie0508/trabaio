// js/auth.js
import { auth } from "../../FullCalendar/dataBase/firebase.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { firebaseConfig } from "../../FullCalendar/dataBase/firebase.js";

const app = initializeApp(firebaseConfig); 
const db = getFirestore(app);

document.getElementById('formulario').addEventListener('submit', async function(event) {
  event.preventDefault(); 

  const nome = document.getElementById("nome").value;
  const idade = document.getElementById("idade").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    // cria o usuário no Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // salva dados adicionais no Firestore
    await setDoc(doc(db, "usuarios", user.uid), {
      nome: nome,
      idade: idade,
      email: email
    });

    alertPersonalizado("Cadastro realizado com sucesso! 🎉");
    setTimeout(() => {
      window.location.href = "FullCalendar/index.html"; // redireciona para o calendário
    }, 1500);

  } catch (error) {
    alertPersonalizado("Erro no cadastro:", error.message);
  }
});

//alerta personalizado
function alertPersonalizado(message) {
  const msg = document.getElementById("simpleToastMsg");
  msg.textContent = message;
  const toast = new bootstrap.Toast(document.getElementById("simpleToast"));
  toast.show();
}
