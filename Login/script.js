function toggleForm() {
  document.getElementById("loginForm").classList.toggle("active");
  document.getElementById("registerForm").classList.toggle("active");
}
/*cerrar sesion*/
// Muestra toast según querystring (?logout=1, ?auth=required, ?success=1)
(function () {
  const toast = document.getElementById('toast');
  if (!toast) return;

  const params = new URLSearchParams(window.location.search);
  let msg = '';
  let variant = 'toast--ok';

  if (params.get('logout') === '1') {
    msg = 'Has cerrado sesión correctamente.';
  } else if (params.get('auth') === 'required') {
    msg = 'Necesitas iniciar sesión para continuar.';
    variant = 'toast--warn';
  } else if (params.get('success') === '1') {
    msg = '¡Registro exitoso! Ya puedes iniciar sesión.';
  }

  if (msg) {
    toast.textContent = msg;
    toast.classList.add('show', variant);
    setTimeout(() => toast.classList.remove('show'), 3500);
  }
})();
