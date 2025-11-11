// MAIN.JS – Funcionalidad principal para 23 Experiencias

document.addEventListener("DOMContentLoaded", () => {
  // Toggle navbar on mobile
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  }
                                                            /*PAQUETES*/
//limitador de personas
document.getElementById("form-compra").addEventListener("submit", function(event) {
  const personas = document.getElementById("personas").value;
  if (personas < 1 || personas > 23) {
    alert("La cantidad de personas debe estar entre 1 y 23.");
    event.preventDefault();
  }
});

  // Simulación básica para botón de compra
function comprarPaquete(tipo) {
  let stockId = {
    clasico: "stock-clasico",
    otaku: "stock-otaku",
    literario: "stock-literario"
  };

  const stockEl = document.getElementById(stockId[tipo]);
  let stock = parseInt(stockEl.innerText);

  if (stock > 0) {
    stock--;
    stockEl.innerText = stock;
    alert(`¡Gracias por elegir el paquete ${tipo}! 🌟`);
  } else {
    alert("Lo sentimos, este paquete está agotado.");
  }
}

  // Smooth scroll for anchor links
  const links = document.querySelectorAll("a[href^='#']");
  for (let link of links) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Login placeholder
  const loginBtn = document.getElementById("login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      alert("Funcionalidad de inicio de sesión en desarrollo. Próximamente con integración a redes.");
    });
  }

  // Formulario de contacto simulado
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Gracias por contactarte con 23 Experiencias 🌸. Te responderemos pronto.");
      contactForm.reset();
    });
  }

  // Guardar preferencias en localStorage
  const preferenceBtn = document.getElementById("save-preference");
  if (preferenceBtn) {
    preferenceBtn.addEventListener("click", () => {
      localStorage.setItem("userExperience", "anime-café-tour");
      alert("Preferencia guardada 💾");
    });
  }
});
                                                                          // CONTACTO //
function enviarFormulario() {
  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const mensaje = document.getElementById("mensaje").value;

  // Acá podrías enviar los datos a un backend o servicio externo
  alert(`¡Gracias por contactarnos, ${nombre}! 😊\nTu mensaje fue enviado con éxito.`);
  
  // Limpia el formulario (opcional)
  document.querySelector(".formulario-contacto").reset();
}
                                                                  /*NUEVO*/
                                                                 
                                                            /*BLOG*/
document.addEventListener("DOMContentLoaded", () => {
  const blogGrid = document.querySelector(".blog-grid");
  if (blogGrid) {
    // Aquí podrías traer posts desde una API
    console.log("Blog listo para contenido dinámico");
  }

  const artistasGrid = document.querySelector(".artistas-grid");
  if (artistasGrid) {
    // Aquí podrías traer artistas desde una base de datos
    console.log("Artistas listos para contenido dinámico");
  }
});
                                                                      /*Blog*/  
                                                        // Modal Login
const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");

// Si tienes un botón de "Login" en tu header, que abra el modal:
document.querySelectorAll(".open-login").forEach(btn => {
    btn.addEventListener("click", () => {
        loginModal.style.display = "flex";
    });
});

// Cerrar modal
closeLogin.addEventListener("click", () => {
    loginModal.style.display = "none";
});
window.addEventListener("click", e => {
    if (e.target === loginModal) {
        loginModal.style.display = "none";
    }
});

// Enviar login
document.querySelector("#loginForm").addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(e.target);

    fetch("backend/login.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        if (data === "success") {
            alert("Bienvenido!");
            location.reload();
        } else {
            alert("Email o contraseña incorrectos");
        }
    });
});
                                                      /* ===== GOOGLE ===== */
window.onGoogleCredential = function (response) {
  // response.credential = ID token (JWT)
  const fd = new FormData();
  fd.append('credential', response.credential);

  fetch('backend/oauth/google_verify.php', { method: 'POST', body: fd })
    .then(r => r.text())
    .then(t => {
      if (t === 'success') {
        alert('¡Bienvenido con Google!');
        location.reload();
      } else {
        alert('Error Google: ' + t);
      }
    })
    .catch(() => alert('Fallo de red con Google'));
};

/* ===== FACEBOOK ===== */
window.fbAsyncInit = function() {
  FB.init({
    appId      : 'TU_FACEBOOK_APP_ID',
    cookie     : true,
    xfbml      : true,
    version    : 'v19.0'
  });
};

const fbBtn = document.getElementById('facebookLogin');
if (fbBtn) {
  fbBtn.addEventListener('click', () => {
    FB.login(function(response) {
      if (response.authResponse) {
        // Redirigimos al callback para intercambio de token
        window.location.href = 'https://www.facebook.com/dialog/oauth?client_id='
          + encodeURIComponent('TU_FACEBOOK_APP_ID')
          + '&redirect_uri=' + encodeURIComponent(window.location.origin + '/backend/oauth/fb_callback.php')
          + '&response_type=code&scope=email,public_profile';
      } else {
        alert('Login de Facebook cancelado');
      }
    }, {scope: 'email,public_profile'});
  });
}
/*packnuevo*/
document.querySelectorAll('.btn-comprar').forEach(btn => {
  btn.addEventListener('click', () => {
    const tipo = btn.getAttribute('data-pack');
    const overlay = document.getElementById('overlay-cargando');
    const texto = document.getElementById('texto-overlay');
    const loader = document.querySelector('.loader');

    // Cambiar color y texto según el pack
    if (tipo === 'basico') {
      overlay.style.background = 'rgba(96, 56, 19, 0.9)';
      loader.style.borderTopColor = '#ff7043';
      texto.textContent = 'Preparando tu café especial...';
    } else if (tipo === 'otaku-premium') {
      overlay.style.background = 'rgba(26, 35, 126, 0.9)';
      loader.style.borderTopColor = '#ec407a';
      texto.textContent = 'Listando tu experiencia japonesa...';
    } else if (tipo === 'literario') {
      overlay.style.background = 'rgba(78, 52, 46, 0.9)';
      loader.style.borderTopColor = '#8d6e63';
      texto.textContent = 'Abriendo tu libro de aventuras...';
    }

    // Mostrar overlay
    overlay.classList.add('activo');

    // Redirigir después de animación
    setTimeout(() => {
      window.location.href = `experiencias/pack-${tipo}.html`;
    }, 1500);
  });
});
                                              //POR EL MUNDO

