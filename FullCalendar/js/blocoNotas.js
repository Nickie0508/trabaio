const titleInput = document.getElementById('titleInput');
const noteInput = document.getElementById('noteInput');
const noteList = document.getElementById('noteList');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const notification = document.getElementById('notification');

let notes = JSON.parse(localStorage.getItem('notes')) || [];

function showNotification(msg) {
    notification.innerText = msg;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotes() {
    let filteredNotes = [...notes];

    const query = searchInput.value.toLowerCase();
    if (query) {
        filteredNotes = filteredNotes.filter(note =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query)
        );
    }

    const sort = sortSelect.value;
    if (sort === 'titleAsc') {
        filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'titleDesc') {
        filteredNotes.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sort === 'dateAsc') {
        filteredNotes.sort((a, b) => a.date - b.date);
    } else {
        filteredNotes.sort((a, b) => b.date - a.date);
    }

    noteList.innerHTML = '';

    filteredNotes.forEach((note, index) => {
        const li = document.createElement('li');
        li.classList.remove('expanded');

        const titleDiv = document.createElement('div');
        titleDiv.className = 'title';
        titleDiv.innerText = note.title;
        titleDiv.onclick = () => toggleContent(li);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        contentDiv.innerText = note.content.length > 150
            ? note.content.slice(0, Math.floor(note.content.length * 0.3)) + '...'
            : note.content;

        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';
        btnGroup.innerHTML = `
            <button onclick="editNote(${index}); event.stopPropagation();" title="Editar">✏️</button>
            <button onclick="deleteNote(${index}); event.stopPropagation();" title="Excluir">🗑️</button>
            <button onclick="copyNote(${index}); event.stopPropagation();" title="Copiar">📋</button>
            <button onclick="toggleFavorite(${index}); event.stopPropagation();" title="Favoritar">
                ${note.favorite ? '✨' : '⭐'}
            </button>
        `;

        li.appendChild(titleDiv);
        li.appendChild(contentDiv);
        li.appendChild(btnGroup);

        noteList.appendChild(li);
    });
}

function toggleContent(li) {
    const expanded = li.classList.contains('expanded');
    if (expanded) {
        li.classList.remove('expanded');
    } else {
        Array.from(noteList.children).forEach(child => child.classList.remove('expanded'));
        li.classList.add('expanded');
    }
}

function addNote() {
    const title = titleInput.value.trim();
    const content = noteInput.value.trim();
    if (title === '' || content === '') {
        showNotification('⚠️ Preencha título e anotação!');
        return;
    }

    notes.push({ title, content, date: Date.now(), favorite: false });
    saveNotes();

    titleInput.value = '';
    noteInput.value = '';
    loadNotes();
    showNotification('✅ Nota salva! ✍️');
}

function editNote(index) {
    const newTitle = prompt('✏️ Editar título:', notes[index].title);
    if (newTitle === null) return;
    const newContent = prompt('📝 Editar anotação:', notes[index].content);
    if (newContent === null) return;

    notes[index].title = newTitle.trim();
    notes[index].content = newContent.trim();
    saveNotes();
    loadNotes();
    showNotification('✅ Nota editada! ✍️');
}

function deleteNote(index) {
    if (!confirm('🗑️ Tem certeza que deseja excluir?')) return;

    notes.splice(index, 1);
    saveNotes();
    loadNotes();
    showNotification('🗑️ Nota excluída.');
}

function copyNote(index) {
    const textToCopy = `Título: ${notes[index].title}\nAnotação: ${notes[index].content}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('📋 Nota copiada!');
    }).catch(() => {
        alert('❌ Falha ao copiar.');
    });
}

function toggleFavorite(index) {
    notes[index].favorite = !notes[index].favorite;
    saveNotes();
    loadNotes();
    const msg = notes[index].favorite ? '⭐ Marcada como favorita!' : '✨ Removida dos favoritos!';
    showNotification(msg);
}

searchInput.addEventListener('input', loadNotes);

loadNotes();
