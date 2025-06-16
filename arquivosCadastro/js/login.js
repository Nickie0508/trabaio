import { auth } from "../../FullCalendar/dataBase/firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    alertPersonalizado("Login realizado com sucesso!");
    
    setTimeout(() => {
        window.location.href = "FullCalendar/index.html";
    }, 2000);
  
  } catch (error) {
    alertPersonalizado("Erro ao fazer login: " + error.message);
  }
});

//alerta personalizado
function alertPersonalizado(message) {
  const msg = document.getElementById("simpleToastMsg");
  msg.textContent = message;
  const toast = new bootstrap.Toast(document.getElementById("simpleToast"));
  toast.show();
}