// ---------------------------------------------
// src/models/Task.js
// Modelo de Tarea (MongoDB)
// Define la estructura de la colección "tasks"
// ---------------------------------------------

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true // elimina espacios innecesarios
    },
    description: {
      type: String,
      default: ''
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // createdAt y updatedAt (suma puntos)
  }
);

// Exportamos el modelo
module.exports = mongoose.model('Task', taskSchema);
