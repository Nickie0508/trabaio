const taskInput = document.getElementById('taskInput');
const descInput = document.getElementById('descInput');
const addBtn = document.getElementById('addBtn');
const filterSelect = document.getElementById('filterSelect');
const taskList = document.getElementById('taskList');
const notification = document.getElementById('notification');

let tasks = [];

addBtn.addEventListener('click', addTask);
filterSelect.addEventListener('change', renderTasks);

function addTask() {
    const title = taskInput.value.trim();
    const desc = descInput.value.trim();

    if (title === '') {
        showNotification('⚠️ Digite uma tarefa!');
        return;
    }

    const task = {
        id: Date.now(),
        title,
        desc,
        completed: false,
        favorite: false
    };

    tasks.push(task);
    taskInput.value = '';
    descInput.value = '';

    renderTasks();
    showNotification('✅ Tarefa adicionada!');
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    renderTasks();
}

function toggleFavorite(id) {
    const task = tasks.find(t => t.id === id);
    task.favorite = !task.favorite;
    renderTasks();
}

function deleteTask(id) {
    if (confirm('🗑️ Tem certeza que deseja excluir?')) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
        showNotification('❌ Tarefa excluída!');
    }
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newTitle = prompt('✏️ Edite o título:', task.title);
    if (newTitle !== null) {
        task.title = newTitle.trim() === '' ? task.title : newTitle.trim();
    }

    const newDesc = prompt('📝 Edite a descrição:', task.desc);
    if (newDesc !== null) {
        task.desc = newDesc.trim();
    }

    renderTasks();
}

function renderTasks() {
    const filter = filterSelect.value;
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        if (filter === 'favorites') return task.favorite;
        return true;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<p>Nenhuma tarefa encontrada.</p>';
        return;
    }

    filteredTasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        if (task.completed) taskDiv.classList.add('completed');

        const leftDiv = document.createElement('div');
        leftDiv.className = 'task-left';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleComplete(task.id));

        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = task.title;

        const desc = document.createElement('div');
        desc.className = 'desc';
        desc.textContent = task.desc;

        leftDiv.appendChild(checkbox);
        const textDiv = document.createElement('div');
        textDiv.appendChild(title);
        if (task.desc) textDiv.appendChild(desc);
        leftDiv.appendChild(textDiv);

        const btnDiv = document.createElement('div');
        btnDiv.className = 'buttons';

        const favBtn = document.createElement('button');
        favBtn.innerHTML = task.favorite ? '⭐' : '☆';
        favBtn.title = 'Favoritar';
        favBtn.addEventListener('click', () => toggleFavorite(task.id));

        const editBtn = document.createElement('button');
        editBtn.innerHTML = '✏️';
        editBtn.title = 'Editar';
        editBtn.addEventListener('click', () => editTask(task.id));

        const delBtn = document.createElement('button');
        delBtn.innerHTML = '🗑️';
        delBtn.title = 'Excluir';
        delBtn.addEventListener('click', () => deleteTask(task.id));

        btnDiv.appendChild(favBtn);
        btnDiv.appendChild(editBtn);
        btnDiv.appendChild(delBtn);

        taskDiv.appendChild(leftDiv);
        taskDiv.appendChild(btnDiv);

        taskList.appendChild(taskDiv);
    });
}

function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

