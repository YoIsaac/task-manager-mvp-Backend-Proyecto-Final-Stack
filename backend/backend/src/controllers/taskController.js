// ---------------------------------------------
// src/controllers/taskController.js
// PostgreSQL + Supabase + JWT + Paginación
// ---------------------------------------------

const pool = require('../config/db');

// ===============================
// OBTENER TAREAS CON PAGINACIÓN
// ===============================
const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    // Total de tareas del usuario
    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM tasks WHERE user_id = $1",
      [userId]
    );

    // Obtener tareas paginadas
    const tasksResult = await pool.query(
      `SELECT * FROM tasks
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    res.status(200).json({
      page,
      limit,
      total: parseInt(totalResult.rows[0].count),
      data: tasksResult.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener tareas" });
  }
};

// ===============================
// CREAR TAREA
// ===============================
const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, status, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: "El título es obligatorio" });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, priority, user_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description || "", status || "pending", priority || "medium", userId]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear tarea" });
  }
};

// ===============================
// ACTUALIZAR TAREA
// ===============================
const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const { title, description, status, priority } = req.body;

    const result = await pool.query(
      `UPDATE tasks
       SET title = $1,
           description = $2,
           status = $3,
           priority = $4
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [title, description, status, priority, taskId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar tarea" });
  }
};

// ===============================
// ELIMINAR TAREA
// ===============================
const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.status(200).json({ message: "Tarea eliminada correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar tarea" });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};