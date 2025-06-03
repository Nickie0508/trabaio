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
        dayMaxEvents: 3, //se tiver muitos eventos em uma dia o calendario mais mostras um "+"
        selectOverlap: true,

      
        //MODAL para criar eventos
        select: function(info){
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
        document.getElementById("viewEventStart").textContent = new Date(event.start).toLocaleString();
        document.getElementById("viewEventEnd").textContent = new Date(event.end).toLocaleString();
        document.getElementById("viewEventDescription").innerHTML = event.extendedProps.description || "";

        const viewModal = new bootstrap.Modal(document.getElementById("viewEventModal"));
        viewModal.show();

        selectedEvent = event;
      }

        
    });

//criar e editar os eventos na lista de eventos
document.getElementById("eventForm").addEventListener("submit", function(e) {
e.preventDefault();

const title = document.getElementById("eventTitle").value;
const start = document.getElementById("eventStart").value;
const end = document.getElementById("eventEnd").value;
const description = quill.root.innerHTML;
const color = document.getElementById("eventColor").value;

if (!title || !start || !end) {
  alert("Por favor, preencha todos os campos obrigatórios.");
  return;
}

if (editingEvent) {
  editingEvent.setProp("title", title);
  editingEvent.setStart(start);
  editingEvent.setEnd(end);
  editingEvent.setExtendedProp("description", description);
  if (color) editingEvent.setProp("backgroundColor", color);
  editingEvent = null;
  selectedEvent = null;
} else {
  calendar.addEvent({
    title: title,
    start: start,
    end: end,
    backgroundColor: color || undefined,
    extendedProps: {
      description: description
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
  document.getElementById("eventStart").value = toLocalISOString(selectedEvent.start);
  document.getElementById("eventEnd").value = toLocalISOString(selectedEvent.end);

  quill.root.innerHTML = selectedEvent.extendedProps.description || "";

  // Fechar modal de visualização
  bootstrap.Modal.getInstance(document.getElementById("viewEventModal")).hide();
  // Abrir modal de edição
  const editModal = new bootstrap.Modal(document.getElementById("eventModal"));
  
  // Restaurar a cor selecionada (se houver)
  const color = selectedEvent.backgroundColor;
  document.getElementById("eventColor").value = color || "";

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


        calendar.render();
    });
