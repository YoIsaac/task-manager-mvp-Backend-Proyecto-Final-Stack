// ============================================
// app.js - Task Manager PRO FINAL DEFINITIVO
// ============================================

require("dotenv").config({ path: "../.env" });

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// ======================
// AUTH
// ======================
app.use("/api/auth", authRoutes);

// ======================
// ADMIN MIDDLEWARE
// ======================
function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado - Solo Admin" });
  }
  next();
}

// ======================
// GET TASKS (PAGINACIÓN)
// ======================
app.get("/tasks", protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM tasks WHERE user_id = $1",
      [req.user.id]
    );

    const total = parseInt(totalResult.rows[0].count);

    const result = await pool.query(
      `SELECT *
       FROM tasks
       WHERE user_id = $1
       ORDER BY id ASC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );

    res.json({
      page,
      limit,
      total,
      data: result.rows
    });

  } catch (error) {
    console.error("Error GET /tasks:", error.message);
    res.status(500).json({ message: "Error al obtener tareas" });
  }
});

// ======================
// POST TASK
// ======================
app.post("/tasks", protect, async (req, res) => {
  try {
    const { title, description, status, priority, due_date } = req.body;

    if (!title) {
      return res.status(400).json({ message: "El título es obligatorio" });
    }

    const result = await pool.query(
      `INSERT INTO tasks
       (title, description, status, priority, due_date, user_id)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [
        title,
        description || "",
        status || "pending",
        priority || "medium",
        due_date || null,
        req.user.id
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("Error POST /tasks:", error.message);
    res.status(500).json({ message: "Error al crear tarea" });
  }
});

// ======================
// PUT TASK
// ======================
app.put("/tasks/:id", protect, async (req, res) => {
  try {
    const { title, description, status, priority, due_date } = req.body;
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE tasks
       SET title=$1,
           description=$2,
           status=$3,
           priority=$4,
           due_date=$5,
           updated_at=CURRENT_TIMESTAMP
       WHERE id=$6 AND user_id=$7
       RETURNING *`,
      [title, description, status, priority, due_date, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No encontrada o no autorizada" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error("Error PUT /tasks:", error.message);
    res.status(500).json({ message: "Error al actualizar tarea" });
  }
});

// ======================
// DELETE TASK
// ======================
app.delete("/tasks/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM tasks WHERE id=$1 AND user_id=$2 RETURNING *",
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No encontrada o no autorizada" });
    }

    res.json({ message: "Tarea eliminada correctamente" });

  } catch (error) {
    console.error("Error DELETE /tasks:", error.message);
    res.status(500).json({ message: "Error al eliminar tarea" });
  }
});

// ======================
// ADMIN - VER USUARIOS
// ======================
app.get("/admin/users", protect, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users ORDER BY id ASC"
    );
    res.json(result.rows);

  } catch (error) {
    console.error("Error GET /admin/users:", error.message);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

// ======================
// EXTERNAL WEATHER (REAL API)
// ======================
app.get("/external/weather", protect, async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.open-meteo.com/v1/forecast?latitude=29.76&longitude=-95.36&current_weather=true"
    );

    res.json({
      city: "Houston",
      weather: response.data.current_weather
    });

  } catch (error) {
    console.error("Error API externa:", error.message);
    res.status(500).json({ message: "Error al consumir API externa" });
  }
});

// ======================
// ROOT
// ======================
app.get("/", (req, res) => {
  res.send("API Task Manager PRO funcionando 🚀");
});

// ======================
// EXPORT PARA JEST
// ======================
module.exports = app;

// ======================
// SERVER (solo si no es test)
// ======================
if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  });
}