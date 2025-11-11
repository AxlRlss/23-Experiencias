let carrito = [];
let total = 0;

// Elements
const carritoEl = document.getElementById('carrito');
const overlay = document.getElementById('overlay');
const badge = document.getElementById('badge');
const fab = document.getElementById('fab-carrito');
const btnCerrar = document.getElementById('btn-cerrar');

function agregarAlCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  total += precio;
  renderCarrito();
  abrirCarrito();
}

function renderCarrito() {
  const lista = document.getElementById('lista-carrito');
  const totalSpan = document.getElementById('total');
  lista.innerHTML = '';

  carrito.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.nombre}</span>
      <span>$${item.precio}</span>
      <button class="btn-eliminar" aria-label="Eliminar" onclick="eliminarProducto(${index})">✕</button>
    `;
    lista.appendChild(li);
  });

  totalSpan.textContent = total;
  badge.textContent = carrito.length;
}

function eliminarProducto(index) {
  total -= carrito[index].precio;
  carrito.splice(index, 1);
  renderCarrito();
}

function esMobile(){
  return window.matchMedia('(max-width: 768px)').matches;
}

function abrirCarrito() {
  overlay.classList.add('show');

  if (esMobile()) {
    carritoEl.classList.add('open');          // bottom sheet
    document.body.style.overflow = 'hidden';  // sin scroll de fondo
  } else {
    document.body.classList.add('cart-open-desktop'); // empuja la grilla
  }
}

function cerrarCarrito() {
  overlay.classList.remove('show');
  document.body.classList.remove('cart-open-desktop');
  carritoEl.classList.remove('open');
  document.body.style.overflow = '';
}

function finalizarCompra() {
  const metodo = document.getElementById('pago').value;
  if (carrito.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }
  alert(`¡Gracias por tu compra! 🎉\nMétodo de pago: ${metodo}\nTotal: $${total}`);
  carrito = [];
  total = 0;
  renderCarrito();
  cerrarCarrito();
}

/* --------- Eventos --------- */
fab.addEventListener('click', abrirCarrito);
btnCerrar.addEventListener('click', cerrarCarrito);
overlay.addEventListener('click', cerrarCarrito);
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') cerrarCarrito(); });

// Recalcula modo (si el usuario rota pantalla, etc.)
window.addEventListener('resize', () => {
  // si estaba abierto en desktop y paso a mobile, quitamos empuje y usamos bottom sheet
  if (esMobile()) {
    document.body.classList.remove('cart-open-desktop');
  }
});
