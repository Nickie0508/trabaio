/*
import { auth, db } from "../dataBase/firebase.js";
import { doc, setDoc, getDocs, collection, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
*/

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
        document.getElementById("viewEventValue").textContent = formatadorMoeda.format(event.extendedProps.valor);
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
      eventDrop: function(info) {
        const now = new Date();
        if (info.event.start < now.setHours(0, 0, 0, 0)) {
          info.revert();
          // Mostrar o toast
          alertPersonalizado("Não é possível mover um evento para o passado.")
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
document.getElementById("eventForm").addEventListener("submit", function(e) {
e.preventDefault();

const title = document.getElementById("eventTitle").value.trim();
const start = document.getElementById("eventStart").value;
const end = document.getElementById("eventEnd").value;
const description = quill.root.innerHTML;
const color = document.getElementById("eventColor").value;
const valorStr = document.getElementById("eventValue").value.trim();

if (!title || !start || !end) {
  alert("Por favor, preencha todos os campos obrigatórios.");
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

if (editingEvent) {
  editingEvent.setProp("title", title);
  editingEvent.setStart(start);
  editingEvent.setEnd(end);
  editingEvent.setExtendedProp("description", description);
  if (color) editingEvent.setProp("backgroundColor", color);
  editingEvent.setExtendedProp("valor", valor);
  editingEvent = null;
  selectedEvent = null;
} else {
  calendar.addEvent({
    title: title,
    start: start,
    end: end,
    backgroundColor: color || undefined,
    extendedProps: {
      description: description,
      done: false,
      valor: valor
    }
  });
}

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

  //cancelar edição de evento
document.getElementById("cancelar").addEventListener('click', function(){
  alertPersonalizado("Edição de evento cancelada.")
  editingEvent = null
  document.getElementById("eventTitle").value = "";
  return;
})

  editingEvent = selectedEvent;
});

//botao de excluir
document.getElementById("deleteEventBtn").addEventListener("click", function () {
  if (selectedEvent) {
    selectedEvent.remove();
    selectedEvent = null;
    bootstrap.Modal.getInstance(document.getElementById("viewEventModal")).hide();
  }
document.getElementById("eventForm").reset();
quill.setContents([]);
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

/*
// Função para salvar (criar ou editar) evento
async function salvarEventoFirestore(userId, eventId, eventData) {
  try {
    const docRef = eventId
      ? doc(db, "users", userId, "tasks", eventId)
      : doc(collection(db, "users", userId, "tasks")); // cria novo ID automático

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
*/
