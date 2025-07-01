let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskInput = document.getElementById('taskInput');
const descInput = document.getElementById('descInput');
const filterSelect = document.getElementById('filterSelect');
const taskList = document.getElementById('taskList');
const notification = document.getElementById('notification');
const addTaskBtn = document.getElementById('addTaskBtn');
const saveListBtn = document.getElementById('saveListBtn');
const backBtn = document.getElementById('backBtn');

function showNotification(msg) {
  notification.textContent = msg;
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 2000);
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  const title = taskInput.value.trim();
  const desc = descInput.value.trim();
  if (!title) return showNotification('⚠️ Digite uma tarefa!');

  tasks.push({ id: Date.now(), title, desc, completed: false, favorite: false });
  taskInput.value = '';
  descInput.value = '';
  saveTasks();
  renderTasks();
  showNotification('✅ Tarefa adicionada!');
}

function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
  showNotification(task.completed ? '✔️ Tarefa concluída!' : '↩️ Tarefa marcada como pendente.');
}

function toggleFavorite(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.favorite = !task.favorite;
  saveTasks();
  renderTasks();
  showNotification(task.favorite ? '⭐ Favoritada!' : '⭐ Removida dos favoritos.');
}

function deleteTask(id) {
  if (confirm('🗑️ Tem certeza que deseja excluir?')) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    showNotification('🗑️ Tarefa excluída.');
  }
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  const newTitle = prompt('✏️ Edite o título:', task.title);
  if (newTitle !== null) task.title = newTitle.trim() || task.title;
  const newDesc = prompt('📝 Edite a descrição:', task.desc);
  if (newDesc !== null) task.desc = newDesc.trim();
  saveTasks();
  renderTasks();
  showNotification('✅ Tarefa editada!');
}

function renderTasks() {
  taskList.innerHTML = '';
  const filter = filterSelect.value;
  const filtered = tasks.filter(task =>
    filter === 'completed' ? task.completed :
    filter === 'pending' ? !task.completed :
    filter === 'favorites' ? task.favorite : true
  );

  if (filtered.length === 0) {
    taskList.innerHTML = '<p>Nenhuma tarefa encontrada.</p>';
    return;
  }

  filtered.forEach(task => {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    if (task.completed) taskDiv.classList.add('completed');

    const leftDiv = document.createElement('div');
    leftDiv.className = 'task-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleComplete(task.id));

    const textDiv = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = task.title;
    const desc = document.createElement('div');
    desc.className = 'desc';
    desc.textContent = task.desc;

    textDiv.appendChild(title);
    if (task.desc) textDiv.appendChild(desc);

    leftDiv.appendChild(checkbox);
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

addTaskBtn.addEventListener('click', addTask);
saveListBtn.addEventListener('click', () => {
  saveTasks();
  showNotification('💾 Lista salva com sucesso!');
});

filterSelect.addEventListener('change', renderTasks);

backBtn.addEventListener('click', () => {
  window.location.href = 'https://nickie0508.github.io/trabaio/FullCalendar/index.html';
});

renderTasks();
