/* script.js - render del calendario, agenda y UI interactions */
(function(){
  const TZ = 'America/Argentina/Cordoba';
  const $ = (sel, root=document) => root.querySelector(sel);
  const grid = $('#grid');
  const label = $('#label');
  const prevBtn = $('#prev');
  const nextBtn = $('#next');
  const todayBtn = $('#hoy');
  const filterSel = $('#filter');
  const modal = $('#modal');
  const modalDate = $('#modal-date');
  const modalBody = $('#modal-body');
  const closeBtn = $('#close');
  const agendaList = $('#agenda-list');

  // Data source (from events-data.js)
  const rawEvents = (window.EVENTS || []).map(e => Object.assign({}, e)); // copia
  // build category list
  const categories = Array.from(new Set(rawEvents.map(e=>e.category).filter(Boolean)));
  categories.forEach(c => {
    if(!filterSel.querySelector(`option[value="${c}"]`)){
      const opt = document.createElement('option'); opt.value = c; opt.textContent = window.Utils.labelCat(c);
      filterSel.appendChild(opt);
    }
  });

  let current = new Date(); current.setDate(1);

  prevBtn.addEventListener('click', ()=>{ current.setMonth(current.getMonth()-1); render(); });
  nextBtn.addEventListener('click', ()=>{ current.setMonth(current.getMonth()+1); render(); });
  todayBtn.addEventListener('click', ()=>{ current = new Date(); current.setDate(1); render(); });
  filterSel.addEventListener('change', render);
  closeBtn.addEventListener('click', ()=> closeModal());

  document.addEventListener('keydown', (ev)=> { if(ev.key === 'Escape') closeModal(); });

  function closeModal(){ if(typeof modal.close === 'function') modal.close(); else modal.removeAttribute('open'); modal.setAttribute('aria-hidden','true'); }

  function openModal(){
    if(typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open','true');
    modal.setAttribute('aria-hidden','false');
  }

  function fmtMonthLabel(d){
    return new Intl.DateTimeFormat('es-AR', { month:'long', year:'numeric', timeZone:TZ }).format(d).replace(/^./,c=>c.toUpperCase());
  }

  function fmtDayLong(d){
    return new Intl.DateTimeFormat('es-AR', { weekday:'long', day:'2-digit', month:'long', year:'numeric', timeZone:TZ }).format(d).replace(/^./,c=>c.toUpperCase());
  }

  function fmtYmd(d){
    return window.Utils.fmtDate(d);
  }

  // RETURNS events for date y-m-d (taking filter into account)
  function eventsForDate(ymd){
    const cat = filterSel.value || 'all';
    // prefer override availability stored in localStorage via Reservas.availableSeats
    return (rawEvents.filter(e => e.date === ymd && (cat === 'all' || e.category === cat))).map(e => Object.assign({}, e));
  }

  // Render functions
  function render(){
    label.textContent = fmtMonthLabel(current);
    grid.innerHTML = '';

    const firstDay = new Date(current.getFullYear(), current.getMonth(), 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // make Monday=0
    const start = new Date(firstDay); start.setDate(firstDay.getDate() - startOffset);

    for(let i=0;i<42;i++){
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const ymd = fmtYmd(day);

      const cell = document.createElement('div'); cell.className = 'day';
      if(day.getMonth() !== current.getMonth()) cell.classList.add('other');
      if(day.toDateString() === new Date().toDateString()) cell.classList.add('today');

      const num = document.createElement('div'); num.className = 'num'; num.textContent = day.getDate();
      cell.appendChild(num);

      const list = document.createElement('div'); list.className = 'chips';

      const todaysEvents = eventsForDate(ymd);
      if(todaysEvents.length){
        todaysEvents.forEach(ev => {
          const seats = window.Reservas.availableSeats(ev);
          const chip = document.createElement('button');
          chip.className = 'chip';
          chip.dataset.cat = ev.category || '';
          chip.innerHTML = `<span>${window.Utils.escapeHtml(ev.title)}</span> <span class="qty">${seats}/${ev.capacity}</span>`;
          chip.addEventListener('click', (e) => {
            e.stopPropagation();
            openDayModal(day, [ev]);
          });
          list.appendChild(chip);
        });
      } else {
        const empty = document.createElement('div');
        empty.className = 'empty';
        empty.textContent = '—';
        list.appendChild(empty);
      }

      cell.appendChild(list);
      cell.addEventListener('click', ()=> {
        if(todaysEvents.length) openDayModal(day, todaysEvents);
      });

      grid.appendChild(cell);
    }

    renderAgenda();
  }

  function renderAgenda(){
    agendaList.innerHTML = '';
    const today = new Date(); today.setHours(0,0,0,0);
    const upcoming = rawEvents.filter(ev => new Date(ev.date+'T00:00:00') >= today)
      .sort((a,b)=> new Date(a.date) - new Date(b.date)).slice(0,6);

    if(!upcoming.length){
      const li = document.createElement('li'); li.textContent = 'No hay próximas experiencias.';
      agendaList.appendChild(li); return;
    }

    for(const ev of upcoming){
      const li = document.createElement('li');
      const date = new Date(ev.date + 'T' + (ev.start||'00:00') + ':00');
      const fmt = new Intl.DateTimeFormat('es-AR', { day:'2-digit', month:'short' }).format(date);
      const seats = window.Reservas.availableSeats(ev);
      li.innerHTML = `<span class="date">${fmt}</span><span class="title">${window.Utils.escapeHtml(ev.title)}</span><span class="spots">${seats}/${ev.capacity}</span>`;
      li.addEventListener('click', ()=> openDayModal(new Date(ev.date), [ev]));
      agendaList.appendChild(li);
    }
  }

  // Open modal for a day (list of events)
  function openDayModal(day, list){
    modalDate.textContent = fmtDayLong(day);
    modalBody.innerHTML = '';

    for(const ev of list){
      const card = document.createElement('div'); card.className = 'event';
      const price = window.Utils.formatMoneyARS(ev.price || 0);
      const seats = window.Reservas.availableSeats(ev);
      card.innerHTML = `
        <h3 style="margin:0">${window.Utils.escapeHtml(ev.title)}</h3>
        <div class="meta">
          <span>🕒 ${window.Utils.escapeHtml(ev.start||'—')}–${window.Utils.escapeHtml(ev.end||'—')}</span>
          <span>📍 ${window.Utils.escapeHtml(ev.location||'—')}</span>
          <span>👥 ${seats}/${ev.capacity}</span>
          <span>💳 ${price}</span>
          <span class="tag">${window.Utils.escapeHtml(window.Utils.labelCat(ev.category))}</span>
        </div>
        <p class="muted" style="margin:.4rem 0 0">${window.Utils.escapeHtml(ev.description||'')}</p>
      `;

      // actions + reservation form
      const actions = document.createElement('div'); actions.className = 'actions';
      const gc = document.createElement('a'); gc.className = 'tag'; gc.href = window.Utils.googleLink(ev); gc.target='_blank'; gc.rel='noopener'; gc.textContent='Añadir a Google Calendar';
      const reserveBtn = document.createElement('button'); reserveBtn.className = 'tag'; reserveBtn.textContent = 'Reservar';
      actions.appendChild(gc);
      actions.appendChild(reserveBtn);
      card.appendChild(actions);

      // reservation form (hidden by default)
      const formWrap = document.createElement('div'); formWrap.style.display='none'; formWrap.className='reserve-wrap';
      formWrap.innerHTML = `
        <div class="form-row">
          <input class="input" name="nombre" placeholder="Tu nombre" />
          <input class="input" name="email" placeholder="Email" />
          <input class="input" name="qty" placeholder="Cantidad" type="number" min="1" value="1" style="width:80px" />
        </div>
        <div style="display:flex; gap:8px; margin-top:8px;">
          <button class="btn-success">Confirmar reserva</button>
          <button class="tag cancel">Cancelar</button>
        </div>
        <div class="feedback" style="margin-top:8px;color:var(--muted)"></div>
      `;
      card.appendChild(formWrap);

      reserveBtn.addEventListener('click', ()=> {
        // toggle form
        if(formWrap.style.display === 'none'){
          formWrap.style.display = 'block';
        } else formWrap.style.display = 'none';
      });

      // form actions
      const confirmBtn = formWrap.querySelector('.btn-success');
      const cancelBtn = formWrap.querySelector('.cancel');
      const feedback = formWrap.querySelector('.feedback');
      confirmBtn.addEventListener('click', ()=> {
        const nombre = formWrap.querySelector('[name="nombre"]').value.trim();
        const email = formWrap.querySelector('[name="email"]').value.trim();
        const qty = Math.max(1, Number(formWrap.querySelector('[name="qty"]').value || 1));
        const res = window.Reservas.reserve(ev.id, nombre, email, qty);
        feedback.style.color = res.ok ? 'var(--text)' : 'var(--muted)';
        feedback.textContent = res.msg;
        if(res.ok){
          // refresh UI: update available seat display (chips + agenda + modal)
          setTimeout(()=> {
            render(); // re-render everything (cheap but ok)
          }, 250);
        }
      });
      cancelBtn.addEventListener('click', ()=> { formWrap.style.display='none'; });

      modalBody.appendChild(card);
    }

    openModal();
  }

  // initial render
  render();

  // small animation: pulse current day
  setInterval(()=> {
    const todayEl = document.querySelector('.day.today');
    if(todayEl){
      todayEl.animate([{transform:'scale(1)'},{transform:'scale(1.01)'},{transform:'scale(1)'}], {duration:2400, iterations:1});
    }
  }, 3000);
})();

