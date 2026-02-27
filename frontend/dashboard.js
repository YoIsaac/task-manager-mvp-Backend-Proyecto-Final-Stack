// ==========================================
// dashboard.js
// Manejo de tareas con JWT (CRUD completo)
// ==========================================

// 📌 URL base del backend
const API_URL = 'http://localhost:3000/api/tasks';

// 📌 Obtenemos el token guardado al hacer login
const token = localStorage.getItem('token');

// ❌ Si no hay token, regresamos al login
if (!token) {
  alert('No autorizado, inicia sesión');
  window.location.href = 'index.html';
}

// 📌 Referencias al DOM
const taskList = document.getElementById('taskList');
const taskForm = document.getElementById('taskForm');
const logoutBtn = document.getElementById('logout');

// ==========================================
// 🔹 CERRAR SESIÓN
// ==========================================
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

// ==========================================
// 🔹 OBTENER TODAS LAS TAREAS (READ)
// ==========================================
const getTasks = async () => {
  try {
    const res = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const tasks = await res.json();
    taskList.innerHTML = '';

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${task.title}</strong> - ${task.description || ''}
        <button onclick="deleteTask('${task._id}')">❌</button>
      `;
      taskList.appendChild(li);
    });

  } catch (error) {
    console.error('Error al obtener tareas', error);
  }
};

// ==========================================
// 🔹 CREAR TAREA (CREATE)
// ==========================================
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, description })
    });

    taskForm.reset();
    getTasks();

  } catch (error) {
    console.error('Error al crear tarea', error);
  }
});

// ==========================================
// 🔹 ELIMINAR TAREA (DELETE)
// ==========================================
const deleteTask = async (id) => {
  if (!confirm('¿Eliminar esta tarea?')) return;

  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    getTasks();

  } catch (error) {
    console.error('Error al eliminar tarea', error);
  }
};

// ==========================================
// 🚀 CARGAR TAREAS AL ENTRAR
// ==========================================
getTasks();
