const temasContainer = document.getElementById("temasContainer")

temasContainer.innerHTML = `
        <select id="selectTemas" class="form-select" aria-label="Default select example">
          <option selected disabled>Temas</option>
          <option value="temaPadrao">Padrão</option>
          <option value="temaDarkMode">Dark</option>
          <option value="temaFuturista">Futurista</option>
          <option value="temaSunset">Sunset</option>
          <option value="temaPsicodelico">Psicodélico</option>
          <option value="temaGalaxy">Galaxy</option>
          <option value="temaNature">Nature</option>
          <option value="temaRoxo">Roxo</option>
        </select>`;

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
