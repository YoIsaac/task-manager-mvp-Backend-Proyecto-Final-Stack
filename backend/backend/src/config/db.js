const { Pool } = require('pg');
require('dotenv').config(); // carga tu .env

// Crear la conexión al pool de PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // necesario para Supabase
  },
});

// Verificar conexión al iniciar
pool.connect()
  .then(client => {
    console.log('✅ PostgreSQL conectado correctamente');
    client.release();
  })
  .catch(err => {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
  });

module.exports = pool;