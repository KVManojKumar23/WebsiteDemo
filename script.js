const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task';

    if (task.editing) {
      li.innerHTML = `
        <input type="text" class="edit-input" value="${task.text}">
        <div class="actions">
          <button class="save" title="Save">&#10003;</button>
          <button class="cancel" title="Cancel">&#10005;</button>
        </div>
      `;
      // Events for edit mode
      li.querySelector('.save').onclick = () => {
        const input = li.querySelector('.edit-input');
        updateTask(index, input.value);
      };
      li.querySelector('.cancel').onclick = () => {
        toggleEditTask(index, false);
      };
    } else {
      li.innerHTML = `
        <span>${task.text}</span>
        <div class="actions">
          <button class="edit" title="Edit">&#9998;</button>
          <button class="delete" title="Delete">&#10006;</button>
        </div>
      `;
      li.querySelector('.edit').onclick = () => toggleEditTask(index, true);
      li.querySelector('.delete').onclick = () => deleteTask(index);
    }
    taskList.appendChild(li);
  });
}

function addTask(text) {
  tasks.push({ text });
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function updateTask(index, newText) {
  if (newText.trim()) {
    tasks[index].text = newText.trim();
    tasks[index].editing = false;
    saveTasks();
    renderTasks();
  }
}

function toggleEditTask(index, editing) {
  tasks = tasks.map((task, i) =>
    i === index ? { ...task, editing } : { ...task, editing: false }
  );
  renderTasks();
}

// Handle add task
taskForm.onsubmit = function(e) {
  e.preventDefault();
  if (taskInput.value.trim()) {
    addTask(taskInput.value.trim());
    taskInput.value = '';
  }
};

// Initial render
renderTasks();
