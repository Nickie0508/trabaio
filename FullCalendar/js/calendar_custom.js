
import { auth, db } from "../dataBase/firebase.js";
import { doc, setDoc, getDocs, collection, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


let calendar;
let selectedEvent = null;
let editingEvent = null;

document.addEventListener('DOMContentLoaded', function() {

    // inicializa o editor de texto Quill
let quill = new Quill('#eventDescription', {
  theme: 'snow',
  placeholder: 'Digite a descrição do evento (opcional)',
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link']
    ]
  }
});

    // Carregar eventos quando abrir o calendário
    auth.onAuthStateChanged(async (user) => {
  if (user) {
    const userId = user.uid;
    const eventos = await carregarEventosFirestore(userId);

    eventos.forEach(ev => {
      calendar.addEvent({
        id: ev.id,
        title: ev.title,
        start: ev.start,
        end: ev.end,
        backgroundColor: ev.backgroundColor,
        extendedProps: {
          description: ev.description,
          done: ev.done,
          valor: ev.valor
        }
      });
    });
  } else {
    window.location.href = "../index.html"; // se nao logado redireciona
  }
});



    const calendarEl = document.getElementById('calendar');

        calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        themeSystem: 'bootstrap5',

              headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },

        firstDay: 1,        //segunda como primeiro dia da semana
        navLinks: true,     //permite clicar nos numeros dos dias da semana enavegar para aquela data
        selectable: true,   //Permite clicar e arrastar sobre datas ou horários para selecionar um intervalo
        selectMirror: true, // clicar arrastar vários dias para criar um evento mostra que foram selecionadas
        editable: true,     //Permite que os usuários arrastem e soltem eventos
        dayMaxEvents: 3,    //se tiver muitos eventos em uma dia o calendario mais mostras um "+"
        selectOverlap: true, //permite criar eventos em dias que já existe outros eventos

      
        //MODAL para criar eventos
        select: function(info){
          // Impedir criação no passado
          if (info.start < new Date().setHours(0, 0, 0, 0)) {
            alertPersonalizado("Não é possível criar eventos no passado.")
            return;
          }

        document.getElementById('eventStart').value = info.startStr + "T00:00";
        document.getElementById('eventEnd').value = info.endStr + "T00:00";
        //mostrar o modal na tela
          const eventModal = new bootstrap.Modal(document.getElementById('eventModal'));
          eventModal.show();
        },
      
        //MODAL pra ver eventos
        eventClick: function(info) {
        const event = info.event;
        // Preencher o modal de visualização
        document.getElementById("viewEventTitle").textContent = event.title;
        document.getElementById("viewEventValue").textContent = event.extendedProps.valor ? formatadorMoeda.format(event.extendedProps.valor) : "";
        document.getElementById("viewEventStart").textContent = new Date(event.start).toLocaleString();
        document.getElementById("viewEventEnd").textContent = new Date(event.end).toLocaleString();
        document.getElementById("viewEventDescription").innerHTML = event.extendedProps.description || "";

        //carregar valor do checkbox
        const checkbox = document.getElementById("checkFeito");
        checkbox.checked = event.extendedProps.done || false;
        checkbox.onchange = () => {
          event.setExtendedProp("done", checkbox.checked);
          calendar.refetchEvents(); //  Atualiza os eventos e chama o eventDidMount
        };

        const viewModal = new bootstrap.Modal(document.getElementById("viewEventModal"));
        viewModal.show();

        selectedEvent = event;
      },

      //ativa quando um evento e arrastado
      eventDrop: async function(info) {
        const now = new Date();
        if (info.event.start < now.setHours(0, 0, 0, 0)) {
          info.revert();
          // Mostrar o toast
          alertPersonalizado("Não é possível mover um evento para o passado.");
          return;
        }

        // salva nova posição no firestore
        const user = auth.currentUser;
        if (!user) {
          alert("Usuário não está logado.");
          return;
        }

        const userId = user.uid;
        const eventId = info.event.id;

        const eventData = {
          title: info.event.title,
          start: info.event.start.toISOString(),
          end: info.event.end ? info.event.end.toISOString() : info.event.start.toISOString(),
          backgroundColor: info.event.backgroundColor,
          description: info.event.extendedProps.description || "",
          done: info.event.extendedProps.done || false,
          valor: info.event.extendedProps.valor || null
        };

        try {
          await salvarEventoFirestore(userId, eventId, eventData);
          alertPersonalizado("Evento atualizado com sucesso.");
        } catch (error) {
          console.error("Erro ao atualizar evento no Firestore:", error);
          alertPersonalizado("Erro ao atualizar evento.");
          info.revert(); // Se falhar desfaz o movimento
        }
},

      eventDidMount: function(info) {
        const done = info.event.extendedProps.done;

        if (done) {
          // Estiliza evento concluído
          info.el.style.opacity = "0.6";
          const titleEl = info.el.querySelector('.fc-event-title');
          if (titleEl) {
            titleEl.style.textDecoration = "line-through";
          }
        } else {
          // Resetar estilo se "não feito"
          info.el.style.opacity = "1";
          const titleEl = info.el.querySelector('.fc-event-title');
          if (titleEl) {
            titleEl.style.textDecoration = "none";
          }
        }
      },

        
    });

