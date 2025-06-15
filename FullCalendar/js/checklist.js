const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterSelect = document.getElementById('filterSelect');
const notification = document.getElementById('notification');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Adiciona o listener do botão para chamar addTask
addBtn.addEventListener('click', addTask);

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
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        if (task.completed) taskDiv.classList.add('completed');

        const leftDiv = document.createElement('div');
        leftDiv.className = 'task-left';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.onclick = () => toggleCompleted(index);

        const title = document.createElement('div');
        title.className = 'title';
        title.innerText = task.title;

        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(title);

        const btns = document.createElement('div');
        btns.className = 'buttons';
        btns.innerHTML = `
            <button onclick="editTask(${index})" title="Editar">✏️</button>
            <button onclick="deleteTask(${index})" title="Excluir">🗑️</button>
            <button onclick="toggleFavorite(${index})" title="Favoritar">${task.favorite ? '✨' : '⭐'}</button>
        `;

        taskDiv.appendChild(leftDiv);
        taskDiv.appendChild(btns);

        const subDiv = document.createElement('div');
        subDiv.className = 'subtasks';
        if (task.subtasks.length > 0) {
            subDiv.innerText = 'Subtarefas: ' + task.subtasks.join(', ');
            taskDiv.appendChild(subDiv);
        }

        taskList.appendChild(taskDiv);
    });

    checkAllCompleted();
}

function addTask() {
    const title = taskInput.value.trim();
    if (title === '') {
        showNotification('⚠️ Digite uma tarefa!');
        return;
    }

    const subtasks = prompt('Digite subtarefas separadas por vírgula (opcional):');
    const subtaskList = subtasks ? subtasks.split(',').map(s => s.trim()).filter(s => s) : [];

    tasks.push({ title, completed: false, favorite: false, subtasks: subtaskList });
    saveTasks();
    taskInput.value = '';
    loadTasks();
    showNotification('✅ Tarefa adicionada!');
}

function toggleCompleted(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    loadTasks();
}

function editTask(index) {
    const newTitle = prompt('Editar tarefa:', tasks[index].title);
    if (newTitle === null) return;

    const newSubtasks = prompt('Editar subtarefas (separadas por vírgula):', tasks[index].subtasks.join(', '));

    tasks[index].title = newTitle.trim();
    tasks[index].subtasks = newSubtasks ? newSubtasks.split(',').map(s => s.trim()).filter(s => s) : [];
    saveTasks();
    loadTasks();
    showNotification('✏️ Tarefa editada!');
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

loadTasks();


