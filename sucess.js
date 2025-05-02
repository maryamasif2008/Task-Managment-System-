import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, set, push, update, remove } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBeFARoj-e1TGSb9qnSYyB0Vk5ZrNK8b0I",
  authDomain: "database-02-8e67b.firebaseapp.com",
  projectId: "database-02-8e67b",
  storageBucket: "database-02-8e67b.appspot.com",
  messagingSenderId: "515413317455",
  appId: "1:515413317455:web:350ed0ef5b8a2a98fb573a",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let taskId = 0;

document.getElementById('createForm').addEventListener('submit', function (e) {
  e.preventDefault();
  createTask();
});

function createTask(title, description, assignedTo, status = 'todo') {
  const taskTitle = title || document.getElementById('title').value;
  const taskDesc = description || document.getElementById('description').value;
  const assigned = assignedTo || document.getElementById('assignedTo').value;

  const task = document.createElement('div');
  task.className = 'task';
  task.id = 'task-' + taskId++;
  task.setAttribute('draggable', true);

  task.innerHTML = `
    <strong>${taskTitle}</strong><br>
    <small>${taskDesc}</small><br>
    <small>Assigned to: ${assigned}</small><br>
    <div class="task-buttons">
      <button class="btn-edit" onclick="editTask(this.closest('.task'))">Edit</button>
      <button class="btn-delete" onclick="deleteTask(this.closest('.task'))">Delete</button>
    </div>
  `;

window.editTask = editTask;
window.deleteTask = deleteTask;

  task.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', task.id);
  });

  document.getElementById(status).appendChild(task);
  saveTaskToFirebase(taskTitle, taskDesc, assigned);
  enableDragAndDrop();
  document.getElementById('createForm').reset();
}

function enableDragAndDrop() {
  const columns = document.querySelectorAll('.column');

  columns.forEach(column => {
    column.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    column.addEventListener('drop', (e) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData('text/plain');
      const task = document.getElementById(taskId);
      column.appendChild(task);
      updateTaskInFirebase(taskId, null, null, null, column.id);
    });
  });
}

function deleteTask(task) {
  const id = task.id;
  task.remove();
  deleteTaskFromFirebase(id);
}

function editTask(task) {
  const currentTitle = task.querySelector('strong').innerText;
  const currentDesc = task.querySelectorAll('small')[0].innerText;
  const currentAssigned = task.querySelectorAll('small')[1].innerText.replace('Assigned to: ', '');

  const newTitle = prompt('Edit Title:', currentTitle);
  const newDesc = prompt('Edit Description:', currentDesc);
  const newAssigned = prompt('Edit Assigned To:', currentAssigned);

  if (newTitle && newDesc && newAssigned) {
    task.querySelector('strong').innerText = newTitle;
    task.querySelectorAll('small')[0].innerText = newDesc;
    task.querySelectorAll('small')[1].innerText = 'Assigned to: ' + newAssigned;
    updateTaskInFirebase(task.id, newTitle, newDesc, newAssigned);
  }
}

function saveTaskToFirebase(title, description, assignedTo) {
  const taskRef = push(ref(db, 'tasks/'));
  set(taskRef, {
    TaskTitle: title,
    TaskDescription: description,
    AssignedTo: assignedTo,
    Status: 'todo'
  }).then(() => {
    alert("Task saved successfully!");
  }).catch((error) => {
    console.error("Error saving task: ", error);
  });
}

function updateTaskInFirebase(taskId, title, description, assignedTo, status = null) {
  const firebaseId = taskId.replace('task-', '');
  const taskRef = ref(db, 'tasks/' + firebaseId);

  const updates = {};
  if (title) updates['TaskTitle'] = title;
  if (description) updates['TaskDescription'] = description;
  if (assignedTo) updates['AssignedTo'] = assignedTo;
  if (status) updates['Status'] = status;

  update(taskRef, updates).then(() => {
    console.log('Task updated in Firebase');
  }).catch((error) => {
    console.error("Error updating task: ", error);
  });
}

function deleteTaskFromFirebase(taskId) {
  const firebaseId = taskId.replace('task-', '');
  const taskRef = ref(db, 'tasks/' + firebaseId);

  remove(taskRef).then(() => {
    console.log('Task deleted from Firebase');
  }).catch((error) => {
    console.error("Error deleting task: ", error);
  });
}

// navbar responsive

const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});