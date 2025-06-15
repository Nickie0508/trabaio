const titleInput = document.getElementById('titleInput');
const noteInput = document.getElementById('noteInput');
const noteList = document.getElementById('noteList');

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    noteList.innerHTML = '';
    notes.forEach((note, index) => {
        const li = document.createElement('li');

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
            <button onclick="editNote(${index})">Editar</button>
            <button onclick="deleteNote(${index})">Excluir</button>
        `;

        contentDiv.appendChild(btnGroup);
        li.appendChild(titleDiv);
        li.appendChild(contentDiv);

        noteList.appendChild(li);
    });
}

function toggleContent(li) {
    const contentDiv = li.querySelector('.content');
    if (contentDiv.style.display === 'block') {
        contentDiv.style.display = 'none';
    } else {
        contentDiv.style.display = 'block';
    }
}

function addNote() {
    const title = titleInput.value.trim();
    const content = noteInput.value.trim();
    if (title === '' || content === '') return;

    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push({ title, content });
    localStorage.setItem('notes', JSON.stringify(notes));

    titleInput.value = '';
    noteInput.value = '';
    loadNotes();
}

function editNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const newTitle = prompt('Edite o título:', notes[index].title);
    const newContent = prompt('Edite a anotação:', notes[index].content);

    if (newTitle !== null && newContent !== null) {
        notes[index] = { title: newTitle, content: newContent };
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
    }
}

function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
}

loadNotes();