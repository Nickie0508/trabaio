
const form = document.getElementById("formTransacao");
const lista = document.getElementById("listaTransacoes");
const limiteInput = document.getElementById("limiteGasto");
const barraProgresso = document.getElementById("barraProgresso");

let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

function atualizarLista() {
  lista.innerHTML = "";
  let totalSaidas = 0;

  transacoes.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.innerHTML = \`
      <span>\${item.tipo === "entrada" ? "⬆" : "⬇"} \${item.categoria}</span>
      <span class="\${item.tipo}">R$ \${item.valor.toFixed(2)}</span>
    \`;
    lista.appendChild(li);

    if (item.tipo === "saida") totalSaidas += item.valor;
  });

  const limite = parseFloat(limiteInput.value);
  if (!isNaN(limite) && limite > 0) {
    const porcentagem = Math.min(100, (totalSaidas / limite) * 100);
    barraProgresso.style.width = porcentagem + "%";
    barraProgresso.textContent = porcentagem.toFixed(0) + "%";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const tipo = document.getElementById("tipo").value;
  const categoria = document.getElementById("categoria").value;
  const valor = parseFloat(document.getElementById("valor").value);

  if (!tipo || !categoria || isNaN(valor)) return;

  transacoes.push({ tipo, categoria, valor });
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
  form.reset();
  atualizarLista();
});

limiteInput.addEventListener("input", atualizarLista);

atualizarLista();
