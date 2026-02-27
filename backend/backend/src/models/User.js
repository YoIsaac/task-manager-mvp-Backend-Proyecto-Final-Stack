// src/models/User.js
// Modelo de Usuario
// Aquí definimos cómo se guarda un usuario en MongoDB

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // nombre obligatorio
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true, // no puede haber correos repetidos
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6 // buena práctica básica de seguridad
    }
  },
  {
    timestamps: true // createdAt y updatedAt automáticos
  }
);

// Exportamos el modelo
module.exports = mongoose.model('User', userSchema);
