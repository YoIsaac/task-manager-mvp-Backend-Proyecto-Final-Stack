const express = require('express');
const router = express.Router();

let tasks = [];
let id = 1;

// GET - listar tareas
router.get('/', (req, res) => {
  res.json(tasks);
});

// POST - crear tarea
router.post('/', (req, res) => {
  const task = {
    id: id++,
    title: req.body.title
  };
  tasks.push(task);
  res.status(201).json(task);
});

// PUT - actualizar tarea
router.put('/:id', (req, res) => {
  const task = tasks.find(t => t.id == req.params.id);
  if (!task) return res.status(404).json({ message: 'No encontrada' });

  task.title = req.body.title;
  res.json(task);
});

// DELETE - eliminar tarea
router.delete('/:id', (req, res) => {
  tasks = tasks.filter(t => t.id != req.params.id);
  res.json({ message: 'Eliminada' });
});

module.exports = router;
