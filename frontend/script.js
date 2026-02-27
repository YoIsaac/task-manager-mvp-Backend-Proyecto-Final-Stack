// ========================================
// script.js
// Login con JWT (Frontend)
// ========================================

// 1️⃣ Capturamos el formulario de login
const loginForm = document.getElementById('loginForm');
const errorText = document.getElementById('error');

// ⚠️ Seguridad básica: si no existe el formulario, no seguimos
if (loginForm) {
  // 2️⃣ Escuchamos el submit del formulario
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita recargar la página

    // 3️⃣ Obtenemos los valores del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      // 4️⃣ Petición al backend (LOGIN)
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      // 5️⃣ Si el login falla
      if (!response.ok) {
        errorText.textContent = data.message || 'Credenciales incorrectas';
        return;
      }

      // 6️⃣ Guardamos el token JWT
      localStorage.setItem('token', data.token);

      // 7️⃣ Redirigimos al dashboard
      window.location.href = 'dashboard.html';

    } catch (error) {
      errorText.textContent = 'Error de conexión con el servidor';
    }
  });
}
