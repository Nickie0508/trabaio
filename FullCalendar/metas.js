document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formMeta");
  const listaMetas = document.getElementById("listaMetas");

  let metas = JSON.parse(localStorage.getItem("metas")) || [];

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("nomeMeta").value.trim();
    const prazo = document.getElementById("prazoMeta").value;
    let progressoManual = parseInt(document.getElementById("progressoManual").value) || 0;
    const prioridade = document.getElementById("prioridadeMeta")?.checked || false;

    if (!nome || !prazo) return;

    const novaMeta = {
      id: Date.now(),
      nome,
      prazo,
      progressoManual,
      prioridade,
      subtarefas: [],
    };

    metas.push(novaMeta);
    salvarMetas();
    renderizarMetas();
    form.reset();
  });

  function salvarMetas() {
    localStorage.setItem("metas", JSON.stringify(metas));
  }

  function diasRestantes(prazo) {
    const hoje = new Date();
    const dataLimite = new Date(prazo);
    const diff = Math.ceil((dataLimite - hoje) / (1000 * 60 * 60 * 24));
    return diff;
  }

  function atualizarProgressoPorSubtarefas(meta) {
    if (!meta.subtarefas || meta.subtarefas.length === 0) return meta.progressoManual;
    const marcadas = meta.subtarefas.filter(st => st.concluida).length;
    return Math.round((marcadas / meta.subtarefas.length) * 100);
  }

  function renderizarMetas() {
    listaMetas.innerHTML = "";

    metas.forEach(meta => {
      if (!meta.subtarefas) meta.subtarefas = [];

      const dias = diasRestantes(meta.prazo);
      const atrasada = dias < 0;
      meta.progressoManual = atualizarProgressoPorSubtarefas(meta);

      const div = document.createElement("div");
      div.className = "meta-card";
      if (meta.prioridade) div.classList.add("prioridade");

      let subtarefasHtml = meta.subtarefas.length > 0
        ? '<div class="subtarefas-lista">' +
          meta.subtarefas.map((st, i) => `
            <div class="subtarefa-item">
              <input type="checkbox" id="st-${meta.id}-${i}" ${st.concluida ? "checked" : ""} />
              <label for="st-${meta.id}-${i}">${st.nome}</label>
            </div>`).join("") +
          '</div>'
        : `<em style="font-size:0.9rem; color:#666;">Nenhuma subtarefa adicionada</em>`;

      div.innerHTML = `
        <div class="meta-header">
          <strong>✨ ${meta.nome}</strong>
          <small class="text-muted">${atrasada ? 'Atrasada' : dias + ' dias restantes'} 📅</small>
        </div>
        <div class="progress">
          <div class="progress-bar" style="width: ${meta.progressoManual}%">${meta.progressoManual}%</div>
        </div>
        ${subtarefasHtml}
        <div class="acoes">
          <button class="btn-editar" data-id="${meta.id}">✏️ Editar</button>
          <button class="btn-apagar" data-id="${meta.id}">🗑️ Apagar</button>
          <button class="btn-adicionar-subtarefa" data-metaid="${meta.id}">➕ Subtarefa</button>
          <label>
            <input type="checkbox" class="chk-prioridade" data-id="${meta.id}" ${meta.prioridade ? "checked" : ""}>
            Prioridade ⭐
          </label>
        </div>
      `;

      listaMetas.appendChild(div);

      // Eventos subtarefas
      meta.subtarefas.forEach((_, i) => {
        const checkbox = document.getElementById(`st-${meta.id}-${i}`);
        checkbox.addEventListener("change", () => {
          meta.subtarefas[i].concluida = checkbox.checked;
          meta.progressoManual = atualizarProgressoPorSubtarefas(meta);
          salvarMetas();
          renderizarMetas();
        });
      });

      // Adicionar subtarefa
      div.querySelector(".btn-adicionar-subtarefa").addEventListener("click", () => {
        const nomeSub = prompt("Nome da nova subtarefa:");
        if (nomeSub?.trim()) {
          meta.subtarefas.push({ nome: nomeSub.trim(), concluida: false });
          salvarMetas();
          renderizarMetas();
        }
      });

      // Apagar meta
      div.querySelector(".btn-apagar").addEventListener("click", () => {
        metas = metas.filter(m => m.id !== meta.id);
        salvarMetas();
        renderizarMetas();
      });

      // Editar meta (simples prompt)
      div.querySelector(".btn-editar").addEventListener("click", () => {
        const novoNome = prompt("Editar nome da meta:", meta.nome);
        if (!novoNome?.trim()) return alert("Nome inválido");
        const novoPrazo = prompt("Editar prazo (AAAA-MM-DD):", meta.prazo);
        if (!novoPrazo || isNaN(new Date(novoPrazo).getTime())) return alert("Data inválida");
        const novoProgresso = prompt("Editar progresso (%):", meta.progressoManual);
        let progressoNum = parseInt(novoProgresso);
        if (isNaN(progressoNum) || progressoNum < 0 || progressoNum > 100) progressoNum = meta.progressoManual;

        meta.nome = novoNome.trim();
        meta.prazo = novoPrazo;
        meta.progressoManual = progressoNum;

        salvarMetas();
        renderizarMetas();
      });

      // Prioridade
      div.querySelector(".chk-prioridade").addEventListener("change", (e) => {
        meta.prioridade = e.target.checked;
        salvarMetas();
        renderizarMetas();
      });
    });
  }

  renderizarMetas();
});

