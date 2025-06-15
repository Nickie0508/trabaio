const titleInput = document.getElementById('titleInput');
const noteInput = document.getElementById('noteInput');
const noteList = document.getElementById('noteList');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const notification = document.getElementById('notification');

let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Função para mostrar notificação
function showNotification(msg) {
    notification.innerText = msg;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Salva as notas no localStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Renderiza as notas na lista
function loadNotes() {
    let filteredNotes = [...notes];

    // Filtrar pela busca
    const query = searchInput.value.toLowerCase();
    if(query) {
        filteredNotes = filteredNotes.filter(note => 
            note.title.toLowerCase().includes(query) || 
            note.content.toLowerCase().includes(query)
        );
    }

    // Ordenar
    const sort = sortSelect.value;
    if(sort === 'titleAsc') {
        filteredNotes.sort((a,b) => a.title.localeCompare(b.title));
    } else if(sort === 'titleDesc') {
        filteredNotes.sort((a,b) => b.title.localeCompare(a.title));
    } else if(sort === 'dateAsc') {
        filteredNotes.sort((a,b) => a.date - b.date);
    } else {
        filteredNotes.sort((a,b) => b.date - a.date);
    }

    noteList.innerHTML = '';

    filteredNotes.forEach((note, index) => {
        const li = document.createElement('li');

        li.classList.remove('expanded');

        // Título clicável para expandir/contrair
        const titleDiv = document.createElement('div');
        titleDiv.className = 'title';
        titleDiv.innerText = note.title;
        titleDiv.onclick = () => toggleContent(li);

        // Conteúdo da nota (expandido)
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        contentDiv.innerText = note.content.length > 150 
            ? note.content.slice(0, Math.floor(note.content.length * 0.3)) + '...'
            : note.content;

        // Botões: Editar, Excluir, Copiar
        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';
        btnGroup.innerHTML = `
            <button onclick="editNote(${index}); event.stopPropagation();">Editar</button>
            <button onclick="deleteNote(${index}); event.stopPropagation();">Excluir</button>
            <button onclick="copyNote(${index}); event.stopPropagation();">Copiar</button>
        `;

        li.appendChild(titleDiv);
        li.appendChild(contentDiv);
        li.appendChild(btnGroup);

        noteList.appendChild(li);
    });
}

// Expande ou contrai o conteúdo da nota com animação suave
function toggleContent(li) {
    const expanded = li.classList.contains('expanded');
    if (expanded) {
        li.classList.remove('expanded');
    } else {
        // Fecha outras notas abertas (modo acordeão)
        Array.from(noteList.children).forEach(child => child.classList.remove('expanded'));
        li.classList.add('expanded');
    }
}

// Adiciona uma nova nota
function addNote() {
    const title = titleInput.value.trim();
    const content = noteInput.value.trim();
    if (title === '' || content === '') {
        showNotification('Por favor, preencha título e anotação.');
        return;
    }

    notes.push({ title, content, date: Date.now() });
    saveNotes();

    titleInput.value = '';
    noteInput.value = '';
    loadNotes();
    showNotification('Nota salva com sucesso!');
}

// Edita uma nota existente
function editNote(index) {
    const newTitle = prompt('Edite o título:', notes[index].title);
    if (newTitle === null) return;
    const newContent = prompt('Edite a anotação:', notes[index].content);
    if (newContent === null) return;

    notes[index].title = newTitle.trim();
    notes[index].content = newContent.trim();
    saveNotes();
    loadNotes();
    showNotification('Nota editada com sucesso!');
}

// Exclui uma nota
function deleteNote(index) {
    if (!confirm('Tem certeza que deseja excluir esta nota?')) return;

    notes.splice(index, 1);
    saveNotes();
    loadNotes();
    showNotification('Nota excluída.');
}

// Copia conteúdo da nota para a área de transferência
function copyNote(index) {
    const textToCopy = `Título: ${notes[index].title}\nAnotação: ${notes[index].content}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('Nota copiada para a área de transferência!');
    }).catch(() => {
        alert('Falha ao copiar a nota.');
    });
}

// Eventos para busca em tempo real
searchInput.addEventListener('input', loadNotes);

// Inicializa o app carregando as notas
loadNotes();
