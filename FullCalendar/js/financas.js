import { auth, db } from "../dataBase/firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Formatador de moeda brasileira
const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

// Selecionar elementos do HTML
const limiteInput = document.getElementById('limiteGasto');
const barraProgresso = document.getElementById('barraProgresso');
const listaTransacoes = document.getElementById('listaTransacoes');
const btnSalvarLimite = document.getElementById('salvarLimite');

// Carregar valor salvo no Local Storage quando abrir a página
document.addEventListener('DOMContentLoaded', () => {
  const limiteSalvo = localStorage.getItem('limiteGasto');
  if (limiteSalvo) {
    limiteInput.value = limiteSalvo;
  }
});

// Salvar no Local Storage quando clicar no botão
btnSalvarLimite.addEventListener('click', () => {
  const limite = parseFloat(limiteInput.value);
  if (!isNaN(limite) && limite > 0) {
    localStorage.setItem('limiteGasto', limite);
  }
});


// Monitorar autenticação
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const userId = user.uid;
    const eventos = await carregarEventosComValor(userId);
    renderizarLista(eventos);

    // Atualiza barra sempre que o usuário muda o limite
    limiteInput.addEventListener('input', () => {
      atualizarBarra(eventos);
    });

  } else {
    window.location.href = "../index.html"; // Redireciona se não estiver logado
  }
});

// Carregar eventos que possuem valor preenchido
async function carregarEventosComValor(userId) {
  const eventosComValor = [];
  try {
    const querySnapshot = await getDocs(collection(db, "users", userId, "tasks"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.valor && !isNaN(data.valor)) {
        eventosComValor.push({
          id: doc.id,
          title: data.title,
          start: data.start,
          valor: data.valor
        });
      }
    });
    return eventosComValor;
  } catch (error) {
    console.error("Erro ao carregar eventos:", error);
    return [];
  }
}

// Renderizar a lista de transações na interface
function renderizarLista(eventos) {
  listaTransacoes.innerHTML = "";

  if (eventos.length === 0) {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = "Nenhuma transação encontrada.";
    listaTransacoes.appendChild(li);
    atualizarBarra(eventos);
    return;
  }

  eventos.forEach(evento => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';

    const data = new Date(evento.start).toLocaleDateString();

    li.innerHTML = `
      <div>
        <strong>${evento.title}</strong><br>
        <small>${data}</small>
      </div>
      <span>${formatadorMoeda.format(evento.valor)}</span>
    `;

    listaTransacoes.appendChild(li);
  });

  atualizarBarra(eventos);
}

// Atualizar a barra de progresso
function atualizarBarra(eventos) {
  const limite = parseFloat(limiteInput.value);
  const total = eventos.reduce((acc, ev) => acc + (parseFloat(ev.valor) || 0), 0);

  if (!limite || limite <= 0) {
    barraProgresso.style.width = '0%';
    barraProgresso.textContent = '0%';
    barraProgresso.classList.remove('bg-success', 'bg-warning', 'bg-danger');
    return;
  }

  const percentual = Math.min((total / limite) * 100, 100).toFixed(0);

  barraProgresso.style.width = `${percentual}%`;
  barraProgresso.setAttribute('aria-valuenow', percentual);
  barraProgresso.textContent = `${percentual}%`;

  // Definir cor da barra conforme o percentual
  barraProgresso.classList.remove('bg-success', 'bg-warning', 'bg-danger');
  if (percentual < 70) {
    barraProgresso.classList.add('bg-success');
  } else if (percentual < 100) {
    barraProgresso.classList.add('bg-warning');
  } else {
    barraProgresso.classList.add('bg-danger');
  }
}
