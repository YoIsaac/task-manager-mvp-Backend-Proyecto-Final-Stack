// src/routes/authRoutes.js
// Rutas de autenticación (register y login)

const express = require("express");
const router = express.Router();

// Importamos el controlador
const authController = require("../controllers/authController");

// Registro de usuario
// POST /api/auth/register
router.post("/register", authController.registerUser);

// Login de usuario
// POST /api/auth/login
router.post("/login", authController.loginUser);

module.exports = router;