//criar e editar os eventos na lista de eventos
document.getElementById("eventForm").addEventListener("submit", async function(e) {
e.preventDefault();

const title = document.getElementById("eventTitle").value.trim();
const start = document.getElementById("eventStart").value;
const end = document.getElementById("eventEnd").value;
const description = quill.root.innerHTML;
const color = document.getElementById("eventColor").value;
let valorStr = document.getElementById("eventValue").value.trim();
valorStr = valorStr.replace(",", "."); //trocar vírgula por ponto

//verifica usuário logado
const user = auth.currentUser;
if (!user) {
  alert("Usuário não está logado.");
  return;
}
const userId = user.uid;

if (!title || !start || !end) {
  alertPersonalizado("Por favor, preencha todos os campos obrigatórios.");
  return;
}

//impedir editar evento para uma data no passado
  const now = new Date();
  const startDate = new Date(start);
  if (startDate < new Date(now.setHours(0, 0, 0, 0))) {
    alertPersonalizado("Você não pode salvar eventos com data no passado.");
    return;
  }

  // Converte para número ou null
  let valor = valorStr ? parseFloat(valorStr) : null;
  if (isNaN(valor) || valor <= 0) {
    valor = null;
  }

let eventId;
let evento; 

if (editingEvent) {
  eventId = editingEvent.id;

  editingEvent.setProp("title", title);
  editingEvent.setStart(start);
  editingEvent.setEnd(end);
  editingEvent.setExtendedProp("description", description);
  editingEvent.setExtendedProp("valor", valor);
  if (color) editingEvent.setProp("backgroundColor", color);

  evento = editingEvent;
  editingEvent = null;
  selectedEvent = null;

} else {
  eventId = crypto.randomUUID(); //gera ID único

  evento = calendar.addEvent({
    id: eventId,
    title: title,
    start: start,
    end: end,
    backgroundColor: color || "#3788d8",
    extendedProps: {
      description: description,
      done: false,
      valor: valor
    }
  });
}
//Dados a serem salvos no Firestore
const eventData = {
  title: title,
  start: start,
  end: end,
  backgroundColor: color || "#3788d8",
  description: description,
  done: evento.extendedProps.done || false,
  valor: valor
};

//Salvar no Firestore
await salvarEventoFirestore(userId, eventId, eventData);


const modalEl = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
modalEl.hide();

// Limpa o formulário e o editor de texto
e.target.reset();
quill.setContents([]);
})


