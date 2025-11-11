<?php
session_start();

// Ruta a tu JSON de eventos (ajusta si lo movés)
$events_json = __DIR__ . '/assets/data/events.json';

// Cargar eventos
$events_data = [];
if (file_exists($events_json)) {
    $events_data = json_decode(file_get_contents($events_json), true);
}

// Obtener ID de evento desde GET
$eventId = $_GET['event'] ?? null;
$event = null;
if ($eventId && is_array($events_data)) {
    foreach ($events_data as $e) {
        if (isset($e['id']) && $e['id'] === $eventId) {
            $event = $e;
            break;
        }
    }
}

if (!$event) {
    // Evento no encontrado — mostrar mensaje bonito
    http_response_code(404);
    echo "<!doctype html><html lang='es'><head><meta charset='utf-8'><title>Evento no encontrado</title>";
    echo "<meta name='viewport' content='width=device-width,initial-scale=1'></head><body style='font-family:Inter,system-ui,Segoe UI,Roboto;padding:30px;background:#f8f9fb;color:#111'>";
    echo "<h1>Evento no encontrado</h1><p>Lo sentimos, no pudimos encontrar el evento solicitado. Verificá el enlace o volvé al <a href='/calendario.html'>calendario</a>.</p></body></html>";
    exit;
}

// Crear token CSRF simple
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(24));
}
$csrf_token = $_SESSION['csrf_token'];

// Sanitizaciones y valores útiles
$available = isset($event['available']) ? intval($event['available']) : 0;
$capacity  = isset($event['capacity']) ? intval($event['capacity']) : 0;
$price     = isset($event['price']) ? floatval($event['price']) : 0;
$max_per_person = 5; // límite por reserva (ajustalo si querés)
$max_allowed = max(1, min($available, $max_per_person));

