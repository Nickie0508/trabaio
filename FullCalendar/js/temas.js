const selectTemas = document.getElementById("selectTemas");

const temaSalvo = localStorage.getItem("temaSelecionado");
if (temaSalvo && temaSalvo !== "temaPadrao") {
    document.body.classList.add(temaSalvo);
    selectTemas.value = temaSalvo;
} else {
    selectTemas.value = "temaPadrao";
}

selectTemas.addEventListener("change", function() {
    const valor = this.value;

    document.body.classList.forEach(cls => {
        if (cls.startsWith("tema")) {
            document.body.classList.remove(cls);
        }
    });

    if (valor !== "temaPadrao") {
        document.body.classList.add(valor);
    }

    localStorage.setItem("temaSelecionado", valor);
});
