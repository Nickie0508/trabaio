const taskInput = document.getElementById('taskInput');
const subtasksInput = document.getElementById('subtasksInput');
const taskList = document.getElementById('taskList');
const filterSelect = document.getElementById('filterSelect');
const notification = document.getElementById('notification');
const addBtn = document.getElementById('addBtn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editIndex = null;

function showNotification(msg) {
    notification.innerText = msg;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const filter = filterSelect.value;
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        if (filter === 'favorites') return task.favorite;
        return true;
    });

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        
        // checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.className = 'checkbox';
        checkbox.onclick = () => toggleCompleted(index);
        li.appendChild(checkbox);

        // title
        const titleDiv = document.createElement('div');
        titleDiv.className = 'title';
        titleDiv.innerText = task.title;
        li.appendChild(titleDiv);

        // subtasks
        if (task.subtasks.length > 0) {
            const subtasksDiv = document.createElement('div');
            subtasksDiv.className = 'subtasks';
            subtasksDiv.innerText = 'Subtarefas: ' + task.subtasks.join(', ');
            li.appendChild(subtasksDiv);
        }

        // buttons
        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';
        btnGroup.innerHTML = `
            <button onclick="editTask(${index})" title="Editar">✏️</button>
            <button onclick="deleteTask(${index})" title="Excluir">🗑️</button>
            <button onclick="toggleFavorite(${index})" title="Favoritar">${task.favorite ? '✨' : '⭐'}</button>
        `;
        li.appendChild(btnGroup);

        taskList.appendChild(li);
    });

    checkAllCompleted();
}

function addTask() {
    const title = taskInput.value.trim();
    const subtasksText = subtasksInput.value.trim();
    if (title === '') {
        showNotification('⚠️ Digite uma tarefa!');
        return;
    }

    const subtasks = subtasksText ? subtasksText.split(',').map(s => s.trim()).filter(s => s) : [];

    if (editIndex !== null) {
        // Atualizar tarefa existente
        tasks[editIndex].title = title;
        tasks[editIndex].subtasks = subtasks;
        showNotification('💾 Tarefa atualizada!');
        editIndex = null;
        addBtn.innerText = '➕ Adicionar Tarefa';
    } else {
        // Adicionar nova tarefa
        tasks.push({ title, completed: false, favorite: false, subtasks });
        showNotification('✅ Tarefa adicionada!');
    }

    saveTasks();
    loadTasks();
    taskInput.value = '';
    subtasksInput.value = '';
}

function toggleCompleted(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    loadTasks();
}

function editTask(index) {
    const task = tasks[index];
    taskInput.value = task.title;
    subtasksInput.value = task.subtasks.join(', ');
    addBtn.innerText = '💾 Salvar';
    editIndex = index;
    taskInput.focus();
}

function deleteTask(index) {
    if (!confirm('🗑️ Tem certeza que deseja excluir?')) return;
    tasks.splice(index, 1);
    saveTasks();
    loadTasks();
    showNotification('🗑️ Tarefa excluída!');
}

function toggleFavorite(index) {
    tasks[index].favorite = !tasks[index].favorite;
    saveTasks();
    loadTasks();
    const msg = tasks[index].favorite ? '⭐ Marcada como favorita!' : '✨ Removida dos favoritos!';
    showNotification(msg);
}

function checkAllCompleted() {
    if (tasks.length > 0 && tasks.every(task => task.completed)) {
        showNotification('🎉 Todas as tarefas concluídas!');
    }
}

filterSelect.addEventListener('change', loadTasks);
addBtn.addEventListener('click', addTask);

loadTasks();