function h($s){ return htmlspecialchars($s ?? '', ENT_QUOTES, 'UTF-8'); }
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Reservar — <?php echo h($event['title']); ?> · 23 Experiencias</title>

  <!-- Estilos mínimos integrados; podés mover a assets/css/style.css -->
  <style>
    :root{
      --bg:#0b0b0e; --card:#111217; --muted:#9aa0b2; --text:#f7f8fb;
      --accent:#F26A1B; --accent-2:#D12A2A; --radius:14px;
      --glass: rgba(255,255,255,0.03);
      --maxWidth:900px;
      font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    }
    html,body{height:100%; margin:0; background:linear-gradient(180deg,#060607,#0b0b0e); color:var(--text); display:flex; align-items:center; justify-content:center; padding:28px;}
    .wrap{width:min(var(--maxWidth),calc(100% - 48px));}
    .card{background:linear-gradient(180deg,var(--card), #0f1113); border-radius:var(--radius); padding:22px; box-shadow:0 12px 30px rgba(0,0,0,.6);}
    .grid{display:grid; grid-template-columns:1fr 360px; gap:18px;}
    @media (max-width:920px){ .grid{grid-template-columns:1fr; } .aside{order:-1}}
    h1{margin:0 0 8px 0; font-size:20px}
    .meta{color:var(--muted); font-size:14px; margin-bottom:12px}
    .desc{color:var(--muted); font-size:14px; line-height:1.45; margin-bottom:14px}
    .badge{display:inline-block; padding:8px 12px; border-radius:999px; background:var(--glass); color:var(--muted); font-size:13px; border:1px solid rgba(255,255,255,0.03)}
    label{display:block; margin-bottom:10px; font-size:13px}
    input[type=text], input[type=email], input[type=tel], select, input[type=number]{
      width:100%; padding:10px 12px; border-radius:10px; border:1px solid rgba(255,255,255,0.04); background:transparent; color:var(--text);
      font-size:14px; outline:none;
    }
    .row{display:flex; gap:10px}
    .row > *{flex:1}
    .small{font-size:13px; color:var(--muted)}
    .price{font-weight:700; font-size:18px; color:var(--accent)}
    .aside{background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); padding:14px; border-radius:12px; border:1px solid rgba(255,255,255,0.03)}
    .summary{display:grid; gap:8px; margin-top:6px}
    .summary .line{display:flex; justify-content:space-between; align-items:center; padding:8px; background:rgba(0,0,0,0.15); border-radius:10px}
    .actions{display:flex; gap:10px; margin-top:12px;}
    button.primary{background:linear-gradient(90deg,var(--accent),var(--accent-2)); border:0;color:#111;padding:12px 14px;border-radius:12px;font-weight:700;cursor:pointer}
    button.ghost{background:transparent;border:1px solid rgba(255,255,255,0.06);color:var(--text);padding:10px;border-radius:10px;cursor:pointer}
    .muted{color:var(--muted)}
    .note{font-size:13px;color:var(--muted); margin-top:10px}
    .soldout{background:#2b2b2b; color:#ff9e9e; padding:8px;border-radius:10px}
    footer{margin-top:14px; color:var(--muted); font-size:13px}
  </style>
</head>
<body>
  <main class="wrap">
    <div class="card" role="region" aria-label="Formulario de reserva">
      <div class="grid">
        <!-- LEFT: información y formulario -->
        <section>
          <h1><?php echo h($event['title']); ?></h1>
          <div class="meta">
            <span class="badge"><?php echo h($event['date']); ?> • <?php echo h($event['start']); ?> - <?php echo h($event['end']); ?> hs</span>
            &nbsp; <span class="badge"><?php echo h($event['location']); ?></span>
          </div>

          <p class="desc"><?php echo h($event['description']); ?></p>

          <?php if ($available <= 0): ?>
            <div class="soldout">Lo sentimos — este evento está completo.</div>
            <p class="note">Podés contactarnos para lista de espera: <a href="mailto:contacto@23experiencias.com.ar">contacto@23experiencias.com.ar</a></p>
          <?php else: ?>
            <form id="reservaForm" method="post" action="/backend/save_reservation.php" novalidate>
              <!-- CSRF -->
              <input type="hidden" name="csrf_token" value="<?php echo h($csrf_token); ?>">
              <input type="hidden" name="event_id" value="<?php echo h($event['id']); ?>">

              <label>
                Nombre completo
                <input type="text" name="name" id="name" required placeholder="Tu nombre completo">
              </label>

              <div class="row">
                <label>
                  Email
                  <input type="email" name="email" id="email" required placeholder="tunombre@email.com">
                </label>
                <label>
                  WhatsApp / Tel
                  <input type="tel" name="phone" id="phone" required placeholder="+54 9 ...">
                </label>
              </div>

              <div class="row" style="align-items:center">
                <label style="flex:0 0 160px">
                  Cantidad
                  <input type="number" name="quantity" id="quantity" min="1" max="<?php echo $max_allowed; ?>" value="1" required>
                </label>

                <div style="flex:1">
                  <label class="small muted">Precio por persona</label>
                  <div class="price" id="unitPrice">$ <?php echo number_format($price,0,',','.'); ?></div>
                </div>
              </div>

              <div style="margin-top:8px" class="small muted">Cupos disponibles: <?php echo $available; ?> / Capacidad total: <?php echo $capacity; ?></div>

              <div class="note">Confirmarás tu reserva y luego recibirás instrucciones para el pago (o podrás pagar online si activamos Stripe/MercadoPago).</div>

              <div class="actions">
                <button type="submit" class="primary" id="btnSubmit">Confirmar reserva</button>
                <a href="/calendario.html" class="ghost" style="display:inline-flex;align-items:center;justify-content:center;padding:10px 12px;border-radius:10px;text-decoration:none;">Volver al calendario</a>
              </div>
            </form>
          <?php endif; ?>

        </section>

        <!-- RIGHT: resumen -->
        <aside class="aside" aria-hidden="false">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div class="muted" style="font-size:13px">Resumen</div>
              <div style="font-weight:700"><?php echo h($event['title']); ?></div>
            </div>
            <div class="badge">23E</div>
          </div>

          <div class="summary">
            <div class="line"><span>Fecha</span><strong><?php echo h($event['date']); ?></strong></div>
            <div class="line"><span>Horario</span><strong><?php echo h($event['start']); ?> - <?php echo h($event['end']); ?> hs</strong></div>
            <div class="line"><span>Lugar</span><strong><?php echo h($event['location']); ?></strong></div>
            <div class="line"><span>Precio por persona</span><strong>$ <?php echo number_format($price,0,',','.'); ?></strong></div>
            <div class="line"><span>Cantidad</span><strong id="summaryQty">1</strong></div>
            <div class="line" style="background:linear-gradient(90deg,var(--accent),var(--accent-2)); color:#111"><span>Total</span><strong id="summaryTotal">$ <?php echo number_format($price,0,',','.'); ?></strong></div>
          </div>

          <p class="note">Si querés pagar ahora con tarjeta, activamos Stripe / MercadoPago en el siguiente paso.</p>
        </aside>
      </div>

      <footer>
        ¿Necesitás ayuda? Escríbenos a <a href="mailto:contacto@23experiencias.com.ar">contacto@23experiencias.com.ar</a>
      </footer>
    </div>
  </main>

<script>
(function(){
  const price = <?php echo json_encode($price); ?>;
  const qtyInput = document.getElementById('quantity');
  const summaryQty = document.getElementById('summaryQty');
  const summaryTotal = document.getElementById('summaryTotal');
  const btn = document.getElementById('btnSubmit');
  const form = document.getElementById('reservaForm');

  function fmtAR(amount){
    return new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS'}).format(amount);
  }

  function update(){
    const q = Math.max(1, Math.min(<?php echo $max_allowed; ?>, parseInt(qtyInput.value || '1', 10)));
    qtyInput.value = q;
    summaryQty.textContent = q;
    summaryTotal.textContent = fmtAR(q * price);
  }

  // Inicial
  update();

  qtyInput.addEventListener('input', update);

  // Cliente: validaciones ligeras
  form && form.addEventListener('submit', function(e){
    // Si no hay disponibilidad, evitar envío
    <?php if ($available <= 0): ?>
      e.preventDefault();
      alert('Lo sentimos, no hay cupos disponibles para este evento.');
      return;
    <?php endif; ?>

    // Validar cantidad no supere disponibilidad
    const q = parseInt(qtyInput.value||'0', 10);
    if(q < 1 || q > <?php echo $max_allowed; ?>){
      e.preventDefault();
      alert('Por favor seleccioná una cantidad válida. Máximo: <?php echo $max_allowed; ?>');
      return;
    }

    // Desactivar botón para evitar doble submit
    btn.disabled = true;
    btn.textContent = 'Enviando...';
  });
  
})();
FOREIGN KEY (event_id) REFERENCES eventos(id)
  ON DELETE CASCADE ON UPDATE CASCADE

</script>
</body>
</html>