// botao de editar
document.getElementById("editEventBtn").addEventListener("click", function () {
  if (!selectedEvent) return;

  document.getElementById("eventTitle").value = selectedEvent.title;
  document.getElementById("eventValue").value = selectedEvent.extendedProps.valor
  document.getElementById("eventStart").value = toLocalISOString(selectedEvent.start);
  document.getElementById("eventEnd").value = toLocalISOString(selectedEvent.end);
  quill.root.innerHTML = selectedEvent.extendedProps.description || "";

  // Restaurar a cor selecionada (se houver)
  const color = selectedEvent.backgroundColor;
  document.getElementById("eventColor").value = color || "";

  // Fechar modal de visualização
  bootstrap.Modal.getInstance(document.getElementById("viewEventModal")).hide();
  // Abrir modal de edição
  const editModal = new bootstrap.Modal(document.getElementById("eventModal"));
  

  // Marcar botão correspondente
  document.querySelectorAll('#colorButtons button').forEach(btn => {
  const btnColor = btn.getAttribute('data-color');
  if (btnColor === color) {
    btn.classList.add('border', 'border-3');
  } else {
    btn.classList.remove('border', 'border-3');
  }
});

  editModal.show();

  //cancelar edição de evento -------------------------------------------
document.getElementById("cancelar").addEventListener('click', function(){
  editingEvent = null
  alertPersonalizado("Edição de evento cancelada.")
  document.getElementById("eventTitle").value = "";
  document.getElementById("eventValue").value = "";
  quill.root.innerHTML = "";
  return;
})

  editingEvent = selectedEvent;
});


//botao de excluir
document.getElementById("deleteEventBtn").addEventListener("click", async function () {
  if (!selectedEvent) return;

  // Verifica se o usuário está logado
  const user = auth.currentUser;
  if (!user) {
    alert("Usuário não está logado.");
    return;
  }

  const userId = user.uid;
  const eventId = selectedEvent.id;

  try {
    // Remove do calendário visual
    selectedEvent.remove();
    // Remove do Firestore
    await deletarEventoFirestore(userId, eventId);
    alertPersonalizado("Evento excluído com sucesso.");
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    alertPersonalizado("Erro ao excluir evento.");
  } finally {
    selectedEvent = null;
    bootstrap.Modal.getInstance(document.getElementById("viewEventModal")).hide();
    document.getElementById("eventForm").reset();
    quill.setContents([]);
  }
});


//cor do evento
document.querySelectorAll('#colorButtons button').forEach(button => {
  button.addEventListener('click', function () {
    document.querySelectorAll('#colorButtons button').forEach(btn => btn.classList.remove('border', 'border-3'));
    
    this.classList.add('border', 'border-3');

    document.getElementById('eventColor').value = this.getAttribute('data-color');
  });
});



//formatar data corretamente qundo for aditar um evento
function toLocalISOString(date) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

// Cria um formatador para moeda brasileira (BRL)
const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2  
});

//alerta personalizado
function alertPersonalizado(message) {
  const msg = document.getElementById("simpleToastMsg");
  msg.textContent = message;
  const toast = new bootstrap.Toast(document.getElementById("simpleToast"));
  toast.show();
}


  calendar.render();
});

//funçoes para o banco
// Função para salvar (criar ou editar) evento
async function salvarEventoFirestore(userId, eventId, eventData) {
  try {
    const docRef = doc(db, "users", userId, "tasks", eventId);
    await setDoc(docRef, eventData);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao salvar evento:", error);
    throw error;
  }
}


// Função para carregar eventos
async function carregarEventosFirestore(userId) {
  const eventos = [];
  try {
    const querySnapshot = await getDocs(
      collection(db, "users", userId, "tasks")
    );
    querySnapshot.forEach((doc) => {
      eventos.push({ id: doc.id, ...doc.data() });
    });
    return eventos;
  } catch (error) {
    console.error("Erro ao carregar eventos:", error);
    throw error;
  }
}

// Função para deletar evento
async function deletarEventoFirestore(userId, eventId) {
  try {
    await deleteDoc(doc(db, "users", userId, "tasks", eventId));
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    throw error;
  }
}

