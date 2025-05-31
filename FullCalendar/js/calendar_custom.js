let calendar;

document.addEventListener('DOMContentLoaded', function() {

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
        dayMaxEvents: true, //se tiver muitos eventos em uma dia o calendario mais mostras um "+"
        selectOverlap: true,

      
        //MODAL para criar eventos
        select: function(info){
        document.getElementById('eventStart').value = info.startStr + "T00:00";
        document.getElementById('eventEnd').value = info.endStr + "T00:00";

        //mostrar o modal na tela
          const eventModal = new bootstrap.Modal(document.getElementById('eventModal'));
          eventModal.show();
        },
        

        /*
        events: [
        {
          title: 'All Day Event',
          start: '2025-05-27'
        },
        {
          title: 'Long Event',
          start: '2025-05-28',
          end: '2025-05-30'
        },
      ],
      */

    });

document.getElementById("eventForm").addEventListener("submit", function(e) {
e.preventDefault();

const title = document.getElementById("eventTitle").value;
const description = document.getElementById("eventDescription").value;
const start = document.getElementById("eventStart").value;
const end = document.getElementById("eventEnd").value;

if (!title || !start || !end) {
  alert("Por favor, preencha todos os campos obrigatórios.");
  return;
}

// ✅ Adiciona o evento no calendário
calendar.addEvent({
  title: title,
  start: start,
  end: end !== start ? end : null,
  extendedProps: {
    description: description
  }
});

// Fecha o modal
const modalEl = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
modalEl.hide();

// Limpa o formulário
e.target.reset();
})


        calendar.render();
    });