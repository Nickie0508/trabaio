document.addEventListener('DOMContentLoaded', function() {

    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',

              headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },

        navLinks: true,
        selectable: true,

        //teste de eventos, aqui vamos puxar do banco de dados ao invez de setar no codigo
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
      ]

        });

        calendar.render();
    });