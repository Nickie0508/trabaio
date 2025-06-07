const botaoTema = document.getElementById("mudarTema");
const iconeLua = document.getElementById("temaEscuro");
const iconeSol = document.getElementById("temaClaro");

iconeSol.style.display = "none";

if (localStorage.getItem("tema") === "escuro") {
    ativarModoEscuro();
}

botaoTema.addEventListener("click", () => {
    document.body.classList.toggle("modo-escuro");

    const modoAtivo = document.body.classList.contains("modo-escuro");

    if (modoAtivo) {
        ativarModoEscuro();
        localStorage.setItem("tema", "escuro");
    }else {
        ativarModoClaro();
        localStorage.setItem("tema", "claro");
    }
});

function ativarModoEscuro() {
    document.body.classList.add("modo-escuro");
    iconeLua.style.display = "none";
    iconeSol.style.display = "inline";
}

function ativarModoClaro() {
    document.body.classList.remove("modo-escuro");
    iconeLua.style.display = "inline";
    iconeSol.style.display = "none";
}
