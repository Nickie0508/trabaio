import { auth } from "../dataBase/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// verifica se o user esta logado, se não, volta para tela de login
onAuthStateChanged(auth, (user) => {
    if (!user) {
    window.location.href = "../index.html"; 
    }
});

// botão para fazer logout
const botaoSair = document.getElementById("sair");
const botaoConfirmarSair = document.getElementById("botaoConfirmarSair");
const modalDeslogar = new bootstrap.Modal(document.getElementById("modalDeslogar"));

botaoSair.addEventListener("click", () => {
    modalDeslogar.show();
});

botaoConfirmarSair.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            window.location.href = "../index.html";
        })
        .catch((error) => {
            alert("Erro ao sair: " + error.message);
        });
});
