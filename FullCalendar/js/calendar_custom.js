document.addEventListener('DOMContentLoaded', function() {

    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
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
        selectMirror: true, //
        editable: true,     //Permite que os usuários arrastem e soltem eventos
        dayMaxEvents: true, //se tiver muitos eventos em uma dia o calendario mais mostras um "+"



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
      ],


      /*
      //MODAL AINDA PRECISA SER INCLUIDO CORRETAMENTE
      eventClick: function(info){
        const visualizarModal = new bootstrap.modal(document.getElementById("staticBackdrop"));
        visualizarModal.show();
      },
      */

        });

        calendar.render();
    